var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.runElectronDevServer=exports.runElectron=exports.exportElectron=exports.configureElectronProject=exports.buildElectron=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _chalk=_interopRequireDefault(require("chalk"));
var _child_process=require("child_process");
var _=require("..");
var _exec=require("../../systemTools/exec");
var _common=require("../../common");















var _logger=require("../../systemTools/logger");







var _utils=require("../../utils");
var _projectParser=require("../../projectTools/projectParser");
var _constants=require("../../constants");
var _web=require("../web");




var _fileutils=require("../../systemTools/fileutils");



var configureElectronProject=function configureElectronProject(c,platform){return _regenerator.default.async(function configureElectronProject$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)("configureElectronProject:"+platform);_context.next=3;return _regenerator.default.awrap(

(0,_projectParser.copyAssetsFolder)(c,platform,platform===_constants.MACOS?_generateICNS:null));case 3:_context.next=5;return _regenerator.default.awrap(
(0,_web.configureCoreWebProject)(c,platform));case 5:_context.next=7;return _regenerator.default.awrap(
configureProject(c,platform));case 7:return _context.abrupt("return",
(0,_projectParser.copyBuildsFolder)(c,platform));case 8:case"end":return _context.stop();}}},null,null,null,Promise);};exports.configureElectronProject=configureElectronProject;

var merge=require('deepmerge');

var configureProject=function configureProject(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("configureProject:"+platform);

if(!(0,_.isPlatformActive)(c,platform,resolve))return;

var appFolder=(0,_common.getAppFolder)(c,platform);
var templateFolder=(0,_common.getAppTemplateFolder)(c,platform);
var bundleAssets=(0,_common.getConfigProp)(c,platform,'bundleAssets')===true;
var electronConfigPath=_path.default.join(appFolder,'electronConfig.json');
var packagePath=_path.default.join(appFolder,'package.json');
var appId=(0,_common.getAppId)(c,platform);

if(!_fs.default.existsSync(packagePath)){
(0,_logger.logWarning)("Looks like your "+_chalk.default.white(platform)+" platformBuild is misconfigured!. let's repair it.");
(0,_.createPlatformBuild)(c,platform).
then(function(){return configureElectronProject(c,platform);}).
then(function(){return resolve(c);}).
catch(function(e){return reject(e);});
return;
}

var pkgJson=_path.default.join(templateFolder,'package.json');
var packageJson=(0,_fileutils.readObjectSync)(pkgJson);

packageJson.name=c.runtime.appId+"-"+platform;
packageJson.productName=""+(0,_common.getAppTitle)(c,platform);
packageJson.version=""+(0,_common.getAppVersion)(c,platform);
packageJson.description=""+(0,_common.getAppDescription)(c,platform);
packageJson.author=(0,_common.getAppAuthor)(c,platform);
packageJson.license=""+(0,_common.getAppLicense)(c,platform);
packageJson.main='./main.js';

(0,_fileutils.writeFileSync)(packagePath,packageJson);

var browserWindow={width:1200,height:800,webPreferences:{nodeIntegration:true}};
var browserWindowExt=(0,_common.getConfigProp)(c,platform,'BrowserWindow');
if(browserWindowExt){
browserWindow=merge(browserWindow,browserWindowExt);
}
var browserWindowStr=JSON.stringify(browserWindow,null,2);

if(bundleAssets){
(0,_common.writeCleanFile)(_path.default.join(templateFolder,'_privateConfig','main.js'),_path.default.join(appFolder,'main.js'),[
{pattern:'{{PLUGIN_INJECT_BROWSER_WINDOW}}',override:browserWindowStr}]);

}else{
(0,_common.writeCleanFile)(_path.default.join(templateFolder,'_privateConfig','main.dev.js'),_path.default.join(appFolder,'main.js'),[
{pattern:'{{DEV_SERVER}}',override:"http://"+c.runtime.localhost+":"+c.runtime.port},
{pattern:'{{PLUGIN_INJECT_BROWSER_WINDOW}}',override:browserWindowStr}]);

}

var macConfig={};
if(platform===_constants.MACOS){
macConfig.mac={
entitlements:_path.default.join(appFolder,'entitlements.mac.plist'),
entitlementsInherit:_path.default.join(appFolder,'entitlements.mac.plist'),
hardenedRuntime:true};

macConfig.mas={
entitlements:_path.default.join(appFolder,'entitlements.mas.plist'),
entitlementsInherit:_path.default.join(appFolder,'entitlements.mas.inherit.plist'),
provisioningProfile:_path.default.join(appFolder,'embedded.provisionprofile'),
hardenedRuntime:false};

}

var electronConfig=merge({
appId:appId,
directories:{
app:appFolder,
buildResources:_path.default.join(appFolder,'resources'),
output:_path.default.join(appFolder,'build/release')},

files:[
'!build/release']},

macConfig);

var electronConfigExt=(0,_common.getConfigProp)(c,platform,'electronConfig');

if(electronConfigExt){
electronConfig=merge(electronConfig,electronConfigExt);
}
(0,_fileutils.writeFileSync)(electronConfigPath,electronConfig);


resolve();
});};

var buildElectron=function buildElectron(c,platform){
(0,_logger.logTask)("buildElectron:"+platform);

return(0,_web.buildWeb)(c,platform);
};exports.buildElectron=buildElectron;

var exportElectron=function exportElectron(c,platform){var maxErrorLength,appFolder,buildPath;return _regenerator.default.async(function exportElectron$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)("exportElectron:"+platform);
maxErrorLength=c.program.maxErrorLength;
appFolder=(0,_common.getAppFolder)(c,platform);
buildPath=_path.default.join(appFolder,'build');if(!

_fs.default.existsSync(buildPath)){_context2.next=8;break;}
console.log("removing old build "+buildPath);_context2.next=8;return _regenerator.default.awrap(
(0,_fileutils.removeDirs)([buildPath]));case 8:_context2.next=10;return _regenerator.default.awrap(


(0,_exec.executeAsync)(c,"npx electron-builder --config "+_path.default.join(appFolder,'electronConfig.json')));case 10:

(0,_logger.logSuccess)("Your Exported App is located in "+_chalk.default.white(_path.default.join(appFolder,'build/release'))+" .");case 11:case"end":return _context2.stop();}}},null,null,null,Promise);};exports.exportElectron=exportElectron;


var runElectron=function runElectron(c,platform,port){var bundleIsDev,bundleAssets,isPortActive;return _regenerator.default.async(function runElectron$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:
(0,_logger.logTask)("runElectron:"+platform);

bundleIsDev=(0,_common.getConfigProp)(c,platform,'bundleIsDev')===true;
bundleAssets=(0,_common.getConfigProp)(c,platform,'bundleAssets')===true;if(!

bundleAssets){_context3.next=10;break;}_context3.next=6;return _regenerator.default.awrap(
buildElectron(c,platform,bundleIsDev));case 6:_context3.next=8;return _regenerator.default.awrap(
_runElectronSimulator(c,platform));case 8:_context3.next=24;break;case 10:_context3.next=12;return _regenerator.default.awrap(

(0,_common.checkPortInUse)(c,platform,port));case 12:isPortActive=_context3.sent;if(
isPortActive){_context3.next=20;break;}
(0,_logger.logInfo)("Looks like your "+
_chalk.default.white(platform)+" devServer at port "+_chalk.default.white(
port)+" is not running. Starting it up for you...");


(0,_common.waitForWebpack)(c,port).
then(function(){return _runElectronSimulator(c,platform);}).
catch(_logger.logError);_context3.next=18;return _regenerator.default.awrap(

runElectronDevServer(c,platform,port));case 18:_context3.next=24;break;case 20:_context3.next=22;return _regenerator.default.awrap(

(0,_common.confirmActiveBundler)(c));case 22:_context3.next=24;return _regenerator.default.awrap(
_runElectronSimulator(c,platform));case 24:case"end":return _context3.stop();}}},null,null,null,Promise);};exports.runElectron=runElectron;




var _runElectronSimulator=function _runElectronSimulator(c){var appFolder,elc,child;return _regenerator.default.async(function _runElectronSimulator$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:
(0,_logger.logTask)("_runElectronSimulator:"+c.platform);
appFolder=(0,_common.getAppFolder)(c,c.platform);
elc=(0,_common.resolveNodeModulePath)(c,'electron/cli.js');

child=(0,_child_process.spawn)('node',[elc,_path.default.join(appFolder,'/main.js')],{
detached:true,
env:process.env,
stdio:'inherit'}).

on('close',function(code){return process.exit(code);}).
on('error',function(spawnError){return console.error(spawnError);});

child.unref();case 5:case"end":return _context4.stop();}}},null,null,null,Promise);};


var runElectronDevServer=function runElectronDevServer(c,platform,port){return _regenerator.default.async(function runElectronDevServer$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:
(0,_logger.logTask)("runElectronDevServer:"+platform);return _context5.abrupt("return",

(0,_web.runWeb)(c,platform,port));case 2:case"end":return _context5.stop();}}},null,null,null,Promise);};exports.runElectronDevServer=runElectronDevServer;


var _generateICNS=function _generateICNS(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("_generateICNS:"+platform);

var source;

if(c.paths.appConfig.dirs){
c.paths.appConfig.dirs.forEach(function(v){
var pf=_path.default.join(v,"assets/"+platform+"/AppIcon.iconset");
if(_fs.default.existsSync(pf)){
source=pf;
}
});
}else if(c.paths.appConfig.dir){
source=_path.default.join(c.paths.appConfig.dir,"assets/"+platform+"/AppIcon.iconset");
}

var dest=_path.default.join((0,_common.getAppFolder)(c,platform),'resources/icon.icns');

if(!_fs.default.existsSync(source)){
(0,_logger.logWarning)("Your app config is missing "+_chalk.default.white(source)+". icon.icns will not be generated!");
resolve();
return;
}

(0,_fileutils.mkdirSync)(_path.default.join((0,_common.getAppFolder)(c,platform),'resources'));

var p=[
'--convert',
'icns',
source,
'--output',
dest];

try{
(0,_exec.executeAsync)(c,"iconutil "+p.join(' '));
resolve();
}catch(e){
reject(e);
}
});};
//# sourceMappingURL=index.js.map