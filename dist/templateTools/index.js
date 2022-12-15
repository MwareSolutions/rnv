var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.rnvTemplateApply=exports.rnvTemplateAdd=exports.rnvTemplateList=exports.getInstalledTemplateOptions=exports.getTemplateOptions=exports.configureEntryPoints=exports.applyTemplate=exports.checkIfTemplateInstalled=exports.addTemplate=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _chalk=_interopRequireDefault(require("chalk"));
var _fs=_interopRequireDefault(require("fs"));
var _path=_interopRequireDefault(require("path"));
var _inquirer=_interopRequireDefault(require("inquirer"));

var _constants=require("../constants");
var _fileutils=require("../systemTools/fileutils");




var _logger=require("../systemTools/logger");
var _pluginTools=require("../pluginTools");
var _prompt=require("../systemTools/prompt");
var _configParser=require("../configTools/configParser");











var addTemplate=function addTemplate(c,template){
(0,_logger.logTask)('addTemplate');

c.files.project.config.templates=c.files.project.config.templates||{};

if(!c.files.project.config.templates[template]){
c.files.project.config.templates[template]={
version:'latest'};

}

_writeObjectSync(c,c.paths.project.config,c.files.project.config);
};exports.addTemplate=addTemplate;

var checkIfTemplateInstalled=function checkIfTemplateInstalled(c){return new Promise(function(resolve,reject){
(0,_logger.logTask)('checkIfTemplateInstalled');
if(!c.buildConfig.templates){
(0,_logger.logWarning)("Your "+_chalk.default.white(c.paths.project.config)+" does not contain "+_chalk.default.white('templates')+" object. ReNative will skip template generation");
resolve();
return;
}

for(var k in c.buildConfig.templates){
var t=k;
var obj=c.buildConfig.templates[k];
if(k.version&&k.version.startsWith('file:')){
t="../"+k.version.replace('file:','');
}
var templateFolder=_path.default.join(c.paths.project.nodeModulesDir,k);
if(!_fs.default.existsSync(templateFolder)){
(0,_logger.logWarning)("Your "+_chalk.default.white(templateFolder)+" template is not installed. ReNative will install it for you");


c._requiresNpmInstall=true;
}
if(c.files.project.package.devDependencies){
c.files.project.package.devDependencies[k]=obj.version;
}
}
_writeObjectSync(c,c.paths.project.package,c.files.project.package);

resolve();
});};exports.checkIfTemplateInstalled=checkIfTemplateInstalled;

var applyTemplate=function applyTemplate(c,selectedTemplate){var opts,_ref,template;return _regenerator.default.async(function applyTemplate$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)("applyTemplate:"+c.buildConfig.currentTemplate+"=>"+selectedTemplate+":");
c.runtime.selectedTemplate=selectedTemplate;if(

c.buildConfig.currentTemplate){_context.next=12;break;}
(0,_logger.logWarning)('You don\'t have any current template selected');
opts=getInstalledTemplateOptions(c);_context.next=7;return _regenerator.default.awrap(

_inquirer.default.prompt({
type:'list',
name:'template',
message:'Pick which template to apply',
choices:opts.keysAsArray}));case 7:_ref=_context.sent;template=_ref.template;


c.buildConfig.currentTemplate=template;
c.files.project.config.currentTemplate=template;
_writeObjectSync(c,c.paths.project.config,c.files.project.config);case 12:_context.next=14;return _regenerator.default.awrap(


_applyTemplate(c));case 14:_context.next=16;return _regenerator.default.awrap(
_configureSrc(c));case 16:_context.next=18;return _regenerator.default.awrap(
_configureAppConfigs(c));case 18:_context.next=20;return _regenerator.default.awrap(
_configureProjectConfig(c));case 20:_context.next=22;return _regenerator.default.awrap(
_configureRenativeConfig(c));case 22:_context.next=24;return _regenerator.default.awrap(
configureEntryPoints(c));case 24:case"end":return _context.stop();}}});};exports.applyTemplate=applyTemplate;


var _cleanProjectTemplateSync=function _cleanProjectTemplateSync(c){
(0,_logger.logTask)('_cleanProjectTemplateSync');
var dirsToRemove=[
_path.default.join(c.paths.project.projectConfig.dir),
_path.default.join(c.paths.project.srcDir),
_path.default.join(c.paths.project.appConfigsDir)];


var filesToRemove=c.buildConfig.defaults.supportedPlatforms.map(function(p){return _path.default.join(c.paths.project.dir,"index."+p+".js");});

(0,_fileutils.removeDirsSync)(dirsToRemove);

(0,_fileutils.removeFilesSync)(filesToRemove);
};

var _applyTemplate=function _applyTemplate(c){return _regenerator.default.async(function _applyTemplate$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)("_applyTemplate:"+c.runtime.selectedTemplate);

if(c.runtime.selectedTemplate){
_cleanProjectTemplateSync(c);
if(c.runtime.isWrapper){
c.paths.template.dir=_path.default.join(c.paths.project.dir,'packages',c.runtime.selectedTemplate);
}else{
c.paths.template.dir=_path.default.join(c.paths.project.nodeModulesDir,c.runtime.selectedTemplate);
}
}else{
c.paths.template.dir=_path.default.join(c.paths.project.nodeModulesDir,c.buildConfig.currentTemplate);
}

c.paths.template.configTemplate=_path.default.join(c.paths.template.dir,_constants.RENATIVE_CONFIG_TEMPLATE_NAME);if(

_fs.default.existsSync(c.paths.template.configTemplate)){_context2.next=6;break;}
(0,_logger.logWarning)("Template file "+_chalk.default.white(c.paths.template.configTemplate)+" does not exist. check your "+_chalk.default.white(c.paths.template.dir)+". skipping");return _context2.abrupt("return",
true);case 6:


(0,_logger.logTask)("_applyTemplate:"+c.runtime.selectedTemplate+":"+c.paths.template.dir,_chalk.default.grey);

c.paths.template.appConfigsDir=_path.default.join(c.paths.template.dir,'appConfigs');
c.paths.template.projectConfigDir=_path.default.join(c.paths.template.dir,'projectConfig');
c.runtime.currentTemplate=c.files.project.config.currentTemplate;
if(!c.runtime.currentTemplate){
c.runtime.currentTemplate=Object.keys(c.files.project.config.templates)[0];
c.runtime.requiresForcedTemplateApply=true;
}_context2.next=13;return _regenerator.default.awrap(

(0,_configParser.setAppConfig)(c,c.runtime.appId));case 13:
(0,_configParser.generateLocalConfig)(c,!!c.runtime.selectedTemplate);return _context2.abrupt("return",

true);case 15:case"end":return _context2.stop();}}});};


var _configureSrc=function _configureSrc(c){return new Promise(function(resolve,reject){

(0,_logger.logTask)('configureProject:check src',_chalk.default.grey);
if(!_fs.default.existsSync(c.paths.project.srcDir)){
(0,_logger.logInfo)("Looks like your src folder "+_chalk.default.white(c.paths.project.srcDir)+" is missing! Let's create one for you.");
(0,_fileutils.copyFolderContentsRecursiveSync)(_path.default.join(c.paths.template.dir,'src'),c.paths.project.srcDir);
}
resolve();
});};


var _configureAppConfigs=function _configureAppConfigs(c){var appConfigIds,_c$files$project,_c$files$project$defa,supPlats,pk;return _regenerator.default.async(function _configureAppConfigs$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:

(0,_logger.logTask)('configureProject:check appConfigs',_chalk.default.grey);if(

_fs.default.existsSync(c.paths.project.appConfigsDir)){_context3.next=16;break;}
(0,_logger.logInfo)("Looks like your appConfig folder "+
_chalk.default.white(
c.paths.project.appConfigsDir)+" is missing! ReNative will create one from template.");




(0,_fileutils.copyFolderContentsRecursiveSync)(c.paths.template.appConfigsDir,c.paths.project.appConfigsDir);

appConfigIds=(0,_configParser.listAppConfigsFoldersSync)(c,true);_context3.prev=5;



appConfigIds.forEach(function(v){
var appConfigPath=_path.default.join(c.paths.project.appConfigsDir,v,_constants.RENATIVE_CONFIG_NAME);
var appConfig=(0,_fileutils.readObjectSync)(appConfigPath);
if(appConfig){
appConfig.common=appConfig.common||{};
if(!c.runtime.isWrapper){var _c$files$project$conf,_c$files$project$conf2,_c$files$project$conf3,_c$files$project$conf4;
appConfig.common.title=(_c$files$project$conf=c.files.project.config)==null?void 0:(_c$files$project$conf2=_c$files$project$conf.defaults)==null?void 0:_c$files$project$conf2.title;
appConfig.common.id=(_c$files$project$conf3=c.files.project.config)==null?void 0:(_c$files$project$conf4=_c$files$project$conf3.defaults)==null?void 0:_c$files$project$conf4.id;
}

_writeObjectSync(c,appConfigPath,appConfig);
}
});

supPlats=(_c$files$project=c.files.project)==null?void 0:(_c$files$project$defa=_c$files$project.defaults)==null?void 0:_c$files$project$defa.supportedPlatforms;

if(supPlats){
for(pk in appConfig.platforms){
if(!supPlats.includes(pk)){
delete appConfig.platforms[pk];
}
}
}_context3.next=11;return _regenerator.default.awrap(
(0,_configParser.updateConfig)(c,true));case 11:_context3.next=16;break;case 13:_context3.prev=13;_context3.t0=_context3["catch"](5);

(0,_logger.logError)(_context3.t0);case 16:case"end":return _context3.stop();}}},null,null,[[5,13]]);};




var _configureProjectConfig=function _configureProjectConfig(c){return new Promise(function(resolve,reject){

(0,_logger.logTask)('configureProject:check projectConfigs',_chalk.default.grey);
if(!_fs.default.existsSync(c.paths.project.projectConfig.dir)){
(0,_logger.logInfo)("Looks like your projectConfig folder "+
_chalk.default.white(c.paths.project.projectConfig.dir)+" is missing! Let's create one for you.");

(0,_fileutils.copyFolderContentsRecursiveSync)(c.paths.template.projectConfigDir,c.paths.project.projectConfig.dir);
}
resolve();
});};

var _configureRenativeConfig=function _configureRenativeConfig(c){return new Promise(function(resolve,reject){

var templateConfig=(0,_fileutils.readObjectSync)(c.paths.template.configTemplate);
(0,_logger.logTask)('configureProject:check renative.json',_chalk.default.grey);
if(!c.runtime.isWrapper){
if(c.runtime.selectedTemplate||c.runtime.requiresForcedTemplateApply||c.files.project.config.isNew){
(0,_logger.logWarning)("Looks like your "+
c.paths.project.config+" need to be updated with "+c.paths.template.configTemplate);

var mergedObj=(0,_fileutils.mergeObjects)(c,c.files.project.config,templateConfig,false,true);
mergedObj.currentTemplate=c.runtime.currentTemplate;
mergedObj.isNew=null;
delete mergedObj.isNew;
c.files.project.config=mergedObj;
_writeObjectSync(c,c.paths.project.config,mergedObj);
}
}else{
if(templateConfig.plugins.renative){
templateConfig.plugins.renative=(0,_pluginTools.getLocalRenativePlugin)();
}
_writeObjectSync(c,c.paths.project.configLocal,templateConfig);
}
resolve();
});};

var configureEntryPoints=function configureEntryPoints(c){return new Promise(function(resolve,reject){
(0,_logger.logTask)('configureEntryPoints');








try{var _c$buildConfig$defaul;
if(!_fs.default.existsSync(c.paths.appConfig.config)){
(0,_logger.logWarning)("ERROR: c.paths.appConfig.config: "+c.paths.appConfig.config+" does not exist");
resolve();
return;
}
var plat;
var p=c.buildConfig.platforms;
var supportedPlatforms=(_c$buildConfig$defaul=c.buildConfig.defaults)==null?void 0:_c$buildConfig$defaul.supportedPlatforms;
for(var k in p){
if(supportedPlatforms&&supportedPlatforms.includes(k)||!supportedPlatforms){
plat=p[k];
var source=_path.default.join(c.paths.template.dir,plat.entryFile+".js");
var backupSource=_path.default.join(c.paths.rnv.projectTemplate.dir,'entry',plat.entryFile+".js");
var dest=_path.default.join(c.paths.project.dir,plat.entryFile+".js");
if(!_fs.default.existsSync(dest)){
if(!plat.entryFile){
(0,_logger.logWarning)("You missing entryFile for "+_chalk.default.white(k)+" platform in your "+_chalk.default.white(c.paths.appConfig.config)+".");
}else if(!_fs.default.existsSync(source)){
(0,_logger.logInfo)("You missing entry file "+_chalk.default.white(source)+" in your template. ReNative Will use default backup entry from "+_chalk.default.white(backupSource)+"!");
(0,_fileutils.copyFileSync)(backupSource,dest);
}else{
(0,_logger.logInfo)("You missing entry file "+_chalk.default.white(plat.entryFile)+" in your project. let's create one for you!");
(0,_fileutils.copyFileSync)(source,dest);
}
}
}else{
(0,_logger.logWarning)("Extra platform "+_chalk.default.white(k)+" will be ignored because it's not configured in your "+_chalk.default.white('./renative.json: { defaults.supportedPlatforms }')+" object.");
}
}
}catch(e){
reject();
return;
}

resolve();
});};exports.configureEntryPoints=configureEntryPoints;

var _writeObjectSync=function _writeObjectSync(c,p,s){
(0,_fileutils.writeFileSync)(p,s);
(0,_configParser.generateBuildConfig)(c);
};

var getTemplateOptions=function getTemplateOptions(c){return(0,_prompt.generateOptions)(c.buildConfig.projectTemplates,false,null,function(i,obj,mapping,defaultVal){var _c$buildConfig$templa;
var exists=(_c$buildConfig$templa=c.buildConfig.templates)==null?void 0:_c$buildConfig$templa[defaultVal];
var installed=exists?_chalk.default.yellow(' (installed)'):'';
return" ["+_chalk.default.grey(i+1)+"]> "+_chalk.default.bold(defaultVal)+installed+" \n";
});};exports.getTemplateOptions=getTemplateOptions;

var getInstalledTemplateOptions=function getInstalledTemplateOptions(c){
if(c.buildConfig.templates){
return(0,_prompt.generateOptions)(c.buildConfig.templates);
}
(0,_logger.logError)('You don\'t have any local templates installed',false,true);
return[];
};exports.getInstalledTemplateOptions=getInstalledTemplateOptions;


var rnvTemplateList=function rnvTemplateList(c){return new Promise(function(resolve,reject){
(0,_logger.logTask)('rnvTemplateList');
var opts=getTemplateOptions(c);
(0,_logger.logToSummary)("Templates:\n\n"+opts.asString);
resolve();
});};exports.rnvTemplateList=rnvTemplateList;

var rnvTemplateAdd=function rnvTemplateAdd(c){var opts,_ref2,template;return _regenerator.default.async(function rnvTemplateAdd$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:
(0,_logger.logTask)('rnvTemplateAdd');

opts=getTemplateOptions(c);_context4.next=4;return _regenerator.default.awrap(

_inquirer.default.prompt({
type:'list',
message:'Pick which template to install',
name:'template',
choices:opts.keysAsArray}));case 4:_ref2=_context4.sent;template=_ref2.template;


addTemplate(c,template);case 7:case"end":return _context4.stop();}}});};exports.rnvTemplateAdd=rnvTemplateAdd;


var rnvTemplateApply=function rnvTemplateApply(c){var opts,_ref3,template;return _regenerator.default.async(function rnvTemplateApply$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:
(0,_logger.logTask)("rnvTemplateApply:"+c.program.template);if(!

c.program.template){_context5.next=3;break;}return _context5.abrupt("return",
applyTemplate(c,c.program.template));case 3:

opts=getInstalledTemplateOptions(c);_context5.next=6;return _regenerator.default.awrap(

_inquirer.default.prompt({
type:'list',
message:'Pick which template to install',
name:'template',
choices:opts.keysAsArray}));case 6:_ref3=_context5.sent;template=_ref3.template;


applyTemplate(c,template);case 9:case"end":return _context5.stop();}}});};exports.rnvTemplateApply=rnvTemplateApply;
//# sourceMappingURL=index.js.map