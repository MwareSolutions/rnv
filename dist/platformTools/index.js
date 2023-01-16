var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.rnvPlatformSetup=exports.rnvPlatformList=exports.rnvPlatformEject=exports.rnvPlatformConnect=exports.rnvPlatformConfigure=exports.isPlatformSupported=exports.isPlatformActive=exports.createPlatformBuild=exports.cleanPlatformBuild=void 0;var _toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));

var _chalk=_interopRequireDefault(require("chalk"));
var _path=_interopRequireDefault(require("path"));
var _inquirer=_interopRequireDefault(require("inquirer"));

var _logger=require("../systemTools/logger");
var _prompt=require("../systemTools/prompt");
var _fileutils=require("../systemTools/fileutils");
var _projectParser=require("../projectTools/projectParser");
var _constants=require("../constants");
var _sdkManager=require("./sdkManager");
var _templateTools=require("../templateTools");function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;})),keys.push.apply(keys,symbols);}return keys;}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach(function(key){(0,_defineProperty2.default)(target,key,source[key]);}):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}return target;}

var rnvPlatformList=function rnvPlatformList(c){return new Promise(function(resolve,reject){
var opts=_genPlatOptions(c);
(0,_logger.logToSummary)("Platforms:\n\n"+opts.asString);
resolve();
});};exports.rnvPlatformList=rnvPlatformList;

var rnvPlatformConfigure=function rnvPlatformConfigure(c){return _regenerator.default.async(function rnvPlatformConfigure$(_context){while(1)switch(_context.prev=_context.next){case 0:

(0,_logger.logTask)("rnvPlatformConfigure:"+c.platform);_context.next=3;return _regenerator.default.awrap(

isPlatformSupported(c));case 3:_context.next=5;return _regenerator.default.awrap(
cleanPlatformBuild(c,c.platform));case 5:_context.next=7;return _regenerator.default.awrap(
(0,_projectParser.cleanPlaformAssets)(c,c.platform));case 7:_context.next=9;return _regenerator.default.awrap(
_runCopyPlatforms(c,c.platform));case 9:case"end":return _context.stop();}},null,null,null,Promise);};exports.rnvPlatformConfigure=rnvPlatformConfigure;


var updateProjectPlatforms=function updateProjectPlatforms(c,platforms){
var config=c.paths.project.config;
var currentConfig=c.files.project.config;
currentConfig.defaults=currentConfig.defaults||{};
currentConfig.defaults.supportedPlatforms=platforms;
(0,_fileutils.writeFileSync)(config,currentConfig);
};

var rnvPlatformSetup=function rnvPlatformSetup(c){var _c$files$project$conf;var currentPlatforms,_await$inquirer$promp,inputSupportedPlatforms;return _regenerator.default.async(function rnvPlatformSetup$(_context2){while(1)switch(_context2.prev=_context2.next){case 0:
currentPlatforms=((_c$files$project$conf=c.files.project.config.defaults)==null?void 0:_c$files$project$conf.supportedPlatforms)||[];_context2.next=3;return _regenerator.default.awrap(



_inquirer.default.prompt({
name:'inputSupportedPlatforms',
type:'checkbox',
pageSize:20,
message:'What platforms would you like to use?',
validate:function validate(val){return!!val.length||'Please select at least a platform';},
default:currentPlatforms,
choices:_constants.SUPPORTED_PLATFORMS
}));case 3:_await$inquirer$promp=_context2.sent;inputSupportedPlatforms=_await$inquirer$promp.inputSupportedPlatforms;

updateProjectPlatforms(c,inputSupportedPlatforms);case 6:case"end":return _context2.stop();}},null,null,null,Promise);};exports.rnvPlatformSetup=rnvPlatformSetup;


var _generatePlatformChoices=function _generatePlatformChoices(c){return c.buildConfig.defaults.supportedPlatforms.map(function(platform){
var isConnected=c.paths.project.platformTemplatesDirs[platform].includes(c.paths.rnv.platformTemplates.dir);
return{name:platform+" - "+(isConnected?_chalk.default.green('(connected)'):_chalk.default.yellow('(ejected)')),value:platform,isConnected:isConnected};
});};

var rnvPlatformEject=function rnvPlatformEject(c){var _await$inquirer$promp2,ejectedPlatforms,ptfn,rptf,prf,copyShared;return _regenerator.default.async(function rnvPlatformEject$(_context3){while(1)switch(_context3.prev=_context3.next){case 0:
(0,_logger.logTask)('rnvPlatformEject');_context3.next=3;return _regenerator.default.awrap(

_inquirer.default.prompt({
name:'ejectedPlatforms',
message:'This will copy platformTemplates folders from ReNative managed directly to your project Select platforms you would like to connect',
type:'checkbox',
choices:_generatePlatformChoices(c).map(function(choice){return _objectSpread(_objectSpread({},choice),{},{disabled:!choice.isConnected});})
}));case 3:_await$inquirer$promp2=_context3.sent;ejectedPlatforms=_await$inquirer$promp2.ejectedPlatforms;

if(ejectedPlatforms.length){
ptfn='platformTemplates';
rptf=c.paths.rnv.platformTemplates.dir;
prf=c.paths.project.dir;

copyShared=false;

ejectedPlatforms.forEach(function(platform){
if(_constants.PLATFORMS[platform].requiresSharedConfig){
copyShared=true;
}

(0,_fileutils.copyFolderContentsRecursiveSync)(_path.default.join(rptf,platform),_path.default.join(prf,ptfn,platform));

if(copyShared){
(0,_fileutils.copyFolderContentsRecursiveSync)(_path.default.join(rptf,'_shared'),_path.default.join(prf,ptfn,'_shared'));
}

c.files.project.config.platformTemplatesDirs=c.files.project.config.platformTemplatesDirs||{};
c.files.project.config.platformTemplatesDirs[platform]="./"+ptfn;

(0,_fileutils.writeFileSync)(c.paths.project.config,c.files.project.config);
});
}

(0,_logger.logSuccess)(
_chalk.default.white(ejectedPlatforms.join(','))+" platform templates are located in "+_chalk.default.white(
c.files.project.config.platformTemplatesDirs[ejectedPlatforms[0]])+" now. You can edit them directly!");case 7:case"end":return _context3.stop();}},null,null,null,Promise);};exports.rnvPlatformEject=rnvPlatformEject;




var _genPlatOptions=function _genPlatOptions(c){
var opts=(0,_prompt.generateOptions)(c.buildConfig.defaults.supportedPlatforms,true,null,function(i,obj,mapping,defaultVal){
var isEjected=c.paths.project.platformTemplatesDirs[obj].includes(c.paths.rnv.platformTemplates.dir)?_chalk.default.green('(connected)'):_chalk.default.yellow('(ejected)');
return" ["+_chalk.default.white(i+1)+"]> "+_chalk.default.bold(defaultVal)+" - "+isEjected+" \n";
});
return opts;
};

var rnvPlatformConnect=function rnvPlatformConnect(c){var _await$inquirer$promp3,connectedPlatforms,_await$inquirer$promp4,deletePlatformFolder,pathsToRemove;return _regenerator.default.async(function rnvPlatformConnect$(_context4){while(1)switch(_context4.prev=_context4.next){case 0:
(0,_logger.logTask)('rnvPlatformConnect');_context4.next=3;return _regenerator.default.awrap(

_inquirer.default.prompt({
name:'connectedPlatforms',
message:'This will point platformTemplates folders from your local project to ReNative managed one. Select platforms you would like to connect',
type:'checkbox',
choices:_generatePlatformChoices(c).map(function(choice){return _objectSpread(_objectSpread({},choice),{},{disabled:choice.isConnected});})
}));case 3:_await$inquirer$promp3=_context4.sent;connectedPlatforms=_await$inquirer$promp3.connectedPlatforms;


if(connectedPlatforms.length){
connectedPlatforms.forEach(function(platform){var _c$files$project$conf2;
if((_c$files$project$conf2=c.files.project.config.platformTemplatesDirs)!=null&&_c$files$project$conf2[platform]){
delete c.files.project.config.platformTemplatesDirs[platform];
}

if(!Object.keys(c.files.project.config.platformTemplatesDirs).length){
delete c.files.project.config.platformTemplatesDirs;
}

(0,_fileutils.writeFileSync)(c.paths.project.config,c.files.project.config);
});
}_context4.next=8;return _regenerator.default.awrap(

_inquirer.default.prompt({
name:'deletePlatformFolder',
type:'confirm',
message:'Would you also like to delete the previously used platform folder?'
}));case 8:_await$inquirer$promp4=_context4.sent;deletePlatformFolder=_await$inquirer$promp4.deletePlatformFolder;if(!

deletePlatformFolder){_context4.next=15;break;}
pathsToRemove=[];
connectedPlatforms.forEach(function(platform){
pathsToRemove.push(_path.default.join(c.paths.project.platformTemplatesDirs[platform],platform));
});_context4.next=15;return _regenerator.default.awrap(



(0,_fileutils.removeDirs)(pathsToRemove));case 15:


(0,_logger.logSuccess)(
_chalk.default.white(connectedPlatforms.join(','))+" now using ReNative platformTemplates located in "+_chalk.default.white(c.paths.rnv.platformTemplates.dir)+" now!");case 16:case"end":return _context4.stop();}},null,null,null,Promise);};exports.rnvPlatformConnect=rnvPlatformConnect;



var _runCopyPlatforms=function _runCopyPlatforms(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("_runCopyPlatforms:"+platform);
var copyPlatformTasks=[];
if(platform==='all'){
for(var k in c.buildConfig.platforms){
if(_isPlatformSupportedSync(k)){
var ptPath=_path.default.join(c.paths.project.platformTemplatesDirs[k],""+k);
var pPath=_path.default.join(c.paths.project.builds.dir,c.runtime.appId+"_"+k);
copyPlatformTasks.push((0,_fileutils.copyFolderContentsRecursiveSync)(ptPath,pPath));
}
}
}else if(_isPlatformSupportedSync(platform)){
var _ptPath=_path.default.join(c.paths.project.platformTemplatesDirs[platform],""+platform);
var _pPath=_path.default.join(c.paths.project.builds.dir,c.runtime.appId+"_"+platform);
copyPlatformTasks.push((0,_fileutils.copyFolderContentsRecursiveSync)(_ptPath,_pPath));
}else{
logWarning("Your platform "+_chalk.default.white(platform)+" config is not present. Check "+_chalk.default.white(c.paths.appConfig.config));
}

Promise.all(copyPlatformTasks).then(function(values){
resolve();
});
});};

var cleanPlatformBuild=function cleanPlatformBuild(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("cleanPlatformBuild:"+platform);

var cleanTasks=[];

if(platform==='all'){
for(var k in c.buildConfig.platforms){
if(_isPlatformSupportedSync(k)){
var pPath=_path.default.join(c.paths.project.builds.dir,c.runtime.appId+"_"+k);
cleanTasks.push((0,_fileutils.cleanFolder)(pPath));
}
}
}else if(_isPlatformSupportedSync(platform)){
var _pPath2=_path.default.join(c.paths.project.builds.dir,c.runtime.appId+"_"+platform);
cleanTasks.push((0,_fileutils.cleanFolder)(_pPath2));
}

Promise.all(cleanTasks).then(function(values){
resolve();
});
});};exports.cleanPlatformBuild=cleanPlatformBuild;

var createPlatformBuild=function createPlatformBuild(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("createPlatformBuild:"+platform);

if(!_isPlatformSupportedSync(platform,null,reject))return;

var pPath=_path.default.join(c.paths.project.builds.dir,c.runtime.appId+"_"+platform);
var ptPath=_path.default.join(c.paths.project.platformTemplatesDirs[platform],""+platform);
(0,_fileutils.copyFolderContentsRecursiveSync)(ptPath,pPath,false,[_path.default.join(ptPath,'_privateConfig')]);

resolve();
});};exports.createPlatformBuild=createPlatformBuild;

var isPlatformSupported=function isPlatformSupported(c){var _c$files$project$conf3,_c$files$project$conf4;var platformsAsObj,opts,_await$inquirerPrompt,platform,configuredPlatforms,_await$inquirerPrompt2,confirm,newPlatforms;return _regenerator.default.async(function isPlatformSupported$(_context5){while(1)switch(_context5.prev=_context5.next){case 0:
(0,_logger.logTask)("isPlatformSupported:"+c.platform);
platformsAsObj=c.buildConfig?c.buildConfig.platforms:c.supportedPlatforms;
if(!platformsAsObj)platformsAsObj=_constants.SUPPORTED_PLATFORMS;
opts=(0,_prompt.generateOptions)(platformsAsObj);if(!(

!c.platform||c.platform===true||!_constants.SUPPORTED_PLATFORMS.includes(c.platform))){_context5.next=10;break;}_context5.next=7;return _regenerator.default.awrap(
(0,_prompt.inquirerPrompt)({
name:'platform',
type:'list',
message:'Pick one of available platforms',
choices:opts.keysAsArray,
logMessage:'You need to specify platform'
}));case 7:_await$inquirerPrompt=_context5.sent;platform=_await$inquirerPrompt.platform;

c.platform=platform;case 10:


configuredPlatforms=(_c$files$project$conf3=c.files.project.config)==null?void 0:(_c$files$project$conf4=_c$files$project$conf3.defaults)==null?void 0:_c$files$project$conf4.supportedPlatforms;if(!(
Array.isArray(configuredPlatforms)&&!configuredPlatforms.includes(c.platform))){_context5.next=25;break;}_context5.next=14;return _regenerator.default.awrap(
(0,_prompt.inquirerPrompt)({
type:'confirm',
message:"Looks like platform "+c.platform+" is not supported by your project. Would you like to enable it?"
}));case 14:_await$inquirerPrompt2=_context5.sent;confirm=_await$inquirerPrompt2.confirm;if(!

confirm){_context5.next=24;break;}
newPlatforms=[].concat((0,_toConsumableArray2.default)(configuredPlatforms),[c.platform]);
updateProjectPlatforms(c,newPlatforms);
c.buildConfig.defaults.supportedPlatforms=newPlatforms;_context5.next=22;return _regenerator.default.awrap(
(0,_templateTools.configureEntryPoints)(c));case 22:_context5.next=25;break;case 24:throw(

new Error('User canceled'));case 25:_context5.next=27;return _regenerator.default.awrap(




(0,_sdkManager.checkAndConfigureSdks)(c));case 27:return _context5.abrupt("return",
c.platform);case 28:case"end":return _context5.stop();}},null,null,null,Promise);};exports.isPlatformSupported=isPlatformSupported;


var _isPlatformSupportedSync=function _isPlatformSupportedSync(platform,resolve,reject){
if(!platform){
if(reject){
reject(
_chalk.default.red("You didn't specify platform. make sure you add \""+
_chalk.default.white.bold(
'-p <PLATFORM>')+"\" option to your command!"));



}
return false;
}
if(!_constants.SUPPORTED_PLATFORMS.includes(platform)){
if(reject)reject(_chalk.default.red("Platform "+platform+" is not supported. Use one of the following: "+_chalk.default.white(_constants.SUPPORTED_PLATFORMS.join(', '))+" ."));
return false;
}
if(resolve)resolve();
return true;
};

var isPlatformActive=function isPlatformActive(c,platform,resolve){
if(!c.buildConfig||!c.buildConfig.platforms){
logError("Looks like your appConfigFile is not configured properly! check "+_chalk.default.white(c.paths.appConfig.config)+" location.");
if(resolve)resolve();
return false;
}
if(!c.buildConfig.platforms[platform]){
console.log("Platform "+platform+" not configured for "+c.runtime.appId+". skipping.");
if(resolve)resolve();
return false;
}
return true;
};exports.isPlatformActive=isPlatformActive;
//# sourceMappingURL=index.js.map