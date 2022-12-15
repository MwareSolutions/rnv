var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _linux=_interopRequireDefault(require("./linux"));
var _windows=_interopRequireDefault(require("./windows"));
var _darwin=_interopRequireDefault(require("./darwin"));
var _config=_interopRequireDefault(require("../config"));var _default=

function _default(c){
if(!c)c=_config.default.getConfig();var _c=
c,platform=_c.process.platform;
if(platform==='linux')return new _linux.default(c);
if(platform==='win32')return new _windows.default(c);
if(platform==='darwin')return new _darwin.default();


throw new Error('Platform unsupported for automated SDK setup');
};exports.default=_default;
//# sourceMappingURL=index.js.map