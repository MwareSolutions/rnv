var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.versionCheck=exports.updateConfig=exports.setAppConfig=exports.parseRenativeConfigs=exports.loadProjectTemplates=exports.loadPluginTemplates=exports.loadPlatformTemplates=exports.loadFile=exports.listAppConfigsFoldersSync=exports.generateRuntimeConfig=exports.generateLocalConfig=exports.generateBuildConfig=exports.fixRenativeConfigsSync=exports.createRnvConfig=exports.configureRnvGlobal=exports.checkIsRenativeProject=void 0;var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));var _toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _chalk=_interopRequireDefault(require("chalk"));
var _deepmerge=_interopRequireDefault(require("deepmerge"));
var _util=require("util");
var _inquirer=_interopRequireDefault(require("inquirer"));
var _constants=require("../constants");
















var _fileutils=require("../systemTools/fileutils");




var _common=require("../common");
var _workspace=require("../projectTools/workspace");
var _logger=require("../systemTools/logger");



var _projectParser=require("../projectTools/projectParser");



var _prompt=require("../systemTools/prompt");
var _config=_interopRequireDefault(require("../config"));function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;})),keys.push.apply(keys,symbols);}return keys;}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach(function(key){(0,_defineProperty2.default)(target,key,source[key]);}):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}return target;}

var base=_path.default.resolve('.');
var homedir=require('os').homedir();

var readdirAsync=(0,_util.promisify)(_fs.default.readdir);

var IGNORE_FOLDERS=['.git'];


var loadAppConfigIDfromDir=function loadAppConfigIDfromDir(dir,appConfigsDir){
(0,_logger.logTask)("loadAppConfigIDfromDir:"+dir+":"+appConfigsDir,_chalk.default.grey);
var filePath=_path.default.join(appConfigsDir,dir,'renative.json');
if(_fs.default.existsSync(filePath)){
try{
var renativeConf=JSON.parse(_fs.default.readFileSync(filePath));
return{dir:dir,id:renativeConf.id};
}catch(e){
(0,_logger.logError)("File "+filePath+" is MALFORMED:\n"+e);
}
}
return{dir:dir,id:null};
};

var askUserAboutConfigs=function askUserAboutConfigs(c,dir,id,basePath){var _await$inquirer$promp,choice,filePath,fileContents;return _regenerator.default.async(function askUserAboutConfigs$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logWarning)("AppConfig error - It seems you have a mismatch between appConfig folder name ("+dir+") and the id defined in renative.json ("+id+"). They must match.");if(!(
c.program.ci===true)){_context.next=3;break;}throw new Error('You cannot continue if you set --ci flag. please fix above error first');case 3:_context.next=5;return _regenerator.default.awrap(
_inquirer.default.prompt({
type:'list',
name:'choice',
message:'You must choose what you want to keep',
choices:[{
name:"Keep ID from renative.json ("+id+") and rename the folder ("+dir+" -> "+id+")",
value:'keepID'},
{
name:"Keep folder name ("+dir+") and rename the ID from renative.json ("+id+" -> "+dir+")",
value:'keepFolder'},
new _inquirer.default.Separator(),{
name:'I\'ll do it manually',
value:'manually'}]}));case 5:_await$inquirer$promp=_context.sent;choice=_await$inquirer$promp.choice;if(!(



choice==='manually')){_context.next=9;break;}throw new Error('Please do the changes and rerun the command');case 9:

if(choice==='keepID'){
_fs.default.renameSync(_path.default.join(basePath,dir),_path.default.join(basePath,id));
}

if(choice==='keepFolder'){
filePath=_path.default.join(basePath,dir,'renative.json');
fileContents=JSON.parse(_fs.default.readFileSync(filePath));
fileContents.id=dir;

(0,_fileutils.writeFileSync)(filePath,fileContents);
}case 11:case"end":return _context.stop();}}},null,null,null,Promise);};


var matchAppConfigID=function matchAppConfigID(c,appConfigID){var _c$buildConfig,_c$buildConfig$paths,_c$paths$project;var appConfigsDirs,_loop,i,_ret;return _regenerator.default.async(function matchAppConfigID$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:
(0,_logger.logTask)("matchAppConfigID:"+appConfigID,_chalk.default.grey);if(

appConfigID){_context4.next=3;break;}return _context4.abrupt("return",false);case 3:

appConfigsDirs=((_c$buildConfig=c.buildConfig)==null?void 0:(_c$buildConfig$paths=_c$buildConfig.paths)==null?void 0:_c$buildConfig$paths.appConfigsDirs)||[(_c$paths$project=c.paths.project)==null?void 0:_c$paths$project.appConfigsDir];_loop=function _loop(
i){var appConfigsDir,appConfigDirContents,appConfigs,ids,dirs,foundConfig;return _regenerator.default.async(function _loop$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:
appConfigsDir=appConfigsDirs[i];_context3.t0=_regenerator.default;_context3.next=4;return _regenerator.default.awrap(

readdirAsync(appConfigsDir));case 4:_context3.t1=_context3.sent.filter(function(folder){return _fs.default.statSync(_path.default.join(appConfigsDir,folder)).isDirectory();});_context3.next=7;return _context3.t0.awrap.call(_context3.t0,_context3.t1);case 7:appConfigDirContents=_context3.sent;

appConfigs=appConfigDirContents.map(function(dir){return loadAppConfigIDfromDir(dir,appConfigsDir);}).filter(function(conf){return conf.id!==null;});

ids=[];
dirs=[];_context3.next=13;return _regenerator.default.awrap(
Promise.all(appConfigs.map(function _callee(conf){var id,dir;return _regenerator.default.async(function _callee$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
id=conf.id.toLowerCase();
dir=conf.dir.toLowerCase();if(!(

id!==dir)){_context2.next=5;break;}_context2.next=5;return _regenerator.default.awrap(askUserAboutConfigs(c,conf.dir,conf.id,appConfigsDir));case 5:if(!
ids.includes(id)){_context2.next=7;break;}throw new Error("AppConfig error - You have 2 duplicate app configs with ID "+id+". Keep in mind that ID is case insensitive. Please edit one of them in /appConfigs/<folder>/renative.json");case 7:
ids.push(id);if(!
dirs.includes(dir)){_context2.next=10;break;}throw new Error("AppConfig error - You have 2 duplicate app config folders named "+dir+". Keep in mind that folder names are case insensitive. Please rename one /appConfigs/<folder>");case 10:
dirs.push(dir);case 11:case"end":return _context2.stop();}}},null,null,null,Promise);})));case 13:


foundConfig=appConfigs.filter(function(cfg){return cfg.id===appConfigID||cfg.id.toLowerCase()===appConfigID||cfg.dir===appConfigID||cfg.dir.toLowerCase()===appConfigID;});if(!
foundConfig.length){_context3.next=16;break;}return _context3.abrupt("return",{v:foundConfig[0].id.toLowerCase()});case 16:case"end":return _context3.stop();}}},null,null,null,Promise);};i=0;case 6:if(!(i<appConfigsDirs.length)){_context4.next=15;break;}_context4.next=9;return _regenerator.default.awrap(_loop(i));case 9:_ret=_context4.sent;if(!(typeof _ret==="object")){_context4.next=12;break;}return _context4.abrupt("return",_ret.v);case 12:i++;_context4.next=6;break;case 15:return _context4.abrupt("return",

false);case 16:case"end":return _context4.stop();}}},null,null,null,Promise);};


var checkIsRenativeProject=function checkIsRenativeProject(c){return new Promise(function(resolve,reject){
if(!c.paths.project.configExists){
return reject("Looks like this directory is not ReNative project. Project config "+
_chalk.default.white(
c.paths.project.config)+" is missing!. You can create new project with "+
_chalk.default.white('rnv new'));

}

return resolve();
});};exports.checkIsRenativeProject=checkIsRenativeProject;

var fixRenativeConfigsSync=function fixRenativeConfigsSync(c){return _regenerator.default.async(function fixRenativeConfigsSync$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:
(0,_logger.logTask)('fixRenativeConfigsSync');





(0,_projectParser.checkAndCreateGitignore)(c);


(0,_logger.logTask)('configureProject:check rn-cli',_chalk.default.grey);
if(!_fs.default.existsSync(c.paths.project.rnCliConfig)){
(0,_logger.logInfo)("Looks like your rn-cli config file "+
_chalk.default.white(c.paths.project.rnCliConfig)+" is missing! Let's create one for you.");

(0,_fileutils.copyFileSync)(_path.default.join(c.paths.rnv.projectTemplate.dir,_constants.RN_CLI_CONFIG_NAME),c.paths.project.rnCliConfig);
}


(0,_logger.logTask)('configureProject:check babel config',_chalk.default.grey);
if(!_fs.default.existsSync(c.paths.project.babelConfig)){
(0,_logger.logInfo)("Looks like your babel config file "+
_chalk.default.white(c.paths.project.babelConfig)+" is missing! Let's create one for you.");

(0,_fileutils.copyFileSync)(_path.default.join(c.paths.rnv.dir,_constants.RN_BABEL_CONFIG_NAME),c.paths.project.babelConfig);
}return _context5.abrupt("return",

true);case 7:case"end":return _context5.stop();}}},null,null,null,Promise);};exports.fixRenativeConfigsSync=fixRenativeConfigsSync;


var _generateConfigPaths=function _generateConfigPaths(pathObj,dir){
pathObj.dir=dir;
pathObj.config=_path.default.join(dir,_constants.RENATIVE_CONFIG_NAME);
pathObj.configLocal=_path.default.join(dir,_constants.RENATIVE_CONFIG_LOCAL_NAME);
pathObj.configPrivate=_path.default.join(dir,_constants.RENATIVE_CONFIG_PRIVATE_NAME);
};

var versionCheck=function versionCheck(c){var _c$files$rnv,_c$files$rnv$package,_c$files$project,_c$files$project$pack,_c$files$project$pack2;var recCmd,actionNoUpdate,actionWithUpdate,actionUpgrade,_await$inquirerPrompt,chosenAction;return _regenerator.default.async(function versionCheck$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:
(0,_logger.logTask)('versionCheck');if(!(

c.runtime.isWrapper||c.runtime.versionCheckCompleted)){_context6.next=3;break;}return _context6.abrupt("return",
true);case 3:

c.runtime.rnvVersionRunner=(_c$files$rnv=c.files.rnv)==null?void 0:(_c$files$rnv$package=_c$files$rnv.package)==null?void 0:_c$files$rnv$package.version;
c.runtime.rnvVersionProject=(_c$files$project=c.files.project)==null?void 0:(_c$files$project$pack=_c$files$project.package)==null?void 0:(_c$files$project$pack2=_c$files$project$pack.devDependencies)==null?void 0:_c$files$project$pack2.rnv;
(0,_logger.logTask)("versionCheck:rnvRunner:"+c.runtime.rnvVersionRunner+",rnvProject:"+c.runtime.rnvVersionProject,_chalk.default.grey);if(!(
c.runtime.rnvVersionRunner&&c.runtime.rnvVersionProject)){_context6.next=19;break;}if(!(
c.runtime.rnvVersionRunner!==c.runtime.rnvVersionProject)){_context6.next=19;break;}
recCmd=_chalk.default.white("$ npx "+(0,_logger.getCurrentCommand)(true));
actionNoUpdate='Continue and skip updating package.json';
actionWithUpdate='Continue and update package.json';
actionUpgrade="Upgrade project to "+c.runtime.rnvVersionRunner;_context6.next=14;return _regenerator.default.awrap(

(0,_prompt.inquirerPrompt)({
message:'What to do next?',
type:'list',
name:'chosenAction',
choices:[
actionNoUpdate,
actionWithUpdate,
actionUpgrade],

warningMessage:"You are running $rnv v"+_chalk.default.red(c.runtime.rnvVersionRunner)+" against project built with rnv v"+_chalk.default.red(c.runtime.rnvVersionProject)+". This might result in unexpected behaviour! It is recommended that you run your rnv command with npx prefix: "+recCmd+" . or manually update your devDependencies.rnv version in your package.json."}));case 14:_await$inquirerPrompt=_context6.sent;chosenAction=_await$inquirerPrompt.chosenAction;


c.runtime.versionCheckCompleted=true;

c.runtime.skipPackageUpdate=chosenAction===actionNoUpdate;

if(chosenAction===actionUpgrade){
(0,_projectParser.upgradeProjectDependencies)(c,c.runtime.rnvVersionRunner);
}case 19:return _context6.abrupt("return",


true);case 20:case"end":return _context6.stop();}}},null,null,null,Promise);};exports.versionCheck=versionCheck;


var loadFile=function loadFile(fileObj,pathObj,key){
if(!_fs.default.existsSync(pathObj[key])){
pathObj[key+"Exists"]=false;
(0,_logger.logDebug)("WARNING: loadFile: Path "+pathObj[key]+" does not exists!");
return false;
}
pathObj[key+"Exists"]=true;
try{
fileObj[key]=JSON.parse(_fs.default.readFileSync(pathObj[key]).toString());
pathObj[key+"Exists"]=true;
return true;
}catch(e){
(0,_logger.logError)("loadFile: "+pathObj[key]+" :: "+e,true);
return false;
}
};exports.loadFile=loadFile;


var _findAndSwitchAppConfigDir=function _findAndSwitchAppConfigDir(c,appId){var _c$buildConfig$paths2,_c$buildConfig$paths3;
(0,_logger.logTask)("_findAndSwitchAppConfigDir:"+appId);

c.paths.project.appConfigsDir=(0,_fileutils.getRealPath)(c,(_c$buildConfig$paths2=c.buildConfig.paths)==null?void 0:_c$buildConfig$paths2.appConfigsDir,'appConfigsDir',c.paths.project.appConfigsDir);
var appConfigsDirs=(_c$buildConfig$paths3=c.buildConfig.paths)==null?void 0:_c$buildConfig$paths3.appConfigsDirs;
if(appConfigsDirs&&appConfigsDirs.forEach&&appId){
appConfigsDirs.forEach(function(v){
var altPath=_path.default.join(v,appId);
if(_fs.default.existsSync(altPath)){
(0,_logger.logInfo)("Found config in following location: "+altPath+". Will use it");
c.paths.project.appConfigsDir=v;
}
});
}
};

var _arrayMergeOverride=function _arrayMergeOverride(destinationArray,sourceArray){return sourceArray;};

var generateBuildConfig=function generateBuildConfig(c){
(0,_logger.logTask)('generateBuildConfig');

var mergeOrder=[
c.paths.rnv.projectTemplates.config,
c.paths.rnv.pluginTemplates.config,
c.files.rnv.platformTemplates.config,
c.paths.workspace.config,
c.paths.workspace.configPrivate,
c.paths.workspace.configLocal,
c.paths.workspace.project.config,
c.paths.workspace.project.configPrivate,
c.paths.workspace.project.configLocal,
c.paths.workspace.appConfig.configBase,
c.paths.workspace.appConfig.config,
c.paths.workspace.appConfig.configPrivate,
c.paths.workspace.appConfig.configLocal,
c.paths.project.config,
c.paths.project.configPrivate,
c.paths.project.configLocal,
c.paths.appConfig.configBase,
c.paths.appConfig.config,
c.paths.appConfig.configPrivate,
c.paths.appConfig.configLocal];

var cleanPaths=mergeOrder.filter(function(v){return v;});
var existsPaths=cleanPaths.filter(function(v){
var exists=_fs.default.existsSync(v);
if(exists){
(0,_logger.logDebug)("Merged: "+v);

}else{

}
return exists;
});

var pluginTemplates=[];
if(c.files.rnv.pluginTemplates.configs){
pluginTemplates=Object.keys(c.files.rnv.pluginTemplates.configs).map(function(v){return c.files.rnv.pluginTemplates.configs[v];});
}

var mergeFiles=[
c.files.rnv.projectTemplates.config].concat((0,_toConsumableArray2.default)(
pluginTemplates),[
c.files.workspace.config,
c.files.workspace.configPrivate,
c.files.workspace.configLocal,
c.files.workspace.project.config,
c.files.workspace.project.configPrivate,
c.files.workspace.project.configLocal,
c.files.workspace.appConfig.configBase,
c.files.workspace.appConfig.config,
c.files.workspace.appConfig.configPrivate,
c.files.workspace.appConfig.configLocal,
c.files.project.config,
c.files.project.configPrivate,
c.files.project.configLocal,
c.files.appConfig.configBase,
c.files.appConfig.config,
c.files.appConfig.configPrivate,
c.files.appConfig.configLocal]);


var mergeFolders=[

c.paths.rnv.platformTemplate.dir,
c.paths.project.projectConfig.buildsDir,
c.paths.workspace.project.projectConfig.buildsDir,

c.paths.appConfig.buildsDir,
c.paths.workspace.appConfig.buildsDir];








(0,_logger.logDebug)('mergeFolders:',mergeFolders);

var meta=[{
_meta:{
generated:new Date().getTime(),
mergedConfigs:existsPaths}}];


var existsFiles=mergeFiles.filter(function(v){return v;});

(0,_logger.logTask)("generateBuildConfig:"+mergeOrder.length+":"+cleanPaths.length+":"+existsPaths.length+":"+existsFiles.length,_chalk.default.grey);

var out=_deepmerge.default.all([].concat(meta,(0,_toConsumableArray2.default)(existsFiles)),{arrayMerge:_arrayMergeOverride});
out=(0,_deepmerge.default)({},out);

(0,_logger.logDebug)("generateBuildConfig: will sanitize file at: "+c.paths.project.builds.config);
c.buildConfig=(0,_fileutils.sanitizeDynamicRefs)(c,out);
c.buildConfig=(0,_fileutils.sanitizeDynamicProps)(c.buildConfig,c.buildConfig._refs);

if(_fs.default.existsSync(c.paths.project.builds.dir)){
(0,_fileutils.writeFileSync)(c.paths.project.builds.config,c.buildConfig);
}
if(_config.default.isRenativeProject){
var localMetroPath=_path.default.join(c.paths.project.dir,'metro.config.local.js');

if(c.platform){
_fs.default.writeFileSync(localMetroPath,"module.exports = "+(0,_common.getSourceExtsAsString)(c));
}else if(!_fs.default.existsSync(localMetroPath)){
_fs.default.writeFileSync(localMetroPath,'module.exports = []');
}
}
};exports.generateBuildConfig=generateBuildConfig;

var _loadConfigFiles=function _loadConfigFiles(c,fileObj,pathObj,extendDir){
var result=false;
var extendAppId;
if(loadFile(fileObj,pathObj,'config')){
extendAppId=fileObj.config.extend||extendAppId;
result=true;
}

if(loadFile(fileObj,pathObj,'configLocal')){
extendAppId=fileObj.configLocal.extend||extendAppId;
result=true;
}

if(loadFile(fileObj,pathObj,'configPrivate')){
extendAppId=fileObj.configPrivate.extend||extendAppId;
result=true;
}

if(extendAppId&&extendDir){
pathObj.configBase=_path.default.join(extendDir,extendAppId,'renative.json');
pathObj.dirs=[
_path.default.join(extendDir,extendAppId),
pathObj.dir];

pathObj.fontDirs=[
_path.default.join(pathObj.dirs[0],'fonts'),
_path.default.join(pathObj.dirs[1],'fonts')];

loadFile(fileObj,pathObj,'configBase');
}


generateBuildConfig(c);
return result;
};

var generateRuntimeConfig=function generateRuntimeConfig(c){var _c$buildConfig$common,_c$buildConfig$platfo,_c$buildConfig$platfo2;return _regenerator.default.async(function generateRuntimeConfig$(_context7){while(1){switch(_context7.prev=_context7.next){case 0:
(0,_logger.logTask)('generateRuntimeConfig');




c.assetConfig=(0,_fileutils.mergeObjects)(c,c.assetConfig,c.buildConfig.runtime||{});
c.assetConfig=(0,_fileutils.mergeObjects)(c,c.assetConfig,((_c$buildConfig$common=c.buildConfig.common)==null?void 0:_c$buildConfig$common.runtime)||{});
c.assetConfig=(0,_fileutils.mergeObjects)(c,c.assetConfig,((_c$buildConfig$platfo=c.buildConfig.platforms)==null?void 0:(_c$buildConfig$platfo2=_c$buildConfig$platfo[c.platform])==null?void 0:_c$buildConfig$platfo2.runtime)||{});
c.assetConfig=(0,_fileutils.mergeObjects)(c,c.assetConfig,(0,_common.getConfigProp)(c,c.platform,'runtime')||{});

if(_fs.default.existsSync(c.paths.project.assets.dir)){
(0,_fileutils.writeFileSync)(c.paths.project.assets.config,c.assetConfig);
}return _context7.abrupt("return",
true);case 7:case"end":return _context7.stop();}}},null,null,null,Promise);};exports.generateRuntimeConfig=generateRuntimeConfig;


var generateLocalConfig=function generateLocalConfig(c,resetAppId){
(0,_logger.logTask)("generateLocalConfig:"+resetAppId+":"+c.paths.project.configLocal);
var configLocal=c.files.project.configLocal||{};
configLocal._meta=configLocal._meta||{};
if(resetAppId){
delete configLocal._meta.currentAppConfigId;
}else{
configLocal._meta.currentAppConfigId=c.runtime.appId;
}
c.files.project.configLocal=configLocal;
(0,_fileutils.writeFileSync)(c.paths.project.configLocal,configLocal);
};exports.generateLocalConfig=generateLocalConfig;

var _generatePlatformTemplatePaths=function _generatePlatformTemplatePaths(c){
var pt=c.buildConfig.platformTemplatesDirs||{};
var originalPath=c.buildConfig.platformTemplatesDir||'$RNV_HOME/platformTemplates';
var result={};
_constants.SUPPORTED_PLATFORMS.forEach(function(v){
if(!pt[v]){
result[v]=(0,_fileutils.getRealPath)(
c,
originalPath,
'platformTemplatesDir',
originalPath);

}else{
result[v]=(0,_fileutils.getRealPath)(
c,
pt[v],
'platformTemplatesDir',
originalPath);

}
});
return result;
};

var _listAppConfigsFoldersSync=function _listAppConfigsFoldersSync(dirPath,configDirs,ignoreHiddenConfigs){
(0,_logger.logTask)("_listAppConfigsFoldersSync:"+dirPath,_chalk.default.grey);
if(!_fs.default.existsSync(dirPath))return;
_fs.default.readdirSync(dirPath).forEach(function(dir){
var appConfigDir=_path.default.join(dirPath,dir);
if(!IGNORE_FOLDERS.includes(dir)&&_fs.default.lstatSync(appConfigDir).isDirectory()){
if(ignoreHiddenConfigs){
var appConfig=_path.default.join(appConfigDir,_constants.RENATIVE_CONFIG_NAME);
if(_fs.default.existsSync(appConfig)){
try{
var config=(0,_fileutils.readObjectSync)(appConfig);
if((config==null?void 0:config.hidden)!==true){
configDirs.push(dir);
}
}catch(e){
(0,_logger.logWarning)("_listAppConfigsFoldersSync: "+e);
}
}
}else{
configDirs.push(dir);
}
}
});
};

var listAppConfigsFoldersSync=function listAppConfigsFoldersSync(c,ignoreHiddenConfigs){var _c$buildConfig2,_c$buildConfig2$paths;
(0,_logger.logTask)("listAppConfigsFoldersSync:"+ignoreHiddenConfigs);
var configDirs=[];
var appConfigsDirs=(_c$buildConfig2=c.buildConfig)==null?void 0:(_c$buildConfig2$paths=_c$buildConfig2.paths)==null?void 0:_c$buildConfig2$paths.appConfigsDirs;
if(appConfigsDirs&&appConfigsDirs.forEach){
appConfigsDirs.forEach(function(v){
_listAppConfigsFoldersSync(v,configDirs,ignoreHiddenConfigs);
});
}else{
_listAppConfigsFoldersSync(c.paths.project.appConfigsDir,configDirs,ignoreHiddenConfigs);
}

return configDirs;
};exports.listAppConfigsFoldersSync=listAppConfigsFoldersSync;

var loadProjectTemplates=function loadProjectTemplates(c){
c.files.rnv.projectTemplates.config=(0,_fileutils.readObjectSync)(c.paths.rnv.projectTemplates.config);
};exports.loadProjectTemplates=loadProjectTemplates;

var loadPluginTemplates=function loadPluginTemplates(c){var _c$files$project$conf,_c$files$project$conf2;
c.files.rnv.pluginTemplates.config=(0,_fileutils.readObjectSync)(c.paths.rnv.pluginTemplates.config);

c.files.rnv.pluginTemplates.configs={
rnv:c.files.rnv.pluginTemplates.config};


c.paths.rnv.pluginTemplates.dirs=[c.paths.rnv.pluginTemplates.dir];

var customPluginTemplates=(_c$files$project$conf=c.files.project.config)==null?void 0:(_c$files$project$conf2=_c$files$project$conf.paths)==null?void 0:_c$files$project$conf2.pluginTemplates;

if(customPluginTemplates){
Object.keys(customPluginTemplates).forEach(function(k){
var val=customPluginTemplates[k];
if(val.npm){var _c$files$project$pack3,_c$files$project$pack4;
var npmDep=((_c$files$project$pack3=c.files.project.package)==null?void 0:_c$files$project$pack3.dependencies[val.npm])||((_c$files$project$pack4=c.files.project.package)==null?void 0:_c$files$project$pack4.devDependencies[val.npm]);

if(npmDep){
var ptPath;
if(npmDep.startsWith('file:')){
ptPath=_path.default.join(c.paths.project.dir,npmDep.replace('file:',''),val.path||'');
}else{
ptPath=_path.default.join(c.paths.project.nodeModulesDir,val.npm,val.path||'');
}

var ptConfig=_path.default.join(ptPath,_constants.RENATIVE_CONFIG_PLUGINS_NAME);
c.paths.rnv.pluginTemplates.dirs.push(ptPath);
if(_fs.default.existsSync(ptConfig)){
c.files.rnv.pluginTemplates.configs[k]=(0,_fileutils.readObjectSync)(ptConfig);
}
}
}
});
}
};exports.loadPluginTemplates=loadPluginTemplates;

var loadPlatformTemplates=function loadPlatformTemplates(c){
c.files.rnv.platformTemplates.config=(0,_fileutils.readObjectSync)(c.paths.rnv.platformTemplates.config);
};exports.loadPlatformTemplates=loadPlatformTemplates;

var _loadWorkspacesSync=function _loadWorkspacesSync(c){

if(_fs.default.existsSync(c.paths.rnv.configWorkspaces)){var _c$files$rnv$configWo;
(0,_logger.logDebug)(c.paths.rnv.configWorkspaces+" file exists!");
c.files.rnv.configWorkspaces=(0,_fileutils.readObjectSync)(c.paths.rnv.configWorkspaces);

if(!c.files.rnv.configWorkspaces)c.files.rnv.configWorkspaces={};

if(!((_c$files$rnv$configWo=c.files.rnv.configWorkspaces)!=null&&_c$files$rnv$configWo.workspaces))c.files.rnv.configWorkspaces.workspaces={};
if(Object.keys(c.files.rnv.configWorkspaces.workspaces).length===0){
(0,_logger.logWarning)("No workspace found in "+c.paths.rnv.configWorkspaces+". Creating default rnv one for you");
c.files.rnv.configWorkspaces.workspaces={
rnv:{
path:c.paths.workspace.dir}};


(0,_fileutils.writeFileSync)(c.paths.rnv.configWorkspaces,c.files.rnv.configWorkspaces);
}
}else{
(0,_logger.logWarning)("Cannot find "+c.paths.rnv.configWorkspaces+". creating one..");
c.files.rnv.configWorkspaces={
workspaces:{
rnv:{
path:c.paths.workspace.dir}}};



(0,_fileutils.writeFileSync)(c.paths.rnv.configWorkspaces,c.files.rnv.configWorkspaces);
}
};

var setAppConfig=function setAppConfig(c,appId){var workspaceAppConfigsDir;return _regenerator.default.async(function setAppConfig$(_context8){while(1){switch(_context8.prev=_context8.next){case 0:
(0,_logger.logTask)("setAppConfig:"+appId);if(!(

!appId||appId===true||appId===true)){_context8.next=3;break;}return _context8.abrupt("return");case 3:

c.runtime.appId=appId;
c.runtime.appDir=_path.default.join(c.paths.project.builds.dir,c.runtime.appId+"_"+c.platform);

_findAndSwitchAppConfigDir(c,appId);

_generateConfigPaths(c.paths.appConfig,_path.default.join(c.paths.project.appConfigsDir,appId));
c.paths.appConfig.fontsDir=_path.default.join(c.paths.appConfig.dir,'fonts');
_loadConfigFiles(c,c.files.appConfig,c.paths.appConfig,c.paths.project.appConfigsDir);

workspaceAppConfigsDir=(0,_fileutils.getRealPath)(c,c.buildConfig.workspaceAppConfigsDir);
c.paths.workspace.project.appConfigsDir=workspaceAppConfigsDir||_path.default.join(c.paths.workspace.project.dir,'appConfigs');

_generateConfigPaths(c.paths.workspace.appConfig,_path.default.join(c.paths.workspace.project.appConfigsDir,appId));

_loadConfigFiles(c,c.files.workspace.appConfig,c.paths.workspace.appConfig,c.paths.workspace.project.appConfigsDir);
generateBuildConfig(c);
generateLocalConfig(c);_context8.t0=


_generateConfigPaths;_context8.t1=c.paths.workspace;_context8.t2=_fileutils.getRealPath;_context8.t3=c;_context8.next=21;return _regenerator.default.awrap((0,_workspace.getWorkspaceDirPath)(c));case 21:_context8.t4=_context8.sent;_context8.t5=(0,_context8.t2)(_context8.t3,_context8.t4);(0,_context8.t0)(_context8.t1,_context8.t5);
_loadConfigFiles(c,c.files.workspace,c.paths.workspace);case 25:case"end":return _context8.stop();}}},null,null,null,Promise);};exports.setAppConfig=setAppConfig;


var updateConfig=function updateConfig(c,appConfigId){var isPureRnv,configDirs,_await$inquirerPrompt2,_conf,_await$inquirerPrompt3,conf;return _regenerator.default.async(function updateConfig$(_context9){while(1){switch(_context9.prev=_context9.next){case 0:
(0,_logger.logTask)("updateConfig:"+appConfigId);_context9.next=3;return _regenerator.default.awrap(

setAppConfig(c,appConfigId));case 3:

isPureRnv=!c.command&&!c.subCommand;if(!(

!_fs.default.existsSync(c.paths.appConfig.dir)||isPureRnv)){_context9.next=30;break;}
configDirs=listAppConfigsFoldersSync(c,true);

if(!appConfigId){
(0,_logger.logWarning)(
'It seems you don\'t have any appConfig active');

}else if(appConfigId!==true&&appConfigId!==true&&!isPureRnv){
(0,_logger.logWarning)("It seems you don't have appConfig named "+
_chalk.default.white(appConfigId)+" present in your config folder: "+_chalk.default.white(
c.paths.project.appConfigsDir)+" !");


}if(!

configDirs.length){_context9.next=21;break;}if(!(
configDirs.length===1)){_context9.next=13;break;}

(0,_logger.logInfo)("Found only one app config available. Will use "+_chalk.default.white(configDirs[0]));_context9.next=12;return _regenerator.default.awrap(
setAppConfig(c,configDirs[0]));case 12:return _context9.abrupt("return",
true);case 13:_context9.next=15;return _regenerator.default.awrap(


(0,_prompt.inquirerPrompt)({
name:'conf',
type:'list',
message:'Which one would you like to pick?',
choices:configDirs,
pageSize:50,
logMessage:'ReNative found multiple existing appConfigs'}));case 15:_await$inquirerPrompt2=_context9.sent;_conf=_await$inquirerPrompt2.conf;if(!


_conf){_context9.next=21;break;}_context9.next=20;return _regenerator.default.awrap(
setAppConfig(c,_conf));case 20:return _context9.abrupt("return",
true);case 21:_context9.next=23;return _regenerator.default.awrap(


(0,_prompt.inquirerPrompt)({
name:'conf',
type:'confirm',
message:"Do you want ReNative to create new sample appConfig ("+_chalk.default.white(
appConfigId)+") for you?",

warningMessage:'No app configs found for this project'}));case 23:_await$inquirerPrompt3=_context9.sent;conf=_await$inquirerPrompt3.conf;if(!


conf){_context9.next=30;break;}_context9.next=28;return _regenerator.default.awrap(
setAppConfig(c,_constants.SAMPLE_APP_ID));case 28:
(0,_fileutils.copyFolderContentsRecursiveSync)(
_path.default.join(c.paths.rnv.dir,'appConfigs',_constants.SAMPLE_APP_ID),
_path.default.join(c.paths.appConfig.dir));return _context9.abrupt("return",

true);case 30:return _context9.abrupt("return",


true);case 31:case"end":return _context9.stop();}}},null,null,null,Promise);};exports.updateConfig=updateConfig;


var parseRenativeConfigs=function parseRenativeConfigs(c){var _c$program$appConfigI,_c$files$project2,_c$files$project2$con,_c$files$project2$con2,aid;return _regenerator.default.async(function parseRenativeConfigs$(_context10){while(1){switch(_context10.prev=_context10.next){case 0:
(0,_logger.logTask)('parseRenativeConfigs');

loadFile(c.files.project,c.paths.project,'package');


_loadConfigFiles(c,c.files.project,c.paths.project);if(!(
c.program.appConfigID!==true)){_context10.next=8;break;}_context10.next=6;return _regenerator.default.awrap(
matchAppConfigID(c,(_c$program$appConfigI=c.program.appConfigID)==null?void 0:_c$program$appConfigI.toLowerCase==null?void 0:_c$program$appConfigI.toLowerCase()));case 6:aid=_context10.sent;
c.runtime.appId=aid||c.runtime.appId||((_c$files$project2=c.files.project)==null?void 0:(_c$files$project2$con=_c$files$project2.configLocal)==null?void 0:(_c$files$project2$con2=_c$files$project2$con._meta)==null?void 0:_c$files$project2$con2.currentAppConfigId);case 8:

c.paths.project.builds.config=_path.default.join(c.paths.project.builds.dir,c.runtime.appId+"_"+c.platform+".json");


loadFile(c.files.project.builds,c.paths.project.builds,'config');_context10.t0=


_generateConfigPaths;_context10.t1=c.paths.workspace;_context10.t2=_fileutils.getRealPath;_context10.t3=c;_context10.next=16;return _regenerator.default.awrap((0,_workspace.getWorkspaceDirPath)(c));case 16:_context10.t4=_context10.sent;_context10.t5=(0,_context10.t2)(_context10.t3,_context10.t4);(0,_context10.t0)(_context10.t1,_context10.t5);
_loadConfigFiles(c,c.files.workspace,c.paths.workspace);


_generateConfigPaths(c.paths.defaultWorkspace,c.paths.GLOBAL_RNV_DIR);
_loadConfigFiles(c,c.files.defaultWorkspace,c.paths.defaultWorkspace);


loadProjectTemplates(c);


loadPluginTemplates(c);


loadPlatformTemplates(c);if(

c.files.project.config){_context10.next=27;break;}return _context10.abrupt("return");case 27:


_generateConfigPaths(c.paths.workspace.project,_path.default.join(c.paths.workspace.dir,c.files.project.config.projectName));
_loadConfigFiles(c,c.files.workspace.project,c.paths.workspace.project);

c.paths.workspace.project.projectConfig.dir=_path.default.join(c.paths.workspace.project.dir,'projectConfig');

_findAndSwitchAppConfigDir(c);

c.runtime.isWrapper=c.buildConfig.isWrapper;
c.paths.project.platformTemplatesDirs=_generatePlatformTemplatePaths(c);case 33:case"end":return _context10.stop();}}},null,null,null,Promise);};exports.parseRenativeConfigs=parseRenativeConfigs;


var configureRnvGlobal=function configureRnvGlobal(c){var oldGlobalConfigPath,_c$files$workspace$co,defaultConfig,newConfig;return _regenerator.default.async(function configureRnvGlobal$(_context11){while(1){switch(_context11.prev=_context11.next){case 0:
(0,_logger.logTask)('configureRnvGlobal');



if(_fs.default.existsSync(c.paths.workspace.dir)){
(0,_logger.logDebug)(c.paths.workspace.dir+" folder exists!");
}else{
(0,_logger.logInfo)(c.paths.workspace.dir+" folder missing! Creating one for you...");
(0,_fileutils.mkdirSync)(c.paths.workspace.dir);
}


if(_fs.default.existsSync(c.paths.workspace.config)){
(0,_logger.logDebug)(c.paths.workspace.dir+"/"+_constants.RENATIVE_CONFIG_NAME+" file exists!");
}else{
oldGlobalConfigPath=_path.default.join(c.paths.workspace.dir,'config.json');
if(_fs.default.existsSync(oldGlobalConfigPath)){
(0,_logger.logWarning)('Found old version of your config. will copy it to new renative.json config');
(0,_fileutils.copyFileSync)(oldGlobalConfigPath,c.paths.workspace.config);
}else{
(0,_logger.logInfo)(c.paths.workspace.dir+"/"+_constants.RENATIVE_CONFIG_NAME+" file missing! Creating one for you...");
(0,_fileutils.copyFileSync)(_path.default.join(c.paths.rnv.dir,'supportFiles','global-config-template.json'),c.paths.workspace.config);
}
}

if(_fs.default.existsSync(c.paths.workspace.config)){
c.files.workspace.config=JSON.parse(_fs.default.readFileSync(c.paths.workspace.config).toString());

if((_c$files$workspace$co=c.files.workspace.config)!=null&&_c$files$workspace$co.appConfigsPath){
if(!_fs.default.existsSync(c.files.workspace.config.appConfigsPath)){
(0,_logger.logWarning)("Looks like your custom global appConfig is pointing to "+
_chalk.default.white(
c.files.workspace.config.appConfigsPath)+" which doesn't exist! Make sure you create one in that location");


}else{
(0,_logger.logInfo)("Found custom appConfing location pointing to "+
_chalk.default.white(
c.files.workspace.config.appConfigsPath)+". ReNativewill now swith to that location!");


c.paths.project.appConfigsDir=c.files.workspace.config.appConfigsPath;
}
}


if(c.files.workspace.config.defaultTargets===undefined){
(0,_logger.logWarning)("Looks like you're missing defaultTargets in your config "+
_chalk.default.white(c.paths.workspace.config)+". Let's add them!");

defaultConfig=JSON.parse(
_fs.default.readFileSync(_path.default.join(c.paths.rnv.dir,'supportFiles','global-config-template.json')).toString());

newConfig=_objectSpread(_objectSpread({},c.files.workspace.config),{},{defaultTargets:defaultConfig.defaultTargets});
_fs.default.writeFileSync(c.paths.workspace.config,JSON.stringify(newConfig,null,2));
}
}return _context11.abrupt("return",

true);case 5:case"end":return _context11.stop();}}},null,null,null,Promise);};exports.configureRnvGlobal=configureRnvGlobal;


var createRnvConfig=function createRnvConfig(program,process,cmd,subCmd){
var c={
cli:{},
runtime:{},


paths:{
buildHooks:{
dist:{}},

home:{},
rnv:{
pluginTemplates:{},
platformTemplates:{},
projectTemplates:{},
platformTemplate:{},
plugins:{},
projectTemplate:{}},

global:{},


project:{
projectConfig:{},
builds:{},
assets:{},
platformTemplates:{}},

template:{},
appConfig:{},
workspace:{
project:{
projectConfig:{},
builds:{},
assets:{},
platformTemplates:{}},

appConfig:{}},

defaultWorkspace:{
project:{
projectConfig:{},
builds:{},
assets:{},
platformTemplates:{}},

appConfig:{}}},



files:{
rnv:{
pluginTemplates:{},
platformTemplates:{},
projectTemplates:{},
plugins:{},
projectTemplate:{}},

project:{
projectConfig:{},
builds:{},
assets:{},
platformTemplates:{}},

appConfig:{},
workspace:{
project:{
projectConfig:{},
builds:{},
assets:{},
platformTemplates:{}},

appConfig:{}},

defaultWorkspace:{
project:{
projectConfig:{},
builds:{},
assets:{},
platformTemplates:{}},

appConfig:{}}}};




c.program=program;
c.process=process;
c.command=cmd;
c.subCommand=subCmd;
c.platformDefaults=_constants.PLATFORMS;

c.paths.rnv.dir=_path.default.join(__dirname,'../..');
c.paths.rnv.nodeModulesDir=_path.default.join(c.paths.rnv.dir,'node_modules');
c.paths.rnv.platformTemplates.dir=_path.default.join(c.paths.rnv.dir,'platformTemplates');
c.paths.rnv.pluginTemplates.dir=_path.default.join(c.paths.rnv.dir,'pluginTemplates');
c.paths.rnv.platformTemplates.config=_path.default.join(c.paths.rnv.platformTemplates.dir,_constants.RENATIVE_CONFIG_PLATFORMS_NAME);
c.paths.rnv.pluginTemplates.config=_path.default.join(c.paths.rnv.pluginTemplates.dir,_constants.RENATIVE_CONFIG_PLUGINS_NAME);
c.paths.rnv.projectTemplates.dir=_path.default.join(c.paths.rnv.dir,'projectTemplates');
c.paths.rnv.projectTemplates.config=_path.default.join(c.paths.rnv.projectTemplates.dir,_constants.RENATIVE_CONFIG_TEMPLATES_NAME);
c.paths.rnv.package=_path.default.join(c.paths.rnv.dir,'package.json');

c.paths.rnv.projectTemplate.dir=_path.default.join(c.paths.rnv.dir,'projectTemplate');
c.files.rnv.package=JSON.parse(_fs.default.readFileSync(c.paths.rnv.package).toString());

c.platform=c.program.platform;
c.paths.home.dir=homedir;
c.paths.GLOBAL_RNV_DIR=_path.default.join(c.paths.home.dir,'.rnv');
c.paths.GLOBAL_RNV_CONFIG=_path.default.join(c.paths.GLOBAL_RNV_DIR,_constants.RENATIVE_CONFIG_NAME);
c.paths.rnv.configWorkspaces=_path.default.join(c.paths.GLOBAL_RNV_DIR,_constants.RENATIVE_CONFIG_WORKSPACES_NAME);

if(!_fs.default.existsSync(c.paths.GLOBAL_RNV_DIR))(0,_fileutils.mkdirSync)(c.paths.GLOBAL_RNV_DIR);

_generateConfigPaths(c.paths.project,base);

c.paths.buildHooks.dir=_path.default.join(c.paths.project.dir,'buildHooks/src');
c.paths.buildHooks.dist.dir=_path.default.join(c.paths.project.dir,'buildHooks/dist');
c.paths.buildHooks.index=_path.default.join(c.paths.buildHooks.dir,'index.js');
c.paths.buildHooks.dist.index=_path.default.join(c.paths.buildHooks.dist.dir,'index.js');
c.paths.project.nodeModulesDir=_path.default.join(c.paths.project.dir,'node_modules');
c.paths.project.srcDir=_path.default.join(c.paths.project.dir,'src');
c.paths.project.appConfigsDir=_path.default.join(c.paths.project.dir,'appConfigs');
c.paths.project.package=_path.default.join(c.paths.project.dir,'package.json');
c.paths.project.rnCliConfig=_path.default.join(c.paths.project.dir,_constants.RN_CLI_CONFIG_NAME);
c.paths.project.babelConfig=_path.default.join(c.paths.project.dir,_constants.RN_BABEL_CONFIG_NAME);
c.paths.project.npmLinkPolyfill=_path.default.join(c.paths.project.dir,'npm_link_polyfill.json');
c.paths.project.projectConfig.dir=_path.default.join(c.paths.project.dir,'appConfigs','base');
c.paths.project.projectConfig.pluginsDir=_path.default.join(c.paths.project.projectConfig.dir,'plugins');
c.paths.project.projectConfig.fontsDir=_path.default.join(c.paths.project.projectConfig.dir,'fonts');
c.paths.project.assets.dir=_path.default.join(c.paths.project.dir,'platformAssets');
c.paths.project.assets.runtimeDir=_path.default.join(c.paths.project.assets.dir,'runtime');
c.paths.project.assets.config=_path.default.join(c.paths.project.assets.dir,_constants.RENATIVE_CONFIG_RUNTIME_NAME);
c.paths.project.builds.dir=_path.default.join(c.paths.project.dir,'platformBuilds');
c.paths.project.builds.config=_path.default.join(c.paths.project.builds.dir,_constants.RENATIVE_CONFIG_BUILD_NAME);

_generateConfigPaths(c.paths.workspace,c.paths.GLOBAL_RNV_DIR);


try{
_loadWorkspacesSync(c);
}catch(e){
(0,_logger.logError)(e);
}

return c;
};exports.createRnvConfig=createRnvConfig;
//# sourceMappingURL=configParser.js.map