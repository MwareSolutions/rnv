var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.rnvClean=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _fs=_interopRequireDefault(require("fs"));
var _path=_interopRequireDefault(require("path"));
var _chalk=_interopRequireDefault(require("chalk"));
var _inquirer=_interopRequireDefault(require("inquirer"));

var _fileutils=require("./fileutils");
var _logger=require("./logger");
var _exec=require("./exec");

var rnvClean=function rnvClean(c){var skipQuestion,pathsToRemove,pkgLock,msg,packagesFolder,buildDirs,answers,_await$inquirer$promp,confirm,_await$inquirer$promp2,confirmBuilds,_await$inquirer$promp3,confirmCache,_args=arguments;return _regenerator.default.async(function rnvClean$(_context){while(1){switch(_context.prev=_context.next){case 0:skipQuestion=_args.length>1&&_args[1]!==undefined?_args[1]:false;
(0,_logger.logTask)('rnvClean');
if(c.program.ci)skipQuestion=true;
pathsToRemove=[];
if(_fs.default.existsSync(c.paths.project.nodeModulesDir))pathsToRemove.push(c.paths.project.nodeModulesDir);
pkgLock=_path.default.join(c.paths.project.dir,'package-lock.json');
if(_fs.default.existsSync(pkgLock))pathsToRemove.push(pkgLock);
msg=_chalk.default.red(c.paths.project.nodeModulesDir+"\n"+pkgLock+"\n");
packagesFolder=_path.default.join(c.paths.project.dir,'packages');
if(_fs.default.existsSync(packagesFolder)){
_fs.default.readdirSync(packagesFolder).forEach(function(dir){
if(dir==='.DS_Store'){
var pth=_path.default.join(packagesFolder,dir);

if(_fs.default.existsSync(pth)){
pathsToRemove.push(pth);
msg+=_chalk.default.red(pth+"\n");
}
}else{
var pth2=_path.default.join(packagesFolder,dir,'node_modules');
if(_fs.default.existsSync(pth2)){
pathsToRemove.push(pth2);
msg+=_chalk.default.red(pth2+"\n");
}

var pth3=_path.default.join(packagesFolder,dir,'package-lock.json');
if(_fs.default.existsSync(pth3)){
pathsToRemove.push(pth3);
msg+=_chalk.default.red(pth3+"\n");
}
}
});
}

buildDirs=[];
if(_fs.default.existsSync(c.paths.project.builds.dir))buildDirs.push(c.paths.project.builds.dir);
if(_fs.default.existsSync(c.paths.project.assets.dir))buildDirs.push(c.paths.project.assets.dir);

answers={
modules:false,
builds:false,
cache:false,
nothingToClean:!skipQuestion};if(!


pathsToRemove.length){_context.next=25;break;}if(
skipQuestion){_context.next=24;break;}_context.next=18;return _regenerator.default.awrap(
_inquirer.default.prompt({
name:'confirm',
type:'confirm',
message:"Do you want to remove node_module related files/folders? \n"+msg}));case 18:_await$inquirer$promp=_context.sent;confirm=_await$inquirer$promp.confirm;

answers.modules=confirm;
if(confirm)answers.nothingToClean=false;_context.next=25;break;case 24:

answers.modules=true;case 25:if(!



buildDirs.length){_context.next=36;break;}if(
skipQuestion){_context.next=35;break;}_context.next=29;return _regenerator.default.awrap(
_inquirer.default.prompt({
name:'confirmBuilds',
type:'confirm',
message:"Do you want to clean your platformBuilds and platformAssets? \n"+_chalk.default.red(buildDirs.join('\n'))}));case 29:_await$inquirer$promp2=_context.sent;confirmBuilds=_await$inquirer$promp2.confirmBuilds;

answers.builds=confirmBuilds;
if(confirmBuilds)answers.nothingToClean=false;_context.next=36;break;case 35:

answers.builds=true;case 36:if(



skipQuestion){_context.next=45;break;}_context.next=39;return _regenerator.default.awrap(
_inquirer.default.prompt({
name:'confirmCache',
type:'confirm',
message:'Do you want to clean your npm/bundler cache?'}));case 39:_await$inquirer$promp3=_context.sent;confirmCache=_await$inquirer$promp3.confirmCache;

answers.cache=confirmCache;
if(confirmCache)answers.nothingToClean=false;_context.next=46;break;case 45:

answers.cache=true;case 46:if(!


answers.nothingToClean){_context.next=49;break;}
(0,_logger.logToSummary)('Nothing to clean');return _context.abrupt("return",
Promise.resolve());case 49:if(!


answers.modules){_context.next=52;break;}_context.next=52;return _regenerator.default.awrap(
(0,_fileutils.removeDirs)(pathsToRemove));case 52:if(!

answers.builds){_context.next=55;break;}_context.next=55;return _regenerator.default.awrap(
(0,_fileutils.removeDirs)(buildDirs));case 55:if(!

answers.cache){_context.next=60;break;}_context.next=58;return _regenerator.default.awrap(
(0,_exec.executeAsync)(c,'watchman watch-del-all'));case 58:_context.next=60;return _regenerator.default.awrap(
(0,_exec.executeAsync)(c,'rm -rf $TMPDIR/metro-* && rm -rf $TMPDIR/react-* && rm -rf $TMPDIR/haste-*'));case 60:case"end":return _context.stop();}}},null,null,null,Promise);};exports.rnvClean=rnvClean;
//# sourceMappingURL=cleaner.js.map