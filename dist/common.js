var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.writeCleanFile=exports.waitForWebpack=exports.waitForEmulator=exports.sanitizeColor=exports.resolveNodeModulePath=exports.logErrorPlatform=exports.isBuildSchemeSupported=exports.initializeBuilder=exports.importPackageFromProject=exports.getSourceExtsAsString=exports.getSourceExts=exports.getIP=exports.getGetJsBundleFile=exports.getFlavouredProp=exports.getEntryFile=exports.getConfigProp=exports.getBuildsFolder=exports.getBuildFilePath=exports.getBinaryPath=exports.getAppVersionCode=exports.getAppVersion=exports.getAppTitle=exports.getAppTemplateFolder=exports.getAppSubFolder=exports.getAppLicense=exports.getAppId=exports.getAppFolder=exports.getAppDescription=exports.getAppAuthor=exports.generateChecksum=exports.default=exports.confirmActiveBundler=exports.configureIfRequired=exports.cleanPlatformIfRequired=exports.checkPortInUse=exports.PLATFORM_RUNS=exports.CLI_PROPS=void 0;var _toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _chalk=_interopRequireDefault(require("chalk"));
var _fs=_interopRequireDefault(require("fs"));
var _path=_interopRequireDefault(require("path"));
var _detectPort=_interopRequireDefault(require("detect-port"));
var _ora=_interopRequireDefault(require("ora"));
var _ip=_interopRequireDefault(require("ip"));
var _axios=_interopRequireDefault(require("axios"));
var _colorString=_interopRequireDefault(require("color-string"));
var _crypto=_interopRequireDefault(require("crypto"));
var _utils=require("./utils");
var _platformTools=require("./platformTools");
var _cli=_interopRequireDefault(require("./cli"));
var _logger=require("./systemTools/logger");




var _constants=require("./constants");




var _exec=require("./systemTools/exec");
var _configParser=require("./configTools/configParser");


var _projectParser=require("./projectTools/projectParser");
var _prompt=require("./systemTools/prompt");
var _config=_interopRequireDefault(require("./config"));

var initializeBuilder=function initializeBuilder(cmd,subCmd,process,program){var c;return _regenerator.default.async(function initializeBuilder$(_context){while(1)switch(_context.prev=_context.next){case 0:
c=(0,_configParser.createRnvConfig)(program,process,cmd,subCmd);

(0,_logger.configureLogger)(c,c.process,c.command,c.subCommand,program.info===true);
(0,_logger.logInitialize)();return _context.abrupt("return",

c);case 4:case"end":return _context.stop();}},null,null,null,Promise);};exports.initializeBuilder=initializeBuilder;



var generateChecksum=function generateChecksum(str,algorithm,encoding){return _crypto.default.
createHash(algorithm||'md5').
update(str,'utf8').
digest(encoding||'hex');};exports.generateChecksum=generateChecksum;

var getSourceExts=function getSourceExts(c){var _PLATFORMS$c$platform;
var sExt=(_PLATFORMS$c$platform=_constants.PLATFORMS[c.platform])==null?void 0:_PLATFORMS$c$platform.sourceExts;
if(sExt){
return[].concat((0,_toConsumableArray2.default)(sExt.factors),(0,_toConsumableArray2.default)(sExt.platforms),(0,_toConsumableArray2.default)(sExt.fallbacks));
}
return[];
};exports.getSourceExts=getSourceExts;

var getSourceExtsAsString=function getSourceExtsAsString(c){
var sourceExts=getSourceExts(c);
return sourceExts.length?"['"+sourceExts.join('\',\'')+"']":'[]';
};exports.getSourceExtsAsString=getSourceExtsAsString;

var sanitizeColor=function sanitizeColor(val){
if(!val){
(0,_logger.logWarning)('sanitizeColor: passed null. will use default #FFFFFF instead');
return{
rgb:[255,255,255,1],
rgbDecimal:[1,1,1,1],
hex:'#FFFFFF'
};
}

var rgb=_colorString.default.get.rgb(val);
var hex=_colorString.default.to.hex(rgb);

return{
rgb:rgb,
rgbDecimal:rgb.map(function(v){return v>1?Math.round(v/255*10)/10:v;}),
hex:hex
};
};exports.sanitizeColor=sanitizeColor;

var isBuildSchemeSupported=function isBuildSchemeSupported(c){var scheme,buildSchemes,schemeDoesNotExist,opts,_await$inquirerPrompt,selectedScheme;return _regenerator.default.async(function isBuildSchemeSupported$(_context2){while(1)switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)("isBuildSchemeSupported:"+c.platform);

scheme=c.program.scheme;

if(!c.buildConfig.platforms[c.platform]){
c.buildConfig.platforms[c.platform]={};
}

buildSchemes=c.buildConfig.platforms[c.platform].buildSchemes;if(


buildSchemes){_context2.next=7;break;}
(0,_logger.logWarning)("Your appConfig for platform "+c.platform+" has no buildSchemes. Will continue with defaults");return _context2.abrupt("return",
false);case 7:


schemeDoesNotExist=scheme&&!buildSchemes[scheme];if(!(
scheme===true||schemeDoesNotExist)){_context2.next=17;break;}
if(schemeDoesNotExist&&scheme&&scheme!==true){
(0,_logger.logError)('Build scheme you picked does not exists.');
}
opts=(0,_prompt.generateOptions)(buildSchemes);_context2.next=13;return _regenerator.default.awrap(

(0,_prompt.inquirerPrompt)({
name:'selectedScheme',
type:'list',
message:'Pick one of available buildSchemes',
choices:opts.keysAsArray,
logMessage:'You need to specify scheme'
}));case 13:_await$inquirerPrompt=_context2.sent;selectedScheme=_await$inquirerPrompt.selectedScheme;

c.program.scheme=selectedScheme;return _context2.abrupt("return",
selectedScheme);case 17:return _context2.abrupt("return",

scheme);case 18:case"end":return _context2.stop();}},null,null,null,Promise);};exports.isBuildSchemeSupported=isBuildSchemeSupported;


var confirmActiveBundler=function confirmActiveBundler(c){var _await$inquirerPrompt2,confirm;return _regenerator.default.async(function confirmActiveBundler$(_context3){while(1)switch(_context3.prev=_context3.next){case 0:if(!
c.runtime.skipActiveServerCheck){_context3.next=2;break;}return _context3.abrupt("return",true);case 2:_context3.next=4;return _regenerator.default.awrap(
(0,_prompt.inquirerPrompt)({
type:'confirm',
message:'It will be used for this session. Continue?',
warningMessage:"Another "+c.platform+" server at port "+c.runtime.port+" already running"
}));case 4:_await$inquirerPrompt2=_context3.sent;confirm=_await$inquirerPrompt2.confirm;if(!

confirm){_context3.next=8;break;}return _context3.abrupt("return",true);case 8:return _context3.abrupt("return",
Promise.reject('Cancelled by user'));case 9:case"end":return _context3.stop();}},null,null,null,Promise);};exports.confirmActiveBundler=confirmActiveBundler;


var getAppFolder=function getAppFolder(c,platform){return _path.default.join(c.paths.project.builds.dir,c.runtime.appId+"_"+platform);};exports.getAppFolder=getAppFolder;

var getAppSubFolder=function getAppSubFolder(c,platform){
var subFolder='';
if(platform===_constants.IOS)subFolder='RNVApp';else
if(platform===_constants.TVOS)subFolder='RNVAppTVOS';
return _path.default.join(getAppFolder(c,platform),subFolder);
};exports.getAppSubFolder=getAppSubFolder;

var getAppTemplateFolder=function getAppTemplateFolder(c,platform){return _path.default.join(c.paths.project.platformTemplatesDirs[platform],""+platform);};exports.getAppTemplateFolder=getAppTemplateFolder;

var CLI_PROPS=[
'provisioningStyle',
'codeSignIdentity',
'provisionProfileSpecifier'];exports.CLI_PROPS=CLI_PROPS;



var getConfigProp=function getConfigProp(c,platform,key,defaultVal){
if(!c.buildConfig){
(0,_logger.logError)('getConfigProp: c.buildConfig is undefined!');
return null;
}
var p=c.buildConfig.platforms[platform];
var ps=c.runtime.scheme;
var resultPlatforms;
var scheme;
if(p){
scheme=p.buildSchemes?p.buildSchemes[ps]:undefined;
resultPlatforms=getFlavouredProp(c,c.buildConfig.platforms[platform],key);
}

scheme=scheme||{};
var resultCli=CLI_PROPS.includes(key)?c.program[key]:undefined;
var resultScheme=scheme[key];
var resultCommon=getFlavouredProp(c,c.buildConfig.common,key);

var result=_config.default.getValueOrMergedObject(resultCli,resultScheme,resultPlatforms,resultCommon);

if(result===undefined)result=defaultVal;
(0,_logger.logTask)("getConfigProp:"+platform+":"+key+":"+result,_chalk.default.grey);
return result;
};exports.getConfigProp=getConfigProp;

var getAppId=function getAppId(c,platform){
var id=getConfigProp(c,platform,'id');
var idSuffix=getConfigProp(c,platform,'idSuffix');
return idSuffix?""+id+idSuffix:id;
};exports.getAppId=getAppId;

var getAppTitle=function getAppTitle(c,platform){return getConfigProp(c,platform,'title');};exports.getAppTitle=getAppTitle;

var getAppVersion=function getAppVersion(c,platform){var _c$files$project$pack;return getConfigProp(c,platform,'version')||((_c$files$project$pack=c.files.project.package)==null?void 0:_c$files$project$pack.version);};exports.getAppVersion=getAppVersion;

var getAppAuthor=function getAppAuthor(c,platform){var _c$files$project$pack2;return getConfigProp(c,platform,'author')||((_c$files$project$pack2=c.files.project.package)==null?void 0:_c$files$project$pack2.author);};exports.getAppAuthor=getAppAuthor;

var getAppLicense=function getAppLicense(c,platform){var _c$files$project$pack3;return getConfigProp(c,platform,'license')||((_c$files$project$pack3=c.files.project.package)==null?void 0:_c$files$project$pack3.license);};exports.getAppLicense=getAppLicense;

var getEntryFile=function getEntryFile(c,platform){var _c$buildConfig$platfo,_c$buildConfig$platfo2;return(_c$buildConfig$platfo=c.buildConfig.platforms)==null?void 0:(_c$buildConfig$platfo2=_c$buildConfig$platfo[platform])==null?void 0:_c$buildConfig$platfo2.entryFile;};exports.getEntryFile=getEntryFile;

var getGetJsBundleFile=function getGetJsBundleFile(c,platform){return getConfigProp(c,platform,'getJsBundleFile');};exports.getGetJsBundleFile=getGetJsBundleFile;

var getAppDescription=function getAppDescription(c,platform){var _c$files$project$pack4;return getConfigProp(c,platform,'description')||((_c$files$project$pack4=c.files.project.package)==null?void 0:_c$files$project$pack4.description);};exports.getAppDescription=getAppDescription;

var getAppVersionCode=function getAppVersionCode(c,platform){
var versionCode=getConfigProp(c,platform,'versionCode');
if(versionCode)return versionCode;

var version=getAppVersion(c,platform);

var vc='';
version.
split('-')[0].
split('.').
forEach(function(v){
vc+=v.length>1?v:"0"+v;
});
return Number(vc).toString();
};exports.getAppVersionCode=getAppVersionCode;

var logErrorPlatform=function logErrorPlatform(c,platform){
(0,_logger.logError)("Platform: "+_chalk.default.white(platform)+" doesn't support command: "+_chalk.default.white(c.command));
};exports.logErrorPlatform=logErrorPlatform;

var PLATFORM_RUNS={};exports.PLATFORM_RUNS=PLATFORM_RUNS;

var configureIfRequired=function configureIfRequired(c,platform){var device,nc;return _regenerator.default.async(function configureIfRequired$(_context4){while(1)switch(_context4.prev=_context4.next){case 0:
(0,_logger.logTask)("configureIfRequired:"+platform);if(!

PLATFORM_RUNS[platform]){_context4.next=3;break;}return _context4.abrupt("return");case 3:


PLATFORM_RUNS[platform]=true;
device=c.program.device;
nc={
command:'configure',
program:{
appConfig:c.id,
update:false,
platform:platform,
device:device
}
};if(!

c.program.reset){_context4.next=9;break;}_context4.next=9;return _regenerator.default.awrap(
(0,_platformTools.cleanPlatformBuild)(c,platform));case 9:if(!


c.program.resetHard){_context4.next=12;break;}_context4.next=12;return _regenerator.default.awrap(
(0,_projectParser.cleanPlaformAssets)(c));case 12:_context4.next=14;return _regenerator.default.awrap(

(0,_platformTools.createPlatformBuild)(c,platform));case 14:_context4.next=16;return _regenerator.default.awrap(
(0,_cli.default)(c,nc));case 16:case"end":return _context4.stop();}},null,null,null,Promise);};exports.configureIfRequired=configureIfRequired;


var getBinaryPath=function getBinaryPath(c,platform){
var appFolder=getAppFolder(c,platform);
var id=getConfigProp(c,platform,'id');
var signingConfig=getConfigProp(c,platform,'signingConfig','debug');
var version=getAppVersion(c,platform);
var productName='ReNative - macos';
var appName=getConfigProp(c,platform,'appName');

switch(platform){
case _constants.IOS:
case _constants.TVOS:
return appFolder+"/release/RNVApp.ipa";
case _constants.ANDROID:
case _constants.ANDROID_TV:
case _constants.ANDROID_WEAR:
return appFolder+"/app/build/outputs/apk/"+signingConfig+"/app-"+signingConfig+".apk";
case _constants.WEB:
return appFolder+"/public";
case _constants.MACOS:
case _constants.WINDOWS:
return appFolder+"/build/release/"+productName+"-"+version;
case _constants.TIZEN:
case _constants.TIZEN_MOBILE:
return appFolder+"/output/"+appName+".wgt";
case _constants.WEBOS:
return appFolder+"/output/"+id+"_"+version+"_all.ipk";
default:
return appFolder;}

};exports.getBinaryPath=getBinaryPath;

var writeCleanFile=function writeCleanFile(source,destination,overrides){

if(!_fs.default.existsSync(source)){
(0,_logger.logError)("Cannot write file. source path doesn't exists: "+source);
return;
}
if(!_fs.default.existsSync(destination)){
(0,_logger.logWarning)("destination path doesn't exists: "+destination+". will create new one");

}
var pFile=_fs.default.readFileSync(source,'utf8');
var pFileClean=pFile;
if(overrides){
overrides.forEach(function(v){
var regEx=new RegExp(v.pattern,'g');
pFileClean=pFileClean.replace(regEx,v.override);
});
}

_fs.default.writeFileSync(destination,pFileClean,'utf8');
};exports.writeCleanFile=writeCleanFile;

var getBuildsFolder=function getBuildsFolder(c,platform,customPath){
var pp=customPath||c.paths.appConfig.dir;



var p=_path.default.join(pp,"builds/"+platform+"@"+c.runtime.scheme);
if(_fs.default.existsSync(p))return p;
return _path.default.join(pp,"builds/"+platform);
};exports.getBuildsFolder=getBuildsFolder;

var getIP=function getIP(){return _ip.default.address();};exports.getIP=getIP;

var cleanPlatformIfRequired=function cleanPlatformIfRequired(c,platform){return _regenerator.default.async(function cleanPlatformIfRequired$(_context5){while(1)switch(_context5.prev=_context5.next){case 0:if(!
c.program.reset){_context5.next=4;break;}
(0,_logger.logInfo)("You passed "+_chalk.default.white('-r')+" argument. paltform "+_chalk.default.white(platform)+" will be cleaned up first!");_context5.next=4;return _regenerator.default.awrap(
(0,_platformTools.cleanPlatformBuild)(c,platform));case 4:case"end":return _context5.stop();}},null,null,null,Promise);};exports.cleanPlatformIfRequired=cleanPlatformIfRequired;



var checkPortInUse=function checkPortInUse(c,platform,port){return new Promise(function(resolve,reject){
(0,_detectPort.default)(port,function(err,availablePort){
if(err){
reject(err);
return;
}
resolve(parseInt(port,10)!==parseInt(availablePort,10));
});
});};exports.checkPortInUse=checkPortInUse;

var resolveNodeModulePath=function resolveNodeModulePath(c,filePath){
var pth=_path.default.join(c.paths.rnv.nodeModulesDir,filePath);
if(!_fs.default.existsSync(pth)){
pth=_path.default.join(c.paths.project.nodeModulesDir,filePath);
}
return pth;
};exports.resolveNodeModulePath=resolveNodeModulePath;

var getFlavouredProp=function getFlavouredProp(c,obj,key){
if(!key)return null;
var val1=obj[key+"@"+c.runtime.scheme];
if(val1)return val1;
return obj[key];
};exports.getFlavouredProp=getFlavouredProp;

var getBuildFilePath=function getBuildFilePath(c,platform,filePath){

var sp=_path.default.join(getAppTemplateFolder(c,platform),filePath);

var sp2=_path.default.join(getBuildsFolder(c,platform,c.paths.project.projectConfig.dir),filePath);
if(_fs.default.existsSync(sp2))sp=sp2;

var sp3=_path.default.join(getBuildsFolder(c,platform),filePath);
if(_fs.default.existsSync(sp3))sp=sp3;
return sp;
};exports.getBuildFilePath=getBuildFilePath;

var waitForEmulator=function waitForEmulator(c,cli,command,callback){var attempts,maxAttempts,CHECK_INTEVAL,maxErrorLength,spinner;return _regenerator.default.async(function waitForEmulator$(_context6){while(1)switch(_context6.prev=_context6.next){case 0:
attempts=0;
maxAttempts=30;
CHECK_INTEVAL=2000;
maxErrorLength=c.program.maxErrorLength;
spinner=(0,_ora.default)('Waiting for emulator to boot...').start();return _context6.abrupt("return",

new Promise(function(resolve,reject){
var interval=setInterval(function(){
(0,_exec.execCLI)(c,cli,command,{silent:true,timeout:10000,maxErrorLength:maxErrorLength}).
then(function(resp){
if(callback(resp)){
clearInterval(interval);
spinner.succeed();
return resolve(true);
}
attempts++;
if(attempts===maxAttempts){
clearInterval(interval);
spinner.fail('Can\'t connect to the running emulator. Try restarting it.');
return reject('Can\'t connect to the running emulator. Try restarting it.');
}
}).catch(function(){
attempts++;
if(attempts>maxAttempts){
clearInterval(interval);
spinner.fail('Can\'t connect to the running emulator. Try restarting it.');
return reject('Can\'t connect to the running emulator. Try restarting it.');
}
});
},CHECK_INTEVAL);
}));case 6:case"end":return _context6.stop();}},null,null,null,Promise);};exports.waitForEmulator=waitForEmulator;


var waitForWebpack=function waitForWebpack(c){var attempts,maxAttempts,CHECK_INTEVAL,extendConfig,devServerHost,url;return _regenerator.default.async(function waitForWebpack$(_context7){while(1)switch(_context7.prev=_context7.next){case 0:
(0,_logger.logTask)("waitForWebpack:"+c.runtime.port);
attempts=0;
maxAttempts=10;
CHECK_INTEVAL=2000;


extendConfig=getConfigProp(c,c.platform,'webpackConfig',{});
devServerHost=(0,_utils.getValidLocalhost)(extendConfig.devServerHost,c.runtime.localhost);
url="http://"+devServerHost+":"+c.runtime.port+"/assets/bundle.js";return _context7.abrupt("return",
new Promise(function(resolve,reject){
var interval=setInterval(function(){
_axios.default.get(url).then(function(res){
if(res.status===200){
clearInterval(interval);

return resolve(true);
}
attempts++;
if(attempts===maxAttempts){
clearInterval(interval);

return reject('Can\'t connect to webpack. Try restarting it.');
}
}).catch(function(){
attempts++;
if(attempts>maxAttempts){
clearInterval(interval);

return reject('Can\'t connect to webpack. Try restarting it.');
}
});
},CHECK_INTEVAL);
}));case 8:case"end":return _context7.stop();}},null,null,null,Promise);};exports.waitForWebpack=waitForWebpack;

var importPackageFromProject=function importPackageFromProject(name){
var c=_config.default.getConfig();

var pkg=require(_path.default.join(c.paths.project.nodeModulesDir,"/"+name));
if(pkg.default)return pkg.default;
return pkg;
};exports.importPackageFromProject=importPackageFromProject;var _default=

{
getBuildFilePath:getBuildFilePath,
getBuildsFolder:getBuildsFolder,
isBuildSchemeSupported:isBuildSchemeSupported,
getAppFolder:getAppFolder,
getAppTemplateFolder:getAppTemplateFolder,
initializeBuilder:initializeBuilder,
logErrorPlatform:logErrorPlatform,
configureIfRequired:configureIfRequired,
getAppId:getAppId,
getAppTitle:getAppTitle,
getAppVersion:getAppVersion,
getAppVersionCode:getAppVersionCode,
writeCleanFile:writeCleanFile,
getEntryFile:getEntryFile,
getGetJsBundleFile:getGetJsBundleFile,
getAppDescription:getAppDescription,
getAppAuthor:getAppAuthor,
getAppLicense:getAppLicense,
getConfigProp:getConfigProp,
getIP:getIP,
cleanPlatformIfRequired:cleanPlatformIfRequired,
checkPortInUse:checkPortInUse,
resolveNodeModulePath:resolveNodeModulePath,
waitForEmulator:waitForEmulator
};exports.default=_default;
//# sourceMappingURL=common.js.map