var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.rnvTargetList=exports.rnvTargetLaunch=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));
var _chalk=_interopRequireDefault(require("chalk"));
var _index=require("./index");
var _logger=require("../systemTools/logger");
var _sdkManager=require("./sdkManager");
var _constants=require("../constants");
var _tizen=require("./tizen");
var _webos=require("./webos");
var _deviceManager=require("./android/deviceManager");
var _deviceManager2=require("./apple/deviceManager");
var _firefox=require("./firefox");

var rnvTargetLaunch=function rnvTargetLaunch(c){var platform,program,target;return _regenerator.default.async(function rnvTargetLaunch$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)('_runLaunch');_context.next=3;return _regenerator.default.awrap(

(0,_index.isPlatformSupported)(c));case 3:

platform=c.platform,program=c.program;
target=program.target||c.files.workspace.config.defaultTargets[platform];_context.t0=

platform;_context.next=_context.t0===
_constants.ANDROID?8:_context.t0===
_constants.ANDROID_TV?8:_context.t0===
_constants.ANDROID_WEAR?8:_context.t0===

_constants.IOS?9:_context.t0===
_constants.TVOS?9:_context.t0===

_constants.TIZEN?10:_context.t0===

_constants.WEBOS?11:_context.t0===

_constants.KAIOS?12:13;break;case 8:return _context.abrupt("return",(0,_deviceManager.launchAndroidSimulator)(c,platform,target));case 9:return _context.abrupt("return",(0,_deviceManager2.launchAppleSimulator)(c,platform,target));case 10:return _context.abrupt("return",(0,_tizen.launchTizenSimulator)(c,target));case 11:return _context.abrupt("return",(0,_webos.launchWebOSimulator)(c,target));case 12:return _context.abrupt("return",
(0,_firefox.launchKaiOSSimulator)(c,target));case 13:return _context.abrupt("return",

Promise.reject("\"target launch\" command does not support "+
_chalk.default.white.bold(
platform)+" platform yet. You will have to launch the emulator manually. Working on it!"));case 14:case"end":return _context.stop();}}});};exports.rnvTargetLaunch=rnvTargetLaunch;





var rnvTargetList=function rnvTargetList(c){var platform,throwError;return _regenerator.default.async(function rnvTargetList$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)('rnvTargetList');_context2.next=3;return _regenerator.default.awrap(

(0,_index.isPlatformSupported)(c));case 3:

platform=c.platform;

throwError=function throwError(err){
throw err;
};_context2.next=7;return _regenerator.default.awrap(

(0,_sdkManager.checkSdk)(c));case 7:_context2.t0=

platform;_context2.next=_context2.t0===
_constants.ANDROID?10:_context2.t0===
_constants.ANDROID_TV?10:_context2.t0===
_constants.ANDROID_WEAR?10:_context2.t0===

_constants.IOS?11:_context2.t0===
_constants.TVOS?11:_context2.t0===

_constants.TIZEN?12:_context2.t0===

_constants.WEBOS?13:14;break;case 10:return _context2.abrupt("return",(0,_deviceManager.listAndroidTargets)(c,platform));case 11:return _context2.abrupt("return",(0,_deviceManager2.listAppleDevices)(c,platform));case 12:return _context2.abrupt("return",(0,_tizen.listTizenTargets)(c,platform));case 13:return _context2.abrupt("return",
(0,_webos.listWebOSTargets)(c));case 14:return _context2.abrupt("return",

Promise.reject("\"target list\" command does not support "+_chalk.default.white.bold(platform)+" platform yet. Working on it!"));case 15:case"end":return _context2.stop();}}});};exports.rnvTargetList=rnvTargetList;
//# sourceMappingURL=target.js.map