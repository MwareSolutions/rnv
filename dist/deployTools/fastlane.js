var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.rnvFastlane=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));var _exec=require("../systemTools/exec");

var _common=require("../common");
var _config=_interopRequireDefault(require("../config"));
var _setupTools=_interopRequireDefault(require("../setupTools"));

var rnvFastlane=function rnvFastlane(){var args,setupInstance,c,appFolder,fastlaneArgs;return _regenerator.default.async(function rnvFastlane$(_context){while(1){switch(_context.prev=_context.next){case 0:
args=_config.default.rnvArguments;
args.shift();if(

(0,_exec.commandExistsSync)('fastlane')){_context.next=6;break;}
setupInstance=(0,_setupTools.default)();_context.next=6;return _regenerator.default.awrap(
setupInstance.askToInstallSDK('fastlane'));case 6:


c=_config.default.getConfig();
appFolder=(0,_common.getAppFolder)(c,c.platform);

fastlaneArgs=(0,_toConsumableArray2.default)(c.program.rawArgs);
fastlaneArgs=fastlaneArgs.slice(3);return _context.abrupt("return",

(0,_exec.executeAsync)(c,"fastlane "+fastlaneArgs.join(' '),{
interactive:true,
env:process.env,
cwd:appFolder}));case 11:case"end":return _context.stop();}}});};exports.rnvFastlane=rnvFastlane;
//# sourceMappingURL=fastlane.js.map