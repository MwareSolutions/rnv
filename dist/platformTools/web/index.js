var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.runWeb=exports.exportWeb=exports.deployWeb=exports.configureWebProject=exports.configureCoreWebProject=exports.buildWeb=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _chalk=_interopRequireDefault(require("chalk"));
var _betterOpn=_interopRequireDefault(require("better-opn"));
var _ip=_interopRequireDefault(require("ip"));
var _exec=require("../../systemTools/exec");
var _common=require("../../common");













var _=require("..");
var _logger=require("../../systemTools/logger");
var _constants=require("../../constants");
var _projectParser=require("../../projectTools/projectParser");
var _fileutils=require("../../systemTools/fileutils");
var _pluginTools=require("../../pluginTools");
var _webTools=require("../../deployTools/webTools");
var _utils=require("../../utils");function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;})),keys.push.apply(keys,symbols);}return keys;}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach(function(key){(0,_defineProperty2.default)(target,key,source[key]);}):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}return target;}

var _generateWebpackConfigs=function _generateWebpackConfigs(c,platform){
var appFolder=(0,_common.getAppFolder)(c,platform);
var templateFolder=(0,_common.getAppTemplateFolder)(c,platform);

var plugins=c.buildConfig.plugins;
var modulePaths=[];
var moduleAliasesString='';
var moduleAliases={};

for(var key in plugins){
var plugin=(0,_pluginTools.getMergedPlugin)(c,key,plugins);
if(!plugin){

}else if(plugin.webpack){
if(plugin.webpack.modulePaths){
if(plugin.webpack.modulePaths===true){
modulePaths.push("node_modules/"+key);
}else{
modulePaths=modulePaths.concat(plugin.webpack.modulePaths);
}
}
if(plugin.webpack.moduleAliases){
if(plugin.webpack.moduleAliases===true){
moduleAliasesString+="'"+key+"': {\n                  projectPath: 'node_modules/"+
key+"'\n                },";

moduleAliases[key]={projectPath:"node_modules/"+key};
}else{
for(var aKey in plugin.webpack.moduleAliases){
if(typeof plugin.webpack.moduleAliases[aKey]==='string'){
moduleAliasesString+="'"+aKey+"': '"+plugin.webpack.moduleAliases[aKey]+"',";
moduleAliases[key]=plugin.webpack.moduleAliases[aKey];
}else{
moduleAliasesString+="'"+aKey+"': {projectPath: '"+plugin.webpack.moduleAliases[aKey].projectPath+"'},";
if(plugin.webpack.moduleAliases[aKey].projectPath){
moduleAliases[key]={projectPath:plugin.webpack.moduleAliases[aKey].projectPath};
}
}
}
}
}
}
}

var env=(0,_common.getConfigProp)(c,platform,'environment');
var extendConfig=(0,_common.getConfigProp)(c,platform,'webpackConfig',{});
var entryFile=(0,_common.getConfigProp)(c,platform,'entryFile','index.web');
var title=(0,_common.getAppTitle)(c,platform);
var analyzer=(0,_common.getConfigProp)(c,platform,'analyzer')||c.program.analyzer;

(0,_fileutils.copyFileSync)(
_path.default.join(templateFolder,'_privateConfig',env==='production'?'webpack.config.js':'webpack.config.dev.js'),
_path.default.join(appFolder,'webpack.config.js'));


var obj=_objectSpread({
modulePaths:modulePaths,
moduleAliases:moduleAliases,
analyzer:analyzer,
entryFile:entryFile,
title:title,
extensions:(0,_common.getSourceExts)(c)},
extendConfig);


var extendJs="\n    module.exports = "+
JSON.stringify(obj,null,2);

_fs.default.writeFileSync(_path.default.join(appFolder,'webpack.extend.js'),extendJs);
};

var buildWeb=function buildWeb(c,platform){return new Promise(function(resolve,reject){
var _c$program=c.program,debug=_c$program.debug,debugIp=_c$program.debugIp;
(0,_logger.logTask)("buildWeb:"+platform);

var appFolder=(0,_common.getAppFolder)(c,platform);

var debugVariables='';

if(debug){
(0,_logger.logInfo)("Starting a remote debugger build with ip "+(debugIp||_ip.default.address())+". If this IP is not correct, you can always override it with --debugIp");
debugVariables+="DEBUG=true DEBUG_IP="+(debugIp||_ip.default.address());
}

var wbp=(0,_common.resolveNodeModulePath)(c,'webpack/bin/webpack.js');

(0,_exec.executeAsync)(c,"npx cross-env PLATFORM="+platform+" NODE_ENV=production "+debugVariables+" node "+wbp+" -p --config ./platformBuilds/"+c.runtime.appId+"_"+platform+"/webpack.config.js").
then(function(){
(0,_logger.logSuccess)("Your Build is located in "+_chalk.default.white(_path.default.join(appFolder,'public'))+" .");
resolve();
}).
catch(function(e){return reject(e);});
});};exports.buildWeb=buildWeb;

var configureWebProject=function configureWebProject(c,platform){return _regenerator.default.async(function configureWebProject$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)("configureWebProject:"+platform);if(

(0,_.isPlatformActive)(c,platform)){_context.next=3;break;}return _context.abrupt("return");case 3:_context.next=5;return _regenerator.default.awrap(

(0,_projectParser.copyAssetsFolder)(c,platform));case 5:_context.next=7;return _regenerator.default.awrap(

configureCoreWebProject(c,platform));case 7:return _context.abrupt("return",

(0,_projectParser.copyBuildsFolder)(c,platform));case 8:case"end":return _context.stop();}}},null,null,null,Promise);};exports.configureWebProject=configureWebProject;


var configureCoreWebProject=function configureCoreWebProject(c,platform){return _regenerator.default.async(function configureCoreWebProject$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
_generateWebpackConfigs(c,platform);
_parseCssSync(c,platform);case 2:case"end":return _context2.stop();}}},null,null,null,Promise);};exports.configureCoreWebProject=configureCoreWebProject;


var _parseCssSync=function _parseCssSync(c,platform){
var appFolder=(0,_common.getAppFolder)(c,platform);
var stringsPath='public/app.css';
(0,_common.writeCleanFile)((0,_common.getBuildFilePath)(c,platform,stringsPath),_path.default.join(appFolder,stringsPath),[
{pattern:'{{PLUGIN_COLORS_BG}}',override:(0,_common.sanitizeColor)((0,_common.getConfigProp)(c,platform,'backgroundColor')).hex}]);

};

var runWeb=function runWeb(c,platform,port){var devServerHost,extendConfig,isPortActive;return _regenerator.default.async(function runWeb$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:
(0,_logger.logTask)("runWeb:"+platform+":"+port);

devServerHost=c.runtime.localhost;

if(platform===_constants.WEB){
extendConfig=(0,_common.getConfigProp)(c,c.platform,'webpackConfig',{});
devServerHost=(0,_utils.getValidLocalhost)(extendConfig.devServerHost,c.runtime.localhost);
}_context3.next=5;return _regenerator.default.awrap(

(0,_common.checkPortInUse)(c,platform,port));case 5:isPortActive=_context3.sent;if(

isPortActive){_context3.next=14;break;}
(0,_logger.logInfo)("Looks like your "+
_chalk.default.white(platform)+" devServerHost "+_chalk.default.white(devServerHost)+" at port "+_chalk.default.white(
port)+" is not running. Starting it up for you...");_context3.next=10;return _regenerator.default.awrap(


_runWebBrowser(c,platform,devServerHost,port,false));case 10:_context3.next=12;return _regenerator.default.awrap(
runWebDevServer(c,platform,port));case 12:_context3.next=18;break;case 14:_context3.next=16;return _regenerator.default.awrap(

(0,_common.confirmActiveBundler)(c));case 16:_context3.next=18;return _regenerator.default.awrap(
_runWebBrowser(c,platform,devServerHost,port,true));case 18:case"end":return _context3.stop();}}},null,null,null,Promise);};exports.runWeb=runWeb;



var _runWebBrowser=function _runWebBrowser(c,platform,devServerHost,port,alreadyStarted){return new Promise(function(resolve){
(0,_logger.logTask)("_runWebBrowser:"+platform+":"+devServerHost+":"+port+":"+c.runtime.shouldOpenBrowser);
if(!c.runtime.shouldOpenBrowser)return resolve();
var wait=(0,_common.waitForWebpack)(c,port).
then(function(){
(0,_betterOpn.default)("http://"+devServerHost+":"+port+"/");
}).
catch(function(e){
(0,_logger.logWarning)(e);
});
if(alreadyStarted)return wait;
return resolve();
});};

var runWebDevServer=function runWebDevServer(c,platform,port){return new Promise(function(resolve,reject){
(0,_logger.logTask)("runWebDevServer:"+platform);
var _c$program2=c.program,debug=_c$program2.debug,debugIp=_c$program2.debugIp;

var appFolder=(0,_common.getAppFolder)(c,platform);
var wpPublic=_path.default.join(appFolder,'public');
var wpConfig=_path.default.join(appFolder,'webpack.config.js');

var debugVariables='';

if(debug){
(0,_logger.logInfo)("Starting a remote debugger build with ip "+(debugIp||_ip.default.address())+". If this IP is not correct, you can always override it with --debugIp");
debugVariables+="DEBUG=true DEBUG_IP="+(debugIp||_ip.default.address());
}

var command="npx cross-env PLATFORM="+platform+" "+debugVariables+" webpack-dev-server -d --devtool source-map --config "+wpConfig+"  --inline --hot --colors --content-base "+wpPublic+" --history-api-fallback --port "+port+" --mode=development";
(0,_exec.executeAsync)(c,command,{stdio:'inherit',silent:true}).
then(function(){
(0,_logger.logDebug)('runWebDevServer: running');
resolve();
}).
catch(function(e){
(0,_logger.logDebug)(e);
resolve();
});
});};

var deployWeb=function deployWeb(c,platform){
(0,_logger.logTask)("deployWeb:"+platform);
return(0,_webTools.selectWebToolAndDeploy)(c,platform);
};exports.deployWeb=deployWeb;

var exportWeb=function exportWeb(c,platform){
(0,_logger.logTask)("exportWeb:"+platform);
return(0,_webTools.selectWebToolAndExport)(c,platform);
};exports.exportWeb=exportWeb;
//# sourceMappingURL=index.js.map