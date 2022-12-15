var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=exports.getFileListSync=exports.replaceHomeFolder=exports.updateConfigFile=exports.mergeObjects=exports.sanitizeDynamicProps=exports.sanitizeDynamicRefs=exports.arrayMerge=exports.getRealPath=exports.updateObjectSync=exports.readObjectSync=exports.writeObjectSync=exports.writeFileSync=exports.removeDirSync=exports.removeDirs=exports.removeDirsSync=exports.removeFilesSync=exports.cleanFolder=exports.mkdirSync=exports.removeDir=exports.saveAsJs=exports.copyFolderContentsRecursive=exports.copyFolderContentsRecursiveSync=exports.copyFolderRecursiveSync=exports.invalidatePodsChecksum=exports.copyFileSync=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _fs=_interopRequireDefault(require("fs"));
var _path=_interopRequireDefault(require("path"));
var _rimraf=_interopRequireDefault(require("rimraf"));
var _svg2js=_interopRequireDefault(require("svg2js"));
var _shelljs=_interopRequireDefault(require("shelljs"));
var _deepmerge=_interopRequireDefault(require("deepmerge"));
var _chalk=_interopRequireDefault(require("chalk"));
var _ncp=_interopRequireDefault(require("ncp"));
var _utils=require("../utils");

var _logger=require("./logger");

var copyFileSync=function copyFileSync(source,target){
(0,_logger.logDebug)('copyFileSync',source);
var targetFile=target;

if(source.indexOf('.DS_Store')!==-1)return;

if(_fs.default.existsSync(target)){
if(_fs.default.lstatSync(target).isDirectory()){
targetFile=_path.default.join(target,_path.default.basename(source));
}
}
if(_fs.default.existsSync(targetFile)){
var src=_fs.default.readFileSync(source);
var dst=_fs.default.readFileSync(targetFile);

if(Buffer.compare(src,dst)===0)return;
}
(0,_logger.logDebug)('copyFileSync',source,targetFile,'executed');
try{
_fs.default.writeFileSync(targetFile,_fs.default.readFileSync(source));
}catch(e){
console.log('copyFileSync',e);
}
};exports.copyFileSync=copyFileSync;

var invalidatePodsChecksum=function invalidatePodsChecksum(c){
var appFolder=_path.default.join(c.paths.project.builds.dir,c.runtime.appId+"_"+c.platform);
var podChecksumPath=_path.default.join(appFolder,'Podfile.checksum');
if(_fs.default.existsSync(podChecksumPath)){
_fs.default.unlinkSync(podChecksumPath);
}
};exports.invalidatePodsChecksum=invalidatePodsChecksum;

var copyFolderRecursiveSync=function copyFolderRecursiveSync(source,target){var convertSvg=arguments.length>2&&arguments[2]!==undefined?arguments[2]:true;var skipPaths=arguments.length>3?arguments[3]:undefined;
(0,_logger.logDebug)('copyFolderRecursiveSync',source,target);
if(!_fs.default.existsSync(source))return;

var files=[];

var targetFolder=_path.default.join(target,_path.default.basename(source));
if(!_fs.default.existsSync(targetFolder)){
mkdirSync(targetFolder);
}

if(_fs.default.lstatSync(source).isDirectory()){
files=_fs.default.readdirSync(source);
files.forEach(function(file){
var curSource=_path.default.join(source,file);
if(_fs.default.lstatSync(curSource).isDirectory()){
copyFolderRecursiveSync(curSource,targetFolder);
}else if(_path.default.extname(curSource)==='.svg'&&convertSvg===true){
var jsDest=_path.default.join(targetFolder,_path.default.basename(curSource)+".js");
(0,_logger.logDebug)("file "+curSource+" is svg and convertSvg is set to true. converitng to "+jsDest);
saveAsJs(curSource,jsDest);
}else{
copyFileSync(curSource,targetFolder);
}
});
}
};exports.copyFolderRecursiveSync=copyFolderRecursiveSync;

var copyFolderContentsRecursiveSync=function copyFolderContentsRecursiveSync(source,target){var convertSvg=arguments.length>2&&arguments[2]!==undefined?arguments[2]:true;var skipPaths=arguments.length>3?arguments[3]:undefined;
(0,_logger.logDebug)('copyFolderContentsRecursiveSync',source,target,skipPaths);
if(!_fs.default.existsSync(source))return;
var files=[];
var targetFolder=_path.default.join(target);
if(!_fs.default.existsSync(targetFolder)){
mkdirSync(targetFolder);
}
if(_fs.default.lstatSync(source).isDirectory()){
files=_fs.default.readdirSync(source);
files.forEach(function(file){
var curSource=_path.default.join(source,file);
if(!skipPaths||skipPaths&&!skipPaths.includes(curSource)){
if(_fs.default.lstatSync(curSource).isDirectory()){
copyFolderRecursiveSync(curSource,targetFolder,convertSvg,skipPaths);
}else{
copyFileSync(curSource,targetFolder);
}
}
});
}
};exports.copyFolderContentsRecursiveSync=copyFolderContentsRecursiveSync;

var copyFolderContentsRecursive=function copyFolderContentsRecursive(source,target){var convertSvg=arguments.length>2&&arguments[2]!==undefined?arguments[2]:true;var skipPaths=arguments.length>3?arguments[3]:undefined;return new Promise(function(resolve,reject){
(0,_logger.logDebug)('copyFolderContentsRecursive',source,target,skipPaths);
if(!_fs.default.existsSync(source))return;
var targetFolder=_path.default.resolve(target);
if(!_fs.default.existsSync(targetFolder)){
mkdirSync(targetFolder);
}
(0,_ncp.default)(source,targetFolder,function(err){
if(err){
return reject(err);
}
return resolve();
});
});};exports.copyFolderContentsRecursive=copyFolderContentsRecursive;

var saveAsJs=function saveAsJs(source,dest){
_svg2js.default.createSync({
source:source,
destination:dest});

};exports.saveAsJs=saveAsJs;

var removeDir=function removeDir(path,callback){
(0,_rimraf.default)(path,callback);
};exports.removeDir=removeDir;

var mkdirSync=function mkdirSync(dir){
if(!dir)return;
if(_fs.default.existsSync(dir))return;
try{
_shelljs.default.mkdir('-p',dir);
}catch(e){
(0,_logger.logWarning)("shelljs.mkdir failed for dir: "+dir+" with error: "+e);
}
};exports.mkdirSync=mkdirSync;

var cleanFolder=function cleanFolder(d){return new Promise(function(resolve,reject){
(0,_logger.logDebug)('cleanFolder',d);
removeDir(d,function(){
mkdirSync(d);
resolve();
});
});};exports.cleanFolder=cleanFolder;

var removeFilesSync=function removeFilesSync(filePaths){
(0,_logger.logDebug)('removeFilesSync',filePaths);
filePaths.forEach(function(filePath){
try{
if(_fs.default.existsSync(filePath)){
_fs.default.unlinkSync(filePath);
}else{
(0,_logger.logDebug)("Path "+filePath+" does not exist");
}
}catch(e){
(0,_logger.logError)(e);
}
});
};exports.removeFilesSync=removeFilesSync;

var removeDirsSync=function removeDirsSync(dirPaths){
(0,_logger.logDebug)('removeDirsSync',dirPaths);

for(var i=0;i<dirPaths.length;i++){
try{
removeDirSync(dirPaths[i]);
}catch(e){
(0,_logger.logError)(e);
}
}
};exports.removeDirsSync=removeDirsSync;


var removeDirs=function removeDirs(dirPaths){return new Promise(function(resolve,reject){
(0,_logger.logDebug)('removeDirs',dirPaths);
var allFolders=dirPaths.length;
var deletedFolders=0;
for(var i=0;i<allFolders;i++){
(0,_rimraf.default)(dirPaths[i],function(e){
if(e){
(0,_logger.logError)(e);
}
deletedFolders++;
if(deletedFolders>=allFolders)resolve();
});
}
if(allFolders===0)resolve();
});};exports.removeDirs=removeDirs;


var removeDirSync=function removeDirSync(dir,rmSelf){
var files;
rmSelf=rmSelf===undefined?true:rmSelf;
dir+='/';
try{files=_fs.default.readdirSync(dir);}catch(e){(0,_logger.logDebug)('!Oops, directory not exist.');return;}
if(files.length>0){
files.forEach(function(x,i){
if(_fs.default.statSync(dir+x).isDirectory()){
removeDirSync(dir+x);
}else{
_fs.default.unlinkSync(dir+x);
}
});
}
if(rmSelf){

_fs.default.rmdirSync(dir);
}
};exports.removeDirSync=removeDirSync;

var writeFileSync=function writeFileSync(filePath,obj,spaces){var addNewLine=arguments.length>3&&arguments[3]!==undefined?arguments[3]:true;
(0,_logger.logDebug)('writeFileSync',filePath);
if(filePath.includes('?')||filePath.includes('undefined'))return;
var output;
if(typeof obj==='string'){
output=obj;
}else{
output=""+JSON.stringify(obj,null,spaces||4)+(addNewLine?'\n':'');
}
if(_fs.default.existsSync(filePath)){
if(_fs.default.readFileSync(filePath).toString()===output)return;
}
(0,_logger.logDebug)('writeFileSync',filePath,'executed');
_fs.default.writeFileSync(filePath,output);
};exports.writeFileSync=writeFileSync;

var writeObjectSync=function writeObjectSync(filePath,obj,spaces){var addNewLine=arguments.length>3&&arguments[3]!==undefined?arguments[3]:true;
(0,_logger.logDebug)('writeObjectSync',filePath);
(0,_logger.logWarning)('writeObjectSync is DEPRECATED. use writeFileSync instead');
return writeFileSync(filePath,obj,spaces,addNewLine);
};exports.writeObjectSync=writeObjectSync;

var readObjectSync=function readObjectSync(filePath){var sanitize=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;var c=arguments.length>2?arguments[2]:undefined;
(0,_logger.logDebug)("readObjectSync:"+sanitize+":"+filePath);
if(!filePath){
(0,_logger.logDebug)('readObjectSync: filePath is undefined');
return null;
}
if(!_fs.default.existsSync(filePath)){
(0,_logger.logDebug)("readObjectSync: File at "+filePath+" does not exist");
return null;
}
var obj;
try{
obj=JSON.parse(_fs.default.readFileSync(filePath));
if(sanitize){
(0,_logger.logDebug)("readObjectSync: will sanitize file at: "+filePath);
if(c){
obj=sanitizeDynamicRefs(c,obj);
}
if(obj._refs){
obj=sanitizeDynamicProps(obj,obj._refs);
}
}
}catch(e){
(0,_logger.logWarning)("readObjectSync: Parsing of "+_chalk.default.white(filePath)+" failed with "+e);
return null;
}
return obj;
};exports.readObjectSync=readObjectSync;

var updateObjectSync=function updateObjectSync(filePath,updateObj){
var output;
var obj=readObjectSync(filePath);
if(obj){
output=(0,_deepmerge.default)(obj,updateObj);
}else{
output=updateObj;
}
writeFileSync(filePath,output);
return output;
};exports.updateObjectSync=updateObjectSync;

var getRealPath=function getRealPath(c,p){var key=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'undefined';var original=arguments.length>3?arguments[3]:undefined;
if(!p){
if(original)(0,_logger.logInfo)("Path "+_chalk.default.white(key)+" is not defined. using default: "+_chalk.default.white(original));
return original;
}
if(p.startsWith('./')){
return _path.default.join(c.paths.project.dir,p);
}
var output=p.replace(/\$RNV_HOME/g,c.paths.rnv.dir).
replace(/~/g,c.paths.home.dir).
replace(/\$USER_HOME/g,c.paths.home.dir).
replace(/\$PROJECT_HOME/g,c.paths.project.dir).
replace(/\$WORKSPACE_HOME/g,c.paths.workspace.dir).
replace(/RNV_HOME/g,c.paths.rnv.dir).
replace(/USER_HOME/g,c.paths.home.dir).
replace(/PROJECT_HOME/g,c.paths.project.dir);
return output;
};exports.getRealPath=getRealPath;

var _refToValue=function _refToValue(c,ref,key){
var val=ref.replace('$REF$:','').split('$...');

var realPath=getRealPath(c,val[0],key);

if(realPath&&realPath.includes('.json')&&val.length===2){
if(_fs.default.existsSync(realPath)){
var obj=readObjectSync(realPath);

try{
var output=val[1].split('.').reduce(function(o,i){return o[i];},obj);
return output;
}catch(e){
(0,_logger.logWarning)("_refToValue: "+e);
}
}else{
(0,_logger.logWarning)("_refToValue: "+_chalk.default.white(realPath)+" does not exist!");
}
}
return ref;
};

var arrayMerge=function arrayMerge(destinationArray,sourceArray,mergeOptions){
var jointArray=destinationArray.concat(sourceArray);
var uniqueArray=jointArray.filter(function(item,index){return jointArray.indexOf(item)===index;});
return uniqueArray;
};exports.arrayMerge=arrayMerge;

var _arrayMergeOverride=function _arrayMergeOverride(destinationArray,sourceArray,mergeOptions){return sourceArray;};

var sanitizeDynamicRefs=function sanitizeDynamicRefs(c,obj){
if(!obj)return obj;
if(Array.isArray(obj)){
obj.forEach(function(v){
sanitizeDynamicRefs(c,v);
});
}
Object.keys(obj).forEach(function(key){
var val=obj[key];
if(val){
if(typeof val==='string'){
if(val.startsWith('$REF$:')){
obj[key]=_refToValue(c,val,key);
}
}else{
sanitizeDynamicRefs(c,val);
}
}
});
return obj;
};exports.sanitizeDynamicRefs=sanitizeDynamicRefs;

var sanitizeDynamicProps=function sanitizeDynamicProps(obj,props){
if(!obj||!props)return obj;
if(Array.isArray(obj)){
obj.forEach(function(v){
if(typeof val==='string'){
Object.keys(props).forEach(function(pk){
val=val.replace("@"+pk+"@",props[pk]).replace("{{props."+pk+"}}",props[pk]);
obj[key]=val;
});
}else{
sanitizeDynamicProps(v,props);
}
});
}
Object.keys(obj).forEach(function(key){
var val=obj[key];
if(val){
if(typeof val==='string'){
Object.keys(props).forEach(function(pk){
val=val.replace("@"+pk+"@",props[pk]).replace("{{props."+pk+"}}",props[pk]);
obj[key]=val;
});
}else{
sanitizeDynamicProps(val,props);
}
}
});
return obj;
};exports.sanitizeDynamicProps=sanitizeDynamicProps;


var mergeObjects=function mergeObjects(c,obj1,obj2){var dynamicRefs=arguments.length>3&&arguments[3]!==undefined?arguments[3]:true;var replaceArrays=arguments.length>4&&arguments[4]!==undefined?arguments[4]:false;
if(!obj2)return obj1;
if(!obj1)return obj2;
var obj=(0,_deepmerge.default)(obj1,obj2,{arrayMerge:replaceArrays?_arrayMergeOverride:arrayMerge});
return dynamicRefs?sanitizeDynamicRefs(c,obj):obj;
};exports.mergeObjects=mergeObjects;

var updateConfigFile=function updateConfigFile(update,globalConfigPath){var configContents;return _regenerator.default.async(function updateConfigFile$(_context){while(1){switch(_context.prev=_context.next){case 0:
configContents=JSON.parse(_fs.default.readFileSync(globalConfigPath));

if(update.androidSdk){
configContents.sdks.ANDROID_SDK=update.androidSdk;
}

if(update.tizenSdk){
configContents.sdks.TIZEN_SDK=update.tizenSdk;
}

if(update.webosSdk){
configContents.sdks.WEBOS_SDK=update.webosSdk;
}

(0,_logger.logDebug)("Updating "+globalConfigPath+". New file "+JSON.stringify(configContents,null,3));

_fs.default.writeFileSync(globalConfigPath,JSON.stringify(configContents,null,3));case 6:case"end":return _context.stop();}}});};exports.updateConfigFile=updateConfigFile;


var replaceHomeFolder=function replaceHomeFolder(p){
if(_utils.isSystemWin)return p.replace('~',process.env.USERPROFILE);
return p.replace('~',process.env.HOME);
};exports.replaceHomeFolder=replaceHomeFolder;

var getFileListSync=function getFileListSync(dir){
var results=[];
var list=_fs.default.readdirSync(dir);
list.forEach(function(file){
file=dir+"/"+file;
var stat=_fs.default.statSync(file);
if(stat&&stat.isDirectory()){

results=results.concat(getFileListSync(file));
}else{

results.push(file);
}
});
return results;
};exports.getFileListSync=getFileListSync;var _default=

{
sanitizeDynamicRefs:sanitizeDynamicRefs,
getFileListSync:getFileListSync,
removeDirs:removeDirs,
copyFileSync:copyFileSync,
copyFolderRecursiveSync:copyFolderRecursiveSync,
removeDir:removeDir,
removeDirsSync:removeDirsSync,
removeFilesSync:removeFilesSync,
saveAsJs:saveAsJs,
mkdirSync:mkdirSync,
copyFolderContentsRecursive:copyFolderContentsRecursive,
copyFolderContentsRecursiveSync:copyFolderContentsRecursiveSync,
cleanFolder:cleanFolder,
writeFileSync:writeFileSync,
readObjectSync:readObjectSync,
updateObjectSync:updateObjectSync,
arrayMerge:arrayMerge,
mergeObjects:mergeObjects,
updateConfigFile:updateConfigFile,
replaceHomeFolder:replaceHomeFolder};exports.default=_default;
//# sourceMappingURL=fileutils.js.map