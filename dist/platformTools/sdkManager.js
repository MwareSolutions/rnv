var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.checkSdk=exports.checkAndConfigureWebosSdks=exports.checkAndConfigureTizenSdks=exports.checkAndConfigureSdks=exports.checkAndConfigureAndroidSdks=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _chalk=_interopRequireDefault(require("chalk"));
var _inquirer=_interopRequireDefault(require("inquirer"));
var _constants=require("../constants");























var _utils=require("../utils");
var _fileutils=require("../systemTools/fileutils");


var _logger=require("../systemTools/logger");


var _setupTools=_interopRequireDefault(require("../setupTools"));

var homedir=require('os').homedir();

var SDK_LOACTIONS={
android:[
_path.default.join('usr/local/android-sdk'),
_path.default.join(homedir,'Library/Android/sdk'),
_path.default.join(homedir,'AppData/Local/Android/android-sdk'),
_path.default.join(homedir,'AppData/Local/Android/sdk'),
_path.default.join('Program Files (x86)/Android/android-sdk')],

tizen:[
_path.default.join('usr/local/tizen-studio'),
_path.default.join(homedir,'tizen-studio')],

webos:[
_path.default.join('/opt/webOS_TV_SDK')]};



var _logSdkWarning=function _logSdkWarning(c){
(0,_logger.logWarning)("Your "+c.paths.workspace.config+" is missing SDK configuration object");
};

var checkAndConfigureAndroidSdks=function checkAndConfigureAndroidSdks(c){var _c$files$workspace$co,_c$files$workspace$co2;var sdk;return _regenerator.default.async(function checkAndConfigureAndroidSdks$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)("checkAndConfigureAndroidSdks:"+c.platform);
sdk=(_c$files$workspace$co=c.files.workspace.config)==null?void 0:(_c$files$workspace$co2=_c$files$workspace$co.sdks)==null?void 0:_c$files$workspace$co2.ANDROID_SDK;
if(sdk){
c.cli[_constants.CLI_ANDROID_EMULATOR]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"emulator/emulator"+(_utils.isSystemWin?'.exe':'')));
c.cli[_constants.CLI_ANDROID_ADB]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"platform-tools/adb"+(_utils.isSystemWin?'.exe':'')));
c.cli[_constants.CLI_ANDROID_AVDMANAGER]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"tools/bin/avdmanager"+(_utils.isSystemWin?'.bat':'')));
c.cli[_constants.CLI_ANDROID_SDKMANAGER]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"tools/bin/sdkmanager"+(_utils.isSystemWin?'.bat':'')));
}else{
_logSdkWarning(c);
}case 3:case"end":return _context.stop();}}},null,null,null,Promise);};exports.checkAndConfigureAndroidSdks=checkAndConfigureAndroidSdks;


var checkAndConfigureTizenSdks=function checkAndConfigureTizenSdks(c){var _c$files$workspace$co3,_c$files$workspace$co4;var sdk;return _regenerator.default.async(function checkAndConfigureTizenSdks$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)("checkAndConfigureTizenSdks:"+c.platform);
sdk=(_c$files$workspace$co3=c.files.workspace.config)==null?void 0:(_c$files$workspace$co4=_c$files$workspace$co3.sdks)==null?void 0:_c$files$workspace$co4.TIZEN_SDK;
if(sdk){
c.cli[_constants.CLI_TIZEN_EMULATOR]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"tools/emulator/bin/em-cli"+(_utils.isSystemWin?'.bat':'')));
c.cli[_constants.CLI_TIZEN]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"tools/ide/bin/tizen"+(_utils.isSystemWin?'.bat':'')));
c.cli[_constants.CLI_SDB_TIZEN]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"tools/sdb"+(_utils.isSystemWin?'.exe':'')));
}else{
_logSdkWarning(c);
}case 3:case"end":return _context2.stop();}}},null,null,null,Promise);};exports.checkAndConfigureTizenSdks=checkAndConfigureTizenSdks;


var checkAndConfigureWebosSdks=function checkAndConfigureWebosSdks(c){var _c$files$workspace$co5,_c$files$workspace$co6;var sdk;return _regenerator.default.async(function checkAndConfigureWebosSdks$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:
(0,_logger.logTask)("checkAndConfigureWebosSdks:"+c.platform);
sdk=(_c$files$workspace$co5=c.files.workspace.config)==null?void 0:(_c$files$workspace$co6=_c$files$workspace$co5.sdks)==null?void 0:_c$files$workspace$co6.WEBOS_SDK;
if(sdk){
c.cli[_constants.CLI_WEBOS_ARES]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"CLI/bin/ares"+(_utils.isSystemWin?'.cmd':'')));
c.cli[_constants.CLI_WEBOS_ARES_PACKAGE]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"CLI/bin/ares-package"+(_utils.isSystemWin?'.cmd':'')));
c.cli[_constants.CLI_WEBOS_ARES_INSTALL]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"CLI/bin/ares-install"+(_utils.isSystemWin?'.cmd':'')));
c.cli[_constants.CLI_WEBOS_ARES_LAUNCH]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"CLI/bin/ares-launch"+(_utils.isSystemWin?'.cmd':'')));
c.cli[_constants.CLI_WEBOS_ARES_SETUP_DEVICE]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"CLI/bin/ares-setup-device"+(_utils.isSystemWin?'.cmd':'')));
c.cli[_constants.CLI_WEBOS_ARES_DEVICE_INFO]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"CLI/bin/ares-device-info"+(_utils.isSystemWin?'.cmd':'')));
c.cli[_constants.CLI_WEBOS_ARES_NOVACOM]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"CLI/bin/ares-novacom"+(_utils.isSystemWin?'.cmd':'')));
}else{
_logSdkWarning(c);
}case 3:case"end":return _context3.stop();}}},null,null,null,Promise);};exports.checkAndConfigureWebosSdks=checkAndConfigureWebosSdks;


var checkAndConfigureSdks=function checkAndConfigureSdks(c){return _regenerator.default.async(function checkAndConfigureSdks$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:
(0,_logger.logTask)("checkAndConfigureSdks:"+c.platform);_context4.t0=

c.platform;_context4.next=_context4.t0===
_constants.ANDROID?4:_context4.t0===
_constants.ANDROID_TV?4:_context4.t0===
_constants.ANDROID_WEAR?4:_context4.t0===

_constants.TIZEN?5:_context4.t0===
_constants.TIZEN_MOBILE?5:_context4.t0===
_constants.TIZEN_WATCH?5:_context4.t0===

_constants.WEBOS?6:7;break;case 4:return _context4.abrupt("return",checkAndConfigureAndroidSdks(c));case 5:return _context4.abrupt("return",checkAndConfigureTizenSdks(c));case 6:return _context4.abrupt("return",
checkAndConfigureWebosSdks(c));case 7:return _context4.abrupt("return",

true);case 8:case"end":return _context4.stop();}}},null,null,null,Promise);};exports.checkAndConfigureSdks=checkAndConfigureSdks;



var _getCurrentSdkPath=function _getCurrentSdkPath(c){var _c$files$workspace,_c$files$workspace$co7,_c$files$workspace$co8;return(_c$files$workspace=c.files.workspace)==null?void 0:(_c$files$workspace$co7=_c$files$workspace.config)==null?void 0:(_c$files$workspace$co8=_c$files$workspace$co7.sdks)==null?void 0:_c$files$workspace$co8[_constants.SDK_PLATFORMS[c.platform]];};

var _isSdkInstalled=function _isSdkInstalled(c){
(0,_logger.logTask)("_isSdkInstalled: "+c.platform);

if(!_constants.SDK_PLATFORMS[c.platform])return true;

var sdkPath=_getCurrentSdkPath(c,c.platform);

return _fs.default.existsSync((0,_fileutils.getRealPath)(c,sdkPath));
};

var _attemptAutoFix=function _attemptAutoFix(c,engine){var result,_await$inquirer$promp,confirm,setupInstance;return _regenerator.default.async(function _attemptAutoFix$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:
result=SDK_LOACTIONS[engine].find(function(v){return _fs.default.existsSync(v);});if(!
result){_context5.next=19;break;}
(0,_logger.logSuccess)("Found existing "+c.platform+" SDK location at "+_chalk.default.white(result));_context5.next=5;return _regenerator.default.awrap(
_inquirer.default.prompt({
type:'confirm',
name:'confirm',
message:'Do you want to use it?'}));case 5:_await$inquirer$promp=_context5.sent;confirm=_await$inquirer$promp.confirm;if(!


confirm){_context5.next=19;break;}_context5.prev=8;

c.files.workspace.config.sdks[_constants.SDK_PLATFORMS[c.platform]]=result;
(0,_fileutils.writeFileSync)(c.paths.workspace.config,c.files.workspace.config);_context5.next=13;return _regenerator.default.awrap(
checkAndConfigureSdks(c));case 13:_context5.next=18;break;case 15:_context5.prev=15;_context5.t0=_context5["catch"](8);

(0,_logger.logError)(_context5.t0);case 18:return _context5.abrupt("return",


true);case 19:



setupInstance=(0,_setupTools.default)(c);return _context5.abrupt("return",
setupInstance.askToInstallSDK(engine));case 21:case"end":return _context5.stop();}}},null,null,[[8,15]],Promise);};



var checkSdk=function checkSdk(c){return _regenerator.default.async(function checkSdk$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:
(0,_logger.logTask)('checkSdk');if(
_isSdkInstalled(c)){_context6.next=10;break;}
(0,_logger.logWarning)(c.platform+" requires SDK to be installed. Your SDK path in "+_chalk.default.white(c.paths.workspace.config)+" does not exist: "+_chalk.default.white(_getCurrentSdkPath(c)));_context6.t0=

c.platform;_context6.next=_context6.t0===
_constants.ANDROID?6:_context6.t0===
_constants.ANDROID_TV?6:_context6.t0===
_constants.ANDROID_WEAR?6:_context6.t0===

_constants.TIZEN?7:_context6.t0===
_constants.TIZEN_MOBILE?7:_context6.t0===
_constants.TIZEN_WATCH?7:_context6.t0===

_constants.WEBOS?8:9;break;case 6:return _context6.abrupt("return",_attemptAutoFix(c,'android'));case 7:return _context6.abrupt("return",_attemptAutoFix(c,'tizen'));case 8:return _context6.abrupt("return",
_attemptAutoFix(c,'webos'));case 9:return _context6.abrupt("return",

true);case 10:return _context6.abrupt("return",


true);case 11:case"end":return _context6.stop();}}},null,null,null,Promise);};exports.checkSdk=checkSdk;
//# sourceMappingURL=sdkManager.js.map