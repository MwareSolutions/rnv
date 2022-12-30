var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.runWebOS=exports.listWebOSTargets=exports.launchWebOSimulator=exports.configureWebOSProject=exports.buildWebOSProject=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _chalk=_interopRequireDefault(require("chalk"));
var _semver=_interopRequireDefault(require("semver"));
var _inquirer=_interopRequireDefault(require("inquirer"));
var _exec=require("../../systemTools/exec");
var _common=require("../../common");












var _=require("..");
var _logger=require("../../systemTools/logger");
var _projectParser=require("../../projectTools/projectParser");
var _constants=require("../../constants");







var _fileutils=require("../../systemTools/fileutils");
var _web=require("../web");
var _runner=require("../runner");
var _config=_interopRequireDefault(require("../../config"));
var _utils=require("../../utils");

var launchWebOSimulator=function launchWebOSimulator(c){
(0,_logger.logTask)('launchWebOSimulator');

var ePath=_path.default.join((0,_fileutils.getRealPath)(c,c.files.workspace.config.sdks.WEBOS_SDK),"Emulator/v4.0.0/LG_webOS_TV_Emulator"+(_utils.isSystemWin?'.exe':'_RCU.app'));

if(!_fs.default.existsSync(ePath)){
return Promise.reject("Can't find emulator at path: "+ePath);
}
if(_utils.isSystemWin)return(0,_exec.executeAsync)(c,ePath,{detached:true,stdio:'ignore'});
return(0,_exec.executeAsync)(c,_exec.openCommand+" "+ePath,{detached:true});
};exports.launchWebOSimulator=launchWebOSimulator;

var startHostedServerIfRequired=function startHostedServerIfRequired(c){
if(_config.default.isWebHostEnabled){
return(0,_runner.rnvStart)(c);
}
};

var parseDevices=function parseDevices(c,devicesResponse){
var linesArray=devicesResponse.split('\n').slice(2).map(function(line){return line.trim();}).filter(function(line){return line!=='';});
return Promise.all(linesArray.map(function _callee(line){var _line$split$map$filte,_line$split$map$filte2,name,device,connection,profile,deviceInfo;return _regenerator.default.async(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_line$split$map$filte=
line.split(' ').map(function(word){return word.trim();}).filter(function(word){return word!=='';}),_line$split$map$filte2=(0,_slicedToArray2.default)(_line$split$map$filte,4),name=_line$split$map$filte2[0],device=_line$split$map$filte2[1],connection=_line$split$map$filte2[2],profile=_line$split$map$filte2[3];
deviceInfo='';_context.prev=2;_context.next=5;return _regenerator.default.awrap(

(0,_exec.execCLI)(c,_constants.CLI_WEBOS_ARES_DEVICE_INFO,"-d "+name,{silent:true,timeout:10000}));case 5:deviceInfo=_context.sent;_context.next=11;break;case 8:_context.prev=8;_context.t0=_context["catch"](2);

deviceInfo=_context.t0;case 11:return _context.abrupt("return",


{
name:name,
device:device,
connection:connection,
profile:profile,
isDevice:!device.includes(c.runtime.localhost),
active:!deviceInfo.includes('ERR!')});case 12:case"end":return _context.stop();}}},null,null,[[2,8]],Promise);}));


};

var installAndLaunchApp=function installAndLaunchApp(c,target,appPath,tId){var hosted,platform,isHosted,toReturn;return _regenerator.default.async(function installAndLaunchApp$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.prev=0;_context2.next=3;return _regenerator.default.awrap(

(0,_exec.execCLI)(c,_constants.CLI_WEBOS_ARES_INSTALL,"--device "+target+" "+appPath));case 3:_context2.next=9;break;case 5:_context2.prev=5;_context2.t0=_context2["catch"](0);_context2.next=9;return _regenerator.default.awrap(



(0,_exec.execCLI)(c,_constants.CLI_WEBOS_ARES_INSTALL,"--device "+target+" "+appPath));case 9:

hosted=c.program.hosted;
platform=c.platform;
isHosted=hosted||!(0,_common.getConfigProp)(c,platform,'bundleAssets');
toReturn=true;if(!
isHosted){_context2.next=17;break;}
toReturn=startHostedServerIfRequired(c);_context2.next=17;return _regenerator.default.awrap(
(0,_common.waitForWebpack)(c));case 17:_context2.next=19;return _regenerator.default.awrap(

(0,_exec.execCLI)(c,_constants.CLI_WEBOS_ARES_LAUNCH,"--device "+target+" "+tId));case 19:return _context2.abrupt("return",
toReturn);case 20:case"end":return _context2.stop();}}},null,null,[[0,5]],Promise);};


var buildDeviceChoices=function buildDeviceChoices(devices){return devices.map(function(device){return{
key:device.name,name:device.name+" - "+device.device,value:device.name};});};


var listWebOSTargets=function listWebOSTargets(c){var devicesResponse,devices,deviceArray;return _regenerator.default.async(function listWebOSTargets$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:_context3.next=2;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_WEBOS_ARES_DEVICE_INFO,'-D'));case 2:devicesResponse=_context3.sent;_context3.next=5;return _regenerator.default.awrap(
parseDevices(c,devicesResponse));case 5:devices=_context3.sent;

deviceArray=devices.map(function(device,i){return" ["+(i+1)+"]> "+_chalk.default.bold(device.name)+" | "+device.device;});

(0,_logger.logToSummary)("WebOS Targets:\n"+deviceArray.join('\n'));return _context3.abrupt("return",

true);case 9:case"end":return _context3.stop();}}},null,null,null,Promise);};exports.listWebOSTargets=listWebOSTargets;


var waitForEmulatorToBeReady=function waitForEmulatorToBeReady(c){var devicesResponse,devices,emulator;return _regenerator.default.async(function waitForEmulatorToBeReady$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:_context4.next=2;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_WEBOS_ARES_DEVICE_INFO,'-D'));case 2:devicesResponse=_context4.sent;_context4.next=5;return _regenerator.default.awrap(
parseDevices(c,devicesResponse));case 5:devices=_context4.sent;
emulator=devices.filter(function(d){return!d.isDevice;})[0];if(
emulator){_context4.next=9;break;}throw new Error('No WebOS emulator configured');case 9:return _context4.abrupt("return",

(0,_common.waitForEmulator)(c,_constants.CLI_WEBOS_ARES_DEVICE_INFO,"-d "+emulator.name,function(res){return res.includes('modelName');}));case 10:case"end":return _context4.stop();}}},null,null,null,Promise);};


var runWebOS=function runWebOS(c,platform,target){var _c$program,device,hosted,isHosted,tDir,tOut,tSim,configFilePath,cnfg,tId,appPath,isPortActive,devicesResponse,devices,activeDevices,actualDevices,response,newDeviceResponse,dev,actualDev,newDevice,tv,choices,_response;return _regenerator.default.async(function runWebOS$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:
(0,_logger.logTask)("runWebOS:"+platform+":"+target);_c$program=

c.program,device=_c$program.device,hosted=_c$program.hosted;

isHosted=hosted||!(0,_common.getConfigProp)(c,platform,'bundleAssets');

tDir=_path.default.join((0,_common.getAppFolder)(c,platform),'public');
tOut=_path.default.join((0,_common.getAppFolder)(c,platform),'output');
tSim=c.program.target||'emulator';
configFilePath=_path.default.join((0,_common.getAppFolder)(c,platform),'public/appinfo.json');

(0,_logger.logTask)("runWebOS:"+platform+":"+target+":"+isHosted,_chalk.default.grey);

cnfg=JSON.parse(_fs.default.readFileSync(configFilePath,'utf-8'));
tId=cnfg.id;
appPath=_path.default.join(tOut,tId+"_"+cnfg.version+"_all.ipk");if(!

isHosted){_context5.next=19;break;}_context5.next=14;return _regenerator.default.awrap(
(0,_common.checkPortInUse)(c,platform,c.runtime.port));case 14:isPortActive=_context5.sent;if(!
isPortActive){_context5.next=19;break;}_context5.next=18;return _regenerator.default.awrap(
(0,_common.confirmActiveBundler)(c));case 18:
c.runtime.skipActiveServerCheck=true;case 19:_context5.t0=




!isHosted;if(!_context5.t0){_context5.next=23;break;}_context5.next=23;return _regenerator.default.awrap((0,_web.buildWeb)(c,platform));case 23:_context5.next=25;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_WEBOS_ARES_PACKAGE,"-o "+tOut+" "+tDir+" -n"));case 25:_context5.next=27;return _regenerator.default.awrap(


(0,_exec.execCLI)(c,_constants.CLI_WEBOS_ARES_DEVICE_INFO,'-D'));case 27:devicesResponse=_context5.sent;_context5.next=30;return _regenerator.default.awrap(
parseDevices(c,devicesResponse));case 30:devices=_context5.sent;
activeDevices=devices.filter(function(d){return d.active;});if(!

device){_context5.next=62;break;}

actualDevices=devices.filter(function(d){return d.isDevice;});if(

actualDevices.length){_context5.next=57;break;}_context5.next=37;return _regenerator.default.awrap(

_inquirer.default.prompt([{
type:'confirm',
name:'setupDevice',
message:'Looks like you want to deploy on a device but have none configured. Do you want to configure one?',
default:false}]));case 37:response=_context5.sent;if(!


response.setupDevice){_context5.next=55;break;}

(0,_logger.logInfo)('Please follow the instructions from http://webostv.developer.lge.com/develop/app-test/#installDevModeApp on how to setup the TV and the connection with the PC. Then follow the onscreen prompts\n');_context5.next=42;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_WEBOS_ARES_SETUP_DEVICE,'',{interactive:true}));case 42:_context5.next=44;return _regenerator.default.awrap(

(0,_exec.execCLI)(c,_constants.CLI_WEBOS_ARES_DEVICE_INFO,'-D'));case 44:newDeviceResponse=_context5.sent;_context5.next=47;return _regenerator.default.awrap(
parseDevices(c,newDeviceResponse));case 47:dev=_context5.sent;
actualDev=dev.filter(function(d){return d.isDevice;});if(!(

actualDev.length>0)){_context5.next=55;break;}
newDevice=actualDev[0];

(0,_logger.logInfo)('Please enter the `Passphrase` from the TV\'s Developer Mode app');_context5.next=54;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_WEBOS_ARES_NOVACOM,"--device "+newDevice.name+" --getkey",{stdio:'inherit'}));case 54:return _context5.abrupt("return",
installAndLaunchApp(c,newDevice.name,appPath,tId));case 55:_context5.next=60;break;case 57:if(!(




actualDevices.length===1)){_context5.next=60;break;}
tv=actualDevices[0];return _context5.abrupt("return",
installAndLaunchApp(c,tv.name,appPath,tId));case 60:_context5.next=82;break;case 62:if(

c.program.target){_context5.next=81;break;}if(!(

activeDevices.length===1)){_context5.next=65;break;}return _context5.abrupt("return",

installAndLaunchApp(c,devices[0].name,appPath,tId));case 65:if(!(

activeDevices.length>1)){_context5.next=74;break;}

choices=buildDeviceChoices(devices);_context5.next=69;return _regenerator.default.awrap(
_inquirer.default.prompt([{
name:'chosenDevice',
type:'list',
message:'What device would you like to start the app?',
choices:choices}]));case 69:_response=_context5.sent;if(!

_response.chosenDevice){_context5.next=72;break;}return _context5.abrupt("return",
installAndLaunchApp(c,_response.chosenDevice,appPath,tId));case 72:_context5.next=79;break;case 74:_context5.next=76;return _regenerator.default.awrap(


launchWebOSimulator(c));case 76:_context5.next=78;return _regenerator.default.awrap(
waitForEmulatorToBeReady(c));case 78:return _context5.abrupt("return",
installAndLaunchApp(c,tSim,appPath,tId));case 79:_context5.next=82;break;case 81:return _context5.abrupt("return",



installAndLaunchApp(c,c.program.target,appPath,tId));case 82:case"end":return _context5.stop();}}},null,null,null,Promise);};exports.runWebOS=runWebOS;




var buildWebOSProject=function buildWebOSProject(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("buildWebOSProject:"+platform);

var tDir=_path.default.join((0,_common.getAppFolder)(c,platform),'public');
var tOut=_path.default.join((0,_common.getAppFolder)(c,platform),'output');

(0,_web.buildWeb)(c,platform).
then(function(){return(0,_exec.execCLI)(c,_constants.CLI_WEBOS_ARES_PACKAGE,"-o "+tOut+" "+tDir+" -n");}).
then(function(){
(0,_logger.logSuccess)("Your IPK package is located in "+_chalk.default.white(tOut)+" .");
return resolve();
}).
catch(reject);
});};exports.buildWebOSProject=buildWebOSProject;

var configureWebOSProject=function configureWebOSProject(c,platform){return _regenerator.default.async(function configureWebOSProject$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:
(0,_logger.logTask)('configureWebOSProject');if(

(0,_.isPlatformActive)(c,platform)){_context6.next=3;break;}return _context6.abrupt("return");case 3:_context6.next=5;return _regenerator.default.awrap(

(0,_projectParser.copyAssetsFolder)(c,platform));case 5:_context6.next=7;return _regenerator.default.awrap(
(0,_web.configureCoreWebProject)(c,platform));case 7:_context6.next=9;return _regenerator.default.awrap(
configureProject(c,platform));case 9:return _context6.abrupt("return",
(0,_projectParser.copyBuildsFolder)(c,platform));case 10:case"end":return _context6.stop();}}},null,null,null,Promise);};exports.configureWebOSProject=configureWebOSProject;


var configureProject=function configureProject(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("configureProject:"+platform);

var appFolder=(0,_common.getAppFolder)(c,platform);

var configFile='public/appinfo.json';
(0,_common.writeCleanFile)(_path.default.join((0,_common.getAppTemplateFolder)(c,platform),configFile),_path.default.join(appFolder,configFile),[
{pattern:'{{APPLICATION_ID}}',override:(0,_common.getAppId)(c,platform).toLowerCase()},
{pattern:'{{APP_TITLE}}',override:(0,_common.getAppTitle)(c,platform)},
{pattern:'{{APP_VERSION}}',override:_semver.default.coerce((0,_common.getAppVersion)(c,platform))}]);


resolve();
});};
//# sourceMappingURL=index.js.map