var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.rnvSwitch=exports.rnvLink=exports.rnvConfigure=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));

var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _chalk=_interopRequireDefault(require("chalk"));
var _common=require("../common");


var _platformTools=require("../platformTools");
var _logger=require("../systemTools/logger");




var _constants=require("../constants");
















var _apple=require("../platformTools/apple");
var _android=require("../platformTools/android");
var _tizen=require("../platformTools/tizen");
var _webos=require("../platformTools/webos");
var _electron=require("../platformTools/electron");
var _firefox=require("../platformTools/firefox");
var _web=require("../platformTools/web");
var _fileutils=require("../systemTools/fileutils");
var _cli=_interopRequireDefault(require("../cli"));
var _projectParser=require("./projectParser");
var _configParser=require("../configTools/configParser");
var _config=_interopRequireDefault(require("../config"));
var _exec=require("../systemTools/exec");

var rnvConfigure=function rnvConfigure(c){var p,ptDirs,i,originalPlatform;return _regenerator.default.async(function rnvConfigure$(_context){while(1){switch(_context.prev=_context.next){case 0:
p=c.platform||'all';
(0,_logger.logTask)("rnvConfigure:"+c.platform+":"+p);if(!(


p!=='all')){_context.next=5;break;}_context.next=5;return _regenerator.default.awrap(_config.default.injectPlatformDependencies(p));case 5:_context.next=7;return _regenerator.default.awrap(

_checkAndCreatePlatforms(c,c.platform));case 7:_context.next=9;return _regenerator.default.awrap(
(0,_projectParser.copyRuntimeAssets)(c));case 9:_context.next=11;return _regenerator.default.awrap(
(0,_projectParser.copySharedPlatforms)(c));case 11:_context.next=13;return _regenerator.default.awrap(
(0,_configParser.generateRuntimeConfig)(c));case 13:
ptDirs=c.paths.rnv.pluginTemplates.dirs;
i=0;case 15:if(!(i<ptDirs.length)){_context.next=21;break;}_context.next=18;return _regenerator.default.awrap(
overridePlugins(c,ptDirs[i]));case 18:i++;_context.next=15;break;case 21:_context.next=23;return _regenerator.default.awrap(


overridePlugins(c,c.paths.project.projectConfig.pluginsDir));case 23:

originalPlatform=c.platform;_context.next=26;return _regenerator.default.awrap(

_configurePlatform(c,p,_constants.ANDROID,_android.configureGradleProject));case 26:_context.next=28;return _regenerator.default.awrap(
_configurePlatform(c,p,_constants.ANDROID_TV,_android.configureGradleProject));case 28:_context.next=30;return _regenerator.default.awrap(
_configurePlatform(c,p,_constants.ANDROID_WEAR,_android.configureGradleProject));case 30:_context.next=32;return _regenerator.default.awrap(
_configurePlatform(c,p,_constants.TIZEN,_tizen.configureTizenProject));case 32:_context.next=34;return _regenerator.default.awrap(
_configurePlatform(c,p,_constants.TIZEN_WATCH,_tizen.configureTizenProject));case 34:_context.next=36;return _regenerator.default.awrap(
_configurePlatform(c,p,_constants.TIZEN_MOBILE,_tizen.configureTizenProject));case 36:_context.next=38;return _regenerator.default.awrap(
_configurePlatform(c,p,_constants.WEBOS,_webos.configureWebOSProject));case 38:_context.next=40;return _regenerator.default.awrap(
_configurePlatform(c,p,_constants.WEB,_web.configureWebProject));case 40:_context.next=42;return _regenerator.default.awrap(
_configurePlatform(c,p,_constants.MACOS,_electron.configureElectronProject));case 42:_context.next=44;return _regenerator.default.awrap(
_configurePlatform(c,p,_constants.WINDOWS,_electron.configureElectronProject));case 44:_context.next=46;return _regenerator.default.awrap(
_configurePlatform(c,p,_constants.KAIOS,_firefox.configureKaiOSProject));case 46:_context.next=48;return _regenerator.default.awrap(
_configurePlatform(c,p,_constants.FIREFOX_OS,_firefox.configureKaiOSProject));case 48:_context.next=50;return _regenerator.default.awrap(
_configurePlatform(c,p,_constants.FIREFOX_TV,_firefox.configureKaiOSProject));case 50:_context.next=52;return _regenerator.default.awrap(
_configurePlatform(c,p,_constants.IOS,_apple.configureXcodeProject));case 52:_context.next=54;return _regenerator.default.awrap(
_configurePlatform(c,p,_constants.TVOS,_apple.configureXcodeProject));case 54:

c.platform=originalPlatform;case 55:case"end":return _context.stop();}}},null,null,null,Promise);};exports.rnvConfigure=rnvConfigure;


var _configurePlatform=function _configurePlatform(c,p,platform,method){return _regenerator.default.async(function _configurePlatform$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:if(!
_isOK(c,p,[platform])){_context2.next=4;break;}
c.platform=platform;_context2.next=4;return _regenerator.default.awrap(
method(c,platform));case 4:case"end":return _context2.stop();}}},null,null,null,Promise);};



var rnvSwitch=function rnvSwitch(c){return new Promise(function(resolve,reject){
var p=c.program.platform||'all';
(0,_logger.logTask)("rnvSwitch:"+p);


(0,_projectParser.copyRuntimeAssets)(c).
then(function(){return(0,_projectParser.copySharedPlatforms)(c);}).
then(function(){return(0,_configParser.generateRuntimeConfig)(c);}).
then(function(){return resolve();}).
catch(function(e){return reject(e);});
});};exports.rnvSwitch=rnvSwitch;

var rnvLink=function rnvLink(c){return new Promise(function(resolve){
if(_fs.default.existsSync(c.paths.project.npmLinkPolyfill)){
var l=JSON.parse(_fs.default.readFileSync(c.paths.project.npmLinkPolyfill).toString());
Object.keys(l).forEach(function(key){

var source=_path.default.resolve(l[key]);
var nm=_path.default.join(source,'node_modules');
var dest=_path.default.join(c.paths.project.nodeModulesDir,key);
if(_fs.default.existsSync(source)){
(0,_fileutils.copyFolderContentsRecursiveSync)(source,dest,false,[nm]);
}else{
(0,_logger.logWarning)("Source: "+source+" doesn't exists!");
}
});
}else{
(0,_logger.logWarning)(c.paths.project.npmLinkPolyfill+" file not found. nothing to link!");
resolve();
}
});};exports.rnvLink=rnvLink;

var _isOK=function _isOK(c,p,list){
var result=false;
list.forEach(function(v){
if((0,_platformTools.isPlatformActive)(c,v)&&(p===v||p==='all'))result=true;
});
return result;
};


var _checkAndCreatePlatforms=function _checkAndCreatePlatforms(c,platform){var appFolder,platforms,ks,i,k,_appFolder;return _regenerator.default.async(function _checkAndCreatePlatforms$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:
(0,_logger.logTask)("_checkAndCreatePlatforms:"+platform);if(

_fs.default.existsSync(c.paths.project.builds.dir)){_context3.next=6;break;}
(0,_logger.logWarning)('Platforms not created yet. creating them for you...');_context3.next=5;return _regenerator.default.awrap(
(0,_cli.default)(c,{
command:'platform',
subCommand:'configure',
program:{appConfig:c.runtime.appId,platform:platform}}));case 5:return _context3.abrupt("return");case 6:if(!



platform){_context3.next=14;break;}
appFolder=(0,_common.getAppFolder)(c,platform);if(
_fs.default.existsSync(appFolder)){_context3.next=12;break;}
(0,_logger.logWarning)("Platform "+platform+" not created yet. creating them for you at "+appFolder);_context3.next=12;return _regenerator.default.awrap(
(0,_cli.default)(c,{
command:'platform',
subCommand:'configure',
program:{appConfig:c.runtime.appId,platform:platform}}));case 12:_context3.next=30;break;case 14:



platforms=c.buildConfig.platforms;if(
platforms){_context3.next=18;break;}
reject("Your "+_chalk.default.white(c.paths.appConfig.config)+" is missconfigured. (Maybe you have older version?). Missing "+_chalk.default.white('{ platforms: {} }')+" object at root");return _context3.abrupt("return");case 18:


ks=Object.keys(platforms);
i=0;case 20:if(!(i<ks.length)){_context3.next=30;break;}
k=ks[i];
_appFolder=(0,_common.getAppFolder)(c,k);if(
_fs.default.existsSync(_appFolder)){_context3.next=27;break;}
(0,_logger.logWarning)("Platform "+k+" not created yet. creating one for you at "+_appFolder);_context3.next=27;return _regenerator.default.awrap(
(0,_cli.default)(c,{
command:'platform',
subCommand:'configure',
platform:k,
program:{appConfig:c.runtime.appId,platform:k}}));case 27:i++;_context3.next=20;break;case 30:case"end":return _context3.stop();}}},null,null,null,Promise);};






var overridePlugins=function overridePlugins(c,pluginsPath){return new Promise(function(resolve){
(0,_logger.logTask)("overridePlugins:"+pluginsPath,_chalk.default.grey);

if(!_fs.default.existsSync(pluginsPath)){
(0,_logger.logInfo)("Your project plugin folder "+_chalk.default.white(pluginsPath)+" does not exists. skipping plugin configuration");
resolve();
return;
}

_fs.default.readdirSync(pluginsPath).forEach(function(dir){
if(dir.startsWith('@')){
var pluginsPathNested=_path.default.join(pluginsPath,dir);
_fs.default.readdirSync(pluginsPathNested).forEach(function(subDir){
_overridePlugins(c,pluginsPath,dir+"/"+subDir);
});
}else{
_overridePlugins(c,pluginsPath,dir);
}
});

resolve();
});};

var _overridePlugins=function _overridePlugins(c,pluginsPath,dir){
var source=_path.default.resolve(pluginsPath,dir,'overrides');
var dest=_path.default.resolve(c.paths.project.dir,'node_modules',dir);

if(_fs.default.existsSync(source)){
(0,_fileutils.copyFolderContentsRecursiveSync)(source,dest,false);



}else{
(0,_logger.logInfo)("Your plugin configuration has no override path "+_chalk.default.white(source)+". skipping folder override action");
}

var overrideConfig=(0,_fileutils.readObjectSync)(_path.default.resolve(pluginsPath,dir,'overrides.json'));
if(overrideConfig!=null&&overrideConfig.overrides){
for(var k in overrideConfig.overrides){
var override=overrideConfig.overrides[k];
ovDir=_path.default.join(dest,k);
if(_fs.default.existsSync(ovDir)){
if(_fs.default.lstatSync(ovDir).isDirectory()){
(0,_logger.logWarning)('overrides.json: Directories not supported yet. specify path to actual file');
}else{
var fileToFix=_fs.default.readFileSync(ovDir).toString();
for(var fk in override){
fileToFix=fileToFix.replace(new RegExp(fk,'g'),override[fk]);
}
_fs.default.writeFileSync(ovDir,fileToFix);
}
}
}
}
};
//# sourceMappingURL=index.js.map