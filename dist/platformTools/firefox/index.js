var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.runFirefoxProject=exports.launchKaiOSSimulator=exports.configureKaiOSProject=exports.buildFirefoxProject=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _chalk=_interopRequireDefault(require("chalk"));
var _common=require("../../common");







var _logger=require("../../systemTools/logger");


var _=require("..");
var _projectParser=require("../../projectTools/projectParser");
var _constants=require("../../constants");


var _fileutils=require("../../systemTools/fileutils");
var _web=require("../web");

var launchKaiOSSimulator=function launchKaiOSSimulator(c,name){return new Promise(function(resolve,reject){
(0,_logger.logTask)('launchKaiOSSimulator');

if(!c.files.workspace.config.sdks.KAIOS_SDK){
reject(
_constants.KAIOS_SDK+" is not configured in your "+c.paths.workspace.config+" file. Make sure you add location to your Kaiosrt App path similar to: "+_chalk.default.white.bold(
'"KAIOS_SDK": "/Applications/Kaiosrt.app"'));


return;
}

var ePath=(0,_fileutils.getRealPath)(_path.default.join(c.files.workspace.config.sdks.KAIOS_SDK));

if(!_fs.default.existsSync(ePath)){
reject("Can't find emulator at path: "+ePath);
return;
}

var childProcess=require('child_process');
childProcess.exec("open "+ePath,function(err,stdout,stderr){
if(err){
reject(err);
return;
}
resolve();
});
});};exports.launchKaiOSSimulator=launchKaiOSSimulator;

var configureKaiOSProject=function configureKaiOSProject(c,platform){return _regenerator.default.async(function configureKaiOSProject$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)('configureKaiOSProject');if(

(0,_.isPlatformActive)(c,platform)){_context.next=3;break;}return _context.abrupt("return");case 3:_context.next=5;return _regenerator.default.awrap(

(0,_projectParser.copyAssetsFolder)(c,platform));case 5:_context.next=7;return _regenerator.default.awrap(
(0,_web.configureCoreWebProject)(c,platform));case 7:_context.next=9;return _regenerator.default.awrap(
configureProject(c,platform));case 9:return _context.abrupt("return",
(0,_projectParser.copyBuildsFolder)(c,platform));case 10:case"end":return _context.stop();}}},null,null,null,Promise);};exports.configureKaiOSProject=configureKaiOSProject;


var configureProject=function configureProject(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("configureProject:"+platform);

if(!(0,_.isPlatformActive)(c,platform,resolve))return;

var appFolder=(0,_common.getAppFolder)(c,platform);
var templateFolder=(0,_common.getAppTemplateFolder)(c,platform);
var bundleIsDev=(0,_common.getConfigProp)(c,platform,'bundleIsDev')===true;
var bundleAssets=(0,_common.getConfigProp)(c,platform,'bundleAssets')===true;

var manifestFilePath=_path.default.join(templateFolder,'manifest.webapp');
var manifestFilePath2=_path.default.join(appFolder,'manifest.webapp');
var manifestFile=JSON.parse(_fs.default.readFileSync(manifestFilePath));

manifestFile.name=""+(0,_common.getAppTitle)(c,platform);
manifestFile.description=""+(0,_common.getAppDescription)(c,platform);
manifestFile.developer=(0,_common.getAppAuthor)(c,platform);

_fs.default.writeFileSync(manifestFilePath2,JSON.stringify(manifestFile,null,2));

resolve();
});};

var runFirefoxProject=function runFirefoxProject(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("runFirefoxProject:"+platform);

(0,_web.buildWeb)(c,platform).
then(function(){return launchKaiOSSimulator(c,platform);}).
then(function(){return resolve();}).
catch(function(e){return reject(e);});
});};exports.runFirefoxProject=runFirefoxProject;

var buildFirefoxProject=function buildFirefoxProject(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("buildFirefoxProject:"+platform);

(0,_web.buildWeb)(c,platform).
then(function(){return resolve();}).
catch(function(e){return reject(e);});
});};exports.buildFirefoxProject=buildFirefoxProject;
//# sourceMappingURL=index.js.map