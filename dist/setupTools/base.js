var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _shelljs=_interopRequireDefault(require("shelljs"));
var _inquirer=_interopRequireDefault(require("inquirer"));

var _exec=require("../systemTools/exec");
var _configParser=require("../configTools/configParser");
var _fileutils=require("../systemTools/fileutils");
var _config=_interopRequireDefault(require("./config"));
var _config2=_interopRequireDefault(require("../config"));
var _logger=require("../systemTools/logger");var

BasePlatformSetup=function(){
function BasePlatformSetup(os,c){(0,_classCallCheck2.default)(this,BasePlatformSetup);

if(!c)c=_config2.default.getConfig();
var _c=c,paths=_c.paths;
this.os=os;
this.c=c;
this.globalConfigPath=paths.workspace.config;
this.availableDownloader=null;
this.androidSdkLocation=(0,_fileutils.replaceHomeFolder)('~/Android');
this.sdksToInstall='"build-tools;28.0.3" "emulator" "extras;android;m2repository" "extras;google;m2repository" "patcher;v4" "platform-tools" "platforms;android-28" "sources;android-28" "system-images;android-28;google_apis_playstore;x86" "tools"';
}(0,_createClass2.default)(BasePlatformSetup,[{key:"checkPrereqs",value:

function checkPrereqs(){
(0,_logger.logInfo)("Platform "+this.os);
(0,_logger.logInfo)('Checking if wget or curl is installed');
if((0,_exec.commandExistsSync)('wget')){
this.availableDownloader='wget';
}else if((0,_exec.commandExistsSync)('curl')){
this.availableDownloader='curl';
}
}},{key:"installPrereqs",value:

function installPrereqs(){return _regenerator.default.async(function installPrereqs$(_context){while(1)switch(_context.prev=_context.next){case 0:return _context.abrupt("return",

true);case 1:case"end":return _context.stop();}},null,null,null,Promise);}},{key:"postInstall",value:


function postInstall(sdk){var location;return _regenerator.default.async(function postInstall$(_context2){while(1)switch(_context2.prev=_context2.next){case 0:if(!(
sdk==='android')){_context2.next=6;break;}
location=_config.default.android.location;_context2.next=4;return _regenerator.default.awrap(
(0,_fileutils.updateConfigFile)({androidSdk:location},this.globalConfigPath));case 4:_context2.next=6;return _regenerator.default.awrap(
(0,_configParser.configureRnvGlobal)(this.c));case 6:if(!(


sdk==='tizen')){_context2.next=11;break;}_context2.next=9;return _regenerator.default.awrap(
(0,_fileutils.updateConfigFile)({tizenSdk:this.tizenSdkPath},this.globalConfigPath));case 9:_context2.next=11;return _regenerator.default.awrap(
(0,_configParser.configureRnvGlobal)(this.c));case 11:if(!(


sdk==='webos')){_context2.next=16;break;}_context2.next=14;return _regenerator.default.awrap(
(0,_fileutils.updateConfigFile)({webosSdk:this.webosSdkPath},this.globalConfigPath));case 14:_context2.next=16;return _regenerator.default.awrap(
(0,_configParser.configureRnvGlobal)(this.c));case 16:case"end":return _context2.stop();}},null,this,null,Promise);}},{key:"downloadSdk",value:



function downloadSdk(sdk){var downloader,aditionalArguments,locationArgument,command;return _regenerator.default.async(function downloadSdk$(_context3){while(1)switch(_context3.prev=_context3.next){case 0:
downloader=this.availableDownloader;if(
downloader){_context3.next=3;break;}throw new Error('Wget or cURL not installed!');case 3:
(0,_logger.logDebug)("Downloading "+sdk+" SDK to "+_config.default[sdk].downloadLocation+" using "+downloader);_context3.next=6;return _regenerator.default.awrap(

_shelljs.default.rm(_config.default[sdk].downloadLocation));case 6:



if(downloader==='wget'){
aditionalArguments='-q';
locationArgument=(0,_fileutils.replaceHomeFolder)('-P ~/');
}
if(downloader==='curl'){
aditionalArguments='-#';
locationArgument="--output "+_config.default[sdk].downloadLocation;
}

command=downloader+" "+aditionalArguments+" "+_config.default[sdk].sdkUrl+" "+locationArgument;

(0,_logger.logDebug)('Running',command);
(0,_logger.logInfo)("Downloading "+sdk+" SDK...");_context3.next=13;return _regenerator.default.awrap(
_shelljs.default.exec(command));case 13:case"end":return _context3.stop();}},null,this,null,Promise);}},{key:"unzipSdk",value:


function unzipSdk(sdk){return _regenerator.default.async(function unzipSdk$(_context4){while(1)switch(_context4.prev=_context4.next){case 0:
(0,_logger.logDebug)("Unzipping from "+_config.default[sdk].downloadLocation+" to "+_config.default[sdk].location);if(
(0,_exec.commandExistsSync)('unzip')){_context4.next=3;break;}throw new Error('unzip is not installed');case 3:_context4.next=5;return _regenerator.default.awrap(
_shelljs.default.exec("unzip -qq -o "+_config.default[sdk].downloadLocation+" -d "+_config.default[sdk].location));case 5:case"end":return _context4.stop();}},null,null,null,Promise);}},{key:"installSdksAndEmulator",value:


function installSdksAndEmulator(){return _regenerator.default.async(function installSdksAndEmulator$(_context5){while(1)switch(_context5.prev=_context5.next){case 0:
(0,_logger.logDebug)('Accepting licenses');_context5.next=3;return _regenerator.default.awrap(
_shelljs.default.exec("yes | "+_config.default.android.location+"/tools/bin/sdkmanager --licenses > /dev/null"));case 3:
(0,_logger.logDebug)('Installing SDKs',this.sdksToInstall);_context5.next=6;return _regenerator.default.awrap(
_shelljs.default.exec(_config.default.android.location+"/tools/bin/sdkmanager "+this.sdksToInstall+" > /dev/null"));case 6:case"end":return _context5.stop();}},null,this,null,Promise);}},{key:"installSdk",value:


function installSdk(sdk,skipPrereq){return _regenerator.default.async(function installSdk$(_context6){while(1)switch(_context6.prev=_context6.next){case 0:
(0,_logger.logTask)("installSdk:"+sdk);
!skipPrereq&&this.checkPrereqs();_context6.t0=
!skipPrereq;if(!_context6.t0){_context6.next=6;break;}_context6.next=6;return _regenerator.default.awrap(this.installPrereqs());case 6:_context6.t1=

sdk;_context6.next=_context6.t1===
'android'?9:_context6.t1===




'tizen'?16:_context6.t1===


'webos'?19:_context6.t1===


'fastlane'?22:_context6.t1===


'docker'?25:28;break;case 9:_context6.next=11;return _regenerator.default.awrap(this.downloadSdk(sdk));case 11:_context6.next=13;return _regenerator.default.awrap(this.unzipSdk(sdk));case 13:_context6.next=15;return _regenerator.default.awrap(this.installSdksAndEmulator());case 15:return _context6.abrupt("break",29);case 16:_context6.next=18;return _regenerator.default.awrap(this.installTizenSdk());case 18:return _context6.abrupt("break",29);case 19:_context6.next=21;return _regenerator.default.awrap(this.installWebosSdk());case 21:return _context6.abrupt("break",29);case 22:_context6.next=24;return _regenerator.default.awrap(this.installFastlane());case 24:return _context6.abrupt("break",29);case 25:_context6.next=27;return _regenerator.default.awrap(
this.installDocker());case 27:return _context6.abrupt("break",29);case 28:return _context6.abrupt("break",29);case 29:





this.postInstall(sdk);case 30:case"end":return _context6.stop();}},null,this,null,Promise);}},{key:"installTizenSdk",value:


function installTizenSdk(){return _regenerator.default.async(function installTizenSdk$(_context7){while(1)switch(_context7.prev=_context7.next){case 0:

(0,_logger.logError)('Install webos sdk not supported yet. Follow https://developer.tizen.org/development/tizen-studio/download to install it manually');return _context7.abrupt("return",
true);case 2:case"end":return _context7.stop();}},null,null,null,Promise);}},{key:"installWebosSdk",value:


function installWebosSdk(){return _regenerator.default.async(function installWebosSdk$(_context8){while(1)switch(_context8.prev=_context8.next){case 0:

(0,_logger.logError)('Install webos sdk not supported yet. Follow http://webostv.developer.lge.com/sdk/installation/ to install it manually');return _context8.abrupt("return",
true);case 2:case"end":return _context8.stop();}},null,null,null,Promise);}},{key:"installFastlane",value:


function installFastlane(){return _regenerator.default.async(function installFastlane$(_context9){while(1)switch(_context9.prev=_context9.next){case 0:

(0,_logger.logError)('Install fastlane not supported yet. Follow https://docs.fastlane.tools/getting-started/ios/setup/ to install it manually');return _context9.abrupt("return",
true);case 2:case"end":return _context9.stop();}},null,null,null,Promise);}},{key:"installDocker",value:


function installDocker(){return _regenerator.default.async(function installDocker$(_context10){while(1)switch(_context10.prev=_context10.next){case 0:

(0,_logger.logError)('Install docker not supported yet');return _context10.abrupt("return",
true);case 2:case"end":return _context10.stop();}},null,null,null,Promise);}},{key:"askToInstallSDK",value:


function askToInstallSDK(sdk){var sdkInstall,response;return _regenerator.default.async(function askToInstallSDK$(_context11){while(1)switch(_context11.prev=_context11.next){case 0:if(

this.c.program.ci){_context11.next=5;break;}_context11.next=3;return _regenerator.default.awrap(
_inquirer.default.prompt([{
name:'sdkInstall',
type:'confirm',
message:"Do you want to install "+sdk+" SDK?"
}]));case 3:response=_context11.sent;

sdkInstall=response.sdkInstall;case 5:if(!(


this.c.program.ci||sdkInstall)){_context11.next=10;break;}_context11.next=8;return _regenerator.default.awrap(
this.installSdk(sdk,['fastlane','docker'].includes(sdk)));case 8:_context11.next=11;break;case 10:throw(

new Error("You can't run the project on this platform without "+sdk+" sdk installed"));case 11:case"end":return _context11.stop();}},null,this,null,Promise);}}]);return BasePlatformSetup;}();var _default=




BasePlatformSetup;exports.default=_default;
//# sourceMappingURL=base.js.map