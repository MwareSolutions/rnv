var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.cleanPlaformAssets=exports.configureNodeModules=exports.upgradeProjectDependencies=exports.copyBuildsFolder=exports.copyAssetsFolder=exports.copySharedPlatforms=exports.parseFonts=exports.copyRuntimeAssets=exports.checkAndCreateGitignore=exports.checkAndCreateProjectPackage=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _chalk=_interopRequireDefault(require("chalk"));
var _constants=require("../constants");


var _common=require("../common");
var _fileutils=require("../systemTools/fileutils");



var _platformTools=require("../platformTools");
var _exec=require("../systemTools/exec");
var _logger=require("../systemTools/logger");



var _pluginTools=require("../pluginTools");
var _configParser=require("../configTools/configParser");
var _prompt=require("../systemTools/prompt");
var _utils=require("../utils");


var checkAndCreateProjectPackage=function checkAndCreateProjectPackage(c){return new Promise(function(resolve){
(0,_logger.logTask)('checkAndCreateProjectPackage');

if(!_fs.default.existsSync(c.paths.project.package)){var _c$files$project$conf,_c$files$project$conf2,_c$files$project$conf3;
(0,_logger.logInfo)("Looks like your "+c.paths.project.package+" is missing. Let's create one for you!");

var packageName=c.files.project.config.projectName||c.paths.project.dir.split('/').pop();
var version=((_c$files$project$conf=c.files.project.config.defaults)==null?void 0:(_c$files$project$conf2=_c$files$project$conf.package)==null?void 0:_c$files$project$conf2.version)||'0.1.0';
var templateName=((_c$files$project$conf3=c.files.project.config.defaults)==null?void 0:_c$files$project$conf3.template)||'renative-template-hello-world';
var rnvVersion=c.files.rnv.package.version;

var pkgJson={};
pkgJson.name=packageName;
pkgJson.version=version;
pkgJson.dependencies={
renative:rnvVersion};

pkgJson.devDependencies={
rnv:rnvVersion};

pkgJson.devDependencies[templateName]=rnvVersion;
var pkgJsonStringClean=JSON.stringify(pkgJson,null,2);
_fs.default.writeFileSync(c.paths.project.package,pkgJsonStringClean);
}

(0,_configParser.loadFile)(c.files.project,c.paths.project,'package');

resolve();
});};exports.checkAndCreateProjectPackage=checkAndCreateProjectPackage;

var checkAndCreateGitignore=function checkAndCreateGitignore(c){
(0,_logger.logTask)('checkAndCreateGitignore');
var ignrPath=_path.default.join(c.paths.project.dir,'.gitignore');
if(!_fs.default.existsSync(ignrPath)){
(0,_logger.logInfo)("Looks like your .gitignore is missing. Let's create one for you!");

(0,_fileutils.copyFileSync)(_path.default.join(c.paths.rnv.dir,'supportFiles/gitignore-template'),ignrPath);
}
};exports.checkAndCreateGitignore=checkAndCreateGitignore;

var copyRuntimeAssets=function copyRuntimeAssets(c){return new Promise(function(resolve,reject){
(0,_logger.logTask)('copyRuntimeAssets');

var destPath=_path.default.join(c.paths.project.assets.dir,'runtime');


if(c.paths.appConfig.dirs){
c.paths.appConfig.dirs.forEach(function(v){
var sourcePath=_path.default.join(v,'assets/runtime');
(0,_fileutils.copyFolderContentsRecursiveSync)(sourcePath,destPath);
});
}else{
var sourcePath=_path.default.join(c.paths.appConfig.dir,'assets/runtime');
(0,_fileutils.copyFolderContentsRecursiveSync)(sourcePath,destPath);
}

if(c.buildConfig){
if(!c.buildConfig.common){
reject("Your "+_chalk.default.white(c.paths.appConfig.config)+" is missconfigured. (Maybe you have older version?). Missing "+_chalk.default.white('{ common: {} }')+" object at root");
return;
}
}


var fontsObj='export default [';


parseFonts(c,function(font,dir){
if(font.includes('.ttf')||font.includes('.otf')){
var key=font.split('.')[0];var
includedFonts=c.buildConfig.common.includedFonts;
if(includedFonts){
if(includedFonts.includes('*')||includedFonts.includes(key)){
if(font){
var fontSource=_path.default.join(dir,font);

var relativePath=dir.replace(c.paths.project.dir,'');
if(_utils.isSystemWin)relativePath=relativePath.replace(/\\/g,'/');
if(_fs.default.existsSync(fontSource)){




fontsObj+="{\n                              fontFamily: '"+
key+"',\n                              file: require('../.."+
relativePath+"/"+font+"'),\n                          },";

}else{
(0,_logger.logWarning)("Font "+_chalk.default.white(fontSource)+" doesn't exist! Skipping.");
}
}
}
}
}
});


fontsObj+='];';
if(!_fs.default.existsSync(c.paths.project.assets.runtimeDir)){
(0,_fileutils.mkdirSync)(c.paths.project.assets.runtimeDir);
}
var fontJsPath=_path.default.join(c.paths.project.assets.dir,'runtime','fonts.js');
if(_fs.default.existsSync(fontJsPath)){
var existingFileContents=_fs.default.readFileSync(fontJsPath).toString();

if(existingFileContents!==fontsObj){
(0,_logger.logDebug)('newFontsJsFile');
_fs.default.writeFileSync(fontJsPath,fontsObj);
}
}else{
(0,_logger.logDebug)('newFontsJsFile');
_fs.default.writeFileSync(fontJsPath,fontsObj);
}

var supportFiles=_path.default.resolve(c.paths.rnv.dir,'supportFiles');
(0,_fileutils.copyFileSync)(
_path.default.resolve(supportFiles,'fontManager.js'),
_path.default.resolve(c.paths.project.assets.dir,'runtime','fontManager.js'));

(0,_fileutils.copyFileSync)(
_path.default.resolve(supportFiles,'fontManager.web.js'),
_path.default.resolve(c.paths.project.assets.dir,'runtime','fontManager.web.js'));


resolve();
});};exports.copyRuntimeAssets=copyRuntimeAssets;


var parseFonts=function parseFonts(c,callback){
(0,_logger.logTask)('parseFonts');

if(c.buildConfig){

if(_fs.default.existsSync(c.paths.project.projectConfig.fontsDir)){
_fs.default.readdirSync(c.paths.project.projectConfig.fontsDir).forEach(function(font){
if(callback)callback(font,c.paths.project.projectConfig.fontsDir);
});
}

if(c.paths.appConfig.fontsDirs){
c.paths.appConfig.fontsDirs.forEach(function(v){
if(_fs.default.existsSync(v)){
_fs.default.readdirSync(v).forEach(function(font){
if(callback)callback(font,v);
});
}
});
}else if(_fs.default.existsSync(c.paths.appConfig.fontsDir)){
_fs.default.readdirSync(c.paths.appConfig.fontsDir).forEach(function(font){
if(callback)callback(font,c.paths.appConfig.fontsDir);
});
}
}
};exports.parseFonts=parseFonts;


var copySharedPlatforms=function copySharedPlatforms(c){return new Promise(function(resolve){
(0,_logger.logTask)("_copySharedPlatform:"+c.platform);

if(c.platform){
(0,_fileutils.mkdirSync)(_path.default.resolve(c.paths.project.platformTemplatesDirs[c.platform],'_shared'));

(0,_fileutils.copyFolderContentsRecursiveSync)(
_path.default.resolve(c.paths.project.platformTemplatesDirs[c.platform],'_shared'),
_path.default.resolve(c.paths.project.builds.dir,'_shared'));

}

resolve();
});};exports.copySharedPlatforms=copySharedPlatforms;

var ASSET_PATH_ALIASES={
android:'app/src/main',
androidtv:'app/src/main',
androidwear:'app/src/main',
ios:'',
tvos:'',
tizen:'',
tizenmobile:'',
tizenwatch:'',
webos:'public',
kaios:'',
firefoxtv:'',
firefoxos:'',
windows:'',
macos:'',
web:'public'};


var copyAssetsFolder=function copyAssetsFolder(c,platform,customFn){var destPath,hasAssetFolder,sourcePath;return _regenerator.default.async(function copyAssetsFolder$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)("copyAssetsFolder:"+platform);if(

(0,_platformTools.isPlatformActive)(c,platform)){_context.next=3;break;}return _context.abrupt("return");case 3:if(!

customFn){_context.next=5;break;}return _context.abrupt("return",
customFn(c,platform));case 5:


destPath=_path.default.join((0,_common.getAppSubFolder)(c,platform),ASSET_PATH_ALIASES[platform]);if(!


c.paths.appConfig.dirs){_context.next=14;break;}
hasAssetFolder=c.paths.appConfig.dirs.filter(function(v){return _fs.default.existsSync(_path.default.join(v,"assets/"+platform));}).length;if(
hasAssetFolder){_context.next=11;break;}_context.next=11;return _regenerator.default.awrap(
generateDefaultAssets(c,platform,_path.default.join(c.paths.appConfig.dirs[0],"assets/"+platform)));case 11:

c.paths.appConfig.dirs.forEach(function(v){
var sourcePath=_path.default.join(v,"assets/"+platform);
(0,_fileutils.copyFolderContentsRecursiveSync)(sourcePath,destPath);
});_context.next=19;break;case 14:

sourcePath=_path.default.join(c.paths.appConfig.dir,"assets/"+platform);if(
_fs.default.existsSync(sourcePath)){_context.next=18;break;}_context.next=18;return _regenerator.default.awrap(
generateDefaultAssets(c,platform,sourcePath));case 18:

(0,_fileutils.copyFolderContentsRecursiveSync)(sourcePath,destPath);case 19:case"end":return _context.stop();}}});};exports.copyAssetsFolder=copyAssetsFolder;



var generateDefaultAssets=function generateDefaultAssets(c,platform,sourcePath){var confirmAssets,_ref,confirm;return _regenerator.default.async(function generateDefaultAssets$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)("generateDefaultAssets:"+platform);
confirmAssets=true;if(!(
c.program.ci===false)){_context2.next=8;break;}_context2.next=5;return _regenerator.default.awrap(
(0,_prompt.inquirerPrompt)({
type:'confirm',
message:"It seems you don't have assets configured in "+_chalk.default.white(sourcePath)+" do you want generate default ones?"}));case 5:_ref=_context2.sent;confirm=_ref.confirm;

confirmAssets=confirm;case 8:


if(confirmAssets){
(0,_fileutils.copyFolderContentsRecursiveSync)(_path.default.join(c.paths.rnv.dir,"projectTemplate/assets/"+platform),sourcePath);
}case 9:case"end":return _context2.stop();}}});};


var copyBuildsFolder=function copyBuildsFolder(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("copyBuildsFolder:"+platform);
if(!(0,_platformTools.isPlatformActive)(c,platform,resolve))return;

var destPath=_path.default.join((0,_common.getAppFolder)(c,platform));


var sourcePath1=(0,_common.getBuildsFolder)(c,platform,c.paths.project.projectConfig.dir);
(0,_fileutils.copyFolderContentsRecursiveSync)(sourcePath1,destPath);


var sourcePath1sec=(0,_common.getBuildsFolder)(c,platform,c.paths.workspace.project.projectConfig.dir);
(0,_fileutils.copyFolderContentsRecursiveSync)(sourcePath1sec,destPath);

if(_constants.WEB_HOSTED_PLATFORMS.includes(platform)){

var sourcePathShared=_path.default.join(c.paths.project.projectConfig.dir,'builds/_shared');
(0,_fileutils.copyFolderContentsRecursiveSync)(sourcePathShared,_path.default.join(c.paths.project.builds.dir,'_shared'));
}


if(c.paths.appConfig.dirs){
c.paths.appConfig.dirs.forEach(function(v){
var sourceV=(0,_common.getBuildsFolder)(c,platform,v);
(0,_fileutils.copyFolderContentsRecursiveSync)(sourceV,destPath,c.paths.appConfig.dir);
});
}else{
(0,_fileutils.copyFolderContentsRecursiveSync)((0,_common.getBuildsFolder)(c,platform,c.paths.appConfig.dir),destPath,c.paths.appConfig.dir);
}


var sourcePath0sec=(0,_common.getBuildsFolder)(c,platform,c.paths.workspace.appConfig.dir);
(0,_fileutils.copyFolderContentsRecursiveSync)(sourcePath0sec,destPath);

(0,_pluginTools.parsePlugins)(c,platform,function(plugin,pluginPlat,key){

var sourcePath3=(0,_common.getBuildsFolder)(c,platform,_path.default.join(c.paths.project.projectConfig.dir,"plugins/"+key));
(0,_fileutils.copyFolderContentsRecursiveSync)(sourcePath3,destPath);


var sourcePath3sec=(0,_common.getBuildsFolder)(c,platform,_path.default.join(c.paths.workspace.project.projectConfig.dir,"plugins/"+key));
(0,_fileutils.copyFolderContentsRecursiveSync)(sourcePath3sec,destPath);


var sourcePath2=(0,_common.getBuildsFolder)(c,platform,_path.default.join(c.paths.appConfig.dir,"plugins/"+key));
(0,_fileutils.copyFolderContentsRecursiveSync)(sourcePath2,destPath);


var sourcePath2sec=(0,_common.getBuildsFolder)(c,platform,_path.default.join(c.paths.workspace.appConfig.dir,"plugins/"+key));
(0,_fileutils.copyFolderContentsRecursiveSync)(sourcePath2sec,destPath);
});

resolve();
});};exports.copyBuildsFolder=copyBuildsFolder;

var upgradeProjectDependencies=function upgradeProjectDependencies(c,version){var _c$files$project$pack,_c$files$project$conf4,_c$files$project$conf5,_c$files$project$conf6,_c$files$project$conf7,_c$files$project$conf8,_c$files$project$conf9;
(0,_logger.logTask)('upgradeProjectDependencies');

var thw='renative-template-hello-world';
var tb='renative-template-blank';
var devDependencies=(_c$files$project$pack=c.files.project.package)==null?void 0:_c$files$project$pack.devDependencies;
if(devDependencies==null?void 0:devDependencies.rnv){
devDependencies.rnv=version;
}
if(devDependencies[thw]){
devDependencies[thw]=version;
}
if(devDependencies[tb]){
devDependencies[tb]=version;
}
if(devDependencies==null?void 0:devDependencies.renative){
devDependencies.renative=version;
}

(0,_fileutils.writeFileSync)(c.paths.project.package,c.files.project.package);

if((_c$files$project$conf4=c.files.project.config)==null?void 0:(_c$files$project$conf5=_c$files$project$conf4.templates)==null?void 0:(_c$files$project$conf6=_c$files$project$conf5[thw])==null?void 0:_c$files$project$conf6.version)c.files.project.config.templates[thw].version=version;
if((_c$files$project$conf7=c.files.project.config)==null?void 0:(_c$files$project$conf8=_c$files$project$conf7.templates)==null?void 0:(_c$files$project$conf9=_c$files$project$conf8[tb])==null?void 0:_c$files$project$conf9.version)c.files.project.config.templates[tb].version=version;

c._requiresNpmInstall=true;

(0,_fileutils.writeFileSync)(c.paths.project.config,c.files.project.config);
};exports.upgradeProjectDependencies=upgradeProjectDependencies;

var configureNodeModules=function configureNodeModules(c){return new Promise(function(resolve,reject){
(0,_logger.logTask)('configureNodeModules');

if(!_fs.default.existsSync(c.paths.project.nodeModulesDir)||c._requiresNpmInstall&&!c.runtime.skipPackageUpdate){
if(!_fs.default.existsSync(c.paths.project.nodeModulesDir)){
(0,_logger.logWarning)("Looks like your node_modules folder "+
_chalk.default.white(c.paths.project.nodeModulesDir)+" is missing! Let's run "+_chalk.default.white(
'npm install')+" first!");


}else{
(0,_logger.logWarning)("Looks like your node_modules out of date! Let's run "+_chalk.default.white('npm install')+" first!");
}
c._requiresNpmInstall=false;
(0,_exec.npmInstall)().then(function(){return resolve();}).catch(function(e){return reject(e);});
}else{
resolve();
}
});};exports.configureNodeModules=configureNodeModules;

var cleanPlaformAssets=function cleanPlaformAssets(c){return _regenerator.default.async(function cleanPlaformAssets$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:
(0,_logger.logTask)('cleanPlaformAssets');_context3.next=3;return _regenerator.default.awrap(

(0,_fileutils.cleanFolder)(c.paths.project.assets.dir));case 3:
(0,_fileutils.mkdirSync)(c.paths.project.assets.runtimeDir);return _context3.abrupt("return",
true);case 5:case"end":return _context3.stop();}}});};exports.cleanPlaformAssets=cleanPlaformAssets;
//# sourceMappingURL=projectParser.js.map