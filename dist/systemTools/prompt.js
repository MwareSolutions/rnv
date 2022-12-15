var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.generateOptions=exports.inquirerPrompt=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _chalk=_interopRequireDefault(require("chalk"));
var _inquirer=_interopRequireDefault(require("inquirer"));
var _logger=require("./logger");
var _config=_interopRequireDefault(require("../config"));

var highlight=_chalk.default.grey.bold;

var inquirerPrompt=function inquirerPrompt(params){var c,msg,type,name,result;return _regenerator.default.async(function inquirerPrompt$(_context){while(1){switch(_context.prev=_context.next){case 0:
c=_config.default.getConfig();
msg=params.logMessage||params.warningMessage||params.message;if(!
c.program.ci){_context.next=4;break;}throw(
new Error("--ci option does not allow prompts: "+msg));case 4:

if(msg&&params.logMessage)(0,_logger.logTask)(msg,_chalk.default.grey);
if(msg&&params.warningMessage)(0,_logger.logWarning)(msg);


type=params.type,name=params.name;
if(type==='confirm'&&!name)params.name='confirm';_context.next=10;return _regenerator.default.awrap(

_inquirer.default.prompt(params));case 10:result=_context.sent;return _context.abrupt("return",
result);case 12:case"end":return _context.stop();}}});};exports.inquirerPrompt=inquirerPrompt;


var generateOptions=function generateOptions(inputData){var isMultiChoice=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;var mapping=arguments.length>2?arguments[2]:undefined;var renderMethod=arguments.length>3?arguments[3]:undefined;
var asString='';
var valuesAsObject={};
var valuesAsArray=[];
var keysAsObject={};
var keysAsArray=[];
var optionsAsArray=[];
var isArray=Array.isArray(inputData);

var output={};
var renderer=renderMethod||_generateOptionString;
if(isArray){
inputData.map(function(v,i){
var rn=renderer(i,v,mapping,v);
asString+=rn;
optionsAsArray.push(rn);
valuesAsArray.push(v);
if(!mapping)keysAsArray.push(v);
if(!mapping)valuesAsObject[v]=v;
});
}else{
var i=0;
for(var k in inputData){
var v=inputData[k];
var rn=renderer(i,v,mapping,k);
asString+=rn;
optionsAsArray.push(rn);
keysAsArray.push(k);
keysAsObject[k]=true;
valuesAsObject[k]=v;
valuesAsArray.push(v);
i++;
}
}
output.keysAsArray=keysAsArray.sort(_sort);
output.valuesAsArray=valuesAsArray.sort(_sort);
output.keysAsObject=keysAsObject;
output.valuesAsObject=valuesAsObject;
output.asString=asString;
output.optionsAsArray=optionsAsArray;
return output;
};exports.generateOptions=generateOptions;

var _sort=function _sort(a,b){
var aStr='';
var bStr='';
if(typeof a==='string'){


aStr=a.toLowerCase?a.toLowerCase():a;
bStr=b.toLowerCase?b.toLowerCase():b;
}else{
if(a&&a.name)aStr=a.name.toLowerCase();
if(b&&b.name)bStr=b.name.toLowerCase();
}

var com=0;
if(aStr>bStr){
com=1;
}else if(aStr<bStr){
com=-1;
}
return com;
};

var _generateOptionString=function _generateOptionString(i,obj,mapping,defaultVal){return" ["+highlight(i+1)+"]> "+highlight(mapping?'':defaultVal)+" \n";};
//# sourceMappingURL=prompt.js.map