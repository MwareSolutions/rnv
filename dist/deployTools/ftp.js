var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.deployToFtp=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _inquirer=_interopRequireDefault(require("inquirer"));

var _logger=require("../systemTools/logger");



var _fileutils=require("../systemTools/fileutils");
var _webTools=require("./webTools");

var _deployToFtp=function _deployToFtp(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("_deployToFtp:"+platform);
var promise;
var envPath=_path.default.resolve(c.paths.project.dir,'.env');
if(!_fs.default.existsSync(envPath)){
(0,_logger.logInfo)('.env file does not exist. Creating one for you');
promise=_createEnvFtpConfig(envPath);
}else{
promise=new Promise(function(resolve,reject){
_fs.default.readFile(envPath,function(err,data){
if(err)return reject(err);
resolve(data.toString());
});
});
}
promise.then(function(envContent){
var matches=0;
var targetMatches=2;
envContent.split('\n').map(function(line){return line.split('=');}).forEach(function(_ref){var _ref2=(0,_slicedToArray2.default)(_ref,2),key=_ref2[0],val=_ref2[1];
if(['RNV_DEPLOY_WEB_FTP_SERVER','RNV_DEPLOY_WEB_FTP_USER'].indexOf(key)>-1){
matches++;
}
});
var envPromise;
if(matches>=targetMatches){
envPromise=Promise.resolve();
}else{
(0,_logger.logInfo)('.env file does not contain all needed FTP config, helping you to set it up');
envPromise=_createEnvFtpConfig(envPath,envContent+"\n");
}
return envPromise;
}).
then(function(){
require('dotenv').config();
var config={
user:process.env.RNV_DEPLOY_WEB_FTP_USER,
password:process.env.RNV_DEPLOY_WEB_FTP_PASSWORD,
host:process.env.RNV_DEPLOY_WEB_FTP_SERVER,
port:process.env.RNV_DEPLOY_WEB_FTP_PORT||21,
localRoot:c.buildConfig.platforms[platform].deploy[_webTools.DEPLOY_TARGET_FTP].localRoot,
remoteRoot:c.buildConfig.platforms[platform].deploy[_webTools.DEPLOY_TARGET_FTP].remoteRoot||'/',
include:c.buildConfig.platforms[platform].deploy[_webTools.DEPLOY_TARGET_FTP].include||['*','**/*'],
exclude:c.buildConfig.platforms[platform].deploy[_webTools.DEPLOY_TARGET_FTP].exclude||[],
deleteRemote:c.buildConfig.platforms[platform].deploy[_webTools.DEPLOY_TARGET_FTP].exclude.deleteRemote||false,
forcePasv:true};

return config;
}).
then(function(config){
var FtpDeploy=require('ftp-deploy');
var ftpDeploy=new FtpDeploy();
return ftpDeploy.deploy(config);
}).catch(reject);
});};

var _createEnvFtpConfig=function _createEnvFtpConfig(configFilePath){var previousContent,envContent,_ref3,host,user,password,port,_args=arguments;return _regenerator.default.async(function _createEnvFtpConfig$(_context){while(1){switch(_context.prev=_context.next){case 0:previousContent=_args.length>1&&_args[1]!==undefined?_args[1]:'';
envContent=previousContent||'';_context.next=4;return _regenerator.default.awrap(

_inquirer.default.prompt([
{
name:'host',
type:'input',
message:'Type your FTP host',
validate:function validate(i){return!!i||'No FTP server provided';}},

{
name:'port',
type:'number',
message:'Type your FTP port',
default:21,
validate:function validate(i){return!!i||'No FTP server provided';}},

{
name:'user',
message:'Type your FTP user',
type:'input',
validate:function validate(i){return!!i||'No FTP user provided';}},

{
name:'password',
message:'Type your FTP password (or press ENTER for prompting every time)',
type:'password'}]));case 4:_ref3=_context.sent;host=_ref3.host;user=_ref3.user;password=_ref3.password;port=_ref3.port;



envContent+="RNV_DEPLOY_WEB_FTP_SERVER="+host+"\n";
envContent+="RNV_DEPLOY_WEB_FTP_USER="+user+"\n";
envContent+="RNV_DEPLOY_WEB_FTP_PASSWORD="+password+"\n";
envContent+="RNV_DEPLOY_WEB_FTP_PORT="+port;

_fs.default.writeFileSync(configFilePath,envContent);
(0,_logger.logInfo)("Writing .env config to "+configFilePath);case 15:case"end":return _context.stop();}}});};


var _createDeployConfig=function _createDeployConfig(c,platform){var deploy,_ref4,remoteRoot,deleteRemote,include,exclude,excludeSourcemaps;return _regenerator.default.async(function _createDeployConfig$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)("_createDeployConfig:"+platform);

deploy=c.buildConfig.platforms[platform].deploy||{};

deploy[_webTools.DEPLOY_TARGET_FTP]={};
deploy[_webTools.DEPLOY_TARGET_FTP].type=_webTools.DEPLOY_TARGET_FTP;

deploy[_webTools.DEPLOY_TARGET_FTP].localRoot=_path.default.resolve(c.paths.project.builds.dir,c.runtime.appId+"_"+platform);_context2.next=7;return _regenerator.default.awrap(
_inquirer.default.prompt([
{
name:'remoteRoot',
type:'input',
message:'Folder on the ftp to upload the project',
default:'/'},

{
name:'deleteRemote',
type:'confirm',
message:'Delete all contents of that folder when deploying versions?'},

{
name:'include',
type:'input',
message:'Included files pattern, comma separated',
default:'\'*\',\'**/*\''},

{
name:'exclude',
type:'input',
message:'Excluded files pattern, comma separated',
default:'[]'},

{
name:'excludeSourcemaps',
type:'confirm',
message:'Exclude sourcemaps?'}]));case 7:_ref4=_context2.sent;remoteRoot=_ref4.remoteRoot;deleteRemote=_ref4.deleteRemote;include=_ref4.include;exclude=_ref4.exclude;excludeSourcemaps=_ref4.excludeSourcemaps;



deploy[_webTools.DEPLOY_TARGET_FTP].remoteRoot=remoteRoot||'/';
deploy[_webTools.DEPLOY_TARGET_FTP].deleteRemote=deleteRemote;
deploy[_webTools.DEPLOY_TARGET_FTP].include=include?include.split(','):['*','**/*'];
deploy[_webTools.DEPLOY_TARGET_FTP].exclude=exclude?exclude.split(','):[];
deploy[_webTools.DEPLOY_TARGET_FTP].exclude=deploy[_webTools.DEPLOY_TARGET_FTP].exclude.concat(excludeSourcemaps?['**/*.map']:[]);

(0,_logger.logInfo)("Setting your appconfig for "+platform+" to include deploy type: "+_webTools.DEPLOY_TARGET_FTP+"\n                    on "+
c.paths.appConfig.config+"\n                ");



c.files.appConfig.config.platforms[platform].deploy=deploy;
(0,_fileutils.writeFileSync)(c.paths.appConfig.config,c.files.appConfig.config);case 21:case"end":return _context2.stop();}}});};


var deployToFtp=function deployToFtp(c,platform){var _targetConfig$deploy,_targetConfig$deploy$;
(0,_logger.logTask)("checkDeployConfigTarget:"+platform);
var targetConfig=c.buildConfig.platforms[platform];
if(targetConfig==null?void 0:(_targetConfig$deploy=targetConfig.deploy)==null?void 0:(_targetConfig$deploy$=_targetConfig$deploy[_webTools.DEPLOY_TARGET_FTP])==null?void 0:_targetConfig$deploy$.type){
return _deployToFtp(c,platform);
}
return _createDeployConfig(c,platform).then(function(){return _deployToFtp(c,platform);});
};exports.deployToFtp=deployToFtp;
//# sourceMappingURL=ftp.js.map