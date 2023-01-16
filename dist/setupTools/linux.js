var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass"));var _inherits2=_interopRequireDefault(require("@babel/runtime/helpers/inherits"));var _possibleConstructorReturn2=_interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));var _getPrototypeOf2=_interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));var _shelljs=_interopRequireDefault(require("shelljs"));
var _path=_interopRequireDefault(require("path"));

var _exec=require("../systemTools/exec");
var _logger=require("../systemTools/logger");
var _base=_interopRequireDefault(require("./base"));
var _fileutils=require("../systemTools/fileutils");
var _config=_interopRequireDefault(require("./config"));
var _constants=require("../constants");function _createSuper(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct();return function _createSuperInternal(){var Super=(0,_getPrototypeOf2.default)(Derived),result;if(hasNativeReflectConstruct){var NewTarget=(0,_getPrototypeOf2.default)(this).constructor;result=Reflect.construct(Super,arguments,NewTarget);}else{result=Super.apply(this,arguments);}return(0,_possibleConstructorReturn2.default)(this,result);};}function _isNativeReflectConstruct(){if(typeof Reflect==="undefined"||!Reflect.construct)return false;if(Reflect.construct.sham)return false;if(typeof Proxy==="function")return true;try{Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));return true;}catch(e){return false;}}var






LinuxPlatformSetup=function(_BasePlatformSetup){(0,_inherits2.default)(LinuxPlatformSetup,_BasePlatformSetup);var _super=_createSuper(LinuxPlatformSetup);
function LinuxPlatformSetup(c){(0,_classCallCheck2.default)(this,LinuxPlatformSetup);return _super.call(this,
'linux',c);
}(0,_createClass2.default)(LinuxPlatformSetup,[{key:"installSoftware",value:

function installSoftware(software){return _regenerator.default.async(function installSoftware$(_context){while(1)switch(_context.prev=_context.next){case 0:if(!
(0,_exec.commandExistsSync)('apt-get')){_context.next=3;break;}_context.next=3;return _regenerator.default.awrap(
_shelljs.default.exec("apt-get -qq update && apt-get install "+software+" -y > /dev/null"));case 3:return _context.abrupt("return",


true);case 4:case"end":return _context.stop();}},null,null,null,Promise);}},{key:"installPrereqs",value:


function installPrereqs(){return _regenerator.default.async(function installPrereqs$(_context2){while(1)switch(_context2.prev=_context2.next){case 0:if(
this.availableDownloader){_context2.next=5;break;}
(0,_logger.logInfo)('Looks like you don\'t have wget or curl installed. We\'ll install wget for you');_context2.next=4;return _regenerator.default.awrap(
this.installSoftware('wget'));case 4:
this.availableDownloader='wget';case 5:if(


(0,_exec.commandExistsSync)('unzip')){_context2.next=9;break;}
(0,_logger.logInfo)('Looks like you don\'t have unzip installed. We\'ll install it for you');_context2.next=9;return _regenerator.default.awrap(
this.installSoftware('unzip'));case 9:if(


(0,_exec.commandExistsSync)('javac')){_context2.next=13;break;}
(0,_logger.logInfo)('Looks like you don\'t have java installed. We\'ll install it for you');_context2.next=13;return _regenerator.default.awrap(
this.installSoftware('openjdk-8-jdk'));case 13:return _context2.abrupt("return",


true);case 14:case"end":return _context2.stop();}},null,this,null,Promise);}},{key:"postInstall",value:


function postInstall(sdk){var location,ANDROID_SDK;return _regenerator.default.async(function postInstall$(_context3){while(1)switch(_context3.prev=_context3.next){case 0:if(!(
sdk==='android')){_context3.next=11;break;}
location=_config.default.android.location;
(0,_logger.logDebug)("Updating "+this.globalConfigPath+" with "+JSON.stringify({androidSdk:location}));_context3.next=5;return _regenerator.default.awrap(
(0,_fileutils.updateConfigFile)({androidSdk:location},this.globalConfigPath));case 5:

this.c.files.workspace.config.sdks.ANDROID_SDK=location;
ANDROID_SDK=this.c.files.workspace.config.sdks.ANDROID_SDK;
this.c.cli[_constants.CLI_ANDROID_EMULATOR]=(0,_fileutils.getRealPath)(this.c,_path.default.join(ANDROID_SDK,'emulator/emulator'));
this.c.cli[_constants.CLI_ANDROID_ADB]=(0,_fileutils.getRealPath)(this.c,_path.default.join(ANDROID_SDK,'platform-tools/adb'));
this.c.cli[_constants.CLI_ANDROID_AVDMANAGER]=(0,_fileutils.getRealPath)(this.c,_path.default.join(ANDROID_SDK,'tools/bin/avdmanager'));
this.c.cli[_constants.CLI_ANDROID_SDKMANAGER]=(0,_fileutils.getRealPath)(this.c,_path.default.join(ANDROID_SDK,'tools/bin/sdkmanager'));case 11:case"end":return _context3.stop();}},null,this,null,Promise);}}]);return LinuxPlatformSetup;}(_base.default);var _default=




LinuxPlatformSetup;exports.default=_default;
//# sourceMappingURL=linux.js.map