var _interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard");var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=exports.executeTelnet=exports.openCommand=exports.commandExistsSync=exports.commandExists=exports.execCLI=exports.executeAsync=exports.npmInstall=exports.cleanNodeModules=exports.parseErrorMessage=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireWildcard(require("fs"));
var _chalk=_interopRequireDefault(require("chalk"));
var _execa=_interopRequireDefault(require("execa"));
var _ora=_interopRequireDefault(require("ora"));
var _client=_interopRequireDefault(require("netcat/client"));
var _config=_interopRequireDefault(require("../config"));

var _logger=require("./logger");
var _fileutils=require("./fileutils");
var _utils=require("../utils");function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);if(enumerableOnly)symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;});keys.push.apply(keys,symbols);}return keys;}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};if(i%2){ownKeys(Object(source),true).forEach(function(key){(0,_defineProperty2.default)(target,key,source[key]);});}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(target,Object.getOwnPropertyDescriptors(source));}else{ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}}return target;}var _require=

require('child_process'),exec=_require.exec,execSync=_require.execSync;



















var _execute=function _execute(c,command){var _c$program,_c$program2,_c$program3;var opts=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};
var defaultOpts={
stdio:'pipe',
localDir:_path.default.resolve('./node_modules/.bin'),
preferLocal:true,
all:true,
maxErrorLength:(_c$program=c.program)==null?void 0:_c$program.maxErrorLength,
mono:(_c$program2=c.program)==null?void 0:_c$program2.mono};


if(opts.interactive){
defaultOpts.silent=true;
defaultOpts.stdio='inherit';
defaultOpts.shell=true;
}

var mergedOpts=_objectSpread({},defaultOpts,{},opts);

var cleanCommand=command;
var interval;
var intervalTimer=30000;
var timer=intervalTimer;
var privateMask='*******';

if(Array.isArray(command))cleanCommand=command.join(' ');

var logMessage=cleanCommand;var
privateParams=mergedOpts.privateParams;
if(privateParams&&Array.isArray(privateParams)){
logMessage=(0,_utils.replaceOverridesInString)(command,privateParams,privateMask);
}

(0,_logger.logDebug)("_execute: "+logMessage);var
silent=mergedOpts.silent,mono=mergedOpts.mono,maxErrorLength=mergedOpts.maxErrorLength,ignoreErrors=mergedOpts.ignoreErrors;
var spinner=!silent&&!mono&&(0,_ora.default)({text:"Executing: "+logMessage}).start();

if(mono){
interval=setInterval(function(){
console.log("Executing: "+logMessage+" - "+timer/1000+"s");
timer+=intervalTimer;
},intervalTimer);
}
var child;
if(opts.rawCommand){var
args=opts.rawCommand.args;
child=(0,_execa.default)(command,args,mergedOpts);
}else{
child=_execa.default.command(cleanCommand,mergedOpts);
}

var MAX_OUTPUT_LENGTH=200;

var printLastLine=function printLastLine(buffer){
var text=Buffer.from(buffer).toString().trim();
var lastLine=text.split('\n').pop();
spinner.text=(0,_utils.replaceOverridesInString)(lastLine.substring(0,MAX_OUTPUT_LENGTH),privateParams,privateMask);
if(lastLine.length===MAX_OUTPUT_LENGTH)spinner.text+='...\n';
};

if((_c$program3=c.program)==null?void 0:_c$program3.info){var _child,_child$stdout;
(_child=child)==null?void 0:(_child$stdout=_child.stdout)==null?void 0:_child$stdout.pipe(process.stdout);
}else if(spinner){var _child2,_child2$stdout;
(_child2=child)==null?void 0:(_child2$stdout=_child2.stdout)==null?void 0:_child2$stdout.on('data',printLastLine);
}

return child.then(function(res){var _child3,_child3$stdout;
spinner&&((_child3=child)==null?void 0:(_child3$stdout=_child3.stdout)==null?void 0:_child3$stdout.off('data',printLastLine));
!silent&&!mono&&spinner.succeed("Executing: "+logMessage);
(0,_logger.logDebug)((0,_utils.replaceOverridesInString)(res.all,privateParams,privateMask));
interval&&clearInterval(interval);

return res.stdout;
}).catch(function(err){var _child4,_child4$stdout;
spinner&&((_child4=child)==null?void 0:(_child4$stdout=_child4.stdout)==null?void 0:_child4$stdout.off('data',printLastLine));
if(!silent&&!mono&&!ignoreErrors)spinner.fail("FAILED: "+logMessage);

(0,_logger.logDebug)((0,_utils.replaceOverridesInString)(err.all,privateParams,privateMask));
interval&&clearInterval(interval);

if(ignoreErrors&&!silent&&!mono){
spinner.succeed("Executing: "+logMessage);
return true;
}
var errMessage=parseErrorMessage(err.all,maxErrorLength)||err.stderr||err.message;
errMessage=(0,_utils.replaceOverridesInString)(errMessage,privateParams,privateMask);
return Promise.reject("COMMAND: \n\n"+logMessage+" \n\nFAILED with ERROR: \n\n"+errMessage);
});
};












var execCLI=function execCLI(c,cli,command){var opts=arguments.length>3&&arguments[3]!==undefined?arguments[3]:{};
if(!c.program)return Promise.reject('You need to pass c object as first parameter to execCLI()');
var p=c.cli[cli];

if(!_fs.default.existsSync(p)){
(0,_logger.logDebug)('execCLI error',cli,command);
return Promise.reject("Location of your cli "+_chalk.default.white(p)+" does not exists. check your "+_chalk.default.white(
c.paths.globalConfigPath)+" file if you SDK path is correct");

}

return _execute(c,p+" "+command,_objectSpread({},opts,{shell:true}));
};exports.execCLI=execCLI;










var executeAsync=function executeAsync(c,cmd,opts){

if(typeof c==='string'){
opts=cmd;
cmd=c;
c=_config.default.getConfig();
}
if(cmd.includes('npm')&&process.platform==='win32')cmd.replace('npm','npm.cmd');
return _execute(c,cmd,opts);
};exports.executeAsync=executeAsync;










var executeTelnet=function executeTelnet(c,port,command){return new Promise(function(resolve){
var nc2=new _client.default();
(0,_logger.logDebug)("execTelnet: "+port+" "+command);

var output='';

nc2.addr(c.runtime.localhost).
port(parseInt(port,10)).
connect().
send(command+"\n");
nc2.on('data',function(data){
var resp=Buffer.from(data).toString();
output+=resp;
if(output.includes('OK'))nc2.close();
});
nc2.on('close',function(){return resolve(output);});
});};exports.executeTelnet=executeTelnet;




















var parseErrorMessage=function parseErrorMessage(text){var maxErrorLength=arguments.length>1&&arguments[1]!==undefined?arguments[1]:800;
if(!text)return'';
var toSearch=/(exception|error|fatal|\[!])/i;
var arr=text.split('\n');

var errFound=0;
arr=arr.filter(function(v){
if(v==='')return false;

if(v.includes('-Werror')){
return false;
}

if(v.includes('[DEBUG]')||v.includes('[INFO]')||v.includes('[LIFECYCLE]')||v.includes('[WARN]')||v.includes(':+HeapDumpOnOutOfMemoryError')||v.includes('.errors.')||v.includes('-exception-')||v.includes('error_prone_annotations')){
return false;
}
if(v.search(toSearch)!==-1){
errFound=5;
return true;
}
if(errFound>0){
errFound-=1;
return true;
}
return false;
});

arr=arr.map(function(str){
var v=str.replace(/\s{2,}/g,' ');
var extractedError=v.substring(0,maxErrorLength);
if(extractedError.length===maxErrorLength)extractedError+='...';
return extractedError;
});

return arr.join('\n');
};exports.parseErrorMessage=parseErrorMessage;


var isUsingWindows=process.platform==='win32';

var fileNotExists=function fileNotExists(commandName,callback){
(0,_fs.access)(commandName,_fs.constants.F_OK,
function(err){
callback(!err);
});
};

var fileNotExistsSync=function fileNotExistsSync(commandName){
try{
(0,_fs.accessSync)(commandName,_fs.constants.F_OK);
return false;
}catch(e){
return true;
}
};

var localExecutable=function localExecutable(commandName,callback){
(0,_fs.access)(commandName,_fs.constants.F_OK|_fs.constants.X_OK,
function(err){
callback(null,!err);
});
};

var localExecutableSync=function localExecutableSync(commandName){
try{
(0,_fs.accessSync)(commandName,_fs.constants.F_OK|_fs.constants.X_OK);
return true;
}catch(e){
return false;
}
};

var commandExistsUnix=function commandExistsUnix(commandName,cleanedCommandName,callback){
fileNotExists(commandName,function(isFile){
if(!isFile){
exec("command -v "+cleanedCommandName+" 2>/dev/null"+(" && { echo >&1 "+

cleanedCommandName+"; exit 0; }"),
function(error,stdout){
callback(null,!!stdout);
});
return;
}

localExecutable(commandName,callback);
});
};

var commandExistsWindows=function commandExistsWindows(commandName,cleanedCommandName,callback){
if(/[\x00-\x1f<>:"\|\?\*]/.test(commandName)){
callback(null,false);
return;
}
exec("where "+cleanedCommandName,
function(error){
if(error!==null){
callback(null,false);
}else{
callback(null,true);
}
});
};

var commandExistsUnixSync=function commandExistsUnixSync(commandName,cleanedCommandName){
if(fileNotExistsSync(commandName)){
try{
var stdout=execSync("command -v "+cleanedCommandName+" 2>/dev/null"+(" && { echo >&1 "+

cleanedCommandName+"; exit 0; }"));
return!!stdout;
}catch(error){
return false;
}
}
return localExecutableSync(commandName);
};

var commandExistsWindowsSync=function commandExistsWindowsSync(commandName,cleanedCommandName){
if(/[\x00-\x1f<>:"\|\?\*]/.test(commandName)){
return false;
}
try{
var stdout=execSync("where "+cleanedCommandName,{stdio:[]});
return!!stdout;
}catch(error){
return false;
}
};

var cleanInput=function cleanInput(s){
if(/[^A-Za-z0-9_\/:=-]/.test(s)){
s="'"+s.replace(/'/g,"'\\''")+"'";
s=s.replace(/^(?:'')+/g,'').
replace(/\\'''/g,"\\'");
}
return s;
};

if(isUsingWindows){
cleanInput=function cleanInput(s){
var isPathName=/[\\]/.test(s);
if(isPathName){
var dirname="\""+_path.default.dirname(s)+"\"";
var basename="\""+_path.default.basename(s)+"\"";
return dirname+":"+basename;
}
return"\""+s+"\"";
};
}

var commandExists=function commandExists(commandName,callback){
var cleanedCommandName=cleanInput(commandName);
if(!callback&&typeof Promise!=='undefined'){
return new Promise(function(resolve,reject){
commandExists(commandName,function(error,output){
if(output){
resolve(commandName);
}else{
reject(error);
}
});
});
}
if(isUsingWindows){
commandExistsWindows(commandName,cleanedCommandName,callback);
}else{
commandExistsUnix(commandName,cleanedCommandName,callback);
}
};exports.commandExists=commandExists;

var commandExistsSync=function commandExistsSync(commandName){
var cleanedCommandName=cleanInput(commandName);
if(isUsingWindows){
return commandExistsWindowsSync(commandName,cleanedCommandName);
}
return commandExistsUnixSync(commandName,cleanedCommandName);
};exports.commandExistsSync=commandExistsSync;

var cleanNodeModules=function cleanNodeModules(c){return new Promise(function(resolve,reject){
(0,_logger.logTask)("cleanNodeModules:"+c.paths.project.nodeModulesDir);
(0,_fileutils.removeDirs)([
_path.default.join(c.paths.project.nodeModulesDir,'react-native-safe-area-view/.git'),
_path.default.join(c.paths.project.nodeModulesDir,'@react-navigation/native/node_modules/react-native-safe-area-view/.git'),
_path.default.join(c.paths.project.nodeModulesDir,'react-navigation/node_modules/react-native-safe-area-view/.git'),
_path.default.join(c.paths.rnv.nodeModulesDir,'react-native-safe-area-view/.git'),
_path.default.join(c.paths.rnv.nodeModulesDir,'@react-navigation/native/node_modules/react-native-safe-area-view/.git'),
_path.default.join(c.paths.rnv.nodeModulesDir,'react-navigation/node_modules/react-native-safe-area-view/.git')]).
then(function(){return resolve();}).catch(function(e){return reject(e);});
});};exports.cleanNodeModules=cleanNodeModules;

var npmInstall=function npmInstall(){var failOnError,c,_args=arguments;return _regenerator.default.async(function npmInstall$(_context){while(1){switch(_context.prev=_context.next){case 0:failOnError=_args.length>0&&_args[0]!==undefined?_args[0]:false;
(0,_logger.logTask)('npmInstall');
c=_config.default.getConfig();return _context.abrupt("return",

executeAsync('npm install').
then(function(){return(0,_fileutils.invalidatePodsChecksum)(c);}).
catch(function(e){
if(failOnError){
return(0,_logger.logError)(e);
}
(0,_logger.logWarning)(e+"\n Seems like your node_modules is corrupted by other libs. ReNative will try to fix it for you");
return cleanNodeModules(_config.default.getConfig()).
then(function(){return npmInstall(true);}).
catch(function(f){return(0,_logger.logError)(f);});
}));case 4:case"end":return _context.stop();}}});};exports.npmInstall=npmInstall;



var openCommand=process.platform==='darwin'?'open':process.platform==='win32'?'start':'xdg-open';exports.openCommand=openCommand;var _default=



{
executeAsync:executeAsync,
execCLI:execCLI,
openCommand:openCommand,
executeTelnet:executeTelnet};exports.default=_default;
//# sourceMappingURL=exec.js.map