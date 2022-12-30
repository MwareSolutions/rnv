var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.rnvHooksRun=exports.rnvHooksPipes=exports.rnvHooksList=exports.executePipe=exports.buildHooks=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _chalk=_interopRequireDefault(require("chalk"));
var _fs=_interopRequireDefault(require("fs"));
var _common=require("../common");


var _logger=require("../systemTools/logger");
var _prompt=require("../systemTools/prompt");
var _exec=require("../systemTools/exec");





var rnvHooksRun=function rnvHooksRun(c){return new Promise(function(resolve,reject){
(0,_logger.logTask)('rnvHooksRun');

buildHooks(c).
then(function(){var _c$program;
if(!c.buildHooks){
reject('Build hooks have not been compiled properly!');
return;
}
if(c.buildHooks[(_c$program=c.program)==null?void 0:_c$program.exeMethod]){var _c$program2;
c.buildHooks[(_c$program2=c.program)==null?void 0:_c$program2.exeMethod](c).
then(function(){return resolve();}).
catch(function(e){return reject(e);});
}else{
reject("Method name "+_chalk.default.white(c.program.exeMethod)+" does not exists in your buildHooks!");
}
}).
catch(function(e){return reject(e);});
});};exports.rnvHooksRun=rnvHooksRun;

var executePipe=function executePipe(c,key){var pipe;return _regenerator.default.async(function executePipe$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)("executePipe:"+key);_context.next=3;return _regenerator.default.awrap(

buildHooks(c));case 3:

pipe=c.buildPipes?c.buildPipes[key]:null;if(!

Array.isArray(pipe)){_context.next=9;break;}_context.next=7;return _regenerator.default.awrap(
pipe.reduce(function(accumulatorPromise,next){return accumulatorPromise.then(function(){return next(c);});},Promise.resolve()));case 7:_context.next=12;break;case 9:if(!
pipe){_context.next=12;break;}_context.next=12;return _regenerator.default.awrap(
pipe(c));case 12:case"end":return _context.stop();}}},null,null,null,Promise);};exports.executePipe=executePipe;



var buildHooks=function buildHooks(c){return new Promise(function(resolve,reject){
(0,_logger.logTask)('buildHooks');

if(_fs.default.existsSync(c.paths.buildHooks.index)){
if(c.isBuildHooksReady){
resolve();
return;
}

(0,_exec.executeAsync)(c,"babel --no-babelrc --plugins @babel/plugin-proposal-optional-chaining,@babel/plugin-proposal-nullish-coalescing-operator "+c.paths.buildHooks.dir+" -d "+c.paths.buildHooks.dist.dir+" --presets=@babel/env",{
cwd:c.paths.buildHooks.dir}).

then(function(){
var h=require(c.paths.buildHooks.dist.index);
c.buildHooks=h.hooks;
c.buildPipes=h.pipes;
c.isBuildHooksReady=true;
resolve();
}).
catch(function(e){



reject("BUILD_HOOK Failed with error: "+e);
});
}else{

resolve();
}
});};exports.buildHooks=buildHooks;

var rnvHooksList=function rnvHooksList(c){return new Promise(function(resolve,reject){
(0,_logger.logTask)('rnvHooksList');

buildHooks(c).
then(function(){
if(c.buildHooks){
var hookOpts=(0,_prompt.generateOptions)(c.buildHooks);
var hooksAsString="\n"+'Hooks:'+"\n"+hookOpts.asString;

if(c.buildPipes){
var pipeOpts=(0,_prompt.generateOptions)(c.buildPipes);
hooksAsString+="\n"+'Pipes:'+"\n"+pipeOpts.asString;
}
(0,_logger.logToSummary)(hooksAsString);
resolve();
}else{
reject('Your buildHooks object is empty!');
}
}).
catch(function(e){return reject(e);});
});};exports.rnvHooksList=rnvHooksList;

var rnvHooksPipes=function rnvHooksPipes(c){return new Promise(function(resolve,reject){
(0,_logger.logTask)('rnvHooksPipes');

buildHooks(c).
then(function(){
var pipeOpts=(0,_prompt.generateOptions)(c.buildPipes);
console.log("Pipes:\n"+pipeOpts.asString);
}).catch(function(e){return reject(e);});
});};exports.rnvHooksPipes=rnvHooksPipes;
//# sourceMappingURL=buildHooks.js.map