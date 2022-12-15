var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.checkCrypto=exports.rnvCryptoUpdateProfiles=exports.rnvCryptoInstallCerts=exports.rnvCryptoInstallProfiles=exports.rnvCryptoDecrypt=exports.rnvCryptoEncrypt=exports.rnvCryptoUpdateProfile=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _path=_interopRequireDefault(require("path"));
var _tar=_interopRequireDefault(require("tar"));
var _chalk=_interopRequireDefault(require("chalk"));
var _fs=_interopRequireDefault(require("fs"));
var _logger=require("./logger");
var _utils=require("../utils");
var _configParser=require("../configTools/configParser");
var _constants=require("../constants");
var _fileutils=require("./fileutils");
var _exec=require("./exec");
var _fastlane=require("../platformTools/apple/fastlane");
var _prompt=require("./prompt");
var _fileutils2=require("../../dist/systemTools/fileutils");

var getEnvVar=function getEnvVar(c){
var p1=c.paths.workspace.dir.split('/').pop().replace('.','');
var p2=c.files.project.package.name.replace('@','').replace('/','_').replace(/-/g,'_');
var envVar=("CRYPTO_"+p1+"_"+p2).toUpperCase();
(0,_logger.logDebug)('encrypt looking for env var:',envVar);
return envVar;
};

var rnvCryptoUpdateProfile=function rnvCryptoUpdateProfile(c){return _regenerator.default.async(function rnvCryptoUpdateProfile$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.next=2;return _regenerator.default.awrap(
(0,_fastlane.updateProfile)(c));case 2:case"end":return _context.stop();}}});};exports.rnvCryptoUpdateProfile=rnvCryptoUpdateProfile;


var rnvCryptoEncrypt=function rnvCryptoEncrypt(c){return new Promise(function(resolve,reject){var _c$files$project$conf,_c$files$project$conf2,_c$files$project$conf3;
(0,_logger.logTask)('rnvCryptoEncrypt');

var source="./"+c.files.project.package.name;
var destRaw=(_c$files$project$conf=c.files.project.config)==null?void 0:(_c$files$project$conf2=_c$files$project$conf.crypto)==null?void 0:(_c$files$project$conf3=_c$files$project$conf2.encrypt)==null?void 0:_c$files$project$conf3.dest;
var tsWorkspacePath=_path.default.join(c.paths.workspace.dir,c.files.project.package.name,'timestamp');

if(destRaw){
var dest=""+(0,_fileutils.getRealPath)(c,destRaw,'encrypt.dest');
var destTemp=_path.default.join(c.paths.workspace.dir,c.files.project.package.name.replace('/','-'))+".tgz";
var timestamp=new Date().getTime();
var envVar=getEnvVar(c);
var key=c.program.key||c.process.env[envVar];
if(!key){
reject("encrypt: You must pass "+_chalk.default.white('--key')+" or have env var "+_chalk.default.white(envVar)+" defined");
return;
}
_tar.default.c(
{
gzip:true,
file:destTemp,
cwd:c.paths.workspace.dir},

[source]).

then(function(){return(0,_exec.executeAsync)(c,_getOpenSllPath(c)+" enc -aes-256-cbc -md md5 -salt -in "+destTemp+" -out "+dest+" -k "+key,{privateParams:[key]});}).
then(function(){
(0,_fileutils.removeFilesSync)([destTemp]);
_fs.default.writeFileSync(dest+".timestamp",timestamp);
_fs.default.writeFileSync(""+tsWorkspacePath,timestamp);
(0,_logger.logSuccess)("Files succesfully encrypted into "+dest);
resolve();
}).catch(function(e){
reject(e);
});
}else{
(0,_logger.logWarning)("You don't have {{ crypto.encrypt.dest }} specificed in "+_chalk.default.white(c.paths.projectConfig));
resolve();
}
});};exports.rnvCryptoEncrypt=rnvCryptoEncrypt;

var rnvCryptoDecrypt=function rnvCryptoDecrypt(c){var _c$files$project$conf4,_c$files$project$conf5,_c$files$project$conf6;var sourceRaw,source,ts,destFolder,destTemp,envVar,wsPath,options,_ref,option,key;return _regenerator.default.async(function rnvCryptoDecrypt$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)('rnvCryptoDecrypt');

sourceRaw=(_c$files$project$conf4=c.files.project.config)==null?void 0:(_c$files$project$conf5=_c$files$project$conf4.crypto)==null?void 0:(_c$files$project$conf6=_c$files$project$conf5.decrypt)==null?void 0:_c$files$project$conf6.source;if(!

sourceRaw){_context2.next=40;break;}
source=""+(0,_fileutils.getRealPath)(c,sourceRaw,'decrypt.source');
ts=source+".timestamp";
destFolder=_path.default.join(c.paths.workspace.dir,c.files.project.package.name);
destTemp=_path.default.join(c.paths.workspace.dir,c.files.project.package.name.replace('/','-'))+".tgz";
envVar=getEnvVar(c);


wsPath=_path.default.join(c.paths.workspace.dir,c.files.project.package.name);if(!(
c.program.ci!==true&&c.program.reset!==true)){_context2.next=24;break;}
options=[
'Yes - override (recommended)',
'Yes - merge',
'Skip'];_context2.next=13;return _regenerator.default.awrap(

(0,_prompt.inquirerPrompt)({
name:'option',
type:'list',
choices:options,
message:"How to decrypt to "+_chalk.default.white(destFolder)+" ?"}));case 13:_ref=_context2.sent;option=_ref.option;if(!(

option===options[0])){_context2.next=20;break;}_context2.next=18;return _regenerator.default.awrap(
(0,_fileutils2.cleanFolder)(wsPath));case 18:_context2.next=22;break;case 20:if(!(
option===options[2])){_context2.next=22;break;}return _context2.abrupt("return",
true);case 22:_context2.next=26;break;case 24:_context2.next=26;return _regenerator.default.awrap(


(0,_fileutils2.cleanFolder)(wsPath));case 26:



key=c.program.key||c.process.env[envVar];if(
key){_context2.next=29;break;}return _context2.abrupt("return",
Promise.reject("encrypt: You must pass "+_chalk.default.white('--key')+" or have env var "+_chalk.default.white(envVar)+" defined"));case 29:if(

_fs.default.existsSync(source)){_context2.next=31;break;}return _context2.abrupt("return",
Promise.reject("Can't decrypt. "+_chalk.default.white(source)+" is missing!"));case 31:_context2.next=33;return _regenerator.default.awrap(


(0,_exec.executeAsync)(c,_getOpenSllPath(c)+" enc -aes-256-cbc -md md5 -d -in "+source+" -out "+destTemp+" -k "+key,{privateParams:[key]}));case 33:_context2.next=35;return _regenerator.default.awrap(

_tar.default.x({
file:destTemp,
cwd:c.paths.workspace.dir}));case 35:


(0,_fileutils.removeFilesSync)([destTemp]);
if(_fs.default.existsSync(ts)){
(0,_fileutils.copyFileSync)(ts,_path.default.join(c.paths.workspace.dir,c.files.project.package.name,'timestamp'));
}
(0,_logger.logSuccess)("Files succesfully extracted into "+destFolder);_context2.next=42;break;case 40:

(0,_logger.logWarning)("You don't have {{ crypto.encrypt.dest }} specificed in "+_chalk.default.white(c.paths.projectConfig));return _context2.abrupt("return",
true);case 42:case"end":return _context2.stop();}}});};exports.rnvCryptoDecrypt=rnvCryptoDecrypt;



var _getOpenSllPath=function _getOpenSllPath(c){var
platform=c.process.platform;
var defaultOpenssl='openssl';

if(_utils.isSystemMac)defaultOpenssl=_path.default.join(c.paths.rnv.dir,'bin/openssl-osx');





return defaultOpenssl;
};

var rnvCryptoInstallProfiles=function rnvCryptoInstallProfiles(c){return new Promise(function(resolve,reject){
(0,_logger.logTask)('rnvCryptoInstallProfiles');
if(c.platform!=='ios'){
(0,_logger.logError)("rnvCryptoInstallProfiles: platform "+c.platform+" not supported");
resolve();
return;
}

var ppFolder=_path.default.join(c.paths.home.dir,'Library/MobileDevice/Provisioning Profiles');

if(!_fs.default.existsSync(ppFolder)){
(0,_logger.logWarning)("folder "+ppFolder+" does not exist!");
(0,_fileutils.mkdirSync)(ppFolder);
}

var list=(0,_fileutils.getFileListSync)(c.paths.workspace.project.dir);
var mobileprovisionArr=list.filter(function(v){return v.endsWith('.mobileprovision');});

try{
mobileprovisionArr.forEach(function(v){
console.log("rnvCryptoInstallProfiles: Installing: "+v);
(0,_fileutils.copyFileSync)(v,ppFolder);
});
}catch(e){
(0,_logger.logError)(e);
}

resolve();
});};exports.rnvCryptoInstallProfiles=rnvCryptoInstallProfiles;

var rnvCryptoInstallCerts=function rnvCryptoInstallCerts(c){return new Promise(function(resolve,reject){
(0,_logger.logTask)('rnvCryptoInstallCerts');var
maxErrorLength=c.program.maxErrorLength;

if(c.platform!=='ios'){
(0,_logger.logError)("_installTempCerts: platform "+c.platform+" not supported");
resolve();
return;
}
var kChain=c.program.keychain||'ios-build.keychain';
var kChainPath=_path.default.join(c.paths.home.dir,'Library/Keychains',kChain);
var list=(0,_fileutils.getFileListSync)(c.paths.workspace.project.dir);
var cerPromises=[];
var cerArr=list.filter(function(v){return v.endsWith('.cer');});

Promise.all(cerArr.map(function(v){return(0,_exec.executeAsync)(c,"security import "+v+" -k "+kChain+" -A");})).
then(function(){return resolve();}).
catch(function(e){
(0,_logger.logWarning)(e);
resolve();
});
});};exports.rnvCryptoInstallCerts=rnvCryptoInstallCerts;


var rnvCryptoUpdateProfiles=function rnvCryptoUpdateProfiles(c){var appId;return _regenerator.default.async(function rnvCryptoUpdateProfiles$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:
(0,_logger.logTask)('rnvCryptoUpdateProfiles');_context3.t0=
c.platform;_context3.next=_context3.t0===
_constants.IOS?4:_context3.t0===
_constants.TVOS?4:9;break;case 4:
appId=c.runtime.appId;_context3.next=7;return _regenerator.default.awrap(
_updateProfiles(c));case 7:_context3.next=9;return _regenerator.default.awrap(
(0,_configParser.setAppConfig)(c,appId));case 9:return _context3.abrupt("return",

true);case 10:return _context3.abrupt("return",

Promise.reject("updateProfiles: Platform "+c.platform+" not supported"));case 11:case"end":return _context3.stop();}}});};exports.rnvCryptoUpdateProfiles=rnvCryptoUpdateProfiles;


var _updateProfiles=function _updateProfiles(c){
(0,_logger.logTask)('_updateProfiles',_chalk.default.grey);
var acList=(0,_configParser.listAppConfigsFoldersSync)(c,true);
var fullList=[];
var currentAppId=c.runtime.appId;

return acList.reduce(function(previousPromise,v){return previousPromise.then(function(){return _updateProfile(c,v);});},Promise.resolve());
};

var _updateProfile=function _updateProfile(c,v){return new Promise(function(resolve,reject){
(0,_logger.logTask)("_updateProfile:"+v,_chalk.default.grey);
(0,_fastlane.updateProfile)(c,v).
then(function(){return resolve();}).
catch(function(e){return reject(e);});
});};

var checkCrypto=function checkCrypto(c){var _c$files$project$conf7,_c$files$project$conf8,_c$files$project$conf9,_c$files$project$conf10,_c$files$project$conf11,_c$files$project$conf12;var sourceRaw,source,destRaw,_source,tsProjectPath,wsPath,tsWorkspacePath,tsWorkspace,tsProject;return _regenerator.default.async(function checkCrypto$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:
(0,_logger.logTask)('checkCrypto');if(!

c.program.ci){_context4.next=3;break;}return _context4.abrupt("return");case 3:

sourceRaw=(_c$files$project$conf7=c.files.project.config)==null?void 0:(_c$files$project$conf8=_c$files$project$conf7.crypto)==null?void 0:(_c$files$project$conf9=_c$files$project$conf8.decrypt)==null?void 0:_c$files$project$conf9.source;
source="./"+c.files.project.package.name;
destRaw=(_c$files$project$conf10=c.files.project.config)==null?void 0:(_c$files$project$conf11=_c$files$project$conf10.crypto)==null?void 0:(_c$files$project$conf12=_c$files$project$conf11.encrypt)==null?void 0:_c$files$project$conf12.dest;if(!

destRaw){_context4.next=26;break;}if(!(
sourceRaw&&destRaw)){_context4.next=26;break;}
_source=""+(0,_fileutils.getRealPath)(c,sourceRaw,'decrypt.source');
tsProjectPath=_source+".timestamp";
wsPath=_path.default.join(c.paths.workspace.dir,c.files.project.package.name);
tsWorkspacePath=_path.default.join(wsPath,'timestamp');if(
_fs.default.existsSync(_source)){_context4.next=16;break;}
(0,_logger.logWarning)('This project uses encrypted files but you don\'t have them installed');_context4.next=26;break;case 16:

tsWorkspace=0;
tsProject=0;
if(_fs.default.existsSync(tsWorkspacePath)){
tsWorkspace=parseInt(_fs.default.readFileSync(tsWorkspacePath).toString());
}

if(_fs.default.existsSync(tsProjectPath)){
tsProject=parseInt(_fs.default.readFileSync(tsProjectPath).toString());
}if(!(

tsProject>tsWorkspace)){_context4.next=25;break;}
(0,_logger.logWarning)("Your "+tsWorkspacePath+" is out of date. you should run decrypt");_context4.next=24;return _regenerator.default.awrap(
rnvCryptoDecrypt(c));case 24:return _context4.abrupt("return");case 25:



if(tsProject<tsWorkspace){
(0,_logger.logWarning)("Your "+tsWorkspacePath+" is newer than your project one.");
}case 26:case"end":return _context4.stop();}}});};exports.checkCrypto=checkCrypto;
//# sourceMappingURL=crypto.js.map