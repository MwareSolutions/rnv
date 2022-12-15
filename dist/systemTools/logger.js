var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=exports.printBoxEnd=exports.rnvStatus=exports.printBoxStart=exports.printArrIntoBox=exports.printIntoBox=exports.logAppInfo=exports.logInitialize=exports.logEnd=exports.logError=exports.logSuccess=exports.logComplete=exports.isInfoEnabled=exports.logDebug=exports.logInfo=exports.logWarning=exports.logTask=exports.setCurrentJob=exports.logSummary=exports.logToSummary=exports.getCurrentCommand=exports.logAndSave=exports.configureLogger=exports.logWelcome=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));var _chalk2=_interopRequireDefault(require("chalk"));
var _prompt=require("./prompt");
var _analytics=_interopRequireDefault(require("./analytics"));function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);if(enumerableOnly)symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;});keys.push.apply(keys,symbols);}return keys;}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};if(i%2){ownKeys(Object(source),true).forEach(function(key){(0,_defineProperty2.default)(target,key,source[key]);});}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(target,Object.getOwnPropertyDescriptors(source));}else{ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}}return target;}

var _chalkCols={
white:function white(v){return v;},
green:function green(v){return v;},
red:function red(v){return v;},
yellow:function yellow(v){return v;},
default:function _default(v){return v;},
gray:function gray(v){return v;},
grey:function grey(v){return v;},
blue:function blue(v){return v;},
magenta:function magenta(v){return v;}};

var _chalkMono=_objectSpread({},
_chalkCols,{
bold:_chalkCols});


var chalk=_chalk2.default;


var RNV_START='🚀 ReNative';
var RNV='ReNative';
var LINE=chalk.bold.white('----------------------------------------------------------');
var LINE2=chalk.gray('----------------------------------------------------------');


var logWelcome=function logWelcome(){var _c2,_c2$files,_c2$files$rnv,_c2$files$rnv$package,_c3;
var str=_defaultColor("\n\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502                                                                              \u2502\n\u2502        "+


chalk.red('██████╗')+" \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557"+chalk.red('███╗   ██╗')+" \u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557"+chalk.red('██╗   ██╗')+"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557       \u2502\n\u2502        "+
chalk.red('██╔══██╗')+"\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D"+chalk.red('████╗  ██║')+"\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u255A\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u255D\u2588\u2588\u2551"+chalk.red('██║   ██║')+"\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D       \u2502\n\u2502        "+
chalk.red('██████╔╝')+"\u2588\u2588\u2588\u2588\u2588\u2557  "+chalk.red('██╔██╗ ██║')+"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551   \u2588\u2588\u2551   \u2588\u2588\u2551"+chalk.red('██║   ██║')+"\u2588\u2588\u2588\u2588\u2588\u2557         \u2502\n\u2502        "+
chalk.red('██╔══██╗')+"\u2588\u2588\u2554\u2550\u2550\u255D  "+chalk.red('██║╚██╗██║')+"\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551   \u2588\u2588\u2551   \u2588\u2588\u2551"+chalk.red('╚██╗ ██╔╝')+"\u2588\u2588\u2554\u2550\u2550\u255D         \u2502\n\u2502        "+
chalk.red('██║  ██║')+"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557"+chalk.red('██║ ╚████║')+"\u2588\u2588\u2551  \u2588\u2588\u2551   \u2588\u2588\u2551   \u2588\u2588\u2551"+chalk.red(' ╚████╔╝ ')+"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557       \u2502\n\u2502        "+
chalk.red('╚═╝  ╚═╝')+"\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D"+chalk.red('╚═╝  ╚═══╝')+"\u255A\u2550\u255D  \u255A\u2550\u255D   \u255A\u2550\u255D   \u255A\u2550\u255D"+chalk.red('  ╚═══╝  ')+"\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D       \u2502\n\u2502                                                                              \u2502\n");



if((_c2=_c)==null?void 0:(_c2$files=_c2.files)==null?void 0:(_c2$files$rnv=_c2$files.rnv)==null?void 0:(_c2$files$rnv$package=_c2$files$rnv.package)==null?void 0:_c2$files$rnv$package.version){
_c.rnvVersion=_c.files.rnv.package.version;
str+=printIntoBox("      Version: "+chalk.green(_c.rnvVersion),1);
if(_c.rnvVersion.includes('alpha')){
str+=printIntoBox("      "+chalk.yellow('WARNING: this is a prerelease version.'),1);
str+=printIntoBox("      "+chalk.yellow('Use "npm install rnv" for stable one.'),1);
}
}
str+=printIntoBox("      "+chalk.grey('https://renative.org'),1);
str+=printIntoBox("      \uD83D\uDE80 "+chalk.yellow('Firing up!...'),1);
str+=printIntoBox("      "+getCurrentCommand());
if((_c3=_c)==null?void 0:_c3.timeStart)str+=printIntoBox("      Start Time: "+_c.timeStart.toLocaleString());
str+=printIntoBox('');
str+=printBoxEnd();
str+='\n';

console.log(str);
};exports.logWelcome=logWelcome;

var _messages=[];
var _currentCommand;
var _currentProcess;
var _isInfoEnabled=false;
var _c;
var _isMono=false;
var _defaultColor;
var _highlightColor;


var configureLogger=function configureLogger(c,process,command,subCommand,isInfoEnabled){
_messages=[];
_c=c;
_c.timeStart=new Date();
_currentProcess=process;
_currentCommand=command;
_currentSubCommand=subCommand;
_isInfoEnabled=isInfoEnabled;
_isMono=c.program.mono;
if(_isMono){
chalk=_chalkMono;
}
_updateDefaultColors();
RNV=getCurrentCommand();
};exports.configureLogger=configureLogger;

var _updateDefaultColors=function _updateDefaultColors(){
_defaultColor=chalk.gray;
_highlightColor=chalk.green;
};
_updateDefaultColors();

var logAndSave=function logAndSave(msg,skipLog){
if(_messages&&!_messages.includes(msg))_messages.push(msg);
if(!skipLog)console.log(""+msg);
};exports.logAndSave=logAndSave;

var PRIVATE_PARAMS=['-k','--key'];

var getCurrentCommand=function getCurrentCommand(){var excludeDollar=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;
if(!_c)return'_c is undefined';
var argArr=_c.process.argv.slice(2);
var hideNext=false;
var output=argArr.map(function(v){
if(hideNext){
hideNext=false;
return'********';
}
if(PRIVATE_PARAMS.includes(v)){
hideNext=true;
}

return v;
}).join(' ');
var dollar=excludeDollar?'':'$ ';
return dollar+"rnv "+output;
};exports.getCurrentCommand=getCurrentCommand;

var logToSummary=function logToSummary(v){
_messages.push("\n"+v);
};exports.logToSummary=logToSummary;

var logSummary=function logSummary(){
var logContent=printIntoBox('All good as 🦄 ');
if(_messages&&_messages.length){
logContent='';
_messages.forEach(function(m){
logContent+="\u2502 "+m+"\n";
});
}


var timeString='';
if(_c){
_c.timeEnd=new Date();
timeString="| "+_c.timeEnd.toLocaleString();
}

var str=printBoxStart("\uD83D\uDE80  SUMMARY "+timeString,getCurrentCommand());
if(_c){var _c$buildConfig,_c$buildConfig$_meta,_c$buildConfig2;
if(_c.files.project.package){
str+=printIntoBox("Project Name: "+_highlightColor(_c.files.project.package.name),1);
str+=printIntoBox("Project Version: "+_highlightColor(_c.files.project.package.version),1);
}
if((_c$buildConfig=_c.buildConfig)==null?void 0:(_c$buildConfig$_meta=_c$buildConfig._meta)==null?void 0:_c$buildConfig$_meta.currentAppConfigId){var _c$buildConfig$_meta2;
str+=printIntoBox("App Config: "+_highlightColor((_c$buildConfig$_meta2=_c.buildConfig._meta)==null?void 0:_c$buildConfig$_meta2.currentAppConfigId),1);
}
if((_c$buildConfig2=_c.buildConfig)==null?void 0:_c$buildConfig2.workspaceID){
str+=printIntoBox("Workspace: "+_highlightColor(_c.buildConfig.workspaceID),1);
}
if(_c.files.project.config){
var defaultProjectConfigs=_c.files.project.config.defaults;
if(defaultProjectConfigs==null?void 0:defaultProjectConfigs.supportedPlatforms){var _c$buildConfig3,_c$buildConfig3$defau;
var plats=[];
(0,_prompt.generateOptions)((_c$buildConfig3=_c.buildConfig)==null?void 0:(_c$buildConfig3$defau=_c$buildConfig3.defaults)==null?void 0:_c$buildConfig3$defau.supportedPlatforms,true,null,function(i,obj,mapping,defaultVal){
var isEjected='';
if(_c.paths.project.platformTemplatesDirs){
isEjected=_c.paths.project.platformTemplatesDirs[obj].includes(_c.paths.rnv.platformTemplates.dir)?'':'(ejected)';
}

plats.push(""+defaultVal+isEjected);
});
str+=printArrIntoBox(plats,'Supported Platforms: ');
}
if(defaultProjectConfigs==null?void 0:defaultProjectConfigs.template){
str+=printIntoBox("Master Template: "+_highlightColor(defaultProjectConfigs.template),1);
}
}
if(_c.process){var _c$process$versions;
var envString=_c.process.platform+" | "+_c.process.arch+" | node v"+((_c$process$versions=_c.process.versions)==null?void 0:_c$process$versions.node)+" | rnv v"+_c.rnvVersion;
str+=printIntoBox("Env Info: "+chalk.gray(envString),1);
}

if(_c.program.scheme)str+=printIntoBox("Build Scheme: "+_highlightColor(_c.program.scheme),1);
if(_c.platform)str+=printIntoBox("Platform: "+_highlightColor(_c.platform),1);
if(_c.timeEnd){
str+=printIntoBox("Executed Time: "+chalk.yellow(_msToTime(_c.timeEnd-_c.timeStart)),1);
}
}

str+=printIntoBox('');
str+=logContent;
str+=printIntoBox('');
str+=printBoxEnd();

console.log(str);
};exports.logSummary=logSummary;

var _msToTime=function _msToTime(s){
var ms=s%1000;
s=(s-ms)/1000;
var secs=s%60;
s=(s-secs)/60;
var mins=s%60;
var hrs=(s-mins)/60;

return hrs+"h:"+mins+"m:"+secs+"s:"+ms+"ms";
};

var setCurrentJob=function setCurrentJob(job){
_currentCommand=job;
};exports.setCurrentJob=setCurrentJob;

var logTask=function logTask(task,customChalk){
var ch=customChalk||chalk.green;
var postMsg=customChalk?'':' - Starting!';
console.log(ch(RNV+" - "+task+postMsg));
};exports.logTask=logTask;

var logWarning=function logWarning(msg){
logAndSave(chalk.yellow("\u26A0\uFE0F  "+RNV+" - WARNING: "+msg));
};exports.logWarning=logWarning;

var logInfo=function logInfo(msg){
console.log(chalk.magenta("\u2139\uFE0F  "+RNV+" - NOTE: "+msg));
};exports.logInfo=logInfo;

var logDebug=function logDebug(){for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}
if(_isInfoEnabled)console.log.apply(null,args);
};exports.logDebug=logDebug;

var isInfoEnabled=function isInfoEnabled(){return _isInfoEnabled;};exports.isInfoEnabled=isInfoEnabled;

var logComplete=function logComplete(){var isEnd=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;
console.log(chalk.bold.white("\n "+RNV+" - Done! \uD83D\uDE80"));
if(isEnd)logEnd(0);
};exports.logComplete=logComplete;

var logSuccess=function logSuccess(msg){
logAndSave("\u2705 "+chalk.magenta(msg));
};exports.logSuccess=logSuccess;

var logError=function logError(e){var isEnd=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;var skipAnalytics=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;
if(!skipAnalytics){
_analytics.default.captureException(e);
}

if(e&&e.message){
logAndSave(chalk.bold.red("\uD83D\uDED1  "+RNV+" - ERRROR! "+e.message+"\n"+e.stack),isEnd);
}else{
logAndSave(chalk.bold.red("\uD83D\uDED1  "+RNV+" - ERRROR! "+e),isEnd);
}

if(isEnd)logEnd(1);
};exports.logError=logError;

var logEnd=function logEnd(code){
logSummary();
if(_currentProcess){
_analytics.default.teardown().then(function(){
_currentProcess.exit(code);
});
}
};exports.logEnd=logEnd;


var logInitialize=function logInitialize(){
logWelcome();



};exports.logInitialize=logInitialize;

var logAppInfo=function logAppInfo(c){return new Promise(function(resolve,reject){
console.log(chalk.gray("\n"+LINE2+"\n\u2139\uFE0F  Current App Config: "+chalk.bold.white(c.buildConfig.id)+"\n"+LINE2));

resolve();
});};exports.logAppInfo=logAppInfo;

var printIntoBox=function printIntoBox(str2){var chalkIntend=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0;
var output=_defaultColor('│  ');
var endLine='';
var intend;
if(_isMono){
intend=0;
chalkIntend=0;
}else{
intend=str2===''?1:2;
}
for(var i=0;i<chalkIntend+intend;i++){
endLine+='          ';
}
endLine+='                                                                               │\n';
output+=_defaultColor(str2);
var l=output.length-endLine.length;
output+=_defaultColor(endLine.slice(l));
return output;
};exports.printIntoBox=printIntoBox;

var printArrIntoBox=function printArrIntoBox(arr){var prefix=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'';
var output='';
var stringArr='';
var i=0;
arr.forEach(function(v){
var l=i===0?60-_defaultColor(prefix).length:60;
if(stringArr.length>l){
if(i===0&&prefix.length){
output+=printIntoBox(""+_defaultColor(prefix)+_defaultColor(stringArr),2);
}else{
output+=printIntoBox(_defaultColor(stringArr),1);
}

stringArr='';
i++;
}
stringArr+=v+", ";

});
if(i===0&&prefix.length){
output+=printIntoBox(""+_defaultColor(prefix)+_defaultColor(stringArr.slice(0,-2)),2);
}else{
output+=printIntoBox(_defaultColor(stringArr.slice(0,-2)),1);
}

return output;
};exports.printArrIntoBox=printArrIntoBox;

var printBoxStart=function printBoxStart(str,str2){
var output=_defaultColor('┌──────────────────────────────────────────────────────────────────────────────┐\n');
output+=printIntoBox(str);
output+=printIntoBox(str2||'');
output+=_defaultColor('├──────────────────────────────────────────────────────────────────────────────┤\n');
return output;
};exports.printBoxStart=printBoxStart;

var rnvStatus=function rnvStatus(){return _regenerator.default.async(function rnvStatus$(_context){while(1){switch(_context.prev=_context.next){case 0:return _context.abrupt("return",Promise.resolve());case 1:case"end":return _context.stop();}}});};exports.rnvStatus=rnvStatus;

var printBoxEnd=function printBoxEnd(){return _defaultColor('└──────────────────────────────────────────────────────────────────────────────┘');};exports.printBoxEnd=printBoxEnd;var _default2=

{
logEnd:logEnd,
logInfo:logInfo,
logTask:logTask,
logError:logError,
logDebug:logDebug,
logAppInfo:logAppInfo,
logWarning:logWarning,
logSuccess:logSuccess,
logWelcome:logWelcome,
logComplete:logComplete,
logInitialize:logInitialize};exports.default=_default2;
//# sourceMappingURL=logger.js.map