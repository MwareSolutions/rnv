var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.configureProject=exports.configureTizenProject=exports.buildTizenProject=exports.runTizen=exports.addDevelopTizenCertificate=exports.createDevelopTizenCertificate=exports.listTizenTargets=exports.launchTizenSimulator=exports.configureTizenGlobal=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _chalk=_interopRequireDefault(require("chalk"));
var _inquirer=_interopRequireDefault(require("inquirer"));
var _net=_interopRequireDefault(require("net"));
var _xml2json=_interopRequireDefault(require("xml2json"));

var _exec=require("../../systemTools/exec");
var _constants=require("../../constants");
var _common=require("../../common");









var _logger=require("../../systemTools/logger");







var _=require("..");
var _projectParser=require("../../projectTools/projectParser");
var _web=require("../web");
var _runner=require("../runner");
var _config=_interopRequireDefault(require("../../config"));function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);if(enumerableOnly)symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;});keys.push.apply(keys,symbols);}return keys;}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};if(i%2){ownKeys(Object(source),true).forEach(function(key){(0,_defineProperty2.default)(target,key,source[key]);});}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(target,Object.getOwnPropertyDescriptors(source));}else{ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}}return target;}

var formatXMLObject=function formatXMLObject(obj){return _objectSpread({},
obj['model-config'].platform.key.reduce(function(acc,cur,i){
acc[cur.name]=cur.$t;
return acc;
},{}));};


var configureTizenGlobal=function configureTizenGlobal(c){return new Promise(function(resolve,reject){
(0,_logger.logTask)('configureTizenGlobal');


var tizenAuthorCert=_path.default.join(c.paths.workspace.dir,'tizen_author.p12');
if(_fs.default.existsSync(tizenAuthorCert)){
console.log('tizen_author.p12 file exists!');
resolve();
}else{
console.log('tizen_author.p12 file missing! Creating one for you...');
createDevelopTizenCertificate(c).
then(function(){return resolve();}).
catch(function(e){return reject(e);});
}

});};exports.configureTizenGlobal=configureTizenGlobal;

var launchTizenSimulator=function launchTizenSimulator(c,name){
(0,_logger.logTask)("launchTizenSimulator:"+name);

if(name){
return(0,_exec.execCLI)(c,_constants.CLI_TIZEN_EMULATOR,"launch --name "+name,{detached:true});
}
return Promise.reject('No simulator -t target name specified!');
};exports.launchTizenSimulator=launchTizenSimulator;

var listTizenTargets=function listTizenTargets(c,name){var targets,targetArr,targetStr;return _regenerator.default.async(function listTizenTargets$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.next=2;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_TIZEN_EMULATOR,'list-vm',{detached:true}));case 2:targets=_context.sent;
targetArr=targets.split('\n');
targetStr='';
Object.keys(targetArr).forEach(function(i){
targetStr+="["+i+"]> "+targetArr[i]+"\n";
});
(0,_logger.logToSummary)("Tizen Targets:\n"+targetStr);case 7:case"end":return _context.stop();}}});};exports.listTizenTargets=listTizenTargets;


var createDevelopTizenCertificate=function createDevelopTizenCertificate(c){return new Promise(function(resolve,reject){
(0,_logger.logTask)('createDevelopTizenCertificate');

(0,_exec.execCLI)(c,_constants.CLI_TIZEN,"certificate -- "+c.paths.workspace.dir+" -a rnv -f tizen_author -p 1234").
then(function(){return addDevelopTizenCertificate(c);}).
then(function(){return resolve();}).
catch(function(e){
(0,_logger.logError)(e);
resolve();
});
});};exports.createDevelopTizenCertificate=createDevelopTizenCertificate;

var addDevelopTizenCertificate=function addDevelopTizenCertificate(c){return new Promise(function(resolve){
(0,_logger.logTask)('addDevelopTizenCertificate');

(0,_exec.execCLI)(c,_constants.CLI_TIZEN,"security-profiles add -n RNVanillaCert -a "+_path.default.join(c.paths.workspace.dir,'tizen_author.p12')+" -p 1234").
then(function(){return resolve();}).
catch(function(e){
(0,_logger.logError)(e);
resolve();
});
});};exports.addDevelopTizenCertificate=addDevelopTizenCertificate;

var _getDeviceID=function _getDeviceID(c,target){var device,connectResponse,devicesList,lines,devices,deviceID;return _regenerator.default.async(function _getDeviceID$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
device=c.program.device;if(!

device){_context2.next=17;break;}_context2.prev=2;_context2.next=5;return _regenerator.default.awrap(


(0,_exec.execCLI)(c,_constants.CLI_SDB_TIZEN,"connect "+target));case 5:connectResponse=_context2.sent;_context2.next=11;break;case 8:_context2.prev=8;_context2.t0=_context2["catch"](2);

connectResponse=_context2.t0;case 11:if(!

connectResponse.includes('EPERM')){_context2.next=13;break;}throw new Error('We can\'t connect to this device even though it is reachable. Please make sure you have enabled Developer Mode and you have added your IP in the Host PC IP section. For more information consult https://developer.samsung.com/tv/develop/getting-started/using-sdk/tv-device');case 13:if(!
connectResponse.includes('failed to connect to remote target')){_context2.next=15;break;}throw new Error("Failed to connect to "+target+". Make sure the IP is correct and you are connected on the same network.");case 15:if(!
connectResponse.includes('error')){_context2.next=17;break;}throw new Error(connectResponse);case 17:_context2.next=19;return _regenerator.default.awrap(


(0,_exec.execCLI)(c,_constants.CLI_SDB_TIZEN,'devices'));case 19:devicesList=_context2.sent;if(!
devicesList.includes(target)){_context2.next=26;break;}
lines=devicesList.trim().split(/\r?\n/);
devices=lines.filter(function(line){return line.includes(target);});

if(devices.length>1){

}

deviceID=devices[0].split('device')[1].trim();return _context2.abrupt("return",
deviceID);case 26:return _context2.abrupt("return",

Promise.reject("No device matching "+target+" could be found."));case 27:case"end":return _context2.stop();}}},null,null,[[2,8]]);};


var _getRunningDevices=function _getRunningDevices(c){var platform,devicesList,lines,devices;return _regenerator.default.async(function _getRunningDevices$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:
platform=c.program.platform;_context4.next=3;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_SDB_TIZEN,'devices'));case 3:devicesList=_context4.sent;
lines=devicesList.trim().split(/\r?\n/).filter(function(line){return!line.includes('List of devices');});
devices=[];_context4.next=8;return _regenerator.default.awrap(

Promise.all(lines.map(function _callee(line){var words,name,deviceInfoXML,deviceInfo,deviceType;return _regenerator.default.async(function _callee$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:
words=line.replace(/\t/g,'').split('    ');if(!(
words.length>=3)){_context3.next=8;break;}
name=words[0].trim();_context3.next=5;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_SDB_TIZEN,"-s "+name+" shell cat /etc/config/model-config.xml",{ignoreErrors:true}));case 5:deviceInfoXML=_context3.sent;




if(deviceInfoXML!==true&&deviceInfoXML!==''){

deviceInfo=formatXMLObject(_xml2json.default.toJson(deviceInfoXML,{object:true,reversible:false}));
deviceType=deviceInfo['tizen.org/feature/profile'];
}

if(platform==='tizenmobile'&&deviceType==='mobile'||platform==='tizenwatch'&&deviceType==='wearable'||platform==='tizen'&&!deviceType){
devices.push({
name:name,
type:words[1].trim(),
id:words[2].trim(),
deviceType:deviceType});

}case 8:case"end":return _context3.stop();}}});})));case 8:return _context4.abrupt("return",



devices);case 9:case"end":return _context4.stop();}}});};


var _waitForEmulatorToBeReady=function _waitForEmulatorToBeReady(c,target){return(0,_common.waitForEmulator)(c,_constants.CLI_SDB_TIZEN,'devices',function(res){
var lines=res.trim().split(/\r?\n/);
var devices=lines.filter(function(line){return line.includes(target)&&line.includes('device');});
return devices.length>0;
});};

var _composeDevicesString=function _composeDevicesString(devices){return devices.map(function(device){return{key:device.id,name:device.name,value:device.id};});};

var startHostedServerIfRequired=function startHostedServerIfRequired(c){
if(_config.default.isWebHostEnabled){
return(0,_runner.rnvStart)(c);
}
};

var runTizen=function runTizen(c,platform,target){var platformConfig,_c$program,hosted,debug,isHosted,tDir,tBuild,tOut,tId,gwt,certProfile,deviceID,isPortActive,askForEmulator,continueLaunching,isTargetSpecified,devices,targetDevice,choices,_ref2,chosenEmulator;return _regenerator.default.async(function runTizen$(_context7){while(1){switch(_context7.prev=_context7.next){case 0:
(0,_logger.logTask)("runTizen:"+platform+":"+target);

platformConfig=c.buildConfig.platforms[platform];_c$program=
c.program,hosted=_c$program.hosted,debug=_c$program.debug;

isHosted=hosted||!(0,_common.getConfigProp)(c,platform,'bundleAssets');if(


platformConfig){_context7.next=6;break;}throw(
new Error("runTizen: "+_chalk.default.grey(platform)+" not defined in your "+_chalk.default.white(c.paths.appConfig.config)));case 6:if(

platformConfig.appName){_context7.next=8;break;}throw(
new Error("runTizen: "+_chalk.default.grey(platform)+".appName not defined in your "+_chalk.default.white(c.paths.appConfig.config)));case 8:


tDir=(0,_common.getAppFolder)(c,platform);
tBuild=_path.default.join(tDir,'build');
tOut=_path.default.join(tDir,'output');
tId=platformConfig.id;
gwt=platformConfig.appName+".wgt";
certProfile=platformConfig.certificateProfile;if(!




isHosted){_context7.next=22;break;}_context7.next=17;return _regenerator.default.awrap(
(0,_common.checkPortInUse)(c,platform,c.runtime.port));case 17:isPortActive=_context7.sent;if(!
isPortActive){_context7.next=22;break;}_context7.next=21;return _regenerator.default.awrap(
(0,_common.confirmActiveBundler)(c));case 21:
c.runtime.skipActiveServerCheck=true;case 22:




askForEmulator=function askForEmulator(){var _ref,startEmulator,defaultTarget;return _regenerator.default.async(function askForEmulator$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:_context5.next=2;return _regenerator.default.awrap(
_inquirer.default.prompt([{
name:'startEmulator',
type:'confirm',
message:"Could not find or connect to the specified target ("+target+"). Would you like to start an emulator?"}]));case 2:_ref=_context5.sent;startEmulator=_ref.startEmulator;if(!


startEmulator){_context5.next=33;break;}
defaultTarget=c.files.workspace.config.defaultTargets[platform];_context5.prev=6;_context5.next=9;return _regenerator.default.awrap(

launchTizenSimulator(c,defaultTarget));case 9:
deviceID=defaultTarget;_context5.next=12;return _regenerator.default.awrap(
_waitForEmulatorToBeReady(c,defaultTarget));case 12:return _context5.abrupt("return",
continueLaunching());case 15:_context5.prev=15;_context5.t0=_context5["catch"](6);

(0,_logger.logDebug)("askForEmulator:ERRROR: "+_context5.t0);_context5.prev=18;_context5.next=21;return _regenerator.default.awrap(

(0,_exec.execCLI)(c,_constants.CLI_TIZEN_EMULATOR,"create -n "+defaultTarget+" -p tv-samsung-5.0-x86"));case 21:_context5.next=23;return _regenerator.default.awrap(
launchTizenSimulator(c,defaultTarget));case 23:
deviceID=defaultTarget;_context5.next=26;return _regenerator.default.awrap(
_waitForEmulatorToBeReady(c,defaultTarget));case 26:return _context5.abrupt("return",
continueLaunching());case 29:_context5.prev=29;_context5.t1=_context5["catch"](18);

(0,_logger.logDebug)(_context5.t1);
(0,_logger.logError)("Could not find the specified target and could not create the emulator automatically. Please create one and then edit the default target from "+c.paths.workspace.dir+"/"+_constants.RENATIVE_CONFIG_NAME);case 33:case"end":return _context5.stop();}}},null,null,[[6,15],[18,29]]);};





continueLaunching=function continueLaunching(){var hasDevice,packageID,toReturn,_packageID;return _regenerator.default.async(function continueLaunching$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:
hasDevice=false;_context6.t0=

!isHosted;if(!_context6.t0){_context6.next=5;break;}_context6.next=5;return _regenerator.default.awrap((0,_web.buildWeb)(c,platform));case 5:_context6.next=7;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_TIZEN,"build-web -- "+tDir+" -out "+tBuild));case 7:_context6.next=9;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_TIZEN,"package -- "+tBuild+" -s "+certProfile+" -t wgt -o "+tOut));case 9:_context6.prev=9;


packageID=platform==='tizenwatch'||platform==='tizenmobile'?tId.split('.')[0]:tId;_context6.next=13;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_TIZEN,"uninstall -p "+packageID+" -t "+deviceID,{ignoreErrors:true}));case 13:
hasDevice=true;_context6.next=24;break;case 16:_context6.prev=16;_context6.t1=_context6["catch"](9);if(!(

_context6.t1&&_context6.t1.includes&&_context6.t1.includes('No device matching'))){_context6.next=24;break;}_context6.next=21;return _regenerator.default.awrap(
launchTizenSimulator(c,target));case 21:_context6.next=23;return _regenerator.default.awrap(
_waitForEmulatorToBeReady(c,target));case 23:hasDevice=_context6.sent;case 24:_context6.prev=24;_context6.next=27;return _regenerator.default.awrap(



(0,_exec.execCLI)(c,_constants.CLI_TIZEN,"install -- "+tOut+" -n "+gwt+" -t "+deviceID));case 27:
hasDevice=true;_context6.next=39;break;case 30:_context6.prev=30;_context6.t2=_context6["catch"](24);

(0,_logger.logError)(_context6.t2);
(0,_logger.logWarning)("Looks like there is no emulator or device connected! Let's try to launch it. \""+
_chalk.default.white.bold("rnv target launch -p "+
platform+" -t "+target)+"\"");_context6.next=36;return _regenerator.default.awrap(



launchTizenSimulator(c,target));case 36:_context6.next=38;return _regenerator.default.awrap(
_waitForEmulatorToBeReady(c,target));case 38:hasDevice=_context6.sent;case 39:


toReturn=true;if(!

isHosted){_context6.next=44;break;}
toReturn=startHostedServerIfRequired(c);_context6.next=44;return _regenerator.default.awrap(
(0,_common.waitForWebpack)(c));case 44:if(!(


platform!=='tizenwatch'&&platform!=='tizenmobile'&&hasDevice)){_context6.next=49;break;}_context6.next=47;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_TIZEN,"run -p "+tId+" -t "+deviceID));case 47:_context6.next=53;break;case 49:if(!(
(platform==='tizenwatch'||platform==='tizenmobile')&&hasDevice)){_context6.next=53;break;}
_packageID=tId.split('.');_context6.next=53;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_TIZEN,"run -p "+_packageID[0]+" -t "+deviceID));case 53:return _context6.abrupt("return",

toReturn);case 54:case"end":return _context6.stop();}}},null,null,[[9,16],[24,30]]);};



isTargetSpecified=c.program.target;_context7.next=27;return _regenerator.default.awrap(


_getRunningDevices(c));case 27:devices=_context7.sent;if(!

isTargetSpecified){_context7.next=53;break;}if(!

_net.default.isIP(target)){_context7.next=34;break;}_context7.next=32;return _regenerator.default.awrap(
_getDeviceID(c,target));case 32:deviceID=_context7.sent;return _context7.abrupt("return",
continueLaunching());case 34:if(!(


devices.length>0)){_context7.next=39;break;}
targetDevice=devices.find(function(device){return device.id===target||device.name===target;});if(!
targetDevice){_context7.next=39;break;}
deviceID=targetDevice.id;return _context7.abrupt("return",
continueLaunching());case 39:_context7.prev=39;_context7.next=42;return _regenerator.default.awrap(




launchTizenSimulator(c,target));case 42:_context7.next=44;return _regenerator.default.awrap(
_waitForEmulatorToBeReady(c,target));case 44:
deviceID=target;return _context7.abrupt("return",
continueLaunching());case 48:_context7.prev=48;_context7.t0=_context7["catch"](39);return _context7.abrupt("return",

askForEmulator());case 51:_context7.next=65;break;case 53:if(!(


devices.length===1)){_context7.next=56;break;}
deviceID=devices[0].id;return _context7.abrupt("return",
continueLaunching());case 56:if(!(
devices.length>1)){_context7.next=64;break;}
choices=_composeDevicesString(devices);_context7.next=60;return _regenerator.default.awrap(
_inquirer.default.prompt([{
name:'chosenEmulator',
type:'list',
message:'On what emulator would you like to run the app?',
choices:choices}]));case 60:_ref2=_context7.sent;chosenEmulator=_ref2.chosenEmulator;

deviceID=chosenEmulator;return _context7.abrupt("return",
continueLaunching());case 64:return _context7.abrupt("return",

askForEmulator());case 65:case"end":return _context7.stop();}}},null,null,[[39,48]]);};exports.runTizen=runTizen;



var buildTizenProject=function buildTizenProject(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("buildTizenProject:"+platform);

var platformConfig=c.buildConfig.platforms[platform];
var tDir=(0,_common.getAppFolder)(c,platform);
var tOut=_path.default.join(tDir,'output');
var tBuild=_path.default.join(tDir,'build');
var certProfile=platformConfig.certificateProfile;

(0,_web.buildWeb)(c,platform).
then(function(){return(0,_exec.execCLI)(c,_constants.CLI_TIZEN,"build-web -- "+tDir+" -out "+tBuild);}).
then(function(){return(0,_exec.execCLI)(c,_constants.CLI_TIZEN,"package -- "+tBuild+" -s "+certProfile+" -t wgt -o "+tOut);}).
then(function(){
(0,_logger.logSuccess)("Your GWT package is located in "+_chalk.default.white(tOut)+" .");
return resolve();
}).
catch(function(e){return reject(e);});
});};exports.buildTizenProject=buildTizenProject;

var _isGlobalConfigured=false;

var configureTizenProject=function configureTizenProject(c,platform){return _regenerator.default.async(function configureTizenProject$(_context8){while(1){switch(_context8.prev=_context8.next){case 0:
(0,_logger.logTask)('configureTizenProject');if(

(0,_.isPlatformActive)(c,platform)){_context8.next=3;break;}return _context8.abrupt("return");case 3:if(

_isGlobalConfigured){_context8.next=7;break;}
_isGlobalConfigured=true;_context8.next=7;return _regenerator.default.awrap(
configureTizenGlobal(c));case 7:_context8.next=9;return _regenerator.default.awrap(


(0,_projectParser.copyAssetsFolder)(c,platform));case 9:_context8.next=11;return _regenerator.default.awrap(
(0,_web.configureCoreWebProject)(c,platform));case 11:_context8.next=13;return _regenerator.default.awrap(
configureProject(c,platform));case 13:return _context8.abrupt("return",
(0,_projectParser.copyBuildsFolder)(c,platform));case 14:case"end":return _context8.stop();}}});};exports.configureTizenProject=configureTizenProject;


var configureProject=function configureProject(c,platform){return new Promise(function(resolve){
(0,_logger.logTask)("configureProject:"+platform);

var appFolder=(0,_common.getAppFolder)(c,platform);

var configFile='config.xml';
var p=c.buildConfig.platforms[platform];
(0,_common.writeCleanFile)(_path.default.join((0,_common.getAppTemplateFolder)(c,platform),configFile),_path.default.join(appFolder,configFile),[
{pattern:'{{PACKAGE}}',override:p.package},
{pattern:'{{ID}}',override:p.id},
{pattern:'{{APP_NAME}}',override:p.appName}]);


resolve();
});};exports.configureProject=configureProject;
//# sourceMappingURL=index.js.map