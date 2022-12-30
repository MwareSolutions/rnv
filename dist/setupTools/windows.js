var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass"));var _inherits2=_interopRequireDefault(require("@babel/runtime/helpers/inherits"));var _possibleConstructorReturn2=_interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));var _getPrototypeOf2=_interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));var _shelljs=_interopRequireDefault(require("shelljs"));
var _getInstalledPath=require("get-installed-path");
var _path=_interopRequireDefault(require("path"));
var _child_process=require("child_process");
var _inquirer=_interopRequireDefault(require("inquirer"));
var _fs=_interopRequireDefault(require("fs"));

var _exec=require("../systemTools/exec");
var _logger=require("../systemTools/logger");
var _fileutils=require("../systemTools/fileutils");
var _base=_interopRequireDefault(require("./base"));
var _config=_interopRequireDefault(require("./config"));function _createSuper(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct();return function _createSuperInternal(){var Super=(0,_getPrototypeOf2.default)(Derived),result;if(hasNativeReflectConstruct){var NewTarget=(0,_getPrototypeOf2.default)(this).constructor;result=Reflect.construct(Super,arguments,NewTarget);}else{result=Super.apply(this,arguments);}return(0,_possibleConstructorReturn2.default)(this,result);};}function _isNativeReflectConstruct(){if(typeof Reflect==="undefined"||!Reflect.construct)return false;if(Reflect.construct.sham)return false;if(typeof Proxy==="function")return true;try{Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));return true;}catch(e){return false;}}var

LinuxPlatformSetup=function(_BasePlatformSetup){(0,_inherits2.default)(LinuxPlatformSetup,_BasePlatformSetup);var _super=_createSuper(LinuxPlatformSetup);
function LinuxPlatformSetup(c){var _this;(0,_classCallCheck2.default)(this,LinuxPlatformSetup);
_this=_super.call(this,'win32',c);
_this.scoopInstalled=false;return _this;
}(0,_createClass2.default)(LinuxPlatformSetup,[{key:"checkPrereqs",value:

function checkPrereqs(){
(0,_logger.logInfo)("Platform "+this.os);
(0,_logger.logInfo)('Checking wget is installed');
if((0,_exec.commandExistsSync)('wget')){
this.availableDownloader='wget';
}


if((0,_exec.commandExistsSync)('scoop')){
this.scoopInstalled=true;
}
}},{key:"installSoftware",value:

function installSoftware(software){return _regenerator.default.async(function installSoftware$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.next=2;return _regenerator.default.awrap(
_shelljs.default.exec((0,_fileutils.replaceHomeFolder)("~/scoop/shims/scoop install "+software)));case 2:_context.next=4;return _regenerator.default.awrap(
this.reloadPathEnv());case 4:return _context.abrupt("return",
true);case 5:case"end":return _context.stop();}}},null,this,null,Promise);}},{key:"addScoopBucket",value:


function addScoopBucket(bucket){
return _shelljs.default.exec((0,_fileutils.replaceHomeFolder)("~/scoop/shims/scoop bucket add "+bucket));
}},{key:"reloadPathEnv",value:

function reloadPathEnv(){return _regenerator.default.async(function reloadPathEnv$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.next=2;return _regenerator.default.awrap(
_shelljs.default.exec((0,_getInstalledPath.getInstalledPathSync)('rnv')+"/scripts/resetPath.vbs"));case 2:_context2.next=4;return _regenerator.default.awrap(
_shelljs.default.exec('%TEMP%/resetvars.bat'));case 4:return _context2.abrupt("return",
true);case 5:case"end":return _context2.stop();}}},null,null,null,Promise);}},{key:"installPrereqs",value:


function installPrereqs(){return _regenerator.default.async(function installPrereqs$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:if(
this.scoopInstalled){_context3.next=6;break;}
(0,_logger.logInfo)('Installing Scoop...');_context3.next=4;return _regenerator.default.awrap(
_shelljs.default.exec("powershell -executionpolicy remotesigned \"& \"\""+(0,_getInstalledPath.getInstalledPathSync)('rnv')+"/scripts/installPackageManager.ps1\"\"\""));case 4:_context3.next=6;return _regenerator.default.awrap(
this.reloadPathEnv());case 6:if(

this.availableDownloader){_context3.next=11;break;}
(0,_logger.logInfo)('Looks like you don\'t have wget or curl installed. We\'ll install wget for you');_context3.next=10;return _regenerator.default.awrap(
this.installSoftware('wget'));case 10:
this.availableDownloader='wget';case 11:if(


(0,_exec.commandExistsSync)('unzip')){_context3.next=15;break;}
(0,_logger.logInfo)('Looks like you don\'t have unzip installed. We\'ll install it for you');_context3.next=15;return _regenerator.default.awrap(
this.installSoftware('unzip'));case 15:if(


(0,_exec.commandExistsSync)('javac')){_context3.next=23;break;}
(0,_logger.logInfo)('Looks like you don\'t have java installed. We\'ll install it for you');_context3.next=19;return _regenerator.default.awrap(
this.installSoftware('shellcheck'));case 19:_context3.next=21;return _regenerator.default.awrap(
this.addScoopBucket('java'));case 21:_context3.next=23;return _regenerator.default.awrap(
this.installSoftware('ojdkbuild8'));case 23:return _context3.abrupt("return",


true);case 24:case"end":return _context3.stop();}}},null,this,null,Promise);}},{key:"installSdksAndEmulator",value:


function installSdksAndEmulator(){return _regenerator.default.async(function installSdksAndEmulator$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:
(0,_logger.logDebug)('Accepting licenses');_context4.next=3;return _regenerator.default.awrap(
(0,_exec.executeAsync)({},this.androidSdkLocation+"/tools/bin/sdkmanager.bat --licenses"));case 3:
(0,_logger.logDebug)('Installing SDKs',this.sdksToInstall);_context4.next=6;return _regenerator.default.awrap(
(0,_exec.executeAsync)({},this.androidSdkLocation+"/tools/bin/sdkmanager.bat "+this.sdksToInstall));case 6:case"end":return _context4.stop();}}},null,this,null,Promise);}},{key:"installTizenSdk",value:


function installTizenSdk(){var downloadDir,res;return _regenerator.default.async(function installTizenSdk$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:
downloadDir=_config.default.tizen.downloadLocation.split('/');
downloadDir.pop();
downloadDir=downloadDir.join('/');
(0,_logger.logInfo)("Opening "+downloadDir+". Please install the SDK then continue after it finished installing.");
(0,_child_process.exec)("start \"\" \""+downloadDir+"\"");_context5.next=7;return _regenerator.default.awrap(

_inquirer.default.prompt({
type:'input',
name:'sdkPath',
message:"Where did you install the SDK? (if you haven't changed the default just press enter)",
default:'C:\\tizen-studio',
validate:function validate(value){
if(_fs.default.existsSync(value))return true;
return'Path does not exist';
}}));case 7:res=_context5.sent;_context5.next=10;return _regenerator.default.awrap(


_inquirer.default.prompt({
type:'confirm',
name:'toolsInstalled',
message:'Please open Package Manager and install: Tizen SDK Tools (Main SDK), TV Extensions-* (Extension SDK). Continue after you finished installing them.',
validate:function validate(){
return _fs.default.existsSync(_path.default.join(res.sdkPath,'tools/ide/bin/tizen.bat'))||'This does not look like a Tizen SDK path';
}}));case 10:


this.tizenSdkPath=res.sdkPath;case 11:case"end":return _context5.stop();}}},null,this,null,Promise);}},{key:"installWebosSdk",value:


function installWebosSdk(){var downloadLink,res;return _regenerator.default.async(function installWebosSdk$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:
downloadLink=_config.default.webos.downloadLink;
(0,_logger.logInfo)("Opening "+downloadLink+". Please download and install the SDK then continue after it finished installing. Make sure you also install the CLI and Emulator components");
(0,_child_process.exec)(_exec.openCommand+" "+downloadLink);_context6.next=5;return _regenerator.default.awrap(
_inquirer.default.prompt({
type:'input',
name:'sdkPath',
message:"Where did you install the SDK? (if you haven't changed the default just press enter)",
default:'C:\\webOS_TV_SDK',
validate:function validate(value){
if(_fs.default.existsSync(value))return true;
return'Path does not exist';
}}));case 5:res=_context6.sent;_context6.next=8;return _regenerator.default.awrap(


_inquirer.default.prompt({
type:'confirm',
name:'toolsInstalled',
message:'Are the CLI and Emulator components installed?',
validate:function validate(){
return _fs.default.existsSync(_path.default.join(res.sdkPath,'tools/ide/bin/tizen.bat'))||'This does not look like a Tizen SDK path';
}}));case 8:


this.webosSdkPath=res.sdkPath;case 9:case"end":return _context6.stop();}}},null,this,null,Promise);}}]);return LinuxPlatformSetup;}(_base.default);var _default=



LinuxPlatformSetup;exports.default=_default;
//# sourceMappingURL=windows.js.map