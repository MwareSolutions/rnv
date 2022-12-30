var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.runXcodeProject=exports.runPod=exports.runAppleLog=exports.packageBundleForXcode=exports.getAppFolderName=exports.exportXcodeProject=exports.copyAppleAssets=exports.configureXcodeProject=exports.archiveXcodeProject=void 0;var _toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));

var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _chalk=_interopRequireDefault(require("chalk"));
var _child_process=_interopRequireDefault(require("child_process"));
var _inquirer=_interopRequireDefault(require("inquirer"));

var _exec=require("../../systemTools/exec");
var _deviceManager=require("./deviceManager");
var _fastlane=require("./fastlane");
var _common=require("../../common");





var _=require("..");
var _projectParser=require("../../projectTools/projectParser");
var _fileutils=require("../../systemTools/fileutils");
var _constants=require("../../constants");
var _plistParser=require("./plistParser");



var _xcschemeParser=require("./xcschemeParser");
var _podfileParser=require("./podfileParser");
var _xcodeParser=require("./xcodeParser");
var _swiftParser=require("./swiftParser");
var _logger=require("../../systemTools/logger");



var checkIfPodsIsRequired=function checkIfPodsIsRequired(c){var appFolder,podChecksumPath,podChecksum,podContentChecksum;return _regenerator.default.async(function checkIfPodsIsRequired$(_context){while(1){switch(_context.prev=_context.next){case 0:
appFolder=(0,_common.getAppFolder)(c,c.platform);
podChecksumPath=_path.default.join(appFolder,'Podfile.checksum');if(
_fs.default.existsSync(podChecksumPath)){_context.next=4;break;}return _context.abrupt("return",true);case 4:
podChecksum=_fs.default.readFileSync(podChecksumPath).toString();
podContentChecksum=(0,_common.generateChecksum)(_fs.default.readFileSync(_path.default.join(appFolder,'Podfile')).toString());if(!(

podChecksum!==podContentChecksum)){_context.next=9;break;}
(0,_logger.logDebug)('runPod:isMandatory');return _context.abrupt("return",
true);case 9:

(0,_logger.logInfo)('Pods do not seem like they need to be updated. If you want to update them manually run the same command with "-u" parameter');return _context.abrupt("return",
false);case 11:case"end":return _context.stop();}}},null,null,null,Promise);};


var updatePodsChecksum=function updatePodsChecksum(c){
(0,_logger.logTask)('updatePodsChecksum');
var appFolder=(0,_common.getAppFolder)(c,c.platform);
var podChecksumPath=_path.default.join(appFolder,'Podfile.checksum');
var podContentChecksum=(0,_common.generateChecksum)(_fs.default.readFileSync(_path.default.join(appFolder,'Podfile')).toString());
if(_fs.default.existsSync(podChecksumPath)){
var existingContent=_fs.default.readFileSync(podChecksumPath).toString();
if(existingContent!==podContentChecksum){
(0,_logger.logDebug)("updatePodsChecksum:"+podContentChecksum);
return _fs.default.writeFileSync(podChecksumPath,podContentChecksum);
}
return true;
}
(0,_logger.logDebug)("updatePodsChecksum:"+podContentChecksum);
return _fs.default.writeFileSync(podChecksumPath,podContentChecksum);
};

var runPod=function runPod(c,platform){var appFolder,podsRequired,s,isGenericError;return _regenerator.default.async(function runPod$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)("runPod:"+platform);

appFolder=(0,_common.getAppFolder)(c,platform);if(

_fs.default.existsSync(appFolder)){_context2.next=4;break;}return _context2.abrupt("return",
Promise.reject("Location "+appFolder+" does not exists!"));case 4:_context2.t0=

c.program.updatePods;if(_context2.t0){_context2.next=9;break;}_context2.next=8;return _regenerator.default.awrap(checkIfPodsIsRequired(c));case 8:_context2.t0=_context2.sent;case 9:podsRequired=_context2.t0;if(!

podsRequired){_context2.next=28;break;}if(
(0,_exec.commandExistsSync)('pod')){_context2.next=13;break;}throw new Error('Cocoapods not installed. Please run `sudo gem install cocoapods`');case 13:_context2.prev=13;_context2.next=16;return _regenerator.default.awrap(


(0,_exec.executeAsync)(c,'pod install',{
cwd:appFolder,
env:process.env}));case 16:_context2.next=26;break;case 18:_context2.prev=18;_context2.t1=_context2["catch"](13);


s=_context2.t1!=null&&_context2.t1.toString?_context2.t1.toString():'';
isGenericError=s.includes('No provisionProfileSpecifier configured')||s.includes('TypeError:')||s.includes('ReferenceError:')||s.includes('find gem cocoapods');if(!
isGenericError){_context2.next=24;break;}return _context2.abrupt("return",new Error("pod install failed with:\n "+s));case 24:
(0,_logger.logWarning)("Looks like pod install is not enough! Let's try pod update! Error:\n "+s);return _context2.abrupt("return",
(0,_exec.executeAsync)(c,'pod update',{cwd:appFolder,env:process.env}).
then(function(){return updatePodsChecksum(c);}).
catch(function(er){return Promise.reject(er);}));case 26:


updatePodsChecksum(c);return _context2.abrupt("return",
true);case 28:case"end":return _context2.stop();}}},null,null,[[13,18]],Promise);};exports.runPod=runPod;



var copyAppleAssets=function copyAppleAssets(c,platform,appFolderName){return new Promise(function(resolve){
(0,_logger.logTask)('copyAppleAssets');
if(!(0,_.isPlatformActive)(c,platform,resolve))return;

var appFolder=(0,_common.getAppFolder)(c,platform);


_fs.default.writeFileSync(_path.default.join(appFolder,'main.jsbundle'),'{}');
(0,_fileutils.mkdirSync)(_path.default.join(appFolder,'assets'));
(0,_fileutils.mkdirSync)(_path.default.join(appFolder,appFolderName+"/images"));

resolve();
});};exports.copyAppleAssets=copyAppleAssets;

var runXcodeProject=function runXcodeProject(c){var appPath,device,scheme,runScheme,bundleIsDev,bundleAssets,p,devicesArr,run,selectedDevice,devices,_await$inquirer$promp,sim,_devices,_await$inquirer$promp2,_sim,allowProvisioningUpdates;return _regenerator.default.async(function runXcodeProject$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:
(0,_logger.logTask)("runXcodeProject:"+c.platform+":"+c.runtime.target);

appPath=(0,_common.getAppFolder)(c,c.platform);
device=c.program.device;
scheme=(0,_common.getConfigProp)(c,c.platform,'scheme');
runScheme=(0,_common.getConfigProp)(c,c.platform,'runScheme');
bundleIsDev=(0,_common.getConfigProp)(c,c.platform,'bundleIsDev')===true;
bundleAssets=(0,_common.getConfigProp)(c,c.platform,'bundleAssets')===true;if(


scheme){_context3.next=9;break;}return _context3.abrupt("return",
Promise.reject("You missing scheme in platforms."+
_chalk.default.yellow(c.platform)+" in your "+_chalk.default.white(
c.paths.appConfig.config)+"! Check example config for more info:  "+
_chalk.default.grey(
'https://github.com/pavjacko/renative/blob/master/appConfigs/helloWorld/renative.json')+" "));case 9:if(!(





device===true)){_context3.next=15;break;}_context3.next=12;return _regenerator.default.awrap((0,_deviceManager.getAppleDevices)(c,c.platform,false,true));case 12:devicesArr=_context3.sent;_context3.next=19;break;case 15:if(!(
c.runtime.target===true)){_context3.next=19;break;}_context3.next=18;return _regenerator.default.awrap((0,_deviceManager.getAppleDevices)(c,c.platform,true,false));case 18:devicesArr=_context3.sent;case 19:if(!(

device===true)){_context3.next=44;break;}if(!(
devicesArr.length===1)){_context3.next=25;break;}
(0,_logger.logSuccess)("Found one device connected! device name: "+_chalk.default.white(devicesArr[0].name)+" udid: "+_chalk.default.white(devicesArr[0].udid));
if(devicesArr[0].udid){
p="--device --udid "+devicesArr[0].udid;
c.runtime.targetUDID=devicesArr[0].udid;
}else{
p="--device "+devicesArr[0].name;
}_context3.next=42;break;case 25:if(!(
devicesArr.length>1)){_context3.next=41;break;}
run=function run(selectedDevice){
(0,_logger.logDebug)("Selected device: "+JSON.stringify(selectedDevice,null,3));
c.runtime.targetUDID=selectedDevice.udid;
if(selectedDevice.udid){
p="--device --udid "+selectedDevice.udid;
}else{
p="--device "+selectedDevice.name;
}

(0,_logger.logDebug)("RN params: "+p);

if(bundleAssets){
(0,_logger.logDebug)('Assets will be bundled');
return packageBundleForXcode(c,c.platform,bundleIsDev).then(function(){return _checkLockAndExec(c,appPath,scheme,runScheme,p);});
}
return _checkLockAndExec(c,appPath,scheme,runScheme,p);
};if(!(

c.runtime.target!==true)){_context3.next=32;break;}
selectedDevice=devicesArr.find(function(d){return d.name===c.runtime.target;});if(!
selectedDevice){_context3.next=31;break;}return _context3.abrupt("return",
run(selectedDevice));case 31:

(0,_logger.logWarning)("Could not find device "+c.runtime.target);case 32:


devices=devicesArr.map(function(v){return{name:v.name+" | "+v.icon+" | v: "+_chalk.default.green(v.version)+" | udid: "+_chalk.default.grey(v.udid)+(v.isDevice?_chalk.default.red(' (device)'):''),value:v};});_context3.next=35;return _regenerator.default.awrap(

_inquirer.default.prompt({
name:'sim',
message:'Select the device you want to launch on',
type:'list',
choices:devices}));case 35:_await$inquirer$promp=_context3.sent;sim=_await$inquirer$promp.sim;if(!


sim){_context3.next=39;break;}return _context3.abrupt("return",
run(sim));case 39:_context3.next=42;break;case 41:return _context3.abrupt("return",


Promise.reject("No "+c.platform+" devices connected!"));case 42:_context3.next=59;break;case 44:if(!

device){_context3.next=48;break;}
p="--device "+device;_context3.next=59;break;case 48:if(!(
c.runtime.target===true)){_context3.next=58;break;}
_devices=devicesArr.map(function(v){return{name:v.name+" | "+v.icon+" | v: "+_chalk.default.green(v.version)+" | udid: "+_chalk.default.grey(v.udid)+(v.isDevice?_chalk.default.red(' (device)'):''),value:v};});_context3.next=52;return _regenerator.default.awrap(

_inquirer.default.prompt({
name:'sim',
message:'Select the device you want to launch on',
type:'list',
choices:_devices}));case 52:_await$inquirer$promp2=_context3.sent;_sim=_await$inquirer$promp2.sim;

c.runtime.target=_sim.name;
p="--simulator "+c.runtime.target.replace(/(\s+)/g,'\\$1');_context3.next=59;break;case 58:

p="--simulator "+c.runtime.target.replace(/(\s+)/g,'\\$1');case 59:if(!


p){_context3.next=64;break;}
allowProvisioningUpdates=(0,_common.getConfigProp)(c,c.platform,'allowProvisioningUpdates',true);if(!


bundleAssets){_context3.next=63;break;}return _context3.abrupt("return",
packageBundleForXcode(c,c.platform,bundleIsDev).then(function(){return _checkLockAndExec(c,appPath,scheme,runScheme,p);}));case 63:return _context3.abrupt("return",

_checkLockAndExec(c,appPath,scheme,runScheme,p));case 64:return _context3.abrupt("return",

Promise.reject('Missing options for react-native command!'));case 65:case"end":return _context3.stop();}}},null,null,null,Promise);};exports.runXcodeProject=runXcodeProject;


var _checkLockAndExec=function _checkLockAndExec(c,appPath,scheme,runScheme,p){var cmd,isDeviceLocked,isDeviceNotRegistered,_await$inquirer$promp3,confirm,isDevelopmentTeamMissing,_c$paths$appConfig,loc,_await$inquirer$promp4,_confirm,isAutomaticSigningDisabled,isProvisioningMissing;return _regenerator.default.async(function _checkLockAndExec$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:
(0,_logger.logTask)("_checkLockAndExec:"+scheme+":"+runScheme);
cmd="react-native run-ios --project-path "+appPath+" --scheme "+scheme+" --configuration "+runScheme+" "+p;_context4.prev=2;_context4.next=5;return _regenerator.default.awrap(

(0,_exec.executeAsync)(c,cmd));case 5:return _context4.abrupt("return",
true);case 8:_context4.prev=8;_context4.t0=_context4["catch"](2);

isDeviceLocked=_context4.t0.includes('ERROR:DEVICE_LOCKED');if(!
isDeviceLocked){_context4.next=15;break;}_context4.next=14;return _regenerator.default.awrap(
_inquirer.default.prompt({message:'Unlock your device and press ENTER',type:'confirm',name:'confirm'}));case 14:return _context4.abrupt("return",
(0,_exec.executeAsync)(c,cmd));case 15:

isDeviceNotRegistered=_context4.t0.includes("doesn't include the currently selected device");if(!
isDeviceNotRegistered){_context4.next=27;break;}
(0,_logger.logError)(_context4.t0);
(0,_logger.logWarning)(c.platform+" DEVICE: "+_chalk.default.white(c.runtime.target)+" with UDID: "+_chalk.default.white(c.runtime.targetUDID)+" is not included in your provisionong profile in TEAM: "+_chalk.default.white((0,_common.getConfigProp)(c,c.platform,'teamID')));_context4.next=21;return _regenerator.default.awrap(
_inquirer.default.prompt({
name:'confirm',
message:'Do you want to register it?',
type:'confirm'}));case 21:_await$inquirer$promp3=_context4.sent;confirm=_await$inquirer$promp3.confirm;if(!

confirm){_context4.next=27;break;}_context4.next=26;return _regenerator.default.awrap(
(0,_fastlane.registerDevice)(c));case 26:return _context4.abrupt("return",
Promise.reject('Updated. Re-run your last command'));case 27:





isDevelopmentTeamMissing=_context4.t0.includes('requires a development team. Select a development team');if(!
isDevelopmentTeamMissing){_context4.next=40;break;}
loc="./appConfigs/"+c.runtime.appId+"/renative.json:{ \"platforms\": { \""+c.platform+"\": { \"teamID\": \".....\"";
(0,_logger.logError)(_context4.t0);
(0,_logger.logWarning)("You need specify the development team if you want to run app on "+c.platform+" device. this can be set manually in "+_chalk.default.white(loc)+"\nYou can find correct teamID in the URL of your apple developer account: "+
_chalk.default.white('https://developer.apple.com/account/#/overview/YOUR-TEAM-ID'));_context4.next=34;return _regenerator.default.awrap(
_inquirer.default.prompt({
name:'confirm',
message:"Type in your Apple Team ID to be used (will be saved to "+((_c$paths$appConfig=c.paths.appConfig)==null?void 0:_c$paths$appConfig.config)+")",
type:'input'}));case 34:_await$inquirer$promp4=_context4.sent;_confirm=_await$inquirer$promp4.confirm;if(!

_confirm){_context4.next=40;break;}_context4.next=39;return _regenerator.default.awrap(
_setDevelopmentTeam(c,_confirm));case 39:return _context4.abrupt("return",
Promise.reject('Updated. Re-run your last command'));case 40:





isAutomaticSigningDisabled=_context4.t0.includes('Automatic signing is disabled and unable to generate a profile');if(!
isAutomaticSigningDisabled){_context4.next=43;break;}return _context4.abrupt("return",
_handleProvisioningIssues(c,_context4.t0,'Your iOS App Development provisioning profiles don\'t match. under manual signing mode'));case 43:

isProvisioningMissing=_context4.t0.includes('requires a provisioning profile');if(!
isProvisioningMissing){_context4.next=46;break;}return _context4.abrupt("return",
_handleProvisioningIssues(c,_context4.t0,'Your iOS App requires a provisioning profile'));case 46:return _context4.abrupt("return",

Promise.reject(_context4.t0));case 47:case"end":return _context4.stop();}}},null,null,[[2,8]],Promise);};



var _handleProvisioningIssues=function _handleProvisioningIssues(c,e,msg){var provisioningStyle,isProvAutomatic,proAutoText,fixCommand,workspacePath,_await$inquirer$promp5,confirmAuto;return _regenerator.default.async(function _handleProvisioningIssues$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:
provisioningStyle=(0,_common.getConfigProp)(c,c.platform,'provisioningStyle');

isProvAutomatic=provisioningStyle==='Automatic';
proAutoText=isProvAutomatic?'':_chalk.default.white('[4]>')+" Switch to automatic signing for appId: "+c.runtime.appId+" , platform: "+c.platform+", scheme: "+c.runtime.scheme;
fixCommand="rnv crypto updateProfile -p "+c.platform+" -s "+c.runtime.scheme;
workspacePath=_chalk.default.white((0,_common.getAppFolder)(c,c.platform)+"/RNVApp.xcworkspace");
(0,_logger.logError)(e);
(0,_logger.logWarning)(msg+". To fix try:\n"+
_chalk.default.white('[1]>')+" Configure your certificates, provisioning profiles correctly manually\n"+
_chalk.default.white('[2]>')+" Try to generate matching profiles with "+_chalk.default.white(fixCommand)+" (you need correct priviledges in apple developer portal)\n"+
_chalk.default.white('[3]>')+" Open generated project in Xcode: "+workspacePath+" and debug from there (Sometimes this helps for the first-time builds)\n"+
proAutoText);if(!
isProvAutomatic){_context5.next=9;break;}return _context5.abrupt("return",false);case 9:_context5.next=11;return _regenerator.default.awrap(
_inquirer.default.prompt({
name:'confirmAuto',
message:'Switch to automatic signing?',
type:'confirm'}));case 11:_await$inquirer$promp5=_context5.sent;confirmAuto=_await$inquirer$promp5.confirmAuto;if(!

confirmAuto){_context5.next=17;break;}_context5.next=16;return _regenerator.default.awrap(
_setAutomaticSigning(c));case 16:return _context5.abrupt("return",
Promise.reject('Updated. Re-run your last command'));case 17:case"end":return _context5.stop();}}},null,null,null,Promise);};






var _setAutomaticSigning=function _setAutomaticSigning(c){var _c$files$appConfig,_c$files$appConfig$co,_c$files$appConfig$co2,_c$files$appConfig$co3,_c$files$appConfig$co4;var scheme,_c$paths$appConfig2;return _regenerator.default.async(function _setAutomaticSigning$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:
(0,_logger.logTask)("_setAutomaticSigning:"+c.platform);

scheme=(_c$files$appConfig=c.files.appConfig)==null?void 0:(_c$files$appConfig$co=_c$files$appConfig.config)==null?void 0:(_c$files$appConfig$co2=_c$files$appConfig$co.platforms)==null?void 0:(_c$files$appConfig$co3=_c$files$appConfig$co2[c.platform])==null?void 0:(_c$files$appConfig$co4=_c$files$appConfig$co3.buildSchemes)==null?void 0:_c$files$appConfig$co4[c.runtime.scheme];if(!
scheme){_context6.next=8;break;}
scheme.provisioningStyle='Automatic';
(0,_fileutils.writeFileSync)(c.paths.appConfig.config,c.files.appConfig.config);
(0,_logger.logSuccess)("Succesfully updated "+c.paths.appConfig.config);_context6.next=9;break;case 8:return _context6.abrupt("return",

Promise.reject("Failed to update "+((_c$paths$appConfig2=c.paths.appConfig)==null?void 0:_c$paths$appConfig2.config)+".\"platforms\": { \""+c.platform+"\": { buildSchemes: { \""+c.runtime.scheme+"\" ... Object is null. Try update file manually"));case 9:case"end":return _context6.stop();}}},null,null,null,Promise);};



var _setDevelopmentTeam=function _setDevelopmentTeam(c,teamID){var _c$files$appConfig2,_c$files$appConfig2$c,_c$files$appConfig2$c2;var plat,_c$paths$appConfig3;return _regenerator.default.async(function _setDevelopmentTeam$(_context7){while(1){switch(_context7.prev=_context7.next){case 0:
(0,_logger.logTask)("_setDevelopmentTeam:"+teamID);

plat=(_c$files$appConfig2=c.files.appConfig)==null?void 0:(_c$files$appConfig2$c=_c$files$appConfig2.config)==null?void 0:(_c$files$appConfig2$c2=_c$files$appConfig2$c.platforms)==null?void 0:_c$files$appConfig2$c2[c.platform];if(!
plat){_context7.next=8;break;}
plat.teamID=teamID;
(0,_fileutils.writeFileSync)(c.paths.appConfig.config,c.files.appConfig.config);
(0,_logger.logSuccess)("Succesfully updated "+c.paths.appConfig.config);_context7.next=9;break;case 8:return _context7.abrupt("return",

Promise.reject("Failed to update "+((_c$paths$appConfig3=c.paths.appConfig)==null?void 0:_c$paths$appConfig3.config)+".\"platforms\": { \""+c.platform+"\" ... Object is null. Try update file manually"));case 9:case"end":return _context7.stop();}}},null,null,null,Promise);};



var composeXcodeArgsFromCLI=function composeXcodeArgsFromCLI(string){
var spacesReplaced=string.replace(/\s(?=(?:[^'"`]*(['"`])[^'"`]*\1)*[^'"`]*$)/g,'&&&');
var keysAndValues=spacesReplaced.split('&&&');
var unescapedValues=keysAndValues.map(function(s){return s.replace(/\'/g,'').replace(/"/g,'').replace(/\\/g,'');});

return unescapedValues;
};

var archiveXcodeProject=function archiveXcodeProject(c,platform){
(0,_logger.logTask)("archiveXcodeProject:"+platform);


var appFolderName=getAppFolderName(c,platform);
var runScheme=(0,_common.getConfigProp)(c,platform,'runScheme','Debug');
var sdk=(0,_common.getConfigProp)(c,platform,'sdk');
if(!sdk){
if(platform===_constants.IOS)sdk='iphoneos';
if(platform===_constants.TVOS)sdk='appletvos';
if(platform===_constants.MACOS)sdk='macosx';
}
var sdkArr=[sdk];

var appPath=(0,_common.getAppFolder)(c,platform);
var exportPath=_path.default.join(appPath,'release');

var scheme=(0,_common.getConfigProp)(c,platform,'scheme');
var allowProvisioningUpdates=(0,_common.getConfigProp)(c,platform,'allowProvisioningUpdates',true);
var ignoreLogs=(0,_common.getConfigProp)(c,platform,'ignoreLogs');
var bundleIsDev=(0,_common.getConfigProp)(c,platform,'bundleIsDev')===true;
var exportPathArchive=exportPath+"/"+scheme+".xcarchive";
var ps='';
if(c.program.xcodebuildArchiveArgs){
ps=c.program.xcodebuildArchiveArgs;
}
var p=[];

if(!ps.includes('-workspace')){
p.push('-workspace');
p.push(appPath+"/"+appFolderName+".xcworkspace");
}
if(!ps.includes('-scheme')){
p.push('-scheme');
p.push(scheme);
}
if(!ps.includes('-sdk')){
p.push('-sdk');
p.push.apply(p,sdkArr);
}
if(!ps.includes('-configuration')){
p.push('-configuration');
p.push(runScheme);
}
p.push('archive');
if(!ps.includes('-archivePath')){
p.push('-archivePath');
p.push(exportPathArchive);
}

if(allowProvisioningUpdates&&!ps.includes('-allowProvisioningUpdates'))p.push('-allowProvisioningUpdates');
if(ignoreLogs&&!ps.includes('-quiet'))p.push('-quiet');



(0,_logger.logTask)('archiveXcodeProject: STARTING xcodebuild ARCHIVE...');

if(c.buildConfig.platforms[platform].runScheme==='Release'){
return packageBundleForXcode(c,platform,bundleIsDev).
then(function(){return(0,_exec.executeAsync)(c,"xcodebuild "+ps+" "+p.join(' '));}).
then(function(){
(0,_logger.logSuccess)("Your Archive is located in "+_chalk.default.white(exportPath)+" .");
});
}

var args=ps!==''?[].concat((0,_toConsumableArray2.default)(composeXcodeArgsFromCLI(ps)),p):p;

(0,_logger.logDebug)('xcodebuild args',args);

return(0,_exec.executeAsync)('xcodebuild',{rawCommand:{args:args}}).
then(function(){
(0,_logger.logSuccess)("Your Archive is located in "+_chalk.default.white(exportPath)+" .");
});
};exports.archiveXcodeProject=archiveXcodeProject;

var exportXcodeProject=function exportXcodeProject(c,platform){
(0,_logger.logTask)("exportXcodeProject:"+platform);

var appPath=(0,_common.getAppFolder)(c,platform);
var exportPath=_path.default.join(appPath,'release');

var scheme=(0,_common.getConfigProp)(c,platform,'scheme');
var allowProvisioningUpdates=(0,_common.getConfigProp)(c,platform,'allowProvisioningUpdates',true);
var ignoreLogs=(0,_common.getConfigProp)(c,platform,'ignoreLogs');

var ps='';
if(c.program.xcodebuildExportArgs){
ps=c.program.xcodebuildExportArgs;
}
var p=['-exportArchive'];

if(!ps.includes('-archivePath')){
p.push("-archivePath "+exportPath+"/"+scheme+".xcarchive");
}
if(!ps.includes('-exportOptionsPlist')){
p.push("-exportOptionsPlist "+appPath+"/exportOptions.plist");
}
if(!ps.includes('-exportPath')){
p.push("-exportPath "+exportPath);
}

if(allowProvisioningUpdates&&!ps.includes('-allowProvisioningUpdates'))p.push('-allowProvisioningUpdates');
if(ignoreLogs&&!ps.includes('-quiet'))p.push('-quiet');

(0,_logger.logDebug)('running',p);

(0,_logger.logTask)('exportXcodeProject: STARTING xcodebuild EXPORT...');

return(0,_exec.executeAsync)(c,"xcodebuild "+p.join(' ')).
then(function(){
(0,_logger.logSuccess)("Your IPA is located in "+_chalk.default.white(exportPath)+" .");
});
};exports.exportXcodeProject=exportXcodeProject;

var packageBundleForXcode=function packageBundleForXcode(c,platform){var isDev=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;
(0,_logger.logTask)("packageBundleForXcode:"+platform);
var maxErrorLength=c.program.maxErrorLength;
var args=[
'bundle',
'--platform',
'ios',
'--dev',
isDev,
'--assets-dest',"platformBuilds/"+
c.runtime.appId+"_"+platform,
'--entry-file',
c.buildConfig.platforms[platform].entryFile+".js",
'--bundle-output',
(0,_common.getAppFolder)(c,platform)+"/main.jsbundle"];


if(c.program.info){
args.push('--verbose');
}

return(0,_exec.executeAsync)(c,"react-native "+args.join(' '));
};exports.packageBundleForXcode=packageBundleForXcode;

var getAppFolderName=function getAppFolderName(c,platform){
var projectFolder=(0,_common.getConfigProp)(c,platform,'projectFolder');
if(projectFolder){
return projectFolder;
}
return platform===_constants.IOS?'RNVApp':'RNVAppTVOS';
};exports.getAppFolderName=getAppFolderName;



var runAppleLog=function runAppleLog(c){return new Promise(function(){
(0,_logger.logTask)('runAppleLog');
var filter=c.program.filter||'RNV';
var child=_child_process.default.execFile(
'xcrun',
['simctl','spawn','booted','log','stream','--predicate',"eventMessage contains \""+filter+"\""],
{stdio:'inherit',customFds:[0,1,2]});


child.stdout.on('data',function(data){
var d=data.toString();
if(d.toLowerCase().includes('error')){
console.log(_chalk.default.red(d));
}else if(d.toLowerCase().includes('success')){
console.log(_chalk.default.green(d));
}else{
console.log(d);
}
});
});};exports.runAppleLog=runAppleLog;

var configureXcodeProject=function configureXcodeProject(c,platform,ip,port){var device,bundlerIp,appFolder,appFolderName,bundleAssets,tId;return _regenerator.default.async(function configureXcodeProject$(_context8){while(1){switch(_context8.prev=_context8.next){case 0:
(0,_logger.logTask)("configureXcodeProject:"+platform);
device=c.program.device;
bundlerIp=device?(0,_common.getIP)():'localhost';
appFolder=(0,_common.getAppFolder)(c,platform);
appFolderName=getAppFolderName(c,platform);
bundleAssets=(0,_common.getConfigProp)(c,platform,'bundleAssets')===true;

c.pluginConfigiOS={
podfileInject:'',
exportOptions:'',
embeddedFonts:[],
embeddedFontSources:[],
pluginAppDelegateImports:'',
pluginAppDelegateMethods:'',
appDelegateMethods:{
application:{
didFinishLaunchingWithOptions:[],
applicationDidBecomeActive:[],
open:[],
supportedInterfaceOrientationsFor:[],
didReceiveRemoteNotification:[],
didFailToRegisterForRemoteNotificationsWithError:[],
didReceive:[],
didRegister:[],
didRegisterForRemoteNotificationsWithDeviceToken:[]},

userNotificationCenter:{
willPresent:[]}},


podfileSources:[]};



(0,_projectParser.parseFonts)(c,function(font,dir){
if(font.includes('.ttf')||font.includes('.otf')){
var key=font.split('.')[0];
var includedFonts=c.buildConfig.common.includedFonts;
if(includedFonts&&(includedFonts.includes('*')||includedFonts.includes(key))){
var fontSource=_path.default.join(dir,font);
if(_fs.default.existsSync(fontSource)){
var fontFolder=_path.default.join(appFolder,'fonts');
(0,_fileutils.mkdirSync)(fontFolder);
var fontDest=_path.default.join(fontFolder,font);
(0,_fileutils.copyFileSync)(fontSource,fontDest);
c.pluginConfigiOS.embeddedFontSources.push(fontSource);
c.pluginConfigiOS.embeddedFonts.push(font);
}else{
(0,_logger.logWarning)("Font "+_chalk.default.white(fontSource)+" doesn't exist! Skipping.");
}
}
}
});



tId=(0,_common.getConfigProp)(c,platform,'teamID');
if(device&&(!tId||tId==='')){
(0,_logger.logError)("Looks like you're missing teamID in your "+
_chalk.default.white(
c.paths.appConfig.config)+" => .platforms."+
platform+".teamID . you will not be able to build "+platform+" app for device!");

}_context8.next=12;return _regenerator.default.awrap(

(0,_projectParser.copyAssetsFolder)(c,platform));case 12:_context8.next=14;return _regenerator.default.awrap(
copyAppleAssets(c,platform,appFolderName));case 14:_context8.next=16;return _regenerator.default.awrap(
(0,_swiftParser.parseAppDelegate)(c,platform,appFolder,appFolderName,bundleAssets,bundlerIp,port));case 16:_context8.next=18;return _regenerator.default.awrap(
(0,_plistParser.parseExportOptionsPlist)(c,platform));case 18:_context8.next=20;return _regenerator.default.awrap(
(0,_xcschemeParser.parseXcscheme)(c,platform));case 20:_context8.next=22;return _regenerator.default.awrap(
(0,_podfileParser.parsePodFile)(c,platform));case 22:_context8.next=24;return _regenerator.default.awrap(
(0,_plistParser.parseEntitlementsPlist)(c,platform));case 24:_context8.next=26;return _regenerator.default.awrap(
(0,_plistParser.parseInfoPlist)(c,platform));case 26:_context8.next=28;return _regenerator.default.awrap(
(0,_projectParser.copyBuildsFolder)(c,platform));case 28:_context8.next=30;return _regenerator.default.awrap(
runPod(c,platform));case 30:_context8.next=32;return _regenerator.default.awrap(
(0,_xcodeParser.parseXcodeProject)(c,platform));case 32:return _context8.abrupt("return",
true);case 33:case"end":return _context8.stop();}}},null,null,null,Promise);};exports.configureXcodeProject=configureXcodeProject;
//# sourceMappingURL=index.js.map