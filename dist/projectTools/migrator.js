var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.checkAndMigrateProject=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _fs=_interopRequireDefault(require("fs"));
var _path=_interopRequireDefault(require("path"));
var _chalk=_interopRequireDefault(require("chalk"));
var _inquirer=_interopRequireDefault(require("inquirer"));

var _logger=require("../systemTools/logger");
var _fileutils=require("../systemTools/fileutils");
var _configParser=require("../configTools/configParser");
var _cleaner=require("../systemTools/cleaner");
var _constants=require("../constants");
var _projectParser=require("./projectParser");
var _prompt=require("../systemTools/prompt");

var checkAndMigrateProject=function checkAndMigrateProject(c){var prjDir,paths,_await$inquirer$promp,confirm;return _regenerator.default.async(function checkAndMigrateProject$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)('checkAndMigrateProject');
prjDir=c.paths.project.dir;


paths={
project:prjDir,
globalConfig:_path.default.join(c.paths.GLOBAL_RNV_DIR,'config.json'),



projectConfigDir:_path.default.join(prjDir,'projectConfig'),
config:_path.default.join(prjDir,'rnv-config.json'),
configNew:_path.default.join(prjDir,'renative.json'),
package:_path.default.join(prjDir,'package.json'),
plugins:_path.default.join(prjDir,'projectConfig/plugins.json'),
permissions:_path.default.join(prjDir,'projectConfig/permissions.json'),
appConfigs:_path.default.join(prjDir,'appConfigs'),
metroConfig:_path.default.join(prjDir,'rn-cli.config.js'),
metroConfigNew:_path.default.join(prjDir,_constants.RN_CLI_CONFIG_NAME)};


try{
paths.appConfigDirs=(0,_configParser.listAppConfigsFoldersSync)(c).map(function(v){return prjDir+"/appConfigs/"+v+"/config.json";});
}catch(e){
(0,_logger.logWarning)(e);
}if(!

_fs.default.existsSync(paths.config)){_context.next=24;break;}if(!
c.program.ci){_context.next=7;break;}return _context.abrupt("return",
Promise.reject('Your project has been created with previous version of ReNative'));case 7:_context.next=9;return _regenerator.default.awrap(

_inquirer.default.prompt({
name:'confirm',
type:'confirm',
message:'Your project has been created with previous version of ReNative. Do you want to migrate it to new format? Backing up project is recommended!'}));case 9:_await$inquirer$promp=_context.sent;confirm=_await$inquirer$promp.confirm;if(!


confirm){_context.next=22;break;}
c.program.reset=true;_context.next=15;return _regenerator.default.awrap(
_migrateProject(c,paths));case 15:_context.next=17;return _regenerator.default.awrap(
_migrateProjectSoft(c,paths));case 17:_context.next=19;return _regenerator.default.awrap(
(0,_cleaner.rnvClean)(c));case 19:_context.next=21;return _regenerator.default.awrap(
(0,_projectParser.configureNodeModules)(c));case 21:return _context.abrupt("return",
true);case 22:_context.next=26;break;case 24:_context.next=26;return _regenerator.default.awrap(


_migrateProjectSoft(c,paths));case 26:return _context.abrupt("return",

true);case 27:case"end":return _context.stop();}}},null,null,null,Promise);};exports.checkAndMigrateProject=checkAndMigrateProject;


var PATH_PROPS=[
{oldKey:'globalConfigFolder',newKey:'globalConfigDir'},
{oldKey:'appConfigsFolder',newKey:'appConfigsDir'},
{oldKey:'platformTemplatesFolder',newKey:'platformTemplatesDir'},
{oldKey:'entryFolder',newKey:'entryDir'},
{oldKey:'platformAssetsFolder',newKey:'platformAssetsDir'},
{oldKey:'platformBuildsFolder',newKey:'platformBuildsDir'},
{oldKey:'projectConfigFolder',newKey:'projectConfigDir'}];


var _migrateProjectSoft=function _migrateProjectSoft(c,paths){var files,_files$configNew,_files$configNew2,_files$configNew3,requiresSave,packageString,metroConfig,_await$inquirerPrompt,confirm;return _regenerator.default.async(function _migrateProjectSoft$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)('_migrateProjectSoft');_context2.prev=1;


requiresSave=false;
files={
configNew:_fs.default.existsSync(paths.configNew)?(0,_fileutils.readObjectSync)(paths.configNew):null};


if((_files$configNew=files.configNew)!=null&&_files$configNew.paths){
PATH_PROPS.forEach(function(v){
if(files.configNew.paths[v.oldKey]){
(0,_logger.logWarning)("You use old key "+_chalk.default.white(v.oldKey)+" instead of new one: "+_chalk.default.white(v.newKey)+". ReNative will try to fix it for you!");
files.configNew.paths[v.newKey]=files.configNew.paths[v.oldKey];
delete files.configNew.paths[v.oldKey];
requiresSave=true;
}
});
}

if(_fs.default.existsSync(paths.package)){
packageString=_fs.default.readFileSync(paths.package).toString();
if(!packageString.includes('jetify')&&!packageString.includes('postinstall')){
(0,_logger.logWarning)("You're missing "+_chalk.default.white('"scripts": { "postinstall": "jetify" }')+" in your package.json. Your android build might fail!");
}
}

if(_fs.default.existsSync(paths.metroConfig)){
(0,_logger.logWarning)("Found deprecated metro config "+paths.metroConfig+" and it needs to be migrated to "+paths.metroConfigNew+". ReNative will try to fix it for you!");
metroConfig=_fs.default.readFileSync(paths.metroConfig).toString();
_fs.default.writeFileSync(paths.metroConfigNew,metroConfig);
(0,_fileutils.removeFilesSync)([paths.metroConfig]);
}

if((_files$configNew2=files.configNew)!=null&&_files$configNew2.android){
(0,_logger.logWarning)('Found legacy object "android" at root. ReNative will try to fix it for you!');
files.configNew.platforms=files.configNew.platforms||{};

files.configNew.platforms.android=(0,_fileutils.mergeObjects)(c,files.configNew.platforms.android||{},files.configNew.android);
if(files.configNew.platforms.androidtv){
files.configNew.platforms.androidtv=(0,_fileutils.mergeObjects)(c,files.configNew.platforms.androidtv||{},files.configNew.android);
}
if(files.configNew.platforms.androidwear){
files.configNew.platforms.androidwear=(0,_fileutils.mergeObjects)(c,files.configNew.platforms.androidwear||{},files.configNew.android);
}
delete files.configNew.android;
requiresSave=true;
}

if((_files$configNew3=files.configNew)!=null&&_files$configNew3.ios){
(0,_logger.logWarning)('Found legacy object "ios" at root. ReNative will try to fix it for you!');
files.configNew.platforms=files.configNew.platforms||{};
files.configNew.platforms.ios=(0,_fileutils.mergeObjects)(c,files.configNew.platforms.ios||{},files.configNew.ios);
if(files.configNew.platforms.tvos){
files.configNew.platforms.tvos=(0,_fileutils.mergeObjects)(c,files.configNew.platforms.tvos||{},files.configNew.ios);
}
delete files.configNew.ios;
requiresSave=true;
}

if(_fs.default.existsSync(paths.permissions)){
(0,_logger.logWarning)("Found legacy object "+_chalk.default.red(paths.permissions)+". this should be migrated to "+_chalk.default.green('./renative.json'));
}

if(_fs.default.existsSync(paths.plugins)){
(0,_logger.logWarning)("Found legacy object "+_chalk.default.red(paths.plugins)+". this should be migrated to "+_chalk.default.green('./renative.json'));
}

if(requiresSave)(0,_fileutils.writeFileSync)(paths.configNew,files.configNew);if(!

_fs.default.existsSync(paths.projectConfigDir)){_context2.next=24;break;}_context2.next=15;return _regenerator.default.awrap(
(0,_prompt.inquirerPrompt)({
type:'confirm',
message:'in RNV 0.28.12+ ./projectConfig has been migrated to ./appConfigs/base. confirm to migrate to new structure. (having a backup or clean git status is recommended)'}));case 15:_await$inquirerPrompt=_context2.sent;confirm=_await$inquirerPrompt.confirm;if(!


confirm){_context2.next=23;break;}
(0,_fileutils.copyFolderContentsRecursiveSync)(paths.projectConfigDir,c.paths.project.projectConfig.dir);_context2.next=21;return _regenerator.default.awrap(

(0,_fileutils.removeDirs)([paths.projectConfigDir]));case 21:_context2.next=24;break;case 23:

(0,_logger.logError)('Not migrating ./projectConfig will most likely result in errors');case 24:_context2.next=29;break;case 26:_context2.prev=26;_context2.t0=_context2["catch"](1);






(0,_logger.logError)("Migration not successfull. "+_context2.t0);case 29:case"end":return _context2.stop();}}},null,null,[[1,26]],Promise);};



var _migrateFile=function _migrateFile(oldPath,newPath){
if(!_fs.default.existsSync(newPath)){
if(_fs.default.existsSync(oldPath)){
(0,_logger.logWarning)("Found old app config at "+_chalk.default.white(oldPath)+". will copy to "+_chalk.default.white(newPath));
}
(0,_fileutils.copyFileSync)(oldPath,newPath);
}
};

var _migrateProject=function _migrateProject(c,paths){return new Promise(function(resolve,reject){
(0,_logger.logTask)('MIGRATION STARTED');

if(!_fs.default.existsSync(c.paths.workspace.config)){
if(_fs.default.existsSync(paths.globalConfig)){
(0,_fileutils.copyFileSync)(paths.globalConfig,c.paths.workspace.config);
}
}

var files={
config:(0,_fileutils.readObjectSync)(paths.config),
package:(0,_fileutils.readObjectSync)(paths.package),
plugins:(0,_fileutils.readObjectSync)(paths.plugins),
permissions:(0,_fileutils.readObjectSync)(paths.permissions)};


(0,_logger.logDebug)("paths to migrate: \n "+paths);

var newConfig={};

if(files.package){
newConfig.projectName=files.package.name;
}

if(files.config){
newConfig.defaults={};

if(files.config.defaultProjectConfigs){
newConfig.defaults=(0,_fileutils.mergeObjects)(c,newConfig.defaults,files.config.defaultProjectConfigs);
}
newConfig.currentTemplate=newConfig.defaults.template||'renative-template-hello-world';

newConfig.templates={};

if(newConfig.defaults.template){
newConfig.templates[newConfig.defaults.template]={
version:c.files.rnv.package.version};

}

delete newConfig.defaults.template;

newConfig.paths={};
PATH_PROPS.forEach(function(v){
if(files.config[v.oldKey]){
newConfig.paths[v.newKey]=files.config[v.oldKey];
}
});
newConfig.paths.appConfigDirs=[newConfig.paths.appConfigDir];
delete newConfig.paths.appConfigDir;

if(files.config.defaultPorts){
newConfig.defaults.ports=files.config.defaultPorts;
}

if(files.config.crypto){
newConfig.crypto=files.config.crypto;
}
}

if(!newConfig.platforms)newConfig.platforms={};

if(files.plugins){
newConfig.plugins=files.plugins.plugins;

if(files.plugins.android){
newConfig.platforms.android=files.plugins.android;
}
if(files.plugins.ios){
newConfig.platforms.ios=files.plugins.ios;
}
}

if(files.permissions){
newConfig.permissions=files.permissions.permissions;
}

var pathsToDelete=[
paths.config,
paths.plugins,
paths.permissions].
concat(paths.appConfigDirs);

paths.appConfigDirs.forEach(function(v){
if(_fs.default.existsSync(v)){
(0,_fileutils.copyFileSync)(v,v.replace('/config.json','/renative.json'));
}
});

(0,_fileutils.writeFileSync)(c.paths.project.config,newConfig);

(0,_logger.logDebug)("Paths to delete, "+pathsToDelete.join('\n'));

(0,_fileutils.removeFilesSync)(pathsToDelete);

(0,_logger.logSuccess)('Migration Complete!');

resolve();
});};
//# sourceMappingURL=migrator.js.map