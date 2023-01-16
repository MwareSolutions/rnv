var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass"));var _integrations=require("@sentry/integrations");
var _nodeMachineId=require("node-machine-id");
var _axios=_interopRequireDefault(require("axios"));
var _os=_interopRequireDefault(require("os"));
var _path=_interopRequireDefault(require("path"));

var _config=_interopRequireDefault(require("../config"));
var _package=_interopRequireDefault(require("../../package.json"));
var _constants=require("../constants");function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;})),keys.push.apply(keys,symbols);}return keys;}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach(function(key){(0,_defineProperty2.default)(target,key,source[key]);}):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}return target;}


var sanitizeError=function sanitizeError(err){
if(err){
if(err.includes('file if you SDK path is correct.')){
return err.toLowerCase().split('. check your ')[0];
}
if(err.includes('AppConfig error - ')){
return err.split(' - ')[0];
}
}

return err;
};var

Redash=function(){function Redash(){(0,_classCallCheck2.default)(this,Redash);}(0,_createClass2.default)(Redash,[{key:"captureEvent",value:
function captureEvent(e){
var defaultProps={
fingerprint:(0,_nodeMachineId.machineIdSync)(),
os:_os.default.platform(),
rnvVersion:_package.default.version
};
return _axios.default.post(_constants.REDASH_URL,_objectSpread(_objectSpread({},e),defaultProps),{
headers:{
'x-api-key':_constants.REDASH_KEY
}
}).catch(function(){return true;});
}}]);return Redash;}();var


Analytics=function(){
function Analytics(){(0,_classCallCheck2.default)(this,Analytics);
this.errorFixer=null;
this.knowItAll=null;
}(0,_createClass2.default)(Analytics,[{key:"initialize",value:

function initialize(){
if(_config.default.isAnalyticsEnabled){


this.errorFixer=require('@sentry/node');

this.errorFixer.init({
dsn:'https://004caee3caa04c81a10f2ba31a945362@sentry.io/1795473',
release:"rnv@"+_package.default.version,
integrations:[new _integrations.RewriteFrames({
root:'/',
iteratee:function iteratee(frame){
if(frame.filename.includes("rnv"+_path.default.sep+"dist"+_path.default.sep)||frame.filename.includes("rnv"+_path.default.sep+"src"+_path.default.sep)){
if(frame.filename.includes("rnv"+_path.default.sep+"dist"+_path.default.sep)){
frame.filename=frame.filename.split("rnv"+_path.default.sep+"dist"+_path.default.sep)[1];
}else{
frame.filename=frame.filename.split("rnv"+_path.default.sep+"src"+_path.default.sep)[1];
}
}else if(frame.filename.includes(_path.default.sep+"node_modules"+_path.default.sep)){
frame.filename="node_modules/"+frame.filename.split(_path.default.sep+"node_modules"+_path.default.sep)[1];
}
return frame;
}
})]
});


this.knowItAll=new Redash();
}
}},{key:"captureException",value:

function captureException(e){var _this=this;var context=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};
if(_config.default.isAnalyticsEnabled&&this.errorFixer){
this.errorFixer.withScope(function(scope){
var _context$extra=context.extra,extra=_context$extra===void 0?{}:_context$extra,_context$tags=context.tags,tags=_context$tags===void 0?{}:_context$tags;
scope.setTags(_objectSpread(_objectSpread({},tags),{},{os:_os.default.platform()}));
scope.setExtras(_objectSpread(_objectSpread({},extra),{},{fingerprint:(0,_nodeMachineId.machineIdSync)()}));
if(e instanceof Error){
_this.errorFixer.captureException(e);
}else{
_this.errorFixer.captureException(new Error(sanitizeError(e)));
}
});
}
}},{key:"captureEvent",value:

function captureEvent(e){return _regenerator.default.async(function captureEvent$(_context){while(1)switch(_context.prev=_context.next){case 0:if(!(
_config.default.isAnalyticsEnabled&&this.knowItAll)){_context.next=2;break;}return _context.abrupt("return",
this.knowItAll.captureEvent(e));case 2:return _context.abrupt("return",

true);case 3:case"end":return _context.stop();}},null,this,null,Promise);}},{key:"teardown",value:


function teardown(){var _this2=this;
return new Promise(function(resolve){
if(_config.default.isAnalyticsEnabled&&_this2.errorFixer){
var client=_this2.errorFixer.getCurrentHub().getClient();
if(client){
return client.close(2000).then(resolve);
}
return resolve();
}
return resolve();
});
}}]);return Analytics;}();var _default=


new Analytics();exports.default=_default;
//# sourceMappingURL=analytics.js.map