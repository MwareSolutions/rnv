/* eslint-disable import/no-cycle */
// @todo fix circular
import path from 'path';
import fs from 'fs';
import net from 'net';
import chalk from 'chalk';
import shell from 'shelljs';
import inquirer from 'inquirer';
import execa from 'execa';

import { executeAsync, execCLI } from '../../systemTools/exec';
import {
    getAppFolder,
    getAppTemplateFolder,
    getConfigProp,
    getAppId
} from '../../common';
import { isPlatformActive, createPlatformBuild } from '..';
import { isSystemWin } from '../../utils';
import { inquirerPrompt } from '../../systemTools/prompt';
import { logTask, logWarning, logDebug, logInfo, logSuccess } from '../../systemTools/logger';
import { copyFileSync, mkdirSync, getRealPath, updateObjectSync } from '../../systemTools/fileutils';
import { copyAssetsFolder, copyBuildsFolder, parseFonts } from '../../projectTools/projectParser';
import { ANDROID_WEAR, ANDROID, ANDROID_TV, CLI_ANDROID_ADB } from '../../constants';
import { parsePlugins } from '../../pluginTools';
import { parseAndroidManifestSync, injectPluginManifestSync } from './manifestParser';
import { parseMainActivitySync, parseSplashActivitySync, parseMainApplicationSync, injectPluginKotlinSync } from './kotlinParser';
import {
    parseAppBuildGradleSync, parseBuildGradleSync, parseSettingsGradleSync,
    parseGradlePropertiesSync, injectPluginGradleSync
} from './gradleParser';
import { parseValuesStringsSync, injectPluginXmlValuesSync, parseValuesColorsSync } from './xmlValuesParser';
import { resetAdb, getAndroidTargets, composeDevicesString, launchAndroidSimulator, checkForActiveEmulator, askForNewEmulator, connectToWifiDevice } from './deviceManager';

const _getEntryOutputName = (c) => {
    // CRAPPY BUT Android Wear does not support webview required for connecting to packager. this is hack to prevent RN connectiing to running bundler
    const { entryFile } = c.buildConfig.platforms[c.platform];
    // TODO Android PROD Crashes if not using this hardcoded one
    let outputFile;
    if (c.platform === ANDROID_WEAR) {
        outputFile = entryFile;
    } else {
        outputFile = 'index.android';
    }
    return outputFile;
};

export const packageAndroid = (c, platform) => new Promise((resolve, reject) => {
    logTask(`packageAndroid:${platform}`);

    const bundleAssets = getConfigProp(c, platform, 'bundleAssets', false) === true;

    if (!bundleAssets && platform !== ANDROID_WEAR) {
        resolve();
        return;
    }

    const outputFile = _getEntryOutputName(c);

    const appFolder = getAppFolder(c, platform);
    let reactNative = 'react-native';

    if (isSystemWin) {
        reactNative = path.normalize(`${process.cwd()}/node_modules/.bin/react-native.cmd`);
    }

    console.log('ANDROID PACKAGE STARTING...');
    executeAsync(c, `${reactNative} bundle --platform android --dev false --assets-dest ${appFolder}/app/src/main/res --entry-file ${c.buildConfig.platforms[c.platform]?.entryFile}.js --bundle-output ${appFolder}/app/src/main/assets/${outputFile}.bundle --sourcemap-output ${appFolder}/app/src/main/assets/${outputFile}.bundle.map`)
        .then(() => {
            console.log('ANDROID PACKAGE FINISHED');
            return resolve();
        })
        .catch((e) => {
            console.log('ANDROID PACKAGE FAILED');
            return reject(e);
        });
});


export const runAndroid = async (c, platform, defaultTarget) => {
    const { target } = c.program;
    logTask(`runAndroid:${platform}:${target}:${defaultTarget}`);

    const outputAab = getConfigProp(c, platform, 'aab', false);
    // shortcircuit devices logic since aabs can't be installed on a device
    if (outputAab) return _runGradleApp(c, platform, {});

    await resetAdb(c);

    if (target && net.isIP(target)) {
        await connectToWifiDevice(c, target);
    }

    let devicesAndEmulators;
    try {
        devicesAndEmulators = await getAndroidTargets(c, false, false, c.program.device !== undefined);
    } catch (e) {
        return Promise.reject(e);
    }

    const activeDevices = devicesAndEmulators.filter(d => d.isActive);
    const inactiveDevices = devicesAndEmulators.filter(d => !d.isActive);

    const askWhereToRun = async () => {
        if (activeDevices.length === 0 && inactiveDevices.length > 0) {
        // No device active, but there are emulators created
            const devicesString = composeDevicesString(inactiveDevices, true);
            const choices = devicesString;
            const response = await inquirer.prompt([{
                name: 'chosenEmulator',
                type: 'list',
                message: 'What emulator would you like to start?',
                choices
            }]);
            if (response.chosenEmulator) {
                await launchAndroidSimulator(c, platform, response.chosenEmulator, true);
                const devices = await checkForActiveEmulator(c, platform);
                await _runGradleApp(c, platform, devices);
            }
        } else if (activeDevices.length > 1) {
            const devicesString = composeDevicesString(activeDevices, true);
            const choices = devicesString;
            const response = await inquirer.prompt([{
                name: 'chosenEmulator',
                type: 'list',
                message: 'Where would you like to run your app?',
                choices
            }]);
            if (response.chosenEmulator) {
                const dev = activeDevices.find(d => d.name === response.chosenEmulator);
                await _runGradleApp(c, platform, dev);
            }
        } else {
            await askForNewEmulator(c, platform);
            const devices = await checkForActiveEmulator(c, platform);
            await _runGradleApp(c, platform, devices);
        }
    };

    if (target) {
        // a target is provided
        logDebug('Target provided', target);
        const foundDevice = devicesAndEmulators.find(d => d.udid.includes(target) || d.name.includes(target));
        if (foundDevice) {
            if (foundDevice.isActive) {
                await _runGradleApp(c, platform, foundDevice);
            } else {
                await launchAndroidSimulator(c, platform, foundDevice, true);
                const device = await checkForActiveEmulator(c, platform);
                await _runGradleApp(c, platform, device);
            }
        } else {
            await askWhereToRun();
        }
    } else if (activeDevices.length === 1) {
        // Only one that is active, running on that one
        const dv = activeDevices[0];
        logInfo(`Found device ${dv.name}:${dv.udid}!`);
        await _runGradleApp(c, platform, dv);
    } else if (defaultTarget) {
        // neither a target nor an active device is found, revert to default target if available
        logDebug('Default target used', defaultTarget);
        const foundDevice = devicesAndEmulators.find(d => d.udid.includes(defaultTarget) || d.name.includes(defaultTarget));
        if (!foundDevice) {
            logDebug('Target not provided, asking where to run');
            await askWhereToRun();
        } else {
            await launchAndroidSimulator(c, platform, foundDevice, true);
            const device = await checkForActiveEmulator(c, platform);
            await _runGradleApp(c, platform, device);
        }
    } else {
        // we don't know what to do, ask the user
        logDebug('Target not provided, asking where to run');
        await askWhereToRun();
    }
};


const _checkSigningCerts = async (c) => {
    logTask('_checkSigningCerts');
    const signingConfig = getConfigProp(c, c.platform, 'signingConfig', 'Debug');
    const isRelease = signingConfig === 'Release';
    const privateConfig = c.files.workspace.appConfig.configPrivate?.[c.platform];

    if (isRelease && !privateConfig) {
        logWarning(`You're attempting to ${c.command} app in release mode but you have't configured your ${chalk.white(c.paths.workspace.appConfig.configPrivate)} for ${chalk.white(c.platform)} platform yet.`);

        const { confirm } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: 'Do you want to configure it now?'
        });

        if (confirm) {
            let confirmCopy = false;
            let platCandidate;
            const { confirmNewKeystore } = await inquirerPrompt({
                type: 'confirm',
                name: 'confirmNewKeystore',
                message: 'Do you want to generate new keystore as well?'
            });

            if (c.files.workspace.appConfig.configPrivate) {
                const platCandidates = [ANDROID_WEAR, ANDROID_TV, ANDROID];

                platCandidates.forEach((v) => {
                    if (c.files.workspace.appConfig.configPrivate[v]) {
                        platCandidate = v;
                    }
                });
                if (platCandidate) {
                    const resultCopy = await inquirerPrompt({
                        type: 'confirm',
                        name: 'confirmCopy',
                        message: `Found existing keystore configuration for ${platCandidate}. do you want to reuse it?`
                    });
                    confirmCopy = resultCopy.confirmCopy;
                }
            }


            if (confirmCopy) {
                c.files.workspace.appConfig.configPrivate[c.platform] = c.files.workspace.appConfig.configPrivate[platCandidate];
            } else {
                let storeFile;

                if (!confirmNewKeystore) {
                    const result = await inquirerPrompt({
                        type: 'input',
                        name: 'storeFile',
                        message: `Paste asolute or relative path to ${chalk.white(c.paths.workspace.appConfig.dir)} of your existing ${chalk.white('release.keystore')} file`,
                    });
                    storeFile = result.storeFile;
                }

                const { storePassword, keyAlias, keyPassword } = await inquirer.prompt([
                    {
                        type: 'password',
                        name: 'storePassword',
                        message: 'storePassword',
                    },
                    {
                        type: 'input',
                        name: 'keyAlias',
                        message: 'keyAlias',
                    },
                    {
                        type: 'password',
                        name: 'keyPassword',
                        message: 'keyPassword',
                    }
                ]);


                if (confirmNewKeystore) {
                    const keystorePath = `${c.paths.workspace.appConfig.dir}/release.keystore`;
                    mkdirSync(c.paths.workspace.appConfig.dir);
                    const keytoolCmd = `keytool -genkey -v -keystore ${keystorePath} -alias ${keyAlias} -keypass ${keyPassword} -storepass ${storePassword} -keyalg RSA -keysize 2048 -validity 10000`;
                    await executeAsync(c, keytoolCmd, {
                        env: process.env,
                        shell: true,
                        stdio: 'inherit',
                        silent: true,
                    });
                    storeFile = './release.keystore';
                }

                if (c.paths.workspace.appConfig.dir) {
                    mkdirSync(c.paths.workspace.appConfig.dir);
                    c.files.workspace.appConfig.configPrivate = {};
                    c.files.workspace.appConfig.configPrivate[c.platform] = { storeFile, storePassword, keyAlias, keyPassword };
                }
            }


            updateObjectSync(c.paths.workspace.appConfig.configPrivate, c.files.workspace.appConfig.configPrivate);
            logSuccess(`Successfully updated private config file at ${chalk.white(c.paths.workspace.appConfig.dir)}.`);
            await configureProject(c, c.platform);
        } else {
            return Promise.reject('You selected no. Can\'t proceed');
        }
    }
};

const _runGradleApp = async (c, platform, device) => {
    logTask(`_runGradleApp:${platform}`);

    const signingConfig = getConfigProp(c, platform, 'signingConfig', 'Debug');
    const appFolder = getAppFolder(c, platform);
    const bundleId = getAppId(c, platform);
    const outputAab = getConfigProp(c, platform, 'aab', false);
    const outputFolder = signingConfig === 'Debug' ? 'debug' : 'release';
    const { arch, name } = device;
    const stacktrace = c.program.info ? ' --debug' : '';

    shell.cd(`${appFolder}`);

    await _checkSigningCerts(c);
    await executeAsync(c, `${isSystemWin ? 'gradlew.bat' : './gradlew'} ${outputAab ? 'bundle' : 'assemble'}${signingConfig}${stacktrace} -x bundleReleaseJsAndAssets`);
    if (outputAab) {
        const aabPath = path.join(appFolder, `app/build/outputs/bundle/${outputFolder}/app.aab`);
        logInfo(`App built. Path ${aabPath}`);
        return true;
    }
    let apkPath = path.join(appFolder, `app/build/outputs/apk/${outputFolder}/app-${outputFolder}.apk`);
    if (!fs.existsSync(apkPath)) {
        apkPath = path.join(appFolder, `app/build/outputs/apk/${outputFolder}/app-${outputFolder}-unsigned.apk`);
    } if (!fs.existsSync(apkPath)) {
        apkPath = path.join(appFolder, `app/build/outputs/apk/${outputFolder}/app-${arch}-${outputFolder}.apk`);
    }
    logInfo(`Installing ${apkPath} on ${name}`);
    try {
        await execCLI(c, CLI_ANDROID_ADB, `-s ${device.udid} install -r -d -f ${apkPath}`);
    } catch (e) {
        if (e?.includes('INSTALL_FAILED') || e?.message?.includes('INSTALL_FAILED')) {
            const { confirm } = await inquirerPrompt({
                type: 'confirm',
                message: 'It seems you already have the app installed but RNV can\'t update it. Uninstall that one and try again?'
            });

            if (!confirm) throw new Error('User canceled');
            await execCLI(c, CLI_ANDROID_ADB, `-s ${device.udid} uninstall ${bundleId}`);
            await execCLI(c, CLI_ANDROID_ADB, `-s ${device.udid} install -r -d -f ${apkPath}`);
        } else {
            throw new Error(e);
        }
    }

    if (!outputAab) await execCLI(c, CLI_ANDROID_ADB, `-s ${device.udid} shell am start -n ${bundleId}/.MainActivity`);
};

export const buildAndroid = (c, platform) => new Promise((resolve, reject) => {
    logTask(`buildAndroid:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const signingConfig = getConfigProp(c, platform, 'signingConfig', 'Debug');

    shell.cd(`${appFolder}`);

    _checkSigningCerts(c)
        .then(() => executeAsync(c, `${isSystemWin ? 'gradlew.bat' : './gradlew'} assemble${signingConfig} -x bundleReleaseJsAndAssets`))
        .then(() => {
            logSuccess(`Your APK is located in ${chalk.white(path.join(appFolder, `app/build/outputs/apk/${signingConfig.toLowerCase()}`))} .`);
            resolve();
        }).catch(e => reject(e));
});

export const configureAndroidProperties = (c, platform) => new Promise((resolve) => {
    logTask(`configureAndroidProperties:${platform}`);

    const appFolder = getAppFolder(c, platform);

    const addNDK = c.files.workspace.config.sdks.ANDROID_NDK && !c.files.workspace.config.sdks.ANDROID_NDK.includes('<USER>');
    const ndkString = `ndk.dir=${getRealPath(c, c.files.workspace.config.sdks.ANDROID_NDK)}`;
    let sdkDir = getRealPath(c, c.files.workspace.config.sdks.ANDROID_SDK);

    if (isSystemWin) {
        sdkDir = sdkDir.replace(/\\/g, '/');
    }

    fs.writeFileSync(
        path.join(appFolder, 'local.properties'),
        `#Generated by ReNative (https://renative.org)
${addNDK ? ndkString : ''}
sdk.dir=${sdkDir}`,
    );

    resolve();
});

export const configureGradleProject = async (c) => {
    const { platform } = c;
    logTask(`configureGradleProject:${platform}`);

    if (!isPlatformActive(c, platform)) return;

    await copyAssetsFolder(c, platform);
    await configureAndroidProperties(c, platform);
    await configureProject(c, platform);
    return copyBuildsFolder(c, platform);
};

export const configureProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`configureProject:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const appTemplateFolder = getAppTemplateFolder(c, platform);

    const gradlew = path.join(appFolder, 'gradlew');

    if (!fs.existsSync(gradlew)) {
        logWarning(`Looks like your ${chalk.white(platform)} platformBuild is misconfigured!. let's repair it.`);
        createPlatformBuild(c, platform)
            .then(() => configureGradleProject(c, platform))
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }

    const outputFile = _getEntryOutputName(c);

    mkdirSync(path.join(appFolder, 'app/src/main/assets'));
    fs.writeFileSync(path.join(appFolder, `app/src/main/assets/${outputFile}.bundle`), '{}');
    fs.chmodSync(gradlew, '755');

    // INJECTORS
    c.pluginConfigAndroid = {
        pluginIncludes: "include ':app'",
        pluginPaths: '',
        pluginImports: '',
        pluginPackages: 'MainReactPackage(),\n',
        pluginActivityImports: '',
        pluginActivityMethods: '',
        pluginApplicationImports: '',
        pluginApplicationMethods: '',
        pluginApplicationCreateMethods: '',
        pluginApplicationDebugServer: '',
        applyPlugin: '',
        defaultConfig: '',
        pluginActivityCreateMethods: '',
        pluginActivityResultMethods: '',
        pluginSplashActivityImports: '',
        manifestApplication: '',
        buildGradleAllProjectsRepositories: '',
        buildGradleBuildScriptRepositories: '',
        buildGradleBuildScriptDependencies: '',
        buildGradleBuildScriptDexOptions: '',
        appBuildGradleSigningConfigs: '',
        appBuildGradleImplementations: '',
        resourceStrings: [],
        appBuildGradleAfterEvaluate: '',
    };

    // PLUGINS
    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        injectPluginGradleSync(c, pluginPlat, key, pluginPlat.package);
        injectPluginKotlinSync(c, pluginPlat, key, pluginPlat.package);
        injectPluginManifestSync(c, pluginPlat, key, pluginPlat.package);
        injectPluginXmlValuesSync(c, pluginPlat, key, pluginPlat.package);
    });

    c.pluginConfigAndroid.pluginPackages = c.pluginConfigAndroid.pluginPackages.substring(0, c.pluginConfigAndroid.pluginPackages.length - 2);

    // FONTS
    parseFonts(c, (font, dir) => {
        if (font.includes('.ttf') || font.includes('.otf')) {
            const key = font.split('.')[0];
            const { includedFonts } = c.buildConfig.common;
            if (includedFonts) {
                if (includedFonts.includes('*') || includedFonts.includes(key)) {
                    if (font) {
                        const fontSource = path.join(dir, font);
                        if (fs.existsSync(fontSource)) {
                            const fontFolder = path.join(appFolder, 'app/src/main/assets/fonts');
                            mkdirSync(fontFolder);
                            const fontDest = path.join(fontFolder, font);
                            copyFileSync(fontSource, fontDest);
                        } else {
                            logWarning(`Font ${chalk.white(fontSource)} doesn't exist! Skipping.`);
                        }
                    }
                }
            }
        }
    });

    parseSettingsGradleSync(c, platform);
    parseAppBuildGradleSync(c, platform);
    parseBuildGradleSync(c, platform);
    parseMainActivitySync(c, platform);
    parseMainApplicationSync(c, platform);
    parseSplashActivitySync(c, platform);
    parseValuesStringsSync(c, platform);
    parseValuesColorsSync(c, platform);
    parseAndroidManifestSync(c, platform);
    parseGradlePropertiesSync(c, platform);

    resolve();
});

// Resolve or reject will not be called so this will keep running
export const runAndroidLog = async (c) => {
    logTask('runAndroidLog');
    const filter = c.program.filter || '';
    const child = execa.command(`${c.cli[CLI_ANDROID_ADB]} logcat`);
    // use event hooks to provide a callback to execute when data are available:
    child.stdout.on('data', (data) => {
        const d = data.toString().split('\n');
        d.forEach((v) => {
            if (v.includes(' E ') && v.includes(filter)) {
                console.log(chalk.red(v));
            } else if (v.includes(' W ') && v.includes(filter)) {
                console.log(chalk.yellow(v));
            } else if (v.includes(filter)) {
                console.log(v);
            }
        });
    });
    return child.then(res => res.stdout).catch(err => Promise.reject(`Error: ${err}`));
};
