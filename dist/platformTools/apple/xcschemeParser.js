var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.parseXcscheme=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _path=_interopRequireDefault(require("path"));
var _common=require("../../common");





var _logger=require("../../systemTools/logger");


var _index=require("./index");

var parseXcscheme=function parseXcscheme(c,platform){var allowProvisioningUpdates,provisioningStyle,runScheme,poisxSpawn,appFolder,appFolderName,appTemplateFolder,debuggerId,launcherId,schemePath;return _regenerator.default.async(function parseXcscheme$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)("parseXcscheme:"+platform);

allowProvisioningUpdates=(0,_common.getConfigProp)(c,platform,'allowProvisioningUpdates',true);
provisioningStyle=(0,_common.getConfigProp)(c,platform,'provisioningStyle','Automatic');
runScheme=(0,_common.getConfigProp)(c,platform,'runScheme');


poisxSpawn=true;
appFolder=(0,_common.getAppFolder)(c,platform);
appFolderName=(0,_index.getAppFolderName)(c,platform);
appTemplateFolder=(0,_common.getAppTemplateFolder)(c,platform);

debuggerId=poisxSpawn?'':'Xcode.DebuggerFoundation.Debugger.LLDB';
launcherId=poisxSpawn?'Xcode.IDEFoundation.Launcher.PosixSpawn':'Xcode.DebuggerFoundation.Launcher.LLDB';
schemePath=appFolderName+".xcodeproj/xcshareddata/xcschemes/"+appFolderName+".xcscheme";
(0,_common.writeCleanFile)(_path.default.join(appTemplateFolder,schemePath),_path.default.join(appFolder,schemePath),[
{pattern:'{{PLUGIN_DEBUGGER_ID}}',override:debuggerId},
{pattern:'{{PLUGIN_LAUNCHER_ID}}',override:launcherId}]);case 12:case"end":return _context.stop();}}},null,null,null,Promise);};exports.parseXcscheme=parseXcscheme;
//# sourceMappingURL=xcschemeParser.js.map