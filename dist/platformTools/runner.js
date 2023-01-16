var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.rnvStart=exports.rnvRun=exports.rnvPackage=exports.rnvLog=exports.rnvExport=exports.rnvDeploy=exports.rnvDebug=exports.rnvBuild=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));

var _chalk=_interopRequireDefault(require("chalk"));
var _betterOpn=_interopRequireDefault(require("better-opn"));
var _ip=_interopRequireDefault(require("ip"));
var _path=_interopRequireDefault(require("path"));

var _common=require("../common");










var _index=require("./index");
var _logger=require("../systemTools/logger");




var _constants=require("../constants");
















var _apple=require("./apple");






var _web=require("./web");
var _tizen=require("./tizen");
var _webos=require("./webos");
var _firefox=require("./firefox");
var _electron=require("./electron");



var _android=require("./android");






var _fileutils=require("../systemTools/fileutils");
var _exec=require("../systemTools/exec");
var _bundler=require("./bundler");
var _sdkManager=require("./sdkManager");
var _config=_interopRequireDefault(require("../config"));
var _analytics=_interopRequireDefault(require("../systemTools/analytics"));
var _utils=require("../utils");

var keepRNVRunning=false;






var rnvStart=function rnvStart(c){var platform,port,hosted,startCmd;return _regenerator.default.async(function rnvStart$(_context){while(1)switch(_context.prev=_context.next){case 0:
platform=c.platform;
port=c.runtime.port;
hosted=c.program.hosted;

(0,_logger.logTask)("rnvStart:"+platform+":"+port+":"+hosted+":"+_config.default.isWebHostEnabled);

if(_config.default.isWebHostEnabled&&hosted){
(0,_common.waitForWebpack)(c,port).
then(function(){return(0,_betterOpn.default)("http://"+c.runtime.localhost+":"+port+"/");}).
catch(_logger.logError);
}_context.t0=

platform;_context.next=_context.t0===
_constants.MACOS?8:_context.t0===
_constants.WINDOWS?8:_context.t0===



_constants.WEB?11:_context.t0===
_constants.TIZEN?11:_context.t0===
_constants.WEBOS?11:_context.t0===
_constants.TIZEN_MOBILE?11:_context.t0===
_constants.TIZEN_WATCH?11:14;break;case 8:_context.next=10;return _regenerator.default.awrap((0,_common.configureIfRequired)(c,platform));case 10:return _context.abrupt("return",(0,_electron.runElectronDevServer)(c,platform,port));case 11:_context.next=13;return _regenerator.default.awrap(
(0,_common.configureIfRequired)(c,platform));case 13:return _context.abrupt("return",
(0,_web.runWeb)(c,platform,port));case 14:if(!

hosted){_context.next=16;break;}return _context.abrupt("return",
(0,_logger.logError)('This platform does not support hosted mode',true));case 16:



startCmd="node ./node_modules/react-native/local-cli/cli.js start --sourceExts "+(0,_common.getSourceExts)(c).join(',')+" --port "+c.runtime.port+" --config=metro.config.js";
if(c.program.reset){
startCmd+=' --reset-cache';
}_context.next=20;return _regenerator.default.awrap(

(0,_exec.executeAsync)(c,startCmd,{stdio:'inherit',silent:true}));case 20:case"end":return _context.stop();}},null,null,null,Promise);};exports.rnvStart=rnvStart;


var runWeinre=function runWeinre(c){return(0,_exec.executeAsync)(c,'npx weinre --boundHost -all-');};

var rnvDebug=function rnvDebug(c){return _regenerator.default.async(function rnvDebug$(_context2){while(1)switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)("rnvDebug:"+c.platform);_context2.next=3;return _regenerator.default.awrap(

(0,_index.isPlatformSupported)(c));case 3:_context2.next=5;return _regenerator.default.awrap(
(0,_common.isBuildSchemeSupported)(c));case 5:_context2.next=7;return _regenerator.default.awrap(
runWeinre(c));case 7:case"end":return _context2.stop();}},null,null,null,Promise);};exports.rnvDebug=rnvDebug;



var rnvRun=function rnvRun(c){return _regenerator.default.async(function rnvRun$(_context3){while(1)switch(_context3.prev=_context3.next){case 0:
(0,_logger.logTask)("rnvRun:"+c.platform);_context3.next=3;return _regenerator.default.awrap(

(0,_index.isPlatformSupported)(c));case 3:_context3.next=5;return _regenerator.default.awrap(
(0,_common.isBuildSchemeSupported)(c));case 5:_context3.next=7;return _regenerator.default.awrap(
_rnvRunWithPlatform(c));case 7:case"end":return _context3.stop();}},null,null,null,Promise);};exports.rnvRun=rnvRun;


var rnvPackage=function rnvPackage(c){return _regenerator.default.async(function rnvPackage$(_context4){while(1)switch(_context4.prev=_context4.next){case 0:
(0,_logger.logTask)("rnvPackage:"+c.platform);_context4.next=3;return _regenerator.default.awrap(

(0,_index.isPlatformSupported)(c));case 3:_context4.next=5;return _regenerator.default.awrap(
(0,_common.isBuildSchemeSupported)(c));case 5:_context4.next=7;return _regenerator.default.awrap(
_rnvPackageWithPlatform(c));case 7:case"end":return _context4.stop();}},null,null,null,Promise);};exports.rnvPackage=rnvPackage;


var rnvBuild=function rnvBuild(c){return _regenerator.default.async(function rnvBuild$(_context5){while(1)switch(_context5.prev=_context5.next){case 0:
(0,_logger.logTask)("rnvBuild:"+c.platform);_context5.next=3;return _regenerator.default.awrap(

(0,_index.isPlatformSupported)(c));case 3:_context5.next=5;return _regenerator.default.awrap(
(0,_common.isBuildSchemeSupported)(c));case 5:_context5.next=7;return _regenerator.default.awrap(
_rnvBuildWithPlatform(c));case 7:case"end":return _context5.stop();}},null,null,null,Promise);};exports.rnvBuild=rnvBuild;


var rnvExport=function rnvExport(c){return _regenerator.default.async(function rnvExport$(_context6){while(1)switch(_context6.prev=_context6.next){case 0:
(0,_logger.logTask)("rnvExport:"+c.platform);_context6.next=3;return _regenerator.default.awrap(

(0,_index.isPlatformSupported)(c));case 3:_context6.next=5;return _regenerator.default.awrap(
(0,_common.isBuildSchemeSupported)(c));case 5:_context6.next=7;return _regenerator.default.awrap(
_rnvExportWithPlatform(c));case 7:case"end":return _context6.stop();}},null,null,null,Promise);};exports.rnvExport=rnvExport;


var rnvDeploy=function rnvDeploy(c){return _regenerator.default.async(function rnvDeploy$(_context7){while(1)switch(_context7.prev=_context7.next){case 0:
(0,_logger.logTask)("rnvDeploy:"+c.platform);_context7.next=3;return _regenerator.default.awrap(

(0,_index.isPlatformSupported)(c));case 3:_context7.next=5;return _regenerator.default.awrap(
(0,_common.isBuildSchemeSupported)(c));case 5:_context7.next=7;return _regenerator.default.awrap(
_rnvDeployWithPlatform(c));case 7:case"end":return _context7.stop();}},null,null,null,Promise);};exports.rnvDeploy=rnvDeploy;


var rnvLog=function rnvLog(c){return _regenerator.default.async(function rnvLog$(_context8){while(1)switch(_context8.prev=_context8.next){case 0:_context8.t0=
c.platform;_context8.next=_context8.t0===
_constants.ANDROID?3:_context8.t0===
_constants.ANDROID_TV?3:_context8.t0===
_constants.ANDROID_WEAR?3:_context8.t0===


_constants.IOS?6:_context8.t0===
_constants.TVOS?6:9;break;case 3:_context8.next=5;return _regenerator.default.awrap((0,_android.runAndroidLog)(c));case 5:return _context8.abrupt("return");case 6:_context8.next=8;return _regenerator.default.awrap(
(0,_apple.runAppleLog)(c));case 8:return _context8.abrupt("return");case 9:



(0,_common.logErrorPlatform)(c,c.platform);case 10:case"end":return _context8.stop();}},null,null,null,Promise);};exports.rnvLog=rnvLog;







var _configureHostedIfRequired=function _configureHostedIfRequired(c){var _c$paths,project,rnv;return _regenerator.default.async(function _configureHostedIfRequired$(_context9){while(1)switch(_context9.prev=_context9.next){case 0:
(0,_logger.logTask)("_configureHostedIfRequired:"+c.platform);
if(_config.default.isWebHostEnabled){
(0,_logger.logDebug)('Running hosted build');_c$paths=
c.paths,project=_c$paths.project,rnv=_c$paths.rnv;
(0,_fileutils.copyFolderContentsRecursiveSync)(_path.default.join(rnv.dir,'supportFiles','appShell'),_path.default.join(project.dir,'platformBuilds',c.runtime.appId+"_"+c.platform,'public'));
(0,_common.writeCleanFile)(_path.default.join(rnv.dir,'supportFiles','appShell','index.html'),_path.default.join(project.dir,'platformBuilds',c.runtime.appId+"_"+c.platform,'public','index.html'),[
{pattern:'{{DEV_SERVER}}',override:"http://"+_ip.default.address()+":"+c.runtime.port}]);

}case 2:case"end":return _context9.stop();}},null,null,null,Promise);};


var _startBundlerIfRequired=function _startBundlerIfRequired(c){var bundleAssets,isRunning;return _regenerator.default.async(function _startBundlerIfRequired$(_context10){while(1)switch(_context10.prev=_context10.next){case 0:
(0,_logger.logTask)("_startBundlerIfRequired:"+c.platform);
bundleAssets=(0,_common.getConfigProp)(c,c.platform,'bundleAssets');if(!(
bundleAssets===true)){_context10.next=4;break;}return _context10.abrupt("return");case 4:_context10.next=6;return _regenerator.default.awrap(

(0,_bundler.isBundlerActive)(c));case 6:isRunning=_context10.sent;if(
isRunning){_context10.next=14;break;}
rnvStart(c);
keepRNVRunning=true;_context10.next=12;return _regenerator.default.awrap(
(0,_bundler.waitForBundler)(c));case 12:_context10.next=16;break;case 14:_context10.next=16;return _regenerator.default.awrap(

(0,_common.confirmActiveBundler)(c));case 16:case"end":return _context10.stop();}},null,null,null,Promise);};



var waitForBundlerIfRequired=function waitForBundlerIfRequired(c){var bundleAssets;return _regenerator.default.async(function waitForBundlerIfRequired$(_context11){while(1)switch(_context11.prev=_context11.next){case 0:
bundleAssets=(0,_common.getConfigProp)(c,c.platform,'bundleAssets');if(!(
bundleAssets===true)){_context11.next=3;break;}return _context11.abrupt("return");case 3:if(!

keepRNVRunning){_context11.next=5;break;}return _context11.abrupt("return",new Promise(function(){}));case 5:return _context11.abrupt("return",
true);case 6:case"end":return _context11.stop();}},null,null,null,Promise);};


var _rnvRunWithPlatform=function _rnvRunWithPlatform(c){var platform,port,target,hosted;return _regenerator.default.async(function _rnvRunWithPlatform$(_context12){while(1)switch(_context12.prev=_context12.next){case 0:
(0,_logger.logTask)("_rnvRunWithPlatform:"+c.platform);
platform=c.platform;
port=c.runtime.port;
target=c.runtime.target;
hosted=c.program.hosted;

(0,_logger.logTask)("_rnvRunWithPlatform:"+platform+":"+port+":"+target+":"+hosted,_chalk.default.grey);if(!(

_config.default.isWebHostEnabled&&hosted)){_context12.next=9;break;}
c.runtime.shouldOpenBrowser=true;return _context12.abrupt("return",
rnvStart(c));case 9:


_analytics.default.captureEvent({
type:'runProject',
platform:platform
});_context12.next=12;return _regenerator.default.awrap(

(0,_sdkManager.checkSdk)(c));case 12:_context12.t0=

platform;_context12.next=_context12.t0===
_constants.IOS?15:_context12.t0===
_constants.TVOS?15:_context12.t0===








_constants.ANDROID?26:_context12.t0===
_constants.ANDROID_TV?26:_context12.t0===
_constants.ANDROID_WEAR?26:_context12.t0===











_constants.MACOS?40:_context12.t0===
_constants.WINDOWS?40:_context12.t0===





_constants.WEB?46:_context12.t0===






_constants.TIZEN?53:_context12.t0===
_constants.TIZEN_MOBILE?53:_context12.t0===
_constants.TIZEN_WATCH?53:_context12.t0===






_constants.WEBOS?61:_context12.t0===






_constants.KAIOS?69:_context12.t0===
_constants.FIREFOX_OS?69:_context12.t0===
_constants.FIREFOX_TV?69:75;break;case 15:if(c.program.only){_context12.next=25;break;}_context12.next=18;return _regenerator.default.awrap((0,_common.cleanPlatformIfRequired)(c,platform));case 18:_context12.next=20;return _regenerator.default.awrap((0,_common.configureIfRequired)(c,platform));case 20:_context12.next=22;return _regenerator.default.awrap(_startBundlerIfRequired(c));case 22:_context12.next=24;return _regenerator.default.awrap((0,_apple.runXcodeProject)(c));case 24:return _context12.abrupt("return",waitForBundlerIfRequired(c));case 25:return _context12.abrupt("return",(0,_apple.runXcodeProject)(c));case 26:if(c.program.only){_context12.next=39;break;}_context12.next=29;return _regenerator.default.awrap((0,_common.cleanPlatformIfRequired)(c,platform));case 29:_context12.next=31;return _regenerator.default.awrap((0,_common.configureIfRequired)(c,platform));case 31:_context12.next=33;return _regenerator.default.awrap(_startBundlerIfRequired(c));case 33:if(!((0,_common.getConfigProp)(c,platform,'bundleAssets')===true||platform===_constants.ANDROID_WEAR)){_context12.next=36;break;}_context12.next=36;return _regenerator.default.awrap((0,_android.packageAndroid)(c,platform));case 36:_context12.next=38;return _regenerator.default.awrap((0,_android.runAndroid)(c,platform,target));case 38:return _context12.abrupt("return",waitForBundlerIfRequired(c));case 39:return _context12.abrupt("return",(0,_android.runAndroid)(c,platform,target));case 40:if(c.program.only){_context12.next=45;break;}_context12.next=43;return _regenerator.default.awrap((0,_common.cleanPlatformIfRequired)(c,platform));case 43:_context12.next=45;return _regenerator.default.awrap((0,_common.configureIfRequired)(c,platform));case 45:return _context12.abrupt("return",(0,_electron.runElectron)(c,platform,port));case 46:if(c.program.only){_context12.next=51;break;}_context12.next=49;return _regenerator.default.awrap((0,_common.cleanPlatformIfRequired)(c,platform));case 49:_context12.next=51;return _regenerator.default.awrap((0,_common.configureIfRequired)(c,platform));case 51:c.runtime.shouldOpenBrowser=true;return _context12.abrupt("return",(0,_web.runWeb)(c,platform,port,true));case 53:if(c.program.only){_context12.next=60;break;}_context12.next=56;return _regenerator.default.awrap((0,_common.cleanPlatformIfRequired)(c,platform));case 56:_context12.next=58;return _regenerator.default.awrap((0,_common.configureIfRequired)(c,platform));case 58:_context12.next=60;return _regenerator.default.awrap(_configureHostedIfRequired(c));case 60:return _context12.abrupt("return",(0,_tizen.runTizen)(c,platform,target));case 61:if(c.program.only){_context12.next=68;break;}_context12.next=64;return _regenerator.default.awrap((0,_common.cleanPlatformIfRequired)(c,platform));case 64:_context12.next=66;return _regenerator.default.awrap((0,_common.configureIfRequired)(c,platform));case 66:_context12.next=68;return _regenerator.default.awrap(_configureHostedIfRequired(c));case 68:return _context12.abrupt("return",(0,_webos.runWebOS)(c,platform,target));case 69:if(
c.program.only){_context12.next=74;break;}_context12.next=72;return _regenerator.default.awrap(
(0,_common.cleanPlatformIfRequired)(c,platform));case 72:_context12.next=74;return _regenerator.default.awrap(
(0,_common.configureIfRequired)(c,platform));case 74:return _context12.abrupt("return",

(0,_firefox.runFirefoxProject)(c,platform));case 75:return _context12.abrupt("return",

(0,_common.logErrorPlatform)(c,platform));case 76:case"end":return _context12.stop();}},null,null,null,Promise);};



var _rnvPackageWithPlatform=function _rnvPackageWithPlatform(c){var platform,target;return _regenerator.default.async(function _rnvPackageWithPlatform$(_context13){while(1)switch(_context13.prev=_context13.next){case 0:
(0,_logger.logTask)("_rnvPackageWithPlatform:"+c.platform);
platform=c.platform;

target=c.program.target||c.files.workspace.config.defaultTargets[platform];_context13.next=5;return _regenerator.default.awrap(

(0,_sdkManager.checkSdk)(c));case 5:_context13.t0=

platform;_context13.next=_context13.t0===
_constants.IOS?8:_context13.t0===
_constants.TVOS?8:_context13.t0===





_constants.ANDROID?14:_context13.t0===
_constants.ANDROID_TV?14:_context13.t0===
_constants.ANDROID_WEAR?14:22;break;case 8:if(c.program.only){_context13.next=13;break;}_context13.next=11;return _regenerator.default.awrap((0,_common.cleanPlatformIfRequired)(c,platform));case 11:_context13.next=13;return _regenerator.default.awrap((0,_common.configureIfRequired)(c,platform));case 13:return _context13.abrupt("return",(0,_apple.packageBundleForXcode)(c,platform));case 14:if(

c.program.only){_context13.next=21;break;}_context13.next=17;return _regenerator.default.awrap(
(0,_common.cleanPlatformIfRequired)(c,platform));case 17:_context13.next=19;return _regenerator.default.awrap(
(0,_common.configureIfRequired)(c,platform));case 19:_context13.next=21;return _regenerator.default.awrap(
(0,_android.configureGradleProject)(c,platform));case 21:return _context13.abrupt("return",

(0,_android.packageAndroid)(c,platform,target,platform===_constants.ANDROID_WEAR));case 22:

(0,_common.logErrorPlatform)(c,platform);return _context13.abrupt("return",
false);case 24:case"end":return _context13.stop();}},null,null,null,Promise);};



var _rnvExportWithPlatform=function _rnvExportWithPlatform(c){var platform;return _regenerator.default.async(function _rnvExportWithPlatform$(_context14){while(1)switch(_context14.prev=_context14.next){case 0:
(0,_logger.logTask)("_rnvExportWithPlatform:"+c.platform);
platform=c.platform;_context14.t0=
platform;_context14.next=_context14.t0===
_constants.WEB?5:_context14.t0===




_constants.IOS?9:_context14.t0===
_constants.TVOS?9:_context14.t0===




_constants.ANDROID?13:_context14.t0===
_constants.ANDROID_TV?13:_context14.t0===
_constants.ANDROID_WEAR?13:_context14.t0===

_constants.MACOS?14:_context14.t0===
_constants.WINDOWS?14:24;break;case 5:if(c.program.only){_context14.next=8;break;}_context14.next=8;return _regenerator.default.awrap(rnvBuild(c));case 8:return _context14.abrupt("return",(0,_web.exportWeb)(c,platform));case 9:if(c.program.only){_context14.next=12;break;}_context14.next=12;return _regenerator.default.awrap(_rnvBuildWithPlatform(c,platform));case 12:return _context14.abrupt("return",(0,_apple.exportXcodeProject)(c,platform));case 13:return _context14.abrupt("return",_rnvBuildWithPlatform(c));case 14:if(
c.program.only){_context14.next=23;break;}_context14.next=17;return _regenerator.default.awrap(
(0,_common.cleanPlatformIfRequired)(c,platform));case 17:_context14.next=19;return _regenerator.default.awrap(
(0,_common.configureIfRequired)(c,platform));case 19:_context14.next=21;return _regenerator.default.awrap(
(0,_electron.configureElectronProject)(c,platform));case 21:_context14.next=23;return _regenerator.default.awrap(
(0,_electron.buildElectron)(c,platform));case 23:return _context14.abrupt("return",

(0,_electron.exportElectron)(c,platform));case 24:

(0,_common.logErrorPlatform)(c,platform);case 25:case"end":return _context14.stop();}},null,null,null,Promise);};



var _rnvDeployWithPlatform=function _rnvDeployWithPlatform(c){var platform;return _regenerator.default.async(function _rnvDeployWithPlatform$(_context15){while(1)switch(_context15.prev=_context15.next){case 0:
(0,_logger.logTask)("_rnvDeployWithPlatform:"+c.platform);
platform=c.platform;_context15.t0=

platform;_context15.next=_context15.t0===
_constants.WEB?5:_context15.t0===




_constants.TVOS?9:_context15.t0===
_constants.IOS?9:_context15.t0===





_constants.TIZEN?12:_context15.t0===




_constants.ANDROID_TV?16:_context15.t0===
_constants.ANDROID?16:19;break;case 5:if(c.program.only){_context15.next=8;break;}_context15.next=8;return _regenerator.default.awrap(rnvBuild(c));case 8:return _context15.abrupt("return",(0,_web.deployWeb)(c,platform));case 9:if(c.program.only){_context15.next=11;break;}return _context15.abrupt("return",_rnvExportWithPlatform(c));case 11:return _context15.abrupt("return");case 12:if(c.program.only){_context15.next=15;break;}_context15.next=15;return _regenerator.default.awrap(rnvBuild(c));case 15:return _context15.abrupt("return");case 16:if(
c.program.only){_context15.next=18;break;}return _context15.abrupt("return",
_rnvBuildWithPlatform(c));case 18:return _context15.abrupt("return");case 19:



(0,_common.logErrorPlatform)(c,platform);case 20:case"end":return _context15.stop();}},null,null,null,Promise);};



var _rnvBuildWithPlatform=function _rnvBuildWithPlatform(c){var platform;return _regenerator.default.async(function _rnvBuildWithPlatform$(_context16){while(1)switch(_context16.prev=_context16.next){case 0:
(0,_logger.logTask)("_rnvBuildWithPlatform:"+c.platform);
platform=c.platform;_context16.t0=

platform;_context16.next=_context16.t0===
_constants.ANDROID?5:_context16.t0===
_constants.ANDROID_TV?5:_context16.t0===
_constants.ANDROID_WEAR?5:_context16.t0===






_constants.MACOS?16:_context16.t0===
_constants.WINDOWS?16:_context16.t0===





_constants.IOS?25:_context16.t0===
_constants.TVOS?25:_context16.t0===





_constants.WEB?31:_context16.t0===




_constants.KAIOS?38:_context16.t0===
_constants.FIREFOX_OS?38:_context16.t0===
_constants.FIREFOX_TV?38:_context16.t0===




_constants.TIZEN?45:_context16.t0===
_constants.TIZEN_MOBILE?45:_context16.t0===
_constants.TIZEN_WATCH?45:_context16.t0===




_constants.WEBOS?52:59;break;case 5:_context16.next=7;return _regenerator.default.awrap((0,_common.cleanPlatformIfRequired)(c,platform));case 7:_context16.next=9;return _regenerator.default.awrap((0,_common.configureIfRequired)(c,platform));case 9:_context16.next=11;return _regenerator.default.awrap((0,_android.configureGradleProject)(c,platform));case 11:_context16.next=13;return _regenerator.default.awrap((0,_android.packageAndroid)(c,platform));case 13:_context16.next=15;return _regenerator.default.awrap((0,_android.buildAndroid)(c,platform));case 15:return _context16.abrupt("return");case 16:_context16.next=18;return _regenerator.default.awrap((0,_common.cleanPlatformIfRequired)(c,platform));case 18:_context16.next=20;return _regenerator.default.awrap((0,_common.configureIfRequired)(c,platform));case 20:_context16.next=22;return _regenerator.default.awrap((0,_electron.configureElectronProject)(c,platform));case 22:_context16.next=24;return _regenerator.default.awrap((0,_electron.buildElectron)(c,platform));case 24:return _context16.abrupt("return");case 25:if(c.program.only){_context16.next=28;break;}_context16.next=28;return _regenerator.default.awrap(_rnvPackageWithPlatform(c,platform));case 28:_context16.next=30;return _regenerator.default.awrap((0,_apple.archiveXcodeProject)(c,platform));case 30:return _context16.abrupt("return");case 31:_context16.next=33;return _regenerator.default.awrap((0,_common.cleanPlatformIfRequired)(c,platform));case 33:_context16.next=35;return _regenerator.default.awrap((0,_common.configureIfRequired)(c,platform));case 35:_context16.next=37;return _regenerator.default.awrap((0,_web.buildWeb)(c,platform));case 37:return _context16.abrupt("return");case 38:_context16.next=40;return _regenerator.default.awrap((0,_common.cleanPlatformIfRequired)(c,platform));case 40:_context16.next=42;return _regenerator.default.awrap((0,_common.configureIfRequired)(c,platform));case 42:_context16.next=44;return _regenerator.default.awrap((0,_firefox.buildFirefoxProject)(c,platform));case 44:return _context16.abrupt("return");case 45:_context16.next=47;return _regenerator.default.awrap((0,_common.cleanPlatformIfRequired)(c,platform));case 47:_context16.next=49;return _regenerator.default.awrap((0,_common.configureIfRequired)(c,platform));case 49:_context16.next=51;return _regenerator.default.awrap((0,_tizen.buildTizenProject)(c,platform));case 51:return _context16.abrupt("return");case 52:_context16.next=54;return _regenerator.default.awrap(
(0,_common.cleanPlatformIfRequired)(c,platform));case 54:_context16.next=56;return _regenerator.default.awrap(
(0,_common.configureIfRequired)(c,platform));case 56:_context16.next=58;return _regenerator.default.awrap(
(0,_webos.buildWebOSProject)(c,platform));case 58:return _context16.abrupt("return");case 59:


(0,_common.logErrorPlatform)(c,platform);case 60:case"end":return _context16.stop();}},null,null,null,Promise);};
//# sourceMappingURL=runner.js.map