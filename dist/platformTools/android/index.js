var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.runAndroidLog=exports.runAndroid=exports.packageAndroid=exports.configureProject=exports.configureGradleProject=exports.configureAndroidProperties=exports.buildAndroid=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));

var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _net=_interopRequireDefault(require("net"));
var _chalk=_interopRequireDefault(require("chalk"));
var _shelljs=_interopRequireDefault(require("shelljs"));
var _inquirer=_interopRequireDefault(require("inquirer"));
var _execa=_interopRequireDefault(require("execa"));

var _exec=require("../../systemTools/exec");
var _common=require("../../common");





var _=require("..");
var _utils=require("../../utils");
var _prompt=require("../../systemTools/prompt");
var _logger=require("../../systemTools/logger");
var _fileutils=require("../../systemTools/fileutils");
var _projectParser=require("../../projectTools/projectParser");
var _constants=require("../../constants");
var _pluginTools=require("../../pluginTools");
var _manifestParser=require("./manifestParser");
var _kotlinParser=require("./kotlinParser");
var _gradleParser=require("./gradleParser");



var _xmlValuesParser=require("./xmlValuesParser");
var _deviceManager=require("./deviceManager");

var _getEntryOutputName=function _getEntryOutputName(c){

var entryFile=c.buildConfig.platforms[c.platform].entryFile;

var outputFile;
if(c.platform===_constants.ANDROID_WEAR){
outputFile=entryFile;
}else{
outputFile='index.android';
}
return outputFile;
};

var packageAndroid=function packageAndroid(c,platform){return new Promise(function(resolve,reject){var _c$buildConfig$platfo;
(0,_logger.logTask)("packageAndroid:"+platform);

var bundleAssets=(0,_common.getConfigProp)(c,platform,'bundleAssets',false)===true;

if(!bundleAssets&&platform!==_constants.ANDROID_WEAR){
resolve();
return;
}

var outputFile=_getEntryOutputName(c);

var appFolder=(0,_common.getAppFolder)(c,platform);
var reactNative='react-native';

if(_utils.isSystemWin){
reactNative=_path.default.normalize(process.cwd()+"/node_modules/.bin/react-native.cmd");
}

console.log('ANDROID PACKAGE STARTING................');
(0,_exec.executeAsync)(c,reactNative+" bundle --platform android --dev false --assets-dest "+appFolder+"/app/src/main/res --entry-file "+((_c$buildConfig$platfo=c.buildConfig.platforms[c.platform])==null?void 0:_c$buildConfig$platfo.entryFile)+".js --bundle-output "+appFolder+"/app/src/main/assets/"+outputFile+".bundle --sourcemap-output "+appFolder+"/app/src/main/assets/"+outputFile+".bundle.map").
then(function(){
console.log('ANDROID PACKAGE FINISHED');
return resolve();
}).
catch(function(e){
console.log('ANDROID PACKAGE FAILED');
return reject(e);
});
});};exports.packageAndroid=packageAndroid;


var runAndroid=function runAndroid(c,platform,defaultTarget){var target,outputAab,devicesAndEmulators,activeDevices,inactiveDevices,askWhereToRun,foundDevice,device,dv,_foundDevice,_device;return _regenerator.default.async(function runAndroid$(_context2){while(1)switch(_context2.prev=_context2.next){case 0:
target=c.program.target;
(0,_logger.logTask)("runAndroid:"+platform+":"+target+":"+defaultTarget);

outputAab=(0,_common.getConfigProp)(c,platform,'aab',false);if(!

outputAab){_context2.next=5;break;}return _context2.abrupt("return",_runGradleApp(c,platform,{}));case 5:_context2.next=7;return _regenerator.default.awrap(

(0,_deviceManager.resetAdb)(c));case 7:if(!(

target&&_net.default.isIP(target))){_context2.next=10;break;}_context2.next=10;return _regenerator.default.awrap(
(0,_deviceManager.connectToWifiDevice)(c,target));case 10:_context2.prev=10;_context2.next=13;return _regenerator.default.awrap(




(0,_deviceManager.getAndroidTargets)(c,false,false,c.program.device!==undefined));case 13:devicesAndEmulators=_context2.sent;_context2.next=19;break;case 16:_context2.prev=16;_context2.t0=_context2["catch"](10);return _context2.abrupt("return",

Promise.reject(_context2.t0));case 19:


activeDevices=devicesAndEmulators.filter(function(d){return d.isActive;});
inactiveDevices=devicesAndEmulators.filter(function(d){return!d.isActive;});

askWhereToRun=function askWhereToRun(){var devicesString,choices,response,devices,_devicesString,_choices,_response,dev,_devices;return _regenerator.default.async(function askWhereToRun$(_context){while(1)switch(_context.prev=_context.next){case 0:if(!(
activeDevices.length===0&&inactiveDevices.length>0)){_context.next=16;break;}

devicesString=(0,_deviceManager.composeDevicesString)(inactiveDevices,true);
choices=devicesString;_context.next=5;return _regenerator.default.awrap(
_inquirer.default.prompt([{
name:'chosenEmulator',
type:'list',
message:'What emulator would you like to start?',
choices:choices
}]));case 5:response=_context.sent;if(!
response.chosenEmulator){_context.next=14;break;}_context.next=9;return _regenerator.default.awrap(
(0,_deviceManager.launchAndroidSimulator)(c,platform,response.chosenEmulator,true));case 9:_context.next=11;return _regenerator.default.awrap(
(0,_deviceManager.checkForActiveEmulator)(c,platform));case 11:devices=_context.sent;_context.next=14;return _regenerator.default.awrap(
_runGradleApp(c,platform,devices));case 14:_context.next=35;break;case 16:if(!(

activeDevices.length>1)){_context.next=28;break;}
_devicesString=(0,_deviceManager.composeDevicesString)(activeDevices,true);
_choices=_devicesString;_context.next=21;return _regenerator.default.awrap(
_inquirer.default.prompt([{
name:'chosenEmulator',
type:'list',
message:'Where would you like to run your app?',
choices:_choices
}]));case 21:_response=_context.sent;if(!
_response.chosenEmulator){_context.next=26;break;}
dev=activeDevices.find(function(d){return d.name===_response.chosenEmulator;});_context.next=26;return _regenerator.default.awrap(
_runGradleApp(c,platform,dev));case 26:_context.next=35;break;case 28:_context.next=30;return _regenerator.default.awrap(


(0,_deviceManager.askForNewEmulator)(c,platform));case 30:_context.next=32;return _regenerator.default.awrap(
(0,_deviceManager.checkForActiveEmulator)(c,platform));case 32:_devices=_context.sent;_context.next=35;return _regenerator.default.awrap(
_runGradleApp(c,platform,_devices));case 35:case"end":return _context.stop();}},null,null,null,Promise);};if(!



target){_context2.next=44;break;}

(0,_logger.logDebug)('Target provided',target);
foundDevice=devicesAndEmulators.find(function(d){return d.udid.includes(target)||d.name.includes(target);});if(!
foundDevice){_context2.next=40;break;}if(!
foundDevice.isActive){_context2.next=31;break;}_context2.next=29;return _regenerator.default.awrap(
_runGradleApp(c,platform,foundDevice));case 29:_context2.next=38;break;case 31:_context2.next=33;return _regenerator.default.awrap(

(0,_deviceManager.launchAndroidSimulator)(c,platform,foundDevice,true));case 33:_context2.next=35;return _regenerator.default.awrap(
(0,_deviceManager.checkForActiveEmulator)(c,platform));case 35:device=_context2.sent;_context2.next=38;return _regenerator.default.awrap(
_runGradleApp(c,platform,device));case 38:_context2.next=42;break;case 40:_context2.next=42;return _regenerator.default.awrap(


askWhereToRun());case 42:_context2.next=72;break;case 44:if(!(

activeDevices.length===1)){_context2.next=51;break;}

dv=activeDevices[0];
(0,_logger.logInfo)("Found device "+dv.name+":"+dv.udid+"!");_context2.next=49;return _regenerator.default.awrap(
_runGradleApp(c,platform,dv));case 49:_context2.next=72;break;case 51:if(!
defaultTarget){_context2.next=69;break;}

(0,_logger.logDebug)('Default target used',defaultTarget);
_foundDevice=devicesAndEmulators.find(function(d){return d.udid.includes(defaultTarget)||d.name.includes(defaultTarget);});if(
_foundDevice){_context2.next=60;break;}
(0,_logger.logDebug)('Target not provided, asking where to run');_context2.next=58;return _regenerator.default.awrap(
askWhereToRun());case 58:_context2.next=67;break;case 60:_context2.next=62;return _regenerator.default.awrap(

(0,_deviceManager.launchAndroidSimulator)(c,platform,_foundDevice,true));case 62:_context2.next=64;return _regenerator.default.awrap(
(0,_deviceManager.checkForActiveEmulator)(c,platform));case 64:_device=_context2.sent;_context2.next=67;return _regenerator.default.awrap(
_runGradleApp(c,platform,_device));case 67:_context2.next=72;break;case 69:



(0,_logger.logDebug)('Target not provided, asking where to run');_context2.next=72;return _regenerator.default.awrap(
askWhereToRun());case 72:case"end":return _context2.stop();}},null,null,[[10,16]],Promise);};exports.runAndroid=runAndroid;




var _checkSigningCerts=function _checkSigningCerts(c){var _c$files$workspace$ap;var signingConfig,isRelease,privateConfig,_await$inquirer$promp,confirm,confirmCopy,platCandidate,_await$inquirerPrompt,confirmNewKeystore,platCandidates,resultCopy,storeFile,result,_await$inquirer$promp2,storePassword,keyAlias,keyPassword,keystorePath,keytoolCmd;return _regenerator.default.async(function _checkSigningCerts$(_context3){while(1)switch(_context3.prev=_context3.next){case 0:
(0,_logger.logTask)('_checkSigningCerts');
signingConfig=(0,_common.getConfigProp)(c,c.platform,'signingConfig','Debug');
isRelease=signingConfig==='Release';
privateConfig=(_c$files$workspace$ap=c.files.workspace.appConfig.configPrivate)==null?void 0:_c$files$workspace$ap[c.platform];if(!(

isRelease&&!privateConfig)){_context3.next=54;break;}
(0,_logger.logWarning)("You're attempting to "+c.command+" app in release mode but you have't configured your "+_chalk.default.white(c.paths.workspace.appConfig.configPrivate)+" for "+_chalk.default.white(c.platform)+" platform yet.");_context3.next=8;return _regenerator.default.awrap(

_inquirer.default.prompt({
type:'confirm',
name:'confirm',
message:'Do you want to configure it now?'
}));case 8:_await$inquirer$promp=_context3.sent;confirm=_await$inquirer$promp.confirm;if(!

confirm){_context3.next=53;break;}
confirmCopy=false;_context3.next=14;return _regenerator.default.awrap(

(0,_prompt.inquirerPrompt)({
type:'confirm',
name:'confirmNewKeystore',
message:'Do you want to generate new keystore as well?'
}));case 14:_await$inquirerPrompt=_context3.sent;confirmNewKeystore=_await$inquirerPrompt.confirmNewKeystore;if(!

c.files.workspace.appConfig.configPrivate){_context3.next=24;break;}
platCandidates=[_constants.ANDROID_WEAR,_constants.ANDROID_TV,_constants.ANDROID];

platCandidates.forEach(function(v){
if(c.files.workspace.appConfig.configPrivate[v]){
platCandidate=v;
}
});if(!
platCandidate){_context3.next=24;break;}_context3.next=22;return _regenerator.default.awrap(
(0,_prompt.inquirerPrompt)({
type:'confirm',
name:'confirmCopy',
message:"Found existing keystore configuration for "+platCandidate+". do you want to reuse it?"
}));case 22:resultCopy=_context3.sent;
confirmCopy=resultCopy.confirmCopy;case 24:if(!




confirmCopy){_context3.next=28;break;}
c.files.workspace.appConfig.configPrivate[c.platform]=c.files.workspace.appConfig.configPrivate[platCandidate];_context3.next=47;break;case 28:if(



confirmNewKeystore){_context3.next=33;break;}_context3.next=31;return _regenerator.default.awrap(
(0,_prompt.inquirerPrompt)({
type:'input',
name:'storeFile',
message:"Paste asolute or relative path to "+_chalk.default.white(c.paths.workspace.appConfig.dir)+" of your existing "+_chalk.default.white('release.keystore')+" file"
}));case 31:result=_context3.sent;
storeFile=result.storeFile;case 33:_context3.next=35;return _regenerator.default.awrap(


_inquirer.default.prompt([
{
type:'password',
name:'storePassword',
message:'storePassword'
},
{
type:'input',
name:'keyAlias',
message:'keyAlias'
},
{
type:'password',
name:'keyPassword',
message:'keyPassword'
}]));case 35:_await$inquirer$promp2=_context3.sent;storePassword=_await$inquirer$promp2.storePassword;keyAlias=_await$inquirer$promp2.keyAlias;keyPassword=_await$inquirer$promp2.keyPassword;if(!



confirmNewKeystore){_context3.next=46;break;}
keystorePath=c.paths.workspace.appConfig.dir+"/release.keystore";
(0,_fileutils.mkdirSync)(c.paths.workspace.appConfig.dir);
keytoolCmd="keytool -genkey -v -keystore "+keystorePath+" -alias "+keyAlias+" -keypass "+keyPassword+" -storepass "+storePassword+" -keyalg RSA -keysize 2048 -validity 10000";_context3.next=45;return _regenerator.default.awrap(
(0,_exec.executeAsync)(c,keytoolCmd,{
env:process.env,
shell:true,
stdio:'inherit',
silent:true
}));case 45:
storeFile='./release.keystore';case 46:


if(c.paths.workspace.appConfig.dir){
(0,_fileutils.mkdirSync)(c.paths.workspace.appConfig.dir);
c.files.workspace.appConfig.configPrivate={};
c.files.workspace.appConfig.configPrivate[c.platform]={storeFile:storeFile,storePassword:storePassword,keyAlias:keyAlias,keyPassword:keyPassword};
}case 47:



(0,_fileutils.updateObjectSync)(c.paths.workspace.appConfig.configPrivate,c.files.workspace.appConfig.configPrivate);
(0,_logger.logSuccess)("Successfully updated private config file at "+_chalk.default.white(c.paths.workspace.appConfig.dir)+".");_context3.next=51;return _regenerator.default.awrap(
configureProject(c,c.platform));case 51:_context3.next=54;break;case 53:return _context3.abrupt("return",

Promise.reject('You selected no. Can\'t proceed'));case 54:case"end":return _context3.stop();}},null,null,null,Promise);};




var _runGradleApp=function _runGradleApp(c,platform,device){var signingConfig,appFolder,bundleId,outputAab,outputFolder,arch,name,stacktrace,aabPath,apkPath,_e$message,_await$inquirerPrompt2,confirm;return _regenerator.default.async(function _runGradleApp$(_context4){while(1)switch(_context4.prev=_context4.next){case 0:
(0,_logger.logTask)("_runGradleApp:"+platform);

signingConfig=(0,_common.getConfigProp)(c,platform,'signingConfig','Debug');
appFolder=(0,_common.getAppFolder)(c,platform);
bundleId=(0,_common.getAppId)(c,platform);
outputAab=(0,_common.getConfigProp)(c,platform,'aab',false);
outputFolder=signingConfig==='Debug'?'debug':'release';
arch=device.arch,name=device.name;
stacktrace=c.program.info?' --debug':'';

_shelljs.default.cd(""+appFolder);_context4.next=11;return _regenerator.default.awrap(

_checkSigningCerts(c));case 11:_context4.next=13;return _regenerator.default.awrap(
(0,_exec.executeAsync)(c,(_utils.isSystemWin?'gradlew.bat':'./gradlew')+" "+(outputAab?'bundle':'assemble')+signingConfig+stacktrace+" -x bundleReleaseJsAndAssets"));case 13:if(!
outputAab){_context4.next=17;break;}
aabPath=_path.default.join(appFolder,"app/build/outputs/bundle/"+outputFolder+"/app.aab");
(0,_logger.logInfo)("App built. Path "+aabPath);return _context4.abrupt("return",
true);case 17:

apkPath=_path.default.join(appFolder,"app/build/outputs/apk/"+outputFolder+"/app-"+outputFolder+".apk");
if(!_fs.default.existsSync(apkPath)){
apkPath=_path.default.join(appFolder,"app/build/outputs/apk/"+outputFolder+"/app-"+outputFolder+"-unsigned.apk");
}if(!_fs.default.existsSync(apkPath)){
apkPath=_path.default.join(appFolder,"app/build/outputs/apk/"+outputFolder+"/app-"+arch+"-"+outputFolder+".apk");
}
(0,_logger.logInfo)("Installing "+apkPath+" on "+name);_context4.prev=21;_context4.next=24;return _regenerator.default.awrap(

(0,_exec.execCLI)(c,_constants.CLI_ANDROID_ADB,"-s "+device.udid+" install -r -d -f "+apkPath));case 24:_context4.next=42;break;case 26:_context4.prev=26;_context4.t0=_context4["catch"](21);if(!(

_context4.t0!=null&&_context4.t0.includes('INSTALL_FAILED')||_context4.t0!=null&&(_e$message=_context4.t0.message)!=null&&_e$message.includes('INSTALL_FAILED'))){_context4.next=41;break;}_context4.next=31;return _regenerator.default.awrap(
(0,_prompt.inquirerPrompt)({
type:'confirm',
message:'It seems you already have the app installed but RNV can\'t update it. Uninstall that one and try again?'
}));case 31:_await$inquirerPrompt2=_context4.sent;confirm=_await$inquirerPrompt2.confirm;if(

confirm){_context4.next=35;break;}throw new Error('User canceled');case 35:_context4.next=37;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_ANDROID_ADB,"-s "+device.udid+" uninstall "+bundleId));case 37:_context4.next=39;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_ANDROID_ADB,"-s "+device.udid+" install -r -d -f "+apkPath));case 39:_context4.next=42;break;case 41:throw(

new Error(_context4.t0));case 42:if(



outputAab){_context4.next=45;break;}_context4.next=45;return _regenerator.default.awrap((0,_exec.execCLI)(c,_constants.CLI_ANDROID_ADB,"-s "+device.udid+" shell am start -n "+bundleId+"/.MainActivity"));case 45:case"end":return _context4.stop();}},null,null,[[21,26]],Promise);};


var buildAndroid=function buildAndroid(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("buildAndroid:"+platform);

var appFolder=(0,_common.getAppFolder)(c,platform);
var signingConfig=(0,_common.getConfigProp)(c,platform,'signingConfig','Debug');

_shelljs.default.cd(""+appFolder);

_checkSigningCerts(c).
then(function(){return(0,_exec.executeAsync)(c,(_utils.isSystemWin?'gradlew.bat':'./gradlew')+" assemble"+signingConfig+" -x bundleReleaseJsAndAssets");}).
then(function(){
(0,_logger.logSuccess)("Your APK is located in "+_chalk.default.white(_path.default.join(appFolder,"app/build/outputs/apk/"+signingConfig.toLowerCase()))+" .");
resolve();
}).catch(function(e){return reject(e);});
});};exports.buildAndroid=buildAndroid;

var configureAndroidProperties=function configureAndroidProperties(c,platform){return new Promise(function(resolve){
(0,_logger.logTask)("configureAndroidProperties:"+platform);

var appFolder=(0,_common.getAppFolder)(c,platform);

var addNDK=c.files.workspace.config.sdks.ANDROID_NDK&&!c.files.workspace.config.sdks.ANDROID_NDK.includes('<USER>');
var ndkString="ndk.dir="+(0,_fileutils.getRealPath)(c,c.files.workspace.config.sdks.ANDROID_NDK);
var sdkDir=(0,_fileutils.getRealPath)(c,c.files.workspace.config.sdks.ANDROID_SDK);

if(_utils.isSystemWin){
sdkDir=sdkDir.replace(/\\/g,'/');
}

_fs.default.writeFileSync(
_path.default.join(appFolder,'local.properties'),"#Generated by ReNative (https://renative.org)\n"+(

addNDK?ndkString:'')+"\nsdk.dir="+
sdkDir);


resolve();
});};exports.configureAndroidProperties=configureAndroidProperties;

var configureGradleProject=function configureGradleProject(c){var platform;return _regenerator.default.async(function configureGradleProject$(_context5){while(1)switch(_context5.prev=_context5.next){case 0:
platform=c.platform;
(0,_logger.logTask)("configureGradleProject:"+platform);if(

(0,_.isPlatformActive)(c,platform)){_context5.next=4;break;}return _context5.abrupt("return");case 4:_context5.next=6;return _regenerator.default.awrap(

(0,_projectParser.copyAssetsFolder)(c,platform));case 6:_context5.next=8;return _regenerator.default.awrap(
configureAndroidProperties(c,platform));case 8:_context5.next=10;return _regenerator.default.awrap(
configureProject(c,platform));case 10:return _context5.abrupt("return",
(0,_projectParser.copyBuildsFolder)(c,platform));case 11:case"end":return _context5.stop();}},null,null,null,Promise);};exports.configureGradleProject=configureGradleProject;


var configureProject=function configureProject(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("configureProject:"+platform);

var appFolder=(0,_common.getAppFolder)(c,platform);
var appTemplateFolder=(0,_common.getAppTemplateFolder)(c,platform);

var gradlew=_path.default.join(appFolder,'gradlew');

if(!_fs.default.existsSync(gradlew)){
(0,_logger.logWarning)("Looks like your "+_chalk.default.white(platform)+" platformBuild is misconfigured!. let's repair it.");
(0,_.createPlatformBuild)(c,platform).
then(function(){return configureGradleProject(c,platform);}).
then(function(){return resolve(c);}).
catch(function(e){return reject(e);});
return;
}

var outputFile=_getEntryOutputName(c);

(0,_fileutils.mkdirSync)(_path.default.join(appFolder,'app/src/main/assets'));
_fs.default.writeFileSync(_path.default.join(appFolder,"app/src/main/assets/"+outputFile+".bundle"),'{}');
_fs.default.chmodSync(gradlew,'755');


c.pluginConfigAndroid={
pluginIncludes:"include ':app'",
pluginPaths:'',
pluginImports:'',
pluginPackages:'MainReactPackage(),\n',
pluginActivityImports:'',
pluginActivityMethods:'',
pluginApplicationImports:'',
pluginApplicationMethods:'',
pluginApplicationCreateMethods:'',
pluginApplicationDebugServer:'',
applyPlugin:'',
defaultConfig:'',
pluginActivityCreateMethods:'',
pluginActivityResultMethods:'',
pluginSplashActivityImports:'',
manifestApplication:'',
buildGradleAllProjectsRepositories:'',
buildGradleBuildScriptRepositories:'',
buildGradleBuildScriptDependencies:'',
buildGradleBuildScriptDexOptions:'',
appBuildGradleSigningConfigs:'',
appBuildGradleImplementations:'',
resourceStrings:[],
appBuildGradleAfterEvaluate:''
};


(0,_pluginTools.parsePlugins)(c,platform,function(plugin,pluginPlat,key){
(0,_gradleParser.injectPluginGradleSync)(c,pluginPlat,key,pluginPlat.package);
(0,_kotlinParser.injectPluginKotlinSync)(c,pluginPlat,key,pluginPlat.package);
(0,_manifestParser.injectPluginManifestSync)(c,pluginPlat,key,pluginPlat.package);
(0,_xmlValuesParser.injectPluginXmlValuesSync)(c,pluginPlat,key,pluginPlat.package);
});

c.pluginConfigAndroid.pluginPackages=c.pluginConfigAndroid.pluginPackages.substring(0,c.pluginConfigAndroid.pluginPackages.length-2);


(0,_projectParser.parseFonts)(c,function(font,dir){
if(font.includes('.ttf')||font.includes('.otf')){
var key=font.split('.')[0];
var includedFonts=c.buildConfig.common.includedFonts;
if(includedFonts){
if(includedFonts.includes('*')||includedFonts.includes(key)){
if(font){
var fontSource=_path.default.join(dir,font);
if(_fs.default.existsSync(fontSource)){
var fontFolder=_path.default.join(appFolder,'app/src/main/assets/fonts');
(0,_fileutils.mkdirSync)(fontFolder);
var fontDest=_path.default.join(fontFolder,font);
(0,_fileutils.copyFileSync)(fontSource,fontDest);
}else{
(0,_logger.logWarning)("Font "+_chalk.default.white(fontSource)+" doesn't exist! Skipping.");
}
}
}
}
}
});

(0,_gradleParser.parseSettingsGradleSync)(c,platform);
(0,_gradleParser.parseAppBuildGradleSync)(c,platform);
(0,_gradleParser.parseBuildGradleSync)(c,platform);
(0,_kotlinParser.parseMainActivitySync)(c,platform);
(0,_kotlinParser.parseMainApplicationSync)(c,platform);
(0,_kotlinParser.parseSplashActivitySync)(c,platform);
(0,_xmlValuesParser.parseValuesStringsSync)(c,platform);
(0,_xmlValuesParser.parseValuesColorsSync)(c,platform);
(0,_manifestParser.parseAndroidManifestSync)(c,platform);
(0,_gradleParser.parseGradlePropertiesSync)(c,platform);

resolve();
});};exports.configureProject=configureProject;


var runAndroidLog=function runAndroidLog(c){var filter,child;return _regenerator.default.async(function runAndroidLog$(_context6){while(1)switch(_context6.prev=_context6.next){case 0:
(0,_logger.logTask)('runAndroidLog');
filter=c.program.filter||'';
child=_execa.default.command(c.cli[_constants.CLI_ANDROID_ADB]+" logcat");

child.stdout.on('data',function(data){
var d=data.toString().split('\n');
d.forEach(function(v){
if(v.includes(' E ')&&v.includes(filter)){
console.log(_chalk.default.red(v));
}else if(v.includes(' W ')&&v.includes(filter)){
console.log(_chalk.default.yellow(v));
}else if(v.includes(filter)){
console.log(v);
}
});
});return _context6.abrupt("return",
child.then(function(res){return res.stdout;}).catch(function(err){return Promise.reject("Error: "+err);}));case 5:case"end":return _context6.stop();}},null,null,null,Promise);};exports.runAndroidLog=runAndroidLog;
//# sourceMappingURL=index.js.map