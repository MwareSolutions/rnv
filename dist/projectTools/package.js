var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _fs=_interopRequireDefault(require("fs"));
var _path=_interopRequireDefault(require("path"));
var _semver=_interopRequireDefault(require("semver"));

var _config=_interopRequireDefault(require("../config"));
var _exec=require("../systemTools/exec");
var _fileutils=require("../systemTools/fileutils");
var _logger=require("../systemTools/logger");

var bumpVersions=function bumpVersions(version){var _Config$getConfig$pat=
_config.default.getConfig().paths,dir=_Config$getConfig$pat.project.dir,pluginTemplates=_Config$getConfig$pat.rnv.pluginTemplates;

var packagesDir=_path.default.join(dir,'packages');
if(_fs.default.existsSync(packagesDir)){
var packages=_fs.default.readdirSync(packagesDir);
packages.forEach(function(name){
var pkgPath=_path.default.join(packagesDir,name);
var pkgJsonPath=_path.default.join(pkgPath,'package.json');
if(_fs.default.lstatSync(pkgPath).isDirectory()&&_fs.default.existsSync(pkgJsonPath)){

var existingPkgJson=require(pkgJsonPath);
existingPkgJson.version=version;
(0,_fileutils.writeObjectSync)(pkgJsonPath,existingPkgJson);
}
});

var renativePkgPath=_path.default.join(packagesDir,'renative');
if(_fs.default.existsSync(renativePkgPath)){
(0,_fileutils.copyFileSync)(_path.default.join(dir,'README.md'),_path.default.join(renativePkgPath,'README.md'));
(0,_fileutils.updateObjectSync)(pluginTemplates.config,{
pluginTemplates:{
renative:{
version:version}}});



}
}
};

var publishAll=function publishAll(){var
dir=_config.default.getConfig().paths.project.dir;
var packagesDir=_path.default.join(dir,'packages');
if(_fs.default.existsSync(packagesDir)){
var packages=_fs.default.readdirSync(packagesDir);
return Promise.all(packages.map(function(name){
var pkgPath=_path.default.join(packagesDir,name);
return(0,_exec.executeAsync)('npm i',{cwd:pkgPath});
}));
}
return true;
};

var rnvPkg=function rnvPkg(){var args,firstArg,secondArg;return _regenerator.default.async(function rnvPkg$(_context){while(1){switch(_context.prev=_context.next){case 0:
args=(0,_toConsumableArray2.default)(_config.default.getConfig().program.rawArgs);
args=args.slice(3);

firstArg=args[0];
secondArg=args[1];_context.t0=

firstArg;_context.next=_context.t0===
'version'?7:_context.t0===




'publish'?12:13;break;case 7:if(secondArg){_context.next=9;break;}return _context.abrupt("return",(0,_logger.logError)('No version specified',false,true));case 9:if(_semver.default.valid(secondArg)){_context.next=11;break;}return _context.abrupt("return",(0,_logger.logError)("Invalid version specified "+secondArg,false,true));case 11:return _context.abrupt("return",bumpVersions(secondArg));case 12:return _context.abrupt("return",
publishAll());case 13:

(0,_logger.logError)("Unknown argument "+firstArg,false,true);return _context.abrupt("break",15);case 15:case"end":return _context.stop();}}});};var _default=




rnvPkg;exports.default=_default;
//# sourceMappingURL=package.js.map