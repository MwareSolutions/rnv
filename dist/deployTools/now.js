var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.deployToNow=void 0;var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _chalk=_interopRequireDefault(require("chalk"));
var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _inquirer=_interopRequireDefault(require("inquirer"));
var _dotenv=_interopRequireDefault(require("dotenv"));

var _exec=require("../systemTools/exec");
var _common=require("../common");
var _logger=require("../systemTools/logger");

var _runDeploymentTask=function _runDeploymentTask(c,nowConfigPath){return new Promise(function(resolve,reject){
_dotenv.default.config();
var defaultBuildFolder=_path.default.join((0,_common.getAppFolder)(c,'web'),'public');
var params=[defaultBuildFolder,'-A',nowConfigPath];
if(process.env.NOW_TOKEN)params.push('-t',process.env.NOW_TOKEN);
var nowIsProduction=(0,_common.getConfigProp)(c,c.platform,'nowIsProduction',false)===true;

if(nowIsProduction)params.push('--prod');

(0,_exec.executeAsync)(c,"now "+params.join(' ')).
then(function(){return resolve();}).
catch(function(error){return reject(error);});
});};

var _createConfigFiles=function _createConfigFiles(configFilePath,envConfigPath){var nowParamsExists,envContent,content,_await$inquirer$promp,name,_await$inquirer$promp2,token,_args=arguments;return _regenerator.default.async(function _createConfigFiles$(_context){while(1)switch(_context.prev=_context.next){case 0:nowParamsExists=_args.length>2&&_args[2]!==undefined?_args[2]:false;envContent=_args.length>3&&_args[3]!==undefined?_args[3]:'';if(
_fs.default.existsSync(configFilePath)){_context.next=18;break;}
content={public:true,version:2};
(0,_logger.logInfo)(_chalk.default.white('now.json')+" file does not exist. Creating one for you");_context.next=7;return _regenerator.default.awrap(

_inquirer.default.prompt([{
type:'input',
name:'name',
message:'What is your project name?',
validate:function validate(i){return!!i||'Please enter a name';}
},{
type:'input',
name:'token',
message:'Do you have now token? If no leave empty and you will be asked to create one'
}]));case 7:_await$inquirer$promp=_context.sent;name=_await$inquirer$promp.name;

content.name=name;if(

nowParamsExists){_context.next=17;break;}_context.next=13;return _regenerator.default.awrap(
_inquirer.default.prompt({
type:'input',
name:'token',
message:'Do you have now token? If no leave empty and you will be asked to create one'
}));case 13:_await$inquirer$promp2=_context.sent;token=_await$inquirer$promp2.token;
if(token){
envContent+="NOW_TOKEN="+token+"\n";
_fs.default.writeFileSync(envConfigPath,envContent);
}return _context.abrupt("return",
_fs.default.writeFileSync(configFilePath,JSON.stringify(content,null,2)));case 17:return _context.abrupt("return",

_fs.default.writeFileSync(configFilePath,JSON.stringify(content,null,2)));case 18:case"end":return _context.stop();}},null,null,null,Promise);};



var deployToNow=function deployToNow(c){return new Promise(function(resolve,reject){
var nowConfigPath=_path.default.resolve(c.paths.project.dir,'now.json');
var envConfigPath=_path.default.resolve(c.paths.project.dir,'.env');

var envContent;
try{
envContent=_fs.default.readFileSync(envConfigPath).toString();
}catch(err){
envContent='';
}

var matched=false;
envContent.split('\n').map(function(line){return line.split('=');}).forEach(function(_ref){var _ref2=(0,_slicedToArray2.default)(_ref,1),key=_ref2[0];
if(['NOW_TOKEN'].indexOf(key)>-1){
matched=true;
}
});

_createConfigFiles(nowConfigPath,envConfigPath,matched,envContent).
then(function(){
_runDeploymentTask(c,nowConfigPath).
then(function(){
resolve();
}).
catch(function(err){return reject(err);});
});
});};exports.deployToNow=deployToNow;
//# sourceMappingURL=now.js.map