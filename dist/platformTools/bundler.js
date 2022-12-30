var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.waitForBundler=exports.isBundlerActive=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _axios=_interopRequireDefault(require("axios"));
var _ora=_interopRequireDefault(require("ora"));
var _common=require("../common");
var _logger=require("../systemTools/logger");

var _isBundlerRunning=function _isBundlerRunning(c){var _await$axios$get,data;return _regenerator.default.async(function _isBundlerRunning$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)("_isBundlerRunning:"+c.platform);_context.prev=1;_context.next=4;return _regenerator.default.awrap(

_axios.default.get("http://"+c.runtime.localhost+":"+c.runtime.port+"/"+(0,_common.getConfigProp)(c,c.platform,'entryFile')+".js"));case 4:_await$axios$get=_context.sent;data=_await$axios$get.data;if(!
data.includes('import')){_context.next=8;break;}return _context.abrupt("return",true);case 8:return _context.abrupt("return",
false);case 11:_context.prev=11;_context.t0=_context["catch"](1);return _context.abrupt("return",

false);case 14:case"end":return _context.stop();}}},null,null,[[1,11]],Promise);};



var isBundlerActive=function isBundlerActive(c){return _regenerator.default.async(function isBundlerActive$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)("isBundlerActive:"+c.platform);_context2.prev=1;_context2.next=4;return _regenerator.default.awrap(

_axios.default.get("http://"+c.runtime.localhost+":"+c.runtime.port));case 4:return _context2.abrupt("return",
true);case 7:_context2.prev=7;_context2.t0=_context2["catch"](1);return _context2.abrupt("return",

false);case 10:case"end":return _context2.stop();}}},null,null,[[1,7]],Promise);};exports.isBundlerActive=isBundlerActive;



var poll=function poll(fn){var timeout=arguments.length>1&&arguments[1]!==undefined?arguments[1]:10000;var interval=arguments.length>2&&arguments[2]!==undefined?arguments[2]:1000;
var endTime=Number(new Date())+timeout;

var spinner=(0,_ora.default)('Waiting for bundler to finish...').start();
var checkCondition=function checkCondition(resolve,reject){var result;return _regenerator.default.async(function checkCondition$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:_context3.prev=0;_context3.next=3;return _regenerator.default.awrap(

fn());case 3:result=_context3.sent;
if(result){
spinner.succeed();
resolve();
}else if(Number(new Date())<endTime){
setTimeout(checkCondition,interval,resolve,reject);
}else{
spinner.fail('Can\'t connect to bundler. Try restarting it.');
reject('Can\'t connect to bundler. Try restarting it.');
}_context3.next=11;break;case 7:_context3.prev=7;_context3.t0=_context3["catch"](0);

spinner.fail('Can\'t connect to bundler. Try restarting it.');
reject(_context3.t0);case 11:case"end":return _context3.stop();}}},null,null,[[0,7]],Promise);};



return new Promise(checkCondition);
};

var waitForBundler=function waitForBundler(c){return _regenerator.default.async(function waitForBundler$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:return _context4.abrupt("return",poll(function(){return _isBundlerRunning(c);}));case 1:case"end":return _context4.stop();}}},null,null,null,Promise);};exports.waitForBundler=waitForBundler;
//# sourceMappingURL=bundler.js.map