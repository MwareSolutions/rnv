var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.selectWebToolAndExport=exports.selectWebToolAndDeploy=exports.DEPLOY_TARGET_NOW=exports.DEPLOY_TARGET_NONE=exports.DEPLOY_TARGET_FTP=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _chalk=_interopRequireDefault(require("chalk"));
var _minimist=_interopRequireDefault(require("minimist"));
var _inquirer=_interopRequireDefault(require("inquirer"));
var _path=_interopRequireDefault(require("path"));

var _now=require("./now");
var _ftp=require("./ftp");
var _common=require("../common");


var _logger=require("../systemTools/logger");


var _configure=require("./configure");

var DEPLOY_TARGET_DOCKER='docker';
var DEPLOY_TARGET_FTP='ftp';exports.DEPLOY_TARGET_FTP=DEPLOY_TARGET_FTP;
var DEPLOY_TARGET_NOW='now';exports.DEPLOY_TARGET_NOW=DEPLOY_TARGET_NOW;
var DEPLOY_TARGET_NONE='none';exports.DEPLOY_TARGET_NONE=DEPLOY_TARGET_NONE;

var _runDeployment=function _runDeployment(c,platform,deployType){var rnvPath,deployToDocker;return _regenerator.default.async(function _runDeployment$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.t0=
deployType;_context.next=_context.t0===
DEPLOY_TARGET_FTP?3:_context.t0===

DEPLOY_TARGET_NOW?4:_context.t0===

DEPLOY_TARGET_NONE?5:_context.t0===

DEPLOY_TARGET_DOCKER?6:10;break;case 3:return _context.abrupt("return",(0,_ftp.deployToFtp)(c,platform));case 4:return _context.abrupt("return",(0,_now.deployToNow)(c,platform));case 5:return _context.abrupt("return",Promise.resolve());case 6:
rnvPath=process.mainModule.filename.split('/bin/index.js')[0];
deployToDocker=(0,_common.importPackageFromProject)('@rnv/deploy-docker');
deployToDocker.setRNVPath(rnvPath);return _context.abrupt("return",
deployToDocker.doDeploy());case 10:return _context.abrupt("return",

Promise.reject(new Error("Deploy Type not supported "+deployType)));case 11:case"end":return _context.stop();}}},null,null,null,Promise);};



var _runExport=function _runExport(c,platform,deployType){
switch(deployType){
case DEPLOY_TARGET_DOCKER:
var rnvPath=process.mainModule.filename.split('/bin/index.js')[0];
var deployToDocker=(0,_common.importPackageFromProject)('@rnv/deploy-docker');
deployToDocker.setRNVPath(rnvPath);
return deployToDocker.doExport();
default:
return Promise.reject(new Error("Deploy Type not supported "+deployType));}

};

var selectToolAndExecute=function selectToolAndExecute(_ref){var c,platform,choices,configFunction,executeFunction,_ref$isDeploy,isDeploy,argv,type,targetConfig,_await$inquirer$promp,selectedTarget;return _regenerator.default.async(function selectToolAndExecute$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
c=_ref.c,platform=_ref.platform,choices=_ref.choices,configFunction=_ref.configFunction,executeFunction=_ref.executeFunction,_ref$isDeploy=_ref.isDeploy,isDeploy=_ref$isDeploy===void 0?true:_ref$isDeploy;

argv=(0,_minimist.default)(c.process.argv.slice(2));
type=argv.t;
targetConfig=c.buildConfig.platforms[platform];if(!(

type||targetConfig&&targetConfig.deploy&&targetConfig.deploy.type)){_context2.next=8;break;}_context2.next=7;return _regenerator.default.awrap(
configFunction(type||targetConfig.deploy.type));case 7:return _context2.abrupt("return",
executeFunction(c,platform,type||targetConfig.deploy.type));case 8:_context2.next=10;return _regenerator.default.awrap(

_inquirer.default.prompt({
name:'selectedTarget',
type:'list',
choices:choices,
message:"Which type of "+(isDeploy?'deploy':'export')+" option would you like to use for "+_chalk.default.white(platform)+"?"}));case 10:_await$inquirer$promp=_context2.sent;selectedTarget=_await$inquirer$promp.selectedTarget;_context2.next=14;return _regenerator.default.awrap(


configFunction(selectedTarget));case 14:

(0,_logger.logInfo)("Setting your appconfig for "+_chalk.default.white(platform)+" to include "+(isDeploy?'deploy':'export')+" type: "+_chalk.default.white(selectedTarget)+" at "+_chalk.default.white(c.paths.appConfig.config));return _context2.abrupt("return",
executeFunction(c,platform,selectedTarget));case 16:case"end":return _context2.stop();}}},null,null,null,Promise);};


var selectWebToolAndDeploy=function selectWebToolAndDeploy(c,platform){return selectToolAndExecute({
c:c,
platform:platform,
choices:[DEPLOY_TARGET_DOCKER,DEPLOY_TARGET_FTP,DEPLOY_TARGET_NOW,DEPLOY_TARGET_NONE],
configFunction:_configure.configureDeploymentIfRequired,
executeFunction:_runDeployment});};exports.selectWebToolAndDeploy=selectWebToolAndDeploy;


var selectWebToolAndExport=function selectWebToolAndExport(c,platform){return selectToolAndExecute({
c:c,
platform:platform,
choices:[DEPLOY_TARGET_DOCKER],
configFunction:_configure.configureExportIfRequired,
executeFunction:_runExport,
isDeploy:false});};exports.selectWebToolAndExport=selectWebToolAndExport;
//# sourceMappingURL=webTools.js.map