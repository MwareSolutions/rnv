var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.rnvHelp=exports.default=exports._startBuilder=exports._spawnCommand=exports.SKIP_APP_CONFIG_CHECK=exports.NO_OP_COMMANDS=void 0;var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _chalk=_interopRequireDefault(require("chalk"));
var _logger=require("../systemTools/logger");
var _workspace=require("../projectTools/workspace");
var _projectGenerator=require("../projectTools/projectGenerator");
var _templateTools=require("../templateTools");
var _target=require("../platformTools/target");
var _pluginTools=require("../pluginTools");
var _platformTools=require("../platformTools");
var _buildHooks=require("../projectTools/buildHooks");
var _projectTools=require("../projectTools");
var _crypto=require("../systemTools/crypto");
var _fastlane=require("../deployTools/fastlane");
var _cleaner=require("../systemTools/cleaner");
var _prompt=require("../systemTools/prompt");
var _runner=require("../platformTools/runner");
var _utils=require("../utils");
var _constants=require("../constants");


var _config=_interopRequireWildcard(require("../config"));
var _migrator=require("../projectTools/migrator");
var _configParser=require("../configTools/configParser");



var _projectParser=require("../projectTools/projectParser");
var _publish=_interopRequireDefault(require("../projectTools/publish"));
var _package=_interopRequireDefault(require("../projectTools/package"));function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!=="function")return null;var cacheBabelInterop=new WeakMap();var cacheNodeInterop=new WeakMap();return(_getRequireWildcardCache=function _getRequireWildcardCache(nodeInterop){return nodeInterop?cacheNodeInterop:cacheBabelInterop;})(nodeInterop);}function _interopRequireWildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule){return obj;}if(obj===null||typeof obj!=="object"&&typeof obj!=="function"){return{default:obj};}var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj)){return cache.get(obj);}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc);}else{newObj[key]=obj[key];}}}newObj.default=obj;if(cache){cache.set(obj,newObj);}return newObj;}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;})),keys.push.apply(keys,symbols);}return keys;}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach(function(key){(0,_defineProperty2.default)(target,key,source[key]);}):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}return target;}

var rnvHelp=function rnvHelp(){
var cmdsString='';
for(var key in COMMANDS){
cmdsString+=key+", ";
}

(0,_logger.logToSummary)("\n"+
_chalk.default.bold.white('COMMANDS:')+"\n\n"+

cmdsString+"\n\n"+

_chalk.default.bold.white('OPTIONS:')+"\n\n'-i, --info', 'Show full debug info'\n'-u, --update', 'Force update dependencies (iOS only)'\n'-p, --platform <value>', 'Select specific platform' // <ios|android|web|...>\n'-c, --appConfigID <value>', 'Select specific appConfigID' // <ios|android|web|...>\n'-t, --target <value>', 'Select specific simulator' // <.....>\n'-d, --device [value]', 'Select connected device'\n'-s, --scheme <value>', 'Select build scheme' // <Debug | Release>\n'-f, --filter <value>', 'Filter Value'\n'-l, --list', 'Return list of items related to command' // <alpha|beta|prod>\n'-r, --reset', 'Also perform reset'\n'-b, --blueprint', 'Blueprint for targets'\n'-h, --host <value>', 'Custom Host IP'\n'-x, --exeMethod <value>', 'Executable method in buildHooks'\n'-P, --port <value>', 'Custom Port'\n'-H, --help', 'Help'\n'-D, --debug', 'enable remote debugger'\n'-G, --global', 'Flag for setting a config value for all RNV projects'\n'--hosted', 'Run in a hosted environment (skip bundleAssets)'\n'--debugIp <value>', '(optional) overwrite the ip to which the remote debugger will connect'\n");





















};exports.rnvHelp=rnvHelp;

var COMMANDS={
start:{
fn:_runner.rnvStart,
platforms:_constants.SUPPORTED_PLATFORMS
},
config:{
fn:_config.rnvConfigHandler,
desc:'Edit or display RNV configs'
},
run:{
desc:'Run your app on target device or emulator',
fn:_runner.rnvRun
},
package:{
desc:'Package JS Code',
platforms:[_constants.IOS,_constants.ANDROID,_constants.ANDROID_TV,_constants.ANDROID_WEAR,_constants.TVOS],
fn:_runner.rnvPackage
},
deploy:{
desc:'Deploy whole app via preconfigured or custom integration',
fn:_runner.rnvDeploy
},
build:{
desc:'Build your app',
fn:_runner.rnvBuild
},
export:{
desc:'Export your app (ios only)',
platforms:[_constants.IOS,_constants.TVOS,_constants.MACOS,_constants.WINDOWS,_constants.WEB,_constants.ANDROID,_constants.ANDROID_TV,_constants.ANDROID_WEAR],
fn:_runner.rnvExport
},
log:{
desc:'Attach logger to device or emulator and print out logs',
platforms:[_constants.IOS,_constants.ANDROID,_constants.ANDROID_TV,_constants.ANDROID_WEAR,_constants.TVOS],
fn:_runner.rnvLog
},
new:{
fn:_projectGenerator.createNewProject,
desc:'Creates new project',
params:['mono','ci']
},
help:{
desc:'Displays help',
fn:rnvHelp
},
configure:{
desc:'Configures app config',
fn:_projectTools.rnvConfigure,
params:['appConfigID','mono','ci']
},
switch:{
desc:'Switches to app confing without rebuilding',
fn:_projectTools.rnvSwitch,
params:['appConfigID','mono','ci']
},
link:{
desc:'Local dependency linking of your project',
fn:_projectTools.rnvLink
},
platform:{
desc:'Manages native platform projects',
subCommands:{
eject:{
fn:_platformTools.rnvPlatformEject
},
list:{
fn:_platformTools.rnvPlatformList
},
connect:{
fn:_platformTools.rnvPlatformConnect
},
configure:{
fn:_platformTools.rnvPlatformConfigure
},
setup:{
fn:_platformTools.rnvPlatformSetup
}
}
},
target:{
desc:'Manages simulators and emulators',
platforms:[_constants.IOS,_constants.ANDROID,_constants.ANDROID_TV,_constants.ANDROID_WEAR,_constants.TIZEN,_constants.TIZEN_MOBILE,_constants.TVOS,_constants.WEBOS,_constants.TIZEN_WATCH],
subCommands:{
launch:{
fn:_target.rnvTargetLaunch
},
list:{
fn:_target.rnvTargetList
}
}
},
plugin:{
desc:'Manages all plugins',
subCommands:{
add:{
fn:_pluginTools.rnvPluginAdd
},
list:{
fn:_pluginTools.rnvPluginList
},
update:{
fn:_pluginTools.rnvPluginUpdate
}
}
},
hooks:{
desc:'Manages project based build hooks. This allows you to extend functionality of RNV CLI',
subCommands:{
run:{
fn:_buildHooks.rnvHooksRun
},
list:{
fn:_buildHooks.rnvHooksList
},
pipes:{
fn:_buildHooks.rnvHooksPipes
}
}
},
status:{
desc:'Prints out summary of your project',
fn:_logger.rnvStatus
},
clean:{
desc:'Automatically removes all node_modules and lock in your project and its dependencies',
fn:_cleaner.rnvClean
},
template:{
desc:'Manages rnv and project templates',
subCommands:{
add:{
fn:_templateTools.rnvTemplateAdd
},
list:{
fn:_templateTools.rnvTemplateList
},
apply:{
fn:_templateTools.rnvTemplateApply
}
}
},
crypto:{
desc:'Utility to manage encrytped files in your project, provisioning profiles, kestores and other sensitive information',
subCommands:{
encrypt:{
fn:_crypto.rnvCryptoEncrypt
},
decrypt:{
fn:_crypto.rnvCryptoDecrypt
},
installCerts:{
platforms:[_constants.IOS,_constants.TVOS],
fn:_crypto.rnvCryptoInstallCerts
},
updateProfile:{
requiredParams:['scheme','platform'],
platforms:[_constants.IOS,_constants.TVOS],
fn:_crypto.rnvCryptoUpdateProfile
},
updateProfiles:{
platforms:[_constants.IOS,_constants.TVOS],
fn:_crypto.rnvCryptoUpdateProfiles
},
installProfiles:{
platforms:[_constants.IOS,_constants.TVOS],
fn:_crypto.rnvCryptoInstallProfiles
}
}
},
workspace:{
desc:'Manages global workspaces for ReNative projects',
subCommands:{
add:{
fn:_workspace.rnvWorkspaceAdd
},
connect:{
fn:_workspace.rnvWorkspaceConnect
},
list:{
fn:_workspace.rnvWorkspaceList
},
update:{
fn:_workspace.rnvWorkspaceUpdate
}
}
},
fastlane:{
desc:'Run fastlane commands on currectly active app/platform directly via rnv command',
platforms:[_constants.IOS,_constants.ANDROID,_constants.ANDROID_TV,_constants.ANDROID_WEAR,_constants.TVOS],
fn:_fastlane.rnvFastlane
},
publish:{
desc:'Provides help deploying a new version, like tagging a commit, pushing it, etc',
fn:_publish.default
},
pkg:{
desc:'Provides help deploying a new version, like tagging a commit, pushing it, etc',
fn:_package.default
}
};
var NO_OP_COMMANDS=['fix','clean','tool','status','log','new','target','help','config'];exports.NO_OP_COMMANDS=NO_OP_COMMANDS;
var SKIP_APP_CONFIG_CHECK=['crypto','config'];exports.SKIP_APP_CONFIG_CHECK=SKIP_APP_CONFIG_CHECK;

var _handleUnknownPlatform=function _handleUnknownPlatform(c,platforms){var _await$inquirerPrompt,platform;return _regenerator.default.async(function _handleUnknownPlatform$(_context){while(1)switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)('_handleUnknownPlatform');_context.next=3;return _regenerator.default.awrap(
(0,_prompt.inquirerPrompt)({
type:'list',
name:'platform',
message:'pick one of the following',
choices:platforms,
logMessage:"cli: Command "+_chalk.default.grey(c.command)+" does not support platform "+_chalk.default.grey(c.platform)+". "
}));case 3:_await$inquirerPrompt=_context.sent;platform=_await$inquirerPrompt.platform;

c.platform=platform;return _context.abrupt("return",
run(c));case 7:case"end":return _context.stop();}},null,null,null,Promise);};






var _builderStarted=false;
var _startBuilder=function _startBuilder(c){var _await$inquirerPrompt2,command;return _regenerator.default.async(function _startBuilder$(_context2){while(1)switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)("_startBuilder:"+_builderStarted);if(!

_builderStarted){_context2.next=3;break;}return _context2.abrupt("return");case 3:

_builderStarted=true;_context2.next=6;return _regenerator.default.awrap(

(0,_migrator.checkAndMigrateProject)(c));case 6:_context2.next=8;return _regenerator.default.awrap(
(0,_configParser.parseRenativeConfigs)(c));case 8:if(

c.command){_context2.next=15;break;}if(
c.paths.project.configExists){_context2.next=15;break;}_context2.next=12;return _regenerator.default.awrap(
(0,_prompt.inquirerPrompt)({
type:'list',
default:'new',
name:'command',
message:'Pick a command',
choices:NO_OP_COMMANDS.sort(),
pageSize:15,
logMessage:'You need to tell rnv what to do. NOTE: your current directory is not ReNative project. RNV options will be limited'
}));case 12:_await$inquirerPrompt2=_context2.sent;command=_await$inquirerPrompt2.command;
c.command=command;case 15:if(!



NO_OP_COMMANDS.includes(c.command)){_context2.next=19;break;}_context2.next=18;return _regenerator.default.awrap(
(0,_configParser.configureRnvGlobal)(c));case 18:return _context2.abrupt("return",
c);case 19:_context2.next=21;return _regenerator.default.awrap(


(0,_migrator.checkAndMigrateProject)(c));case 21:_context2.next=23;return _regenerator.default.awrap(
(0,_configParser.parseRenativeConfigs)(c));case 23:_context2.next=25;return _regenerator.default.awrap(
(0,_configParser.checkIsRenativeProject)(c));case 25:_context2.next=27;return _regenerator.default.awrap(
(0,_projectParser.checkAndCreateProjectPackage)(c));case 27:_context2.next=29;return _regenerator.default.awrap(
(0,_configParser.configureRnvGlobal)(c));case 29:_context2.next=31;return _regenerator.default.awrap(
(0,_templateTools.checkIfTemplateInstalled)(c));case 31:_context2.next=33;return _regenerator.default.awrap(
(0,_configParser.fixRenativeConfigsSync)(c));case 33:_context2.next=35;return _regenerator.default.awrap(
(0,_projectParser.configureNodeModules)(c));case 35:_context2.next=37;return _regenerator.default.awrap(
(0,_templateTools.applyTemplate)(c));case 37:_context2.next=39;return _regenerator.default.awrap(
(0,_pluginTools.configurePlugins)(c));case 39:_context2.next=41;return _regenerator.default.awrap(
(0,_projectParser.configureNodeModules)(c));case 41:_context2.next=43;return _regenerator.default.awrap(
(0,_crypto.checkCrypto)(c));case 43:if(

SKIP_APP_CONFIG_CHECK.includes(c.command)){_context2.next=46;break;}_context2.next=46;return _regenerator.default.awrap(
(0,_configParser.updateConfig)(c,c.runtime.appId));case 46:_context2.next=48;return _regenerator.default.awrap(

(0,_logger.logAppInfo)(c));case 48:case"end":return _context2.stop();}},null,null,null,Promise);};exports._startBuilder=_startBuilder;


var _execCommandHep=function _execCommandHep(c,cmd){var opts,subCommands;return _regenerator.default.async(function _execCommandHep$(_context3){while(1)switch(_context3.prev=_context3.next){case 0:
opts='';
subCommands='';

if(cmd.subCommands){
subCommands='\nSub Commands: \n';
subCommands+=Object.keys(cmd.subCommands).join(', ');
subCommands+='\n';
}

if(cmd.params){
opts='Options:\n';
opts+=(cmd.params||[]).reduce(function(t,v){return t+"--"+v+"\n";},'');
}

(0,_logger.logToSummary)("\nCommand: "+
c.command+"\n\nDescription: "+

cmd.desc+".\n"+
subCommands+"\n"+
opts+"\nMore info at "+
_chalk.default.grey("https://renative.org/docs/rnv-"+c.command)+"\n");return _context3.abrupt("return",

Promise.resolve());case 6:case"end":return _context3.stop();}},null,null,null,Promise);};


var _handleUnknownSubCommand=function _handleUnknownSubCommand(c){var _COMMANDS$c$command;var cmds,_await$inquirerPrompt3,subCommand;return _regenerator.default.async(function _handleUnknownSubCommand$(_context4){while(1)switch(_context4.prev=_context4.next){case 0:
(0,_logger.logTask)('_handleUnknownSubCommand');
cmds=(_COMMANDS$c$command=COMMANDS[c.command])==null?void 0:_COMMANDS$c$command.subCommands;_context4.next=4;return _regenerator.default.awrap(

(0,_prompt.inquirerPrompt)({
type:'list',
name:'subCommand',
message:'Pick a subCommand',
choices:Object.keys(cmds),
logMessage:"cli: Command "+_chalk.default.bold(c.command)+" does not support method "+_chalk.default.bold(c.subCommand)+"!"
}));case 4:_await$inquirerPrompt3=_context4.sent;subCommand=_await$inquirerPrompt3.subCommand;

c.subCommand=subCommand;return _context4.abrupt("return",
run(c));case 8:case"end":return _context4.stop();}},null,null,null,Promise);};


var _handleUnknownCommand=function _handleUnknownCommand(c){var _await$inquirerPrompt4,command;return _regenerator.default.async(function _handleUnknownCommand$(_context5){while(1)switch(_context5.prev=_context5.next){case 0:
(0,_logger.logTask)('_handleUnknownCommand');

c.program.scheme=true;_context5.next=4;return _regenerator.default.awrap(

(0,_prompt.inquirerPrompt)({
type:'list',
name:'command',
message:'Pick a command',
pageSize:7,
choices:Object.keys(COMMANDS).sort(),
logMessage:"cli: Command "+_chalk.default.bold(c.command)+" not supported!"
}));case 4:_await$inquirerPrompt4=_context5.sent;command=_await$inquirerPrompt4.command;
c.command=command;return _context5.abrupt("return",
run(c));case 8:case"end":return _context5.stop();}},null,null,null,Promise);};



var _arrayMergeOverride=function _arrayMergeOverride(destinationArray,sourceArray,mergeOptions){return sourceArray;};

var _spawnCommand=function _spawnCommand(c,overrideParams){
var newCommand={};

Object.keys(c).forEach(function(k){
if(typeof newCommand[k]==='object'&&!(newCommand[k]instanceof'String')){
newCommand[k]=_objectSpread({},c[k]);
}else{
newCommand[k]=c[k];
}
});

var merge=require('deepmerge');

Object.keys(overrideParams).forEach(function(k){
if(newCommand[k]&&typeof overrideParams[k]==='object'){
newCommand[k]=merge(newCommand[k],overrideParams[k],{arrayMerge:_arrayMergeOverride});
}else{
newCommand[k]=overrideParams[k];
}
});




return newCommand;
};exports._spawnCommand=_spawnCommand;






var run=function run(c,spawnC,skipStartBuilder){var _cmd$subCommands;var oldC,cmd,cmdFn,subCmd,subCmdFn;return _regenerator.default.async(function run$(_context6){while(1)switch(_context6.prev=_context6.next){case 0:
(0,_logger.logTask)('cli');if(

skipStartBuilder){_context6.next=4;break;}_context6.next=4;return _regenerator.default.awrap(_startBuilder(c));case 4:


if(spawnC){
oldC=c;
c=_spawnCommand(c,spawnC);
_config.default.initializeConfig(c);
}

cmd=COMMANDS[c.command];
cmdFn=cmd==null?void 0:cmd.fn;
subCmd=cmd==null?void 0:(_cmd$subCommands=cmd.subCommands)==null?void 0:_cmd$subCommands[c.subCommand];
subCmdFn=subCmd==null?void 0:subCmd.fn;if(!

cmd){_context6.next=35;break;}if(!(
c.subCommand==='help')){_context6.next=15;break;}_context6.next=13;return _regenerator.default.awrap(
_execCommandHep(c,cmd));case 13:_context6.next=33;break;case 15:if(!
cmdFn){_context6.next=26;break;}if(!
subCmdFn){_context6.next=21;break;}_context6.next=19;return _regenerator.default.awrap(
_execute(c,subCmdFn,cmd));case 19:_context6.next=24;break;case 21:


c.subCommand=null;_context6.next=24;return _regenerator.default.awrap(
_execute(c,cmdFn,cmd));case 24:_context6.next=33;break;case 26:if(!

subCmdFn){_context6.next=31;break;}_context6.next=29;return _regenerator.default.awrap(
_execute(c,subCmdFn,cmd));case 29:_context6.next=33;break;case 31:_context6.next=33;return _regenerator.default.awrap(

_handleUnknownSubCommand(c));case 33:_context6.next=37;break;case 35:_context6.next=37;return _regenerator.default.awrap(


_handleUnknownCommand(c));case 37:case"end":return _context6.stop();}},null,null,null,Promise);};




var _execute=function _execute(c,cmdFn,cmd){var _c$buildConfig,_c$buildConfig$defaul,_c$buildConfig$defaul2,_PLATFORMS$c$platform;var subCmd,_cmd$subCommands2,_cmd$subCommands2$c$s,requiredPlatforms,pipeEnabled;return _regenerator.default.async(function _execute$(_context7){while(1)switch(_context7.prev=_context7.next){case 0:
(0,_logger.logTask)("_execute:"+c.command+":"+c.subCommand);if(!(
cmd.platforms&&!cmd.platforms.includes(c.platform))){_context7.next=5;break;}_context7.next=4;return _regenerator.default.awrap(
_handleUnknownPlatform(c,cmd.platforms));case 4:return _context7.abrupt("return");case 5:



subCmd='';if(!
c.subCommand){_context7.next=13;break;}
subCmd=":"+c.subCommand;
requiredPlatforms=(_cmd$subCommands2=cmd.subCommands)==null?void 0:(_cmd$subCommands2$c$s=_cmd$subCommands2[c.subCommand])==null?void 0:_cmd$subCommands2$c$s.platforms;if(!(
requiredPlatforms&&!requiredPlatforms.includes(c.platform))){_context7.next=13;break;}_context7.next=12;return _regenerator.default.awrap(
_handleUnknownPlatform(c,requiredPlatforms));case 12:return _context7.abrupt("return");case 13:












c.runtime.port=c.program.port||((_c$buildConfig=c.buildConfig)==null?void 0:(_c$buildConfig$defaul=_c$buildConfig.defaults)==null?void 0:(_c$buildConfig$defaul2=_c$buildConfig$defaul.ports)==null?void 0:_c$buildConfig$defaul2[c.platform])||((_PLATFORMS$c$platform=_constants.PLATFORMS[c.platform])==null?void 0:_PLATFORMS$c$platform.defaultPort);
if(c.program.target!==true)c.runtime.target=c.program.target||c.files.workspace.config.defaultTargets[c.platform];else
c.runtime.target=c.program.target;
c.runtime.scheme=c.program.scheme||'debug';
c.runtime.localhost=_utils.isSystemWin?'127.0.0.1':'0.0.0.0';






pipeEnabled=!NO_OP_COMMANDS.includes(c.command)&&!SKIP_APP_CONFIG_CHECK.includes(c.command);if(!
pipeEnabled){_context7.next=21;break;}_context7.next=21;return _regenerator.default.awrap((0,_buildHooks.executePipe)(c,""+c.command+subCmd+":before"));case 21:_context7.next=23;return _regenerator.default.awrap(
cmdFn(c));case 23:if(!
pipeEnabled){_context7.next=26;break;}_context7.next=26;return _regenerator.default.awrap((0,_buildHooks.executePipe)(c,""+c.command+subCmd+":after"));case 26:case"end":return _context7.stop();}},null,null,null,Promise);};var _default=



run;exports.default=_default;
//# sourceMappingURL=index.js.map