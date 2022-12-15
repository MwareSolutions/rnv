var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.rnvConfigHandler=exports.default=exports.CLI_PROPS=void 0;var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));var _toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));var _extends2=_interopRequireDefault(require("@babel/runtime/helpers/extends"));var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _consoleTablePrinter=require("console-table-printer");
var _fs=_interopRequireDefault(require("fs"));
var _chalk=_interopRequireDefault(require("chalk"));
var _semver=_interopRequireDefault(require("semver"));

var _fileutils=require("./systemTools/fileutils");
var _exec=require("./systemTools/exec");
var _logger=require("./systemTools/logger");
var _prompt=require("./systemTools/prompt");
var _constants=require("./constants");

var CLI_PROPS=[
'provisioningStyle',
'codeSignIdentity',
'provisionProfileSpecifier'];exports.CLI_PROPS=CLI_PROPS;var


Config=function(){
function Config(){(0,_classCallCheck2.default)(this,Config);
this.config={};
}(0,_createClass2.default)(Config,[{key:"initializeConfig",value:function initializeConfig(





c){
this.config=c;
return c;
}},{key:"getConfig",value:function getConfig()

{
return this.config;
}},{key:"injectProjectDependency",value:function injectProjectDependency(


























dependency,version,type){var skipInstall,currentPackage,existingPath,_args=arguments;return _regenerator.default.async(function injectProjectDependency$(_context){while(1){switch(_context.prev=_context.next){case 0:skipInstall=_args.length>3&&_args[3]!==undefined?_args[3]:false;
currentPackage=this.config.files.project.package;
existingPath=this.config.paths.project.package;
if(!currentPackage[type])currentPackage[type]={};
currentPackage[type][dependency]=version;
(0,_fileutils.writeFileSync)(existingPath,currentPackage);if(
skipInstall){_context.next=9;break;}_context.next=9;return _regenerator.default.awrap((0,_exec.npmInstall)());case 9:return _context.abrupt("return",
true);case 10:case"end":return _context.stop();}}},null,this);}},{key:"getProjectConfig",value:function getProjectConfig()


{
return this.config.files.project;
}},{key:"checkRequiredPackage",value:function checkRequiredPackage(

pkg){var _projectConfig$packag;var version,type,skipAsking,skipInstall,projectConfig,confirm,resp,latestVersion,currentVersion,_latestVersion,updateAvailable,_confirm,_resp,_args2=arguments;return _regenerator.default.async(function checkRequiredPackage$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:version=_args2.length>1&&_args2[1]!==undefined?_args2[1]:false;type=_args2.length>2?_args2[2]:undefined;skipAsking=_args2.length>3&&_args2[3]!==undefined?_args2[3]:false;skipInstall=_args2.length>4&&_args2[4]!==undefined?_args2[4]:false;if(
pkg){_context2.next=6;break;}return _context2.abrupt("return",false);case 6:
projectConfig=this.getProjectConfig();if((_projectConfig$packag=

projectConfig.package[type])==null?void 0:_projectConfig$packag[pkg]){_context2.next=28;break;}

confirm=skipAsking;if(
confirm){_context2.next=14;break;}_context2.next=12;return _regenerator.default.awrap(
(0,_prompt.inquirerPrompt)({
type:'confirm',
message:"You do not have "+pkg+" installed. Do you want to add it now?"}));case 12:resp=_context2.sent;


confirm=resp.confirm;case 14:if(!


confirm){_context2.next=26;break;}
latestVersion='latest';if(
version){_context2.next=25;break;}_context2.prev=17;_context2.next=20;return _regenerator.default.awrap(

(0,_exec.executeAsync)("npm show "+pkg+" version"));case 20:latestVersion=_context2.sent;_context2.next=25;break;case 23:_context2.prev=23;_context2.t0=_context2["catch"](17);case 25:return _context2.abrupt("return",



this.injectProjectDependency(pkg,version||latestVersion,type,skipInstall));case 26:_context2.next=51;break;case 28:if(

version){_context2.next=51;break;}

currentVersion=projectConfig.package[type][pkg];
_latestVersion=false;_context2.prev=31;_context2.next=34;return _regenerator.default.awrap(

(0,_exec.executeAsync)("npm show "+pkg+" version"));case 34:_latestVersion=_context2.sent;_context2.next=39;break;case 37:_context2.prev=37;_context2.t1=_context2["catch"](31);case 39:if(!


_latestVersion){_context2.next=51;break;}
updateAvailable=false;

try{

updateAvailable=_semver.default.lt(currentVersion,_latestVersion);

}catch(e){}if(!

updateAvailable){_context2.next=51;break;}
_confirm=skipAsking;if(
_confirm){_context2.next=49;break;}_context2.next=47;return _regenerator.default.awrap(
(0,_prompt.inquirerPrompt)({
type:'confirm',
message:"Seems like "+pkg+"@"+currentVersion+" is installed while there is a newer version, "+pkg+"@"+_latestVersion+". Do you want to upgrade?"}));case 47:_resp=_context2.sent;


_confirm=_resp.confirm;case 49:if(!


_confirm){_context2.next=51;break;}return _context2.abrupt("return",
this.injectProjectDependency(pkg,_latestVersion,type,skipInstall));case 51:return _context2.abrupt("return",





false);case 52:case"end":return _context2.stop();}}},null,this,[[17,23],[31,37]]);}},{key:"injectPlatformDependencies",value:function injectPlatformDependencies(


platform){var _this$config$files,_this$config$files$rn,_this$config$files$rn2,_this$config$files$rn3,_this$config$files$rn4,_this$config$files$rn5,_this=this;var npmDeps,promises,installed;return _regenerator.default.async(function injectPlatformDependencies$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:
npmDeps=(_this$config$files=this.config.files)==null?void 0:(_this$config$files$rn=_this$config$files.rnv)==null?void 0:(_this$config$files$rn2=_this$config$files$rn.platformTemplates)==null?void 0:(_this$config$files$rn3=_this$config$files$rn2.config)==null?void 0:(_this$config$files$rn4=_this$config$files$rn3.platforms)==null?void 0:(_this$config$files$rn5=_this$config$files$rn4[platform])==null?void 0:_this$config$files$rn5.npm;if(!

npmDeps){_context3.next=9;break;}
promises=Object.keys(npmDeps).reduce(function(acc,type){
Object.keys(npmDeps[type]).forEach(function(dep){
acc.push(_this.checkRequiredPackage(dep,npmDeps[type][dep],type,true,true));
});
return acc;
},[]);_context3.next=5;return _regenerator.default.awrap(

Promise.all(promises));case 5:installed=_context3.sent;if(!

installed.some(function(i){return i===true;})){_context3.next=9;break;}_context3.next=9;return _regenerator.default.awrap(
(0,_exec.npmInstall)());case 9:case"end":return _context3.stop();}}},null,this);}},{key:"getConfigValueSeparate",value:function getConfigValueSeparate(























key){var global=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;var
paths=this.config.paths;

if(!global&&!_fs.default.existsSync(paths.project.config))return'N/A';
var cfg=global?require(paths.GLOBAL_RNV_CONFIG):require(paths.project.config);

var value=cfg[_constants.configSchema[key].key];
if(value===undefined)return'N/A';

return value;
}},{key:"getMergedConfigValue",value:function getMergedConfigValue(

key){var _this$config$buildCon;
var value=(_this$config$buildCon=this.config.buildConfig)==null?void 0:_this$config$buildCon[_constants.configSchema[key].key];
if(value===undefined&&_constants.configSchema[key].default)value=_constants.configSchema[key].default;
return value;
}},{key:"listConfigValue",value:function listConfigValue(

key){
var localVal=this.getConfigValueSeparate(key).toString();
var globalVal=this.getConfigValueSeparate(key,true).toString();

if(globalVal==='N/A'&&_constants.configSchema[key].default)globalVal=_constants.configSchema[key].default;
if(localVal==='N/A')localVal=globalVal;

var table=[{
Key:key,
'Global Value':globalVal}];



if(localVal!=='N/A'){
table[0]['Project Value']=localVal;
}

return table;
}},{key:"isConfigValueValid",value:function isConfigValueValid(

key,value){
var keySchema=_constants.configSchema[key];
if(!keySchema){
(0,_logger.logWarning)("Unknown config param "+key);
return false;
}

if(keySchema.values&&!keySchema.values.includes(value)){
(0,_logger.logWarning)("Unsupported value provided for "+key+". Correct values are "+keySchema.values.join(', '));
return false;
}

return true;
}},{key:"setConfigValue",value:function setConfigValue(

key,value){var _this$config=
this.config,global=_this$config.program.global,paths=_this$config.paths;

if(this.isConfigValueValid(key,value)){
var configPath=global?paths.GLOBAL_RNV_CONFIG:paths.project.config;
var config=require(configPath);

if(['true','false'].includes(value))value=value==='true';

config[_constants.configSchema[key].key]=value;
(0,_fileutils.writeFileSync)(configPath,config);
return true;
}
return false;
}},{key:"getValueOrMergedObject",value:function getValueOrMergedObject(

resultCli,resultScheme,resultPlatforms,resultCommon){
if(resultCli!==undefined){
return resultCli;
}
if(resultScheme!==undefined){
if(Array.isArray(resultScheme)||typeof resultScheme!=='object')return resultScheme;
var val=(0,_extends2.default)(resultCommon||{},resultPlatforms||{},resultScheme);
return val;
}
if(resultPlatforms!==undefined){
if(Array.isArray(resultPlatforms)||typeof resultPlatforms!=='object')return resultPlatforms;
return(0,_extends2.default)(resultCommon||{},resultPlatforms);
}
if(resultPlatforms===null)return null;
return resultCommon;
}},{key:"getConfigProp",value:function getConfigProp(


c,platform,key,defaultVal){var _c$buildConfig$common;
if(!c.buildConfig){
(0,_logger.logError)('getConfigProp: c.buildConfig is undefined!');
return null;
}
var p=c.buildConfig.platforms[platform];
var ps=c.runtime.scheme;
var resultPlatforms;
var scheme;
if(p){
scheme=p.buildSchemes?p.buildSchemes[ps]:undefined;
resultPlatforms=c.buildConfig.platforms[platform][key];
}

scheme=scheme||{};
var resultCli=CLI_PROPS.includes(key)?c.program[key]:undefined;
var resultScheme=scheme[key];
var resultCommon=(_c$buildConfig$common=c.buildConfig.common)==null?void 0:_c$buildConfig$common[key];

var result=this.getValueOrMergedObject(resultCli,resultScheme,resultPlatforms,resultCommon);

if(result===undefined)result=defaultVal;
(0,_logger.logTask)("getConfigProp:"+platform+":"+key+":"+result,_chalk.default.grey);
return result;
}},{key:"command",get:function get(){return this.config.command;}},{key:"subCommand",get:function get(){return this.config.subCommand;}},{key:"rnvArguments",get:function get(){var _missingArg;var _this$config$program=this.config.program,args=_this$config$program.args,rawArgs=_this$config$program.rawArgs;var argsCopy=(0,_toConsumableArray2.default)(args);var missingArg=rawArgs[rawArgs.indexOf(argsCopy[1])+1];if(((_missingArg=missingArg)==null?void 0:_missingArg[0])==='-'){if(rawArgs[rawArgs.indexOf(argsCopy[1])+2]){missingArg=rawArgs[rawArgs.indexOf(argsCopy[1])+2];}else{missingArg=undefined;}}if(rawArgs.length===3)missingArg=undefined;argsCopy[2]=missingArg;return argsCopy.filter(function(arg){return!!arg;});}},{key:"platform",get:function get(){return this.config.platform;}},{key:"isRenativeProject",get:function get(){var _this$config2,_this$config2$paths,_this$config2$paths$p;return((_this$config2=this.config)==null?void 0:(_this$config2$paths=_this$config2.paths)==null?void 0:(_this$config2$paths$p=_this$config2$paths.project)==null?void 0:_this$config2$paths$p.configExists)||false;}},{key:"program",get:function get(){return this.config.program;}},{key:"paths",get:function get(){return this.config.paths;}},{key:"isWebHostEnabled",get:function get()

{var
hosted=this.config.program.hosted;

var bundleAssets=this.getConfigProp(this.config,this.platform,'bundleAssets');
return(hosted||!bundleAssets)&&_constants.WEB_HOSTED_PLATFORMS.includes(this.platform);
}},{key:"isAnalyticsEnabled",get:function get()

{
return this.getMergedConfigValue('analytics');
}},{key:"projectPath",get:function get()

{
return this.config.paths.project.dir;
}}]);return Config;}();












































var Conf=new Config();

var rnvConfigHandler=function rnvConfigHandler(){var _Conf$rnvArguments=(0,_slicedToArray2.default)(
Conf.rnvArguments,3),key=_Conf$rnvArguments[1],value=_Conf$rnvArguments[2];
if(key==='list'){var _ref;
var rows=[];
Object.keys(_constants.configSchema).forEach(function(k){return rows.push(Conf.listConfigValue(k));});

(0,_consoleTablePrinter.printTable)((_ref=[]).concat.apply(_ref,rows));
return true;
}


if(!key){
(0,_logger.logWarning)('Please specify a config');
return true;
}
if(!_constants.configSchema[key]){
(0,_logger.logWarning)("Unknown config "+key);
return true;
}

if(!value){

(0,_consoleTablePrinter.printTable)(Conf.listConfigValue(key));
}else if(Conf.setConfigValue(key,value))(0,_consoleTablePrinter.printTable)(Conf.listConfigValue(key));

return true;
};exports.rnvConfigHandler=rnvConfigHandler;var _default=

Conf;exports.default=_default;
//# sourceMappingURL=config.js.map