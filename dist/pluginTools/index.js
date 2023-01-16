var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.rnvPluginUpdate=exports.rnvPluginList=exports.rnvPluginAdd=exports.parsePlugins=exports.getMergedPlugin=exports.getLocalRenativePlugin=exports.default=exports.configurePlugins=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _chalk=_interopRequireDefault(require("chalk"));
var _inquirer=_interopRequireDefault(require("inquirer"));
var _ora=_interopRequireDefault(require("ora"));
var _fileutils=require("../systemTools/fileutils");
var _common=require("../common");
var _configParser=require("../configTools/configParser");

var _constants=require("../constants");
var _logger=require("../systemTools/logger");



var _buildHooks=require("../projectTools/buildHooks");

var rnvPluginList=function rnvPluginList(c){return new Promise(function(resolve){
(0,_logger.logTask)('_runList');

var o=_getPluginList(c);


(0,_logger.logToSummary)("Plugins:\n\n"+o.asString);

resolve();
});};exports.rnvPluginList=rnvPluginList;

var _getPluginList=function _getPluginList(c){var isUpdate=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;
var output={
asString:'',
asArray:[],
plugins:[],
allPlugins:{}
};

var i=1;

Object.keys(c.files.rnv.pluginTemplates.configs).forEach(function(pk){
var plugins=c.files.rnv.pluginTemplates.configs[pk].pluginTemplates;
Object.keys(plugins).forEach(function(k){
var p=plugins[k];

var platforms='';
_constants.SUPPORTED_PLATFORMS.forEach(function(v){
if(p[v])platforms+=v+", ";
});
if(platforms.length)platforms=platforms.slice(0,platforms.length-2);
var installedPlugin=c.buildConfig&&c.buildConfig.plugins&&c.buildConfig.plugins[k];
var installedString=installedPlugin?_chalk.default.yellow('installed'):_chalk.default.green('not installed');
if(isUpdate&&installedPlugin){
output.plugins.push(k);
var versionString;
if(installedPlugin.version!==p.version){
versionString="("+_chalk.default.yellow(installedPlugin.version)+") => ("+_chalk.default.green(p.version)+")";
}else{
versionString="("+_chalk.default.green(installedPlugin.version)+")";
}
output.asString+=" ["+i+"]> "+_chalk.default.bold(k)+" "+versionString+"\n";
output.asArray.push({name:k+" "+versionString,value:k});
output.allPlugins[k]=p;
i++;
}else if(!isUpdate){
output.plugins.push(k);
output.asString+=" ["+i+"]> "+_chalk.default.bold(k)+" ("+_chalk.default.grey(p.version)+") ["+platforms+"] - "+installedString+"\n";
output.asArray.push({name:k+" ("+_chalk.default.grey(p.version)+") ["+platforms+"] - "+installedString,value:k});
output.allPlugins[k]=p;

i++;
}
output.asArray.sort(function(a,b){
var aStr=a.name.toLowerCase();
var bStr=b.name.toLowerCase();
var com=0;
if(aStr>bStr){
com=1;
}else if(aStr<bStr){
com=-1;
}
return com;
});
});
});


return output;
};

var rnvPluginAdd=function rnvPluginAdd(c){var o,_await$inquirer$promp,plugin,installMessage,selectedPlugins,questionPlugins,pluginKeys,i,pluginKey,_plugin,pluginProps,finalProps,i2,_await$inquirer$promp2,propValue,spinner;return _regenerator.default.async(function rnvPluginAdd$(_context){while(1)switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)('rnvPluginAdd');

o=_getPluginList(c);_context.next=4;return _regenerator.default.awrap(

_inquirer.default.prompt({
name:'plugin',
type:'rawlist',
message:'Select the plugins you want to add',
choices:o.asArray,
pageSize:50
}));case 4:_await$inquirer$promp=_context.sent;plugin=_await$inquirer$promp.plugin;

installMessage=[];
selectedPlugins={};
selectedPlugins[plugin]=o.allPlugins[plugin];
installMessage.push(_chalk.default.white(plugin)+" v("+_chalk.default.green(o.allPlugins[plugin].version)+")");

questionPlugins={};

Object.keys(selectedPlugins).forEach(function(key){

var plugin=selectedPlugins[key];
if(plugin.props)questionPlugins[key]=plugin;
c.files.project.config.plugins[key]='source:rnv';


_checkAndAddDependantPlugins(c,selectedPlugins[key]);
});

pluginKeys=Object.keys(questionPlugins);
i=0;case 14:if(!(i<pluginKeys.length)){_context.next=34;break;}
pluginKey=pluginKeys[i];
_plugin=questionPlugins[pluginKey];
pluginProps=Object.keys(_plugin.props);
finalProps={};
i2=0;case 20:if(!(i2<pluginProps.length)){_context.next=29;break;}_context.next=23;return _regenerator.default.awrap(
_inquirer.default.prompt({
name:'propValue',
type:'input',
message:pluginKey+": Add value for "+pluginProps[i2]+" (You can do this later in ./renative.json file)"
}));case 23:_await$inquirer$promp2=_context.sent;propValue=_await$inquirer$promp2.propValue;
finalProps[pluginProps[i2]]=propValue;case 26:i2++;_context.next=20;break;case 29:

c.files.project.config.plugins[pluginKey]={};
c.files.project.config.plugins[pluginKey].props=finalProps;case 31:i++;_context.next=14;break;case 34:


spinner=(0,_ora.default)("Installing: "+installMessage.join(', ')).start();

(0,_fileutils.writeFileSync)(c.paths.project.config,c.files.project.config);
spinner.succeed('All plugins installed!');
(0,_logger.logSuccess)('Plugins installed successfully!');case 38:case"end":return _context.stop();}},null,null,null,Promise);};exports.rnvPluginAdd=rnvPluginAdd;


var _checkAndAddDependantPlugins=function _checkAndAddDependantPlugins(c,plugin){
if(plugin.dependsOn){
plugin.dependsOn.forEach(function(v){
Object.keys(c.files.rnv.pluginTemplates.configs).forEach(function(p){
var templatePlugins=c.files.rnv.pluginTemplates.configs[p].pluginTemplates;
if(templatePlugins[v]){
console.log("Added dependant plugin "+v);
c.buildConfig.plugins[v]=templatePlugins[v];
}
});
});
}
};

var rnvPluginUpdate=function rnvPluginUpdate(c){var o,_await$inquirer$promp3,confirm,plugins;return _regenerator.default.async(function rnvPluginUpdate$(_context2){while(1)switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)('rnvPluginUpdate');

o=_getPluginList(c,true);

console.log(o.asString);_context2.next=5;return _regenerator.default.awrap(

_inquirer.default.prompt({
name:'confirm',
type:'confirm',
message:'Above installed plugins will be updated with RNV'
}));case 5:_await$inquirer$promp3=_context2.sent;confirm=_await$inquirer$promp3.confirm;

if(confirm){
plugins=c.buildConfig.plugins;
Object.keys(plugins).forEach(function(key){

c.files.project.config.plugins[key]=o.json[key];
});

(0,_fileutils.writeFileSync)(c.paths.project.config,c.files.project.config);

(0,_logger.logSuccess)('Plugins updated successfully!');
}case 8:case"end":return _context2.stop();}},null,null,null,Promise);};exports.rnvPluginUpdate=rnvPluginUpdate;


var getMergedPlugin=function getMergedPlugin(c,key,plugins){var _c$files$rnv$pluginTe,_c$files$rnv$pluginTe2,_c$files$rnv$pluginTe3;var noMerge=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;
var plugin=plugins[key];


var rnvPlugin=(_c$files$rnv$pluginTe=c.files.rnv.pluginTemplates.configs)==null?void 0:(_c$files$rnv$pluginTe2=_c$files$rnv$pluginTe.rnv)==null?void 0:(_c$files$rnv$pluginTe3=_c$files$rnv$pluginTe2.pluginTemplates)==null?void 0:_c$files$rnv$pluginTe3[key];

var origPlugin;
if(typeof plugin==='string'||plugin instanceof String){var _c$files$rnv$pluginTe4,_c$files$rnv$pluginTe5;
var scope=plugin.split(':').pop();

origPlugin=(_c$files$rnv$pluginTe4=c.files.rnv.pluginTemplates.configs[scope])==null?void 0:(_c$files$rnv$pluginTe5=_c$files$rnv$pluginTe4.pluginTemplates)==null?void 0:_c$files$rnv$pluginTe5[key];

if(origPlugin){var _origPlugin;
if(rnvPlugin&&!((_origPlugin=origPlugin)!=null&&_origPlugin.skipMerge)){
origPlugin=_getMergedPlugin(c,rnvPlugin,origPlugin,true,true);
}
return origPlugin;
}
(0,_logger.logWarning)("Plugin "+key+" is not recognized plugin in "+plugin+" scope");
return null;
}

if(plugin){
if(plugin.source){var _c$files$rnv$pluginTe6,_c$files$rnv$pluginTe7,_origPlugin2;
origPlugin=(_c$files$rnv$pluginTe6=c.files.rnv.pluginTemplates.configs[plugin.source])==null?void 0:(_c$files$rnv$pluginTe7=_c$files$rnv$pluginTe6.pluginTemplates)==null?void 0:_c$files$rnv$pluginTe7[key];
if(rnvPlugin&&!((_origPlugin2=origPlugin)!=null&&_origPlugin2.skipMerge)){
origPlugin=_getMergedPlugin(c,rnvPlugin,origPlugin,true,true);
}
}else{
origPlugin=rnvPlugin;
}
}


if(origPlugin){
var mergedPlugin=_getMergedPlugin(c,origPlugin,plugin,true,true);
return mergedPlugin;
}

return plugin;
};exports.getMergedPlugin=getMergedPlugin;

var _getMergedPlugin=function _getMergedPlugin(c,obj1,obj2){var _c$buildConfig;
var obj=(0,_fileutils.sanitizeDynamicProps)((0,_fileutils.mergeObjects)(c,obj1,obj2,true,true),(_c$buildConfig=c.buildConfig)==null?void 0:_c$buildConfig._refs);
return(0,_fileutils.sanitizeDynamicProps)(obj,obj.props);
};


var configurePlugins=function configurePlugins(c){return new Promise(function(resolve,reject){
(0,_logger.logTask)('configurePlugins');

if(!c.files.project.package.dependencies){
c.files.project.package.dependencies={};
}

var hasPackageChanged=false;

for(var k in c.buildConfig.plugins){
var dependencies=c.files.project.package.dependencies;
var devDependencies=c.files.project.package.devDependencies;
var plugin=getMergedPlugin(c,k,c.buildConfig.plugins);

if(!plugin){
(0,_logger.logWarning)("Plugin with name "+
_chalk.default.white(k)+" does not exists in ReNative source:rnv scope. you need to define it manually here: "+
_chalk.default.white(c.paths.project.builds.config));
}else if(dependencies&&dependencies[k]){
if(plugin['no-active']!==true&&plugin['no-npm']!==true&&dependencies[k]!==plugin.version){
if(k==='renative'&&c.runtime.isWrapper){
(0,_logger.logWarning)('You\'re in ReNative wrapper mode. plugin renative will stay as local dep!');
}else{
(0,_logger.logWarning)("Version mismatch of dependency "+
_chalk.default.white(k)+" between:\n  "+
_chalk.default.white(c.paths.project.package)+": v("+_chalk.default.red(dependencies[k])+") and\n  "+
_chalk.default.white(c.paths.project.builds.config)+": v("+_chalk.default.green(plugin.version)+").\n  package.json will be overriden");



hasPackageChanged=true;
dependencies[k]=plugin.version;
}
}
}else if(devDependencies&&devDependencies[k]){
if(plugin['no-active']!==true&&plugin['no-npm']!==true&&devDependencies[k]!==plugin.version){
(0,_logger.logWarning)("Version mismatch of devDependency "+
_chalk.default.white(k)+" between package.json: v("+_chalk.default.red(
devDependencies[k])+") and plugins.json: v("+
_chalk.default.red(plugin.version)+"). package.json will be overriden");

hasPackageChanged=true;
devDependencies[k]=plugin.version;
}
}else if(plugin['no-active']!==true&&plugin['no-npm']!==true){

(0,_logger.logWarning)("Missing dependency "+
_chalk.default.white(k)+" v("+_chalk.default.red(
plugin.version)+") in package.json. package.json will be overriden");



hasPackageChanged=true;
dependencies[k]=plugin.version;
}

if(plugin&&plugin.npm){
for(var npmKey in plugin.npm){
var npmDep=plugin.npm[npmKey];
if(dependencies[npmKey]!==npmDep){
(0,_logger.logWarning)("Plugin "+_chalk.default.white(k)+" requires npm dependency "+_chalk.default.white(npmKey)+" .Adding missing npm dependency to you package.json");
dependencies[npmKey]=npmDep;
hasPackageChanged=true;
}
}
}
}

(0,_logger.logTask)("configurePlugins:"+hasPackageChanged,_chalk.default.grey);
(0,_configParser.versionCheck)(c).
then(function(){
if(hasPackageChanged&&!c.runtime.skipPackageUpdate){
(0,_fileutils.writeFileSync)(c.paths.project.package,c.files.project.package);
c._requiresNpmInstall=true;
}
resolve();
}).catch(function(e){return reject(e);});
});};exports.configurePlugins=configurePlugins;

var parsePlugins=function parsePlugins(c,platform,pluginCallback){
(0,_logger.logTask)("parsePlugins:"+platform);
if(c.buildConfig){
var includedPlugins=(0,_common.getConfigProp)(c,platform,'includedPlugins',[]);
var excludedPlugins=(0,_common.getConfigProp)(c,platform,'excludedPlugins',[]);
if(includedPlugins){
var plugins=c.buildConfig.plugins;
if(plugins){
Object.keys(plugins).forEach(function(key){
if((includedPlugins.includes('*')||includedPlugins.includes(key))&&!excludedPlugins.includes(key)){
var plugin=getMergedPlugin(c,key,plugins);
if(plugin){
var pluginPlat=plugin[platform];
if(pluginPlat){
if(plugin['no-active']!==true&&plugin.enabled!==false&&pluginPlat.enabled!==false){
if(plugin.deprecated){
(0,_logger.logWarning)(plugin.deprecated);
}
if(pluginCallback)pluginCallback(plugin,pluginPlat,key);
}else{
(0,_logger.logWarning)("Plugin "+key+" is marked disabled. skipping.");
}
}
}
}
});
}else{
(0,_logger.logError)("You have no plugins defined in "+_chalk.default.white(c.paths.project.builds.config));
}
}else{
(0,_logger.logWarning)("You haven't included any "+_chalk.default.white('{ common: { includedPlugins: [] }}')+" in your "+_chalk.default.white(c.paths.appConfig.config)+". Your app might not work correctly");
}
}
};exports.parsePlugins=parsePlugins;

var getLocalRenativePlugin=function getLocalRenativePlugin(){return{
version:'file:./packages/renative',
webpack:{
modulePaths:[],
moduleAliases:{
renative:{
projectPath:'packages/renative'
}
}
}
};};exports.getLocalRenativePlugin=getLocalRenativePlugin;var _default=



{getMergedPlugin:getMergedPlugin,parsePlugins:parsePlugins,getLocalRenativePlugin:getLocalRenativePlugin};exports.default=_default;
//# sourceMappingURL=index.js.map