var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass"));var _inherits2=_interopRequireDefault(require("@babel/runtime/helpers/inherits"));var _possibleConstructorReturn2=_interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));var _getPrototypeOf2=_interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));var _exec=require("../systemTools/exec");
var _base=_interopRequireDefault(require("./base"));
var _config=_interopRequireDefault(require("../config"));function _createSuper(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct();return function _createSuperInternal(){var Super=(0,_getPrototypeOf2.default)(Derived),result;if(hasNativeReflectConstruct){var NewTarget=(0,_getPrototypeOf2.default)(this).constructor;result=Reflect.construct(Super,arguments,NewTarget);}else{result=Super.apply(this,arguments);}return(0,_possibleConstructorReturn2.default)(this,result);};}function _isNativeReflectConstruct(){if(typeof Reflect==="undefined"||!Reflect.construct)return false;if(Reflect.construct.sham)return false;if(typeof Proxy==="function")return true;try{Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));return true;}catch(e){return false;}}var

LinuxPlatformSetup=function(_BasePlatformSetup){(0,_inherits2.default)(LinuxPlatformSetup,_BasePlatformSetup);var _super=_createSuper(LinuxPlatformSetup);
function LinuxPlatformSetup(){(0,_classCallCheck2.default)(this,LinuxPlatformSetup);return _super.call(this,
'darwin');
}(0,_createClass2.default)(LinuxPlatformSetup,[{key:"installFastlane",value:

function installFastlane(){var c;return _regenerator.default.async(function installFastlane$(_context){while(1){switch(_context.prev=_context.next){case 0:
c=_config.default.getConfig();if(!
(0,_exec.commandExistsSync)('brew')){_context.next=3;break;}return _context.abrupt("return",
(0,_exec.executeAsync)(c,'brew cask install fastlane',{interactive:true}));case 3:return _context.abrupt("return",

(0,_exec.executeAsync)(c,'sudo gem install fastlane -NV',{interactive:true}));case 4:case"end":return _context.stop();}}},null,null,null,Promise);}},{key:"installDocker",value:


function installDocker(){return _regenerator.default.async(function installDocker$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:throw(
new Error('Automated Docker install is not supported on this platform. Please go to https://hub.docker.com/editions/community/docker-ce-desktop-mac and install it manually. Then rerun this command'));case 1:case"end":return _context2.stop();}}},null,null,null,Promise);}}]);return LinuxPlatformSetup;}(_base.default);var _default=



LinuxPlatformSetup;exports.default=_default;
//# sourceMappingURL=darwin.js.map