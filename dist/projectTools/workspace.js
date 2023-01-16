var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.rnvWorkspaceUpdate=exports.rnvWorkspaceList=exports.rnvWorkspaceConnect=exports.rnvWorkspaceAdd=exports.getWorkspaceOptions=exports.getWorkspaceDirPath=exports.createWorkspace=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _chalk=_interopRequireDefault(require("chalk"));
var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _prompt=require("../systemTools/prompt");
var _logger=require("../systemTools/logger");




var _fileutils=require("../systemTools/fileutils");

var rnvWorkspaceList=function rnvWorkspaceList(c){var _c$files$rnv$configWo;var opts;return _regenerator.default.async(function rnvWorkspaceList$(_context){while(1)switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)('rnvWorkspaceList');


opts=(0,_prompt.generateOptions)((_c$files$rnv$configWo=c.files.rnv.configWorkspaces)==null?void 0:_c$files$rnv$configWo.workspaces,true,null,function(i,obj,mapping,defaultVal){
var isConnected='';
return" ["+_chalk.default.grey(i+1)+"]> "+_chalk.default.bold(defaultVal)+isConnected+" \n";
});

(0,_logger.logToSummary)("Workspaces:\n\n"+opts.asString);case 3:case"end":return _context.stop();}},null,null,null,Promise);};exports.rnvWorkspaceList=rnvWorkspaceList;


var rnvWorkspaceAdd=function rnvWorkspaceAdd(c){var _await$inquirerPrompt,workspace,workspacePath,_await$inquirerPrompt2,confirm,workspaceID,_await$inquirerPrompt3,workspaceIDInput;return _regenerator.default.async(function rnvWorkspaceAdd$(_context2){while(1)switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)('rnvWorkspaceAdd');_context2.next=3;return _regenerator.default.awrap(

(0,_prompt.inquirerPrompt)({
name:'workspace',
type:'input',
message:'absolute path to new workspace',
validate:function validate(i){return!!i||'No path provided';}
}));case 3:_await$inquirerPrompt=_context2.sent;workspace=_await$inquirerPrompt.workspace;

workspacePath=_path.default.join(workspace);if(!

_fs.default.existsSync(workspacePath)){_context2.next=13;break;}_context2.next=9;return _regenerator.default.awrap(
(0,_prompt.inquirerPrompt)({
name:'confirm',
type:'confirm',
message:"Folder "+workspacePath+" already exists are you sure you want to override it?"
}));case 9:_await$inquirerPrompt2=_context2.sent;confirm=_await$inquirerPrompt2.confirm;if(
confirm){_context2.next=13;break;}return _context2.abrupt("return");case 13:


workspaceID=workspacePath.split('/').pop().replace(/@|\./g,'');_context2.next=16;return _regenerator.default.awrap(

(0,_prompt.inquirerPrompt)({
name:'workspaceIDInput',
type:'input',
message:"ID of the workspace ("+workspaceID+")"
}));case 16:_await$inquirerPrompt3=_context2.sent;workspaceIDInput=_await$inquirerPrompt3.workspaceIDInput;

workspaceID=workspaceIDInput||workspaceID;
createWorkspace(c,workspaceID,workspacePath);case 20:case"end":return _context2.stop();}},null,null,null,Promise);};exports.rnvWorkspaceAdd=rnvWorkspaceAdd;


var createWorkspace=function createWorkspace(c,workspaceID,workspacePath){var _c$files$defaultWorks,_c$files$defaultWorks2,_c$files$defaultWorks3,_c$files$defaultWorks4;var workspaceConfig;return _regenerator.default.async(function createWorkspace$(_context3){while(1)switch(_context3.prev=_context3.next){case 0:
c.files.rnv.configWorkspaces.workspaces[workspaceID]={
path:workspacePath
};

workspaceConfig={
sdks:(_c$files$defaultWorks=c.files.defaultWorkspace)==null?void 0:(_c$files$defaultWorks2=_c$files$defaultWorks.config)==null?void 0:_c$files$defaultWorks2.sdks,
defaultTargets:(_c$files$defaultWorks3=c.files.defaultWorkspace)==null?void 0:(_c$files$defaultWorks4=_c$files$defaultWorks3.config)==null?void 0:_c$files$defaultWorks4.defaultTargets
};

(0,_fileutils.mkdirSync)(workspacePath);
(0,_fileutils.writeFileSync)(_path.default.join(workspacePath,'renative.json'),workspaceConfig);

(0,_fileutils.writeFileSync)(c.paths.rnv.configWorkspaces,c.files.rnv.configWorkspaces);return _context3.abrupt("return",
true);case 6:case"end":return _context3.stop();}},null,null,null,Promise);};exports.createWorkspace=createWorkspace;


var getWorkspaceDirPath=function getWorkspaceDirPath(c){var _c$buildConfig,_c$buildConfig2,_c$buildConfig2$paths;var wss,ws,dirPath,_wss$workspaces$ws,wsDir,confirm,_await$inquirerPrompt4,conf,_c$buildConfig3,_c$buildConfig3$paths;return _regenerator.default.async(function getWorkspaceDirPath$(_context4){while(1)switch(_context4.prev=_context4.next){case 0:
(0,_logger.logTask)('getWorkspaceDirPath');
wss=c.files.rnv.configWorkspaces;
ws=c.runtime.selectedWorkspace||((_c$buildConfig=c.buildConfig)==null?void 0:_c$buildConfig.workspaceID);if(!(

wss!=null&&wss.workspaces&&ws)){_context4.next=25;break;}
dirPath=(_wss$workspaces$ws=wss.workspaces[ws])==null?void 0:_wss$workspaces$ws.path;if(
dirPath){_context4.next=25;break;}
wsDir=_path.default.join(c.paths.home.dir,"."+ws);if(!
_fs.default.existsSync(wsDir)){_context4.next=13;break;}
wss.workspaces[ws]={
path:wsDir
};
(0,_fileutils.writeFileSync)(c.paths.rnv.configWorkspaces,wss);
(0,_logger.logInfo)("Found workspace id "+ws+" and compatible directory "+wsDir+". Your "+c.paths.rnv.configWorkspaces+" has been updated.");_context4.next=25;break;case 13:if(!(
!c.runtime.isWSConfirmed||c.program.ci===true)){_context4.next=25;break;}
confirm=true;if(!(
c.program.ci!==true)){_context4.next=22;break;}_context4.next=18;return _regenerator.default.awrap(
(0,_prompt.inquirerPrompt)({
name:'conf',
type:'confirm',
message:"Your project belongs to workspace "+_chalk.default.white(
ws)+". do you want to add new workspace "+
_chalk.default.white(
ws)+" to your local system at "+
_chalk.default.white(wsDir)+"?",
warningMessage:'No app configs found for this project'
}));case 18:_await$inquirerPrompt4=_context4.sent;conf=_await$inquirerPrompt4.conf;
confirm=conf;
c.runtime.isWSConfirmed=true;case 22:if(!

confirm){_context4.next=25;break;}_context4.next=25;return _regenerator.default.awrap(
createWorkspace(c,ws,wsDir));case 25:




if((_c$buildConfig2=c.buildConfig)!=null&&(_c$buildConfig2$paths=_c$buildConfig2.paths)!=null&&_c$buildConfig2$paths.globalConfigDir){
(0,_logger.logWarning)("paths.globalConfigDir in "+c.paths.project.config+" is DEPRECATED. use workspaceID instead. more info at https://renative.org/docs/workspaces");
}if(
dirPath){_context4.next=28;break;}return _context4.abrupt("return",
((_c$buildConfig3=c.buildConfig)==null?void 0:(_c$buildConfig3$paths=_c$buildConfig3.paths)==null?void 0:_c$buildConfig3$paths.globalConfigDir)||c.paths.GLOBAL_RNV_DIR);case 28:return _context4.abrupt("return",

dirPath);case 29:case"end":return _context4.stop();}},null,null,null,Promise);};exports.getWorkspaceDirPath=getWorkspaceDirPath;


var rnvWorkspaceConnect=function rnvWorkspaceConnect(c){var _c$files$rnv$configWo2;var opts,_await$inquirerPrompt5,selectedWS;return _regenerator.default.async(function rnvWorkspaceConnect$(_context5){while(1)switch(_context5.prev=_context5.next){case 0:
(0,_logger.logTask)('rnvWorkspaceConnect');

opts=Object.keys((_c$files$rnv$configWo2=c.files.rnv.configWorkspaces)==null?void 0:_c$files$rnv$configWo2.workspaces).map(function(v){var _c$files$rnv$configWo3;return v+" "+_getConnectionString((_c$files$rnv$configWo3=c.files.rnv.configWorkspaces)==null?void 0:_c$files$rnv$configWo3.workspaces[v]);});_context5.next=4;return _regenerator.default.awrap(

(0,_prompt.inquirerPrompt)({
type:'list',
name:'selectedWS',
message:'Pick a workspace',
choices:opts
}));case 4:_await$inquirerPrompt5=_context5.sent;selectedWS=_await$inquirerPrompt5.selectedWS;case 6:case"end":return _context5.stop();}},null,null,null,Promise);};exports.rnvWorkspaceConnect=rnvWorkspaceConnect;


var _getConnectionString=function _getConnectionString(obj){var _obj$remote;
var remoteUrl=(_obj$remote=obj.remote)==null?void 0:_obj$remote.url;
var connectMsg=remoteUrl?_chalk.default.green("("+obj.remote.type+":"+remoteUrl+")"):'';
return connectMsg;
};

var rnvWorkspaceUpdate=function rnvWorkspaceUpdate(c){return _regenerator.default.async(function rnvWorkspaceUpdate$(_context6){while(1)switch(_context6.prev=_context6.next){case 0:
(0,_logger.logTask)('rnvWorkspaceUpdate');case 1:case"end":return _context6.stop();}},null,null,null,Promise);};exports.rnvWorkspaceUpdate=rnvWorkspaceUpdate;



var getWorkspaceOptions=function getWorkspaceOptions(c){var _c$files$rnv$configWo4;return(0,_prompt.generateOptions)((_c$files$rnv$configWo4=c.files.rnv.configWorkspaces)==null?void 0:_c$files$rnv$configWo4.workspaces,false,null,function(i,obj,mapping,defaultVal){
(0,_logger.logDebug)('getWorkspaceOptions');

return" ["+_chalk.default.grey(i+1)+"]> "+_chalk.default.bold(defaultVal)+" "+_getConnectionString(obj)+"\n";
});};exports.getWorkspaceOptions=getWorkspaceOptions;
//# sourceMappingURL=workspace.js.map