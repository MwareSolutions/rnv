var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.checkSdk=exports.checkAndConfigureSdks=exports.checkAndConfigureWebosSdks=exports.checkAndConfigureTizenSdks=exports.checkAndConfigureAndroidSdks=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _chalk=_interopRequireDefault(require("chalk"));
var _constants=require("../constants");























var _utils=require("../utils");
var _fileutils=require("./fileutils");


var _logger=require("./logger");







var checkAndConfigureAndroidSdks=function checkAndConfigureAndroidSdks(c){var _c$files$workspace$co,_c$files$workspace$co2;var sdk;return _regenerator.default.async(function checkAndConfigureAndroidSdks$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)("checkAndConfigureAndroidSdks:"+c.platform);
sdk=(_c$files$workspace$co=c.files.workspace.config)==null?void 0:(_c$files$workspace$co2=_c$files$workspace$co.sdks)==null?void 0:_c$files$workspace$co2.ANDROID_SDK;
if(sdk){
c.cli[_constants.CLI_ANDROID_EMULATOR]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"emulator/emulator"+(_utils.isSystemWin?'.exe':'')));
c.cli[_constants.CLI_ANDROID_ADB]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"platform-tools/adb"+(_utils.isSystemWin?'.exe':'')));
c.cli[_constants.CLI_ANDROID_AVDMANAGER]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"tools/bin/avdmanager"+(_utils.isSystemWin?'.bat':'')));
c.cli[_constants.CLI_ANDROID_SDKMANAGER]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"tools/bin/sdkmanager"+(_utils.isSystemWin?'.bat':'')));
}else{

}case 3:case"end":return _context.stop();}}});};exports.checkAndConfigureAndroidSdks=checkAndConfigureAndroidSdks;


var checkAndConfigureTizenSdks=function checkAndConfigureTizenSdks(c){var _c$files$workspace$co3,_c$files$workspace$co4;var sdk;return _regenerator.default.async(function checkAndConfigureTizenSdks$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)("checkAndConfigureTizenSdks:"+c.platform);
sdk=(_c$files$workspace$co3=c.files.workspace.config)==null?void 0:(_c$files$workspace$co4=_c$files$workspace$co3.sdks)==null?void 0:_c$files$workspace$co4.TIZEN_SDK;
if(sdk){
c.cli[_constants.CLI_TIZEN_EMULATOR]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"tools/emulator/bin/em-cli"+(_utils.isSystemWin?'.bat':'')));
c.cli[_constants.CLI_TIZEN]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"tools/ide/bin/tizen"+(_utils.isSystemWin?'.bat':'')));
c.cli[_constants.CLI_SDB_TIZEN]=(0,_fileutils.getRealPath)(c,_path.default.join(sdk,"tools/sdb"+(_utils.isSystemWin?'.exe':'')));
}else{

}case 3:case"end":return _context2.stop();}}});};exports.checkAndConfigureTizenSdks=checkAndConfigureTizenSdks;


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

}case 3:case"end":return _context3.stop();}}});};exports.checkAndConfigureWebosSdks=checkAndConfigureWebosSdks;


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

true);case 8:case"end":return _context4.stop();}}});};exports.checkAndConfigureSdks=checkAndConfigureSdks;



var _getCurrentSdkPath=function _getCurrentSdkPath(c){var _c$files$workspace,_c$files$workspace$co7,_c$files$workspace$co8;return(_c$files$workspace=c.files.workspace)==null?void 0:(_c$files$workspace$co7=_c$files$workspace.config)==null?void 0:(_c$files$workspace$co8=_c$files$workspace$co7.sdks)==null?void 0:_c$files$workspace$co8[_constants.SDK_PLATFORMS[c.platform]];};

var _isSdkInstalled=function _isSdkInstalled(c){
(0,_logger.logTask)("_isSdkInstalled: "+c.platform);

var sdkPath=_getCurrentSdkPath(c,c.platform);

return _fs.default.existsSync((0,_fileutils.getRealPath)(c,sdkPath));
};

var checkSdk=function checkSdk(c,reject){
if(!_isSdkInstalled(c)){
var err=c.platform+" requires SDK to be installed. check your "+_chalk.default.white(c.paths.workspace.config)+" file if you SDK path is correct. current value is "+_chalk.default.white(_getCurrentSdkPath(c));
if(reject){
reject(err);
}else{
throw new Error(err);
}
return false;
}
return true;
};exports.checkSdk=checkSdk;
//# sourceMappingURL=sdkManager.js.map