var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.fixPackageObject=exports.fixPackageJson=exports.default=void 0;var _chalk=_interopRequireDefault(require("chalk"));
var _fileutils=require("./fileutils");
var _constants=require("../constants");
var _logger=require("./logger");

var getSortedObject=function getSortedObject(obj){
if(obj!==null&&typeof obj==='object'&&!Array.isArray(obj)){
var keys=Object.keys(obj).sort();
var newObj={};
var addedKeys={};
keys.forEach(function(v){
if(!addedKeys[v]){
newObj[v]=obj[v];
addedKeys[v]=true;
}else{

}
});
return newObj;
}if(Array.isArray(obj)){
return obj.sort();
}
return obj;
};

var checkForDuplicates=function checkForDuplicates(arr){
var dupCheck={};
arr.forEach(function(v){
if(v){
for(var k in v){
if(dupCheck[k]){
(0,_logger.logWarning)("Key "+_chalk.default.white(k)+" is duplicated in your package.json");
}
dupCheck[k]=true;
}
}
});
};

var fixPackageJson=function fixPackageJson(c,pkgPath){return new Promise(function(resolve,reject){
var pth=pkgPath||c.paths.project.package;
var pp=(0,_fileutils.readObjectSync)(pth);
var output=fixPackageObject(pp);
(0,_fileutils.writeFileSync)(pth,output,4);
resolve();
});};exports.fixPackageJson=fixPackageJson;

var fixPackageObject=function fixPackageObject(pp){
var output={};
var usedKeys={};
_constants.PACKAGE_JSON_FILEDS.forEach(function(v){
if(pp[v]!==null){
output[v]=getSortedObject(pp[v]);
usedKeys[v]=true;
}
});
for(var k in pp){
if(!usedKeys[k]){
output[k]=pp[k];
}
}
checkForDuplicates([pp.dependencies,pp.devDependencies]);

return output;
};exports.fixPackageObject=fixPackageObject;var _default=


{
fixPackageJson:fixPackageJson,fixPackageObject:fixPackageObject
};exports.default=_default;
//# sourceMappingURL=doctor.js.map