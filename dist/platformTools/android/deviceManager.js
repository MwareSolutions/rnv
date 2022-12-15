var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.checkForActiveEmulator=exports.askForNewEmulator=exports.connectToWifiDevice=exports.getAndroidTargets=exports.resetAdb=exports.listAndroidTargets=exports.launchAndroidSimulator=exports.composeDevicesString=void 0;var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));

var _path=_interopRequireDefault(require("path"));
var _os=_interopRequireDefault(require("os"));
var _fs=_interopRequireDefault(require("fs"));
var _chalk=_interopRequireDefault(require("chalk"));
var _child_process=_interopRequireDefault(require("child_process"));
var _inquirer=_interopRequireDefault(require("inquirer"));

var _exec=require("../../systemTools/exec");
var _common=require("../../common");
var _utils=require("../../utils");
var _logger=require("../../systemTools/logger");


var _constants=require("../../constants");function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);if(enumerableOnly)symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;});keys.push.apply(keys,symbols);}return keys;}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};if(i%2){ownKeys(Object(source),true).forEach(function(key){(0,_defineProperty2.default)(target,key,source[key]);});}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(target,Object.getOwnPropertyDescriptors(source));}else{ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}}return target;}

var CHECK_INTEVAL=5000;

var currentDeviceProps={};

var composeDevicesString=function composeDevicesString(devices,returnArray){
(0,_logger.logTask)("composeDevicesString:"+(devices?devices.length:null));
var devicesArray=[];
devices.forEach(function(v,i){return devicesArray.push(_getDeviceString(v,!returnArray?i:null));});
if(returnArray)return devicesArray;
return"\n"+devicesArray.join('');
};exports.composeDevicesString=composeDevicesString;

var launchAndroidSimulator=function launchAndroidSimulator(c,platform,target){var isIndependentThread=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;
(0,_logger.logTask)("launchAndroidSimulator:"+platform+":"+target+":"+isIndependentThread);

if(target){
var actualTarget=target.name||target;
if(isIndependentThread){
(0,_exec.execCLI)(c,_constants.CLI_ANDROID_EMULATOR,"-avd \""+actualTarget+"\"",{detached:isIndependentThread}).catch(function(err){
if(err.includes&&err.includes('WHPX')){
(0,_logger.logWarning)(err);
return(0,_logger.logError)('It seems you do not have the Windows Hypervisor Platform virtualization enabled. Enter windows features in the Windows search box and select Turn Windows features on or off in the search results. In the Windows Features dialog, enable both Hyper-V and Windows Hypervisor Platform.',true);
}
(0,_logger.logError)(err);
});
return Promise.resolve();
}
return(0,_exec.execCLI)(c,_constants.CLI_ANDROID_EMULATOR,"-avd \""+actualTarget+"\"",{detached:isIndependentThread});
}
return Promise.reject('No simulator -t target name specified!');
};exports.launchAndroidSimulator=launchAndroidSimulator;

var listAndroidTargets=function listAndroidTargets(c){var device,list,devices;return _regenerator.default.async(function listAndroidTargets$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)('listAndroidTargets');
device=c.program.device;_context.next=4;return _regenerator.default.awrap(

resetAdb(c));case 4:_context.next=6;return _regenerator.default.awrap(
getAndroidTargets(c,false,device,device));case 6:list=_context.sent;_context.next=9;return _regenerator.default.awrap(
composeDevicesString(list));case 9:devices=_context.sent;
(0,_logger.logToSummary)("Android Targets:\n"+devices);
if(devices.trim()==='')(0,_logger.logToSummary)('Android Targets: No devices found');return _context.abrupt("return",
devices);case 13:case"end":return _context.stop();}}});};exports.listAndroidTargets=listAndroidTargets;


var _getDeviceString=function _getDeviceString(device,i){var

isTV=
device.isTV,isTablet=device.isTablet,name=device.name,udid=device.udid,isDevice=device.isDevice,isActive=device.isActive,avdConfig=device.avdConfig,isWear=device.isWear,arch=device.arch;
var deviceIcon='';
if(isTablet)deviceIcon='Tablet 💊 ';
if(isTV)deviceIcon='TV 📺 ';
if(isWear)deviceIcon='Wear ⌚ ';
if(!deviceIcon&&(udid!=='unknown'||avdConfig))deviceIcon='Phone 📱 ';

var deviceString=_chalk.default.white(name)+" | "+deviceIcon+" | arch: "+arch+" | udid: "+_chalk.default.grey(udid)+(isDevice?_chalk.default.red(' (device)'):'')+" "+(
isActive?_chalk.default.magenta(' (active)'):'');

if(i===null)return{key:name,name:deviceString,value:name,icon:deviceIcon};

return" ["+(i+1)+"]> "+deviceString+"\n";
};

var resetAdb=function resetAdb(c,ranBefore){return _regenerator.default.async(function resetAdb$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.prev=0;if(

ranBefore){_context2.next=4;break;}_context2.next=4;return _regenerator.default.awrap((0,_exec.execCLI)(c,_constants.CLI_ANDROID_ADB,'kill-server'));case 4:_context2.next=9;break;case 6:_context2.prev=6;_context2.t0=_context2["catch"](0);

(0,_logger.logWarning)(_context2.t0);case 9:_context2.prev=9;_context2.next=12;return _regenerator.default.awrap(


(0,_exec.execCLI)(c,_constants.CLI_ANDROID_ADB,'start-server'));case 12:_context2.next=20;break;case 14:_context2.prev=14;_context2.t1=_context2["catch"](9);if(!

ranBefore){_context2.next=18;break;}return _context2.abrupt("return",
Promise.reject(_context2.t1));case 18:

(0,_logger.logWarning)("Got error:\n"+_context2.t1+"\nWill attemnt again in 5 seconds");
setTimeout(resetAdb,5000,c,true);case 20:case"end":return _context2.stop();}}},null,null,[[0,6],[9,14]]);};exports.resetAdb=resetAdb;



var getAndroidTargets=function getAndroidTargets(c,skipDevices,skipAvds){var deviceOnly,devicesResult,avdResult,_args3=arguments;return _regenerator.default.async(function getAndroidTargets$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:deviceOnly=_args3.length>3&&_args3[3]!==undefined?_args3[3]:false;
(0,_logger.logTask)("getAndroidTargets:"+c.platform+":"+skipDevices+":"+skipAvds+":"+deviceOnly);_context3.prev=2;if(





skipDevices){_context3.next=7;break;}_context3.next=6;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_ANDROID_ADB,'devices -l'));case 6:devicesResult=_context3.sent;case 7:if(

skipAvds){_context3.next=11;break;}_context3.next=10;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_ANDROID_EMULATOR,'-list-avds'));case 10:avdResult=_context3.sent;case 11:return _context3.abrupt("return",

_parseDevicesResult(c,devicesResult,avdResult,deviceOnly));case 14:_context3.prev=14;_context3.t0=_context3["catch"](2);return _context3.abrupt("return",

Promise.reject(_context3.t0));case 17:case"end":return _context3.stop();}}},null,null,[[2,14]]);};exports.getAndroidTargets=getAndroidTargets;



var calculateDeviceDiagonal=function calculateDeviceDiagonal(width,height,density){

var widthInches=width/density;
var heightInches=height/density;
return Math.sqrt(widthInches*widthInches+heightInches*heightInches);
};

var getRunningDeviceProp=function getRunningDeviceProp(c,udid,prop){var rawProps,reg,lines;return _regenerator.default.async(function getRunningDeviceProp$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:if(!

currentDeviceProps[udid]){_context4.next=4;break;}if(
prop){_context4.next=3;break;}return _context4.abrupt("return",currentDeviceProps[udid]);case 3:return _context4.abrupt("return",
currentDeviceProps[udid][prop]);case 4:_context4.next=6;return _regenerator.default.awrap(

(0,_exec.execCLI)(c,_constants.CLI_ANDROID_ADB,"-s "+udid+" shell getprop"));case 6:rawProps=_context4.sent;
reg=/\[.+\]: \[.*\n?[^\[]*\]/gm;
lines=rawProps.match(reg);

lines.forEach(function(line){
var words=line.split(']: [');
var key=words[0].slice(1);
var value=words[1].slice(0,words[1].length-1);

if(!currentDeviceProps[udid])currentDeviceProps[udid]={};
currentDeviceProps[udid][key]=value;
});return _context4.abrupt("return",

getRunningDeviceProp(c,udid,prop));case 11:case"end":return _context4.stop();}}});};


var decideIfTVRunning=function decideIfTVRunning(c,device){var udid,model,product,mod,name,flavor,clientIdBase,description,hdmi,modelGroup,configuration,cecEnabled,isTV;return _regenerator.default.async(function decideIfTVRunning$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:
udid=device.udid,model=device.model,product=device.product;_context5.next=3;return _regenerator.default.awrap(
getRunningDeviceProp(c,udid,'ro.product.model'));case 3:mod=_context5.sent;_context5.next=6;return _regenerator.default.awrap(
getRunningDeviceProp(c,udid,'ro.product.name'));case 6:name=_context5.sent;_context5.next=9;return _regenerator.default.awrap(
getRunningDeviceProp(c,udid,'ro.build.flavor'));case 9:flavor=_context5.sent;_context5.next=12;return _regenerator.default.awrap(
getRunningDeviceProp(c,udid,'ro.com.google.clientidbase'));case 12:clientIdBase=_context5.sent;_context5.next=15;return _regenerator.default.awrap(
getRunningDeviceProp(c,udid,'ro.build.description'));case 15:description=_context5.sent;_context5.next=18;return _regenerator.default.awrap(
getRunningDeviceProp(c,udid,'init.svc.hdmi'));case 18:hdmi=_context5.sent;_context5.next=21;return _regenerator.default.awrap(
getRunningDeviceProp(c,udid,'ro.nrdp.modelgroup'));case 21:modelGroup=_context5.sent;_context5.next=24;return _regenerator.default.awrap(
getRunningDeviceProp(c,udid,'ro.build.configuration'));case 24:configuration=_context5.sent;_context5.next=27;return _regenerator.default.awrap(
getRunningDeviceProp(c,udid,'persist.sys.cec.enabled'));case 27:cecEnabled=_context5.sent;

isTV=false;
[mod,name,flavor,clientIdBase,description,model,product].forEach(function(string){
if(string&&string.toLowerCase().includes('tv'))isTV=true;
});

if(model.includes('SHIELD'))isTV=true;
if(hdmi)isTV=true;
if(modelGroup&&modelGroup.toLowerCase().includes('firetv'))isTV=true;
if(configuration==='tv')isTV=true;
if(cecEnabled)isTV=true;return _context5.abrupt("return",

isTV);case 36:case"end":return _context5.stop();}}});};


var decideIfWearRunning=function decideIfWearRunning(c,device){var udid,model,product,fingerprint,name,mod,flavor,description,isWear;return _regenerator.default.async(function decideIfWearRunning$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:
udid=device.udid,model=device.model,product=device.product;_context6.next=3;return _regenerator.default.awrap(
getRunningDeviceProp(c,udid,'ro.vendor.build.fingerprint'));case 3:fingerprint=_context6.sent;_context6.next=6;return _regenerator.default.awrap(
getRunningDeviceProp(c,udid,'ro.product.vendor.name'));case 6:name=_context6.sent;_context6.next=9;return _regenerator.default.awrap(
getRunningDeviceProp(c,udid,'ro.product.vendor.model'));case 9:mod=_context6.sent;_context6.next=12;return _regenerator.default.awrap(
getRunningDeviceProp(c,udid,'ro.build.flavor'));case 12:flavor=_context6.sent;_context6.next=15;return _regenerator.default.awrap(
getRunningDeviceProp(c,udid,'ro.build.description'));case 15:description=_context6.sent;

isWear=false;
[fingerprint,name,mod,flavor,description,model,product].forEach(function(string){
if(string&&string.toLowerCase().includes('wear'))isWear=true;
});return _context6.abrupt("return",
isWear);case 19:case"end":return _context6.stop();}}});};


var getDeviceType=function getDeviceType(device,c){var screenSizeResult,screenDensityResult,arch,screenProps,_screenSizeResult$spl,_screenSizeResult$spl2,width,height,density,_screenProps,_width,_height,_density,diagonalInches,_density2,_width2,_height2,_arch,sysdir,tagId,tagDisplay,deviceName,avdId,name,skin,image,_diagonalInches;return _regenerator.default.async(function getDeviceType$(_context7){while(1){switch(_context7.prev=_context7.next){case 0:
(0,_logger.logDebug)('getDeviceType - in',{device:device});if(!(

device.product==='tunny')){_context7.next=4;break;}
device.isNotEligibleAndroid=true;return _context7.abrupt("return",
device);case 4:if(!(


device.udid!=='unknown')){_context7.next=33;break;}_context7.next=7;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_ANDROID_ADB,"-s "+device.udid+" shell wm size"));case 7:screenSizeResult=_context7.sent;_context7.next=10;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_ANDROID_ADB,"-s "+device.udid+" shell wm density"));case 10:screenDensityResult=_context7.sent;_context7.next=13;return _regenerator.default.awrap(
getRunningDeviceProp(c,device.udid,'ro.product.cpu.abi'));case 13:arch=_context7.sent;


if(screenSizeResult){_screenSizeResult$spl=
screenSizeResult.split('Physical size: ')[1].split('x'),_screenSizeResult$spl2=(0,_slicedToArray2.default)(_screenSizeResult$spl,2),width=_screenSizeResult$spl2[0],height=_screenSizeResult$spl2[1];
screenProps={width:parseInt(width,10),height:parseInt(height,10)};
}

if(screenDensityResult){
density=screenDensityResult.split('Physical density: ')[1];
screenProps=_objectSpread({},screenProps,{density:parseInt(density,10)});
}_context7.next=18;return _regenerator.default.awrap(

decideIfTVRunning(c,device));case 18:device.isTV=_context7.sent;if(!(

screenSizeResult&&screenDensityResult)){_context7.next=27;break;}_screenProps=
screenProps,_width=_screenProps.width,_height=_screenProps.height,_density=_screenProps.density;

diagonalInches=calculateDeviceDiagonal(_width,_height,_density);
screenProps=_objectSpread({},screenProps,{diagonalInches:diagonalInches});
device.isTablet=!device.isTV&&diagonalInches>_constants.IS_TABLET_ABOVE_INCH&&diagonalInches<=15;_context7.next=26;return _regenerator.default.awrap(
decideIfWearRunning(c,device));case 26:device.isWear=_context7.sent;case 27:


device.isPhone=!device.isTablet&&!device.isWear&&!device.isTV;
device.isMobile=!device.isWear&&!device.isTV;
device.screenProps=screenProps;
device.arch=arch;
(0,_logger.logDebug)('getDeviceType - out',{device:device});return _context7.abrupt("return",
device);case 33:if(!


device.avdConfig){_context7.next=57;break;}
_density2=parseInt(device.avdConfig['hw.lcd.density'],10);
_width2=parseInt(device.avdConfig['hw.lcd.width'],10);
_height2=parseInt(device.avdConfig['hw.lcd.height'],10);
_arch=device.avdConfig['abi.type'];


sysdir=device.avdConfig['image.sysdir.1'];
tagId=device.avdConfig['tag.id'];
tagDisplay=device.avdConfig['tag.display'];
deviceName=device.avdConfig['hw.device.name'];

device.isWear=false;
[sysdir,tagId,tagDisplay,deviceName].forEach(function(string){
if(string&&string.includes('wear'))device.isWear=true;
});

avdId=device.avdConfig.AvdId;
name=device.avdConfig['hw.device.name'];
skin=device.avdConfig['skin.name'];
image=device.avdConfig['image.sysdir.1'];

device.isTV=false;
[avdId,name,skin,image].forEach(function(string){
if(string&&string.toLowerCase().includes('tv'))device.isTV=true;
});

_diagonalInches=calculateDeviceDiagonal(_width2,_height2,_density2);
device.isTablet=!device.isTV&&_diagonalInches>_constants.IS_TABLET_ABOVE_INCH;
device.isPhone=!device.isTablet&&!device.isWear&&!device.isTV;
device.isMobile=!device.isWear&&!device.isTV;
device.arch=_arch;
(0,_logger.logDebug)('getDeviceType - out',{device:device});return _context7.abrupt("return",
device);case 57:return _context7.abrupt("return",

device);case 58:case"end":return _context7.stop();}}});};


var getAvdDetails=function getAvdDetails(c,deviceName){var _process$env=
process.env,ANDROID_SDK_HOME=_process$env.ANDROID_SDK_HOME,ANDROID_AVD_HOME=_process$env.ANDROID_AVD_HOME;


var avdConfigPaths=[""+
ANDROID_AVD_HOME,
ANDROID_SDK_HOME+"/.android/avd",
_os.default.homedir()+"/.android/avd"];


var results={};

avdConfigPaths.forEach(function(cPath){
if(_fs.default.existsSync(cPath)){
var filesPath=_fs.default.readdirSync(cPath);


filesPath.forEach(function(fName){
var fPath=_path.default.join(cPath,fName);
var dirent=_fs.default.lstatSync(fPath);
if(!dirent.isDirectory()&&fName===deviceName+".ini"){
var avdData=_fs.default.readFileSync(fPath).toString();
var lines=avdData.trim().split(/\r?\n/);
lines.forEach(function(line){var _line$split=
line.split('='),_line$split2=(0,_slicedToArray2.default)(_line$split,2),key=_line$split2[0],value=_line$split2[1];
if(key==='path'){
var initData=_fs.default.readFileSync(value+"/config.ini").toString();
var initLines=initData.trim().split(/\r?\n/);
var avdConfig={};
initLines.forEach(function(initLine){var _initLine$split=
initLine.split('='),_initLine$split2=(0,_slicedToArray2.default)(_initLine$split,2),iniKey=_initLine$split2[0],iniValue=_initLine$split2[1];

avdConfig[iniKey.trim()]=iniValue.trim();
});
results.avdConfig=avdConfig;
}
});
}
});
}
});
return results;
};

var getEmulatorName=function getEmulatorName(c,words){var emulator,port,emulatorReply,emulatorReplyArray,emulatorName;return _regenerator.default.async(function getEmulatorName$(_context8){while(1){switch(_context8.prev=_context8.next){case 0:
emulator=words[0];
port=emulator.split('-')[1];_context8.next=4;return _regenerator.default.awrap(

(0,_exec.executeTelnet)(c,port,'avd name'));case 4:emulatorReply=_context8.sent;
emulatorReplyArray=emulatorReply.split('OK');
emulatorName=emulatorReplyArray[emulatorReplyArray.length-2].trim();return _context8.abrupt("return",
emulatorName);case 8:case"end":return _context8.stop();}}});};


var connectToWifiDevice=function connectToWifiDevice(c,ip){var deviceResponse;return _regenerator.default.async(function connectToWifiDevice$(_context9){while(1){switch(_context9.prev=_context9.next){case 0:_context9.next=2;return _regenerator.default.awrap(
(0,_exec.execCLI)(c,_constants.CLI_ANDROID_ADB,"connect "+ip+":5555"));case 2:deviceResponse=_context9.sent;if(!
deviceResponse.includes('connected')){_context9.next=5;break;}return _context9.abrupt("return",true);case 5:
(0,_logger.logError)("Failed to connect to "+ip+":5555",false,true);return _context9.abrupt("return",
false);case 7:case"end":return _context9.stop();}}});};exports.connectToWifiDevice=connectToWifiDevice;


var _parseDevicesResult=function _parseDevicesResult(c,devicesString,avdsString,deviceOnly){var devices,skipTargetCheck,lines,avdLines;return _regenerator.default.async(function _parseDevicesResult$(_context12){while(1){switch(_context12.prev=_context12.next){case 0:
(0,_logger.logDebug)("_parseDevicesResult:"+devicesString+":"+avdsString+":"+deviceOnly);
devices=[];
skipTargetCheck=c.program.skipTargetCheck;if(!

devicesString){_context12.next=9;break;}
lines=devicesString.trim().split(/\r?\n/);
(0,_logger.logDebug)('_parseDevicesResult 2',{lines:lines});if(!(
lines.length!==0)){_context12.next=9;break;}_context12.next=9;return _regenerator.default.awrap(
Promise.all(lines.map(function _callee(line){var words,isDevice,name,model,product;return _regenerator.default.async(function _callee$(_context10){while(1){switch(_context10.prev=_context10.next){case 0:
words=line.split(/[ ,\t]+/).filter(function(w){return w!=='';});if(!(
words.length===0)){_context10.next=3;break;}return _context10.abrupt("return");case 3:
(0,_logger.logDebug)('_parseDevicesResult 3',{words:words});if(!(

words[1]==='device')){_context10.next=20;break;}
isDevice=!words[0].includes('emulator');
name=_getDeviceProp(words,'model:');
model=name;
product=_getDeviceProp(words,'product:');
(0,_logger.logDebug)('_parseDevicesResult 4',{name:name});if(
isDevice){_context10.next=17;break;}_context10.next=13;return _regenerator.default.awrap(
waitForEmulatorToBeReady(c,words[0]));case 13:_context10.next=15;return _regenerator.default.awrap(
getEmulatorName(c,words));case 15:name=_context10.sent;
(0,_logger.logDebug)('_parseDevicesResult 5',{name:name});case 17:

(0,_logger.logDebug)('_parseDevicesResult 6',{deviceOnly:deviceOnly,isDevice:isDevice});
if(deviceOnly&&isDevice||!deviceOnly){
devices.push({
udid:words[0],
isDevice:isDevice,
isActive:true,
name:name,
model:model,
product:product});

}return _context10.abrupt("return",
true);case 20:case"end":return _context10.stop();}}});})));case 9:if(!





avdsString){_context12.next=14;break;}
avdLines=avdsString.trim().split(/\r?\n/);
(0,_logger.logDebug)('_parseDevicesResult 7',{avdLines:avdLines});_context12.next=14;return _regenerator.default.awrap(

Promise.all(avdLines.map(function _callee2(line){var avdDetails,findProcess;return _regenerator.default.async(function _callee2$(_context11){while(1){switch(_context11.prev=_context11.next){case 0:


try{
avdDetails=getAvdDetails(c,line);
}catch(e){
(0,_logger.logError)(e);
}

try{
(0,_logger.logDebug)('_parseDevicesResult 8',{avdDetails:avdDetails});



findProcess=_utils.isSystemWin?"tasklist | find \"avd "+line+"\"":"ps x | grep \"avd "+line+"\" | grep -v grep";
_child_process.default.execSync(findProcess);
(0,_logger.logDebug)('_parseDevicesResult 9 - excluding running emulator');
}catch(e){
if(avdDetails){
devices.push(_objectSpread({
udid:'unknown',
isDevice:false,
isActive:false,
name:line},
avdDetails));

}
}case 2:case"end":return _context11.stop();}}});})));case 14:



(0,_logger.logDebug)('_parseDevicesResult 10',{devices:devices});return _context12.abrupt("return",

Promise.all(devices.map(function(device){return getDeviceType(device,c);})).
then(function(devicesArray){return devicesArray.filter(function(device){var

platform=c.platform;
if(skipTargetCheck)return true;
if(device.isNotEligibleAndroid)return false;
var matches=platform===_constants.ANDROID&&device.isTablet||platform===_constants.ANDROID_WEAR&&device.isWear||platform===_constants.ANDROID_TV&&device.isTV||platform===_constants.ANDROID&&device.isMobile;
(0,_logger.logDebug)('getDeviceType - filter',{device:device,matches:matches,platform:platform});
return matches;
});}));case 16:case"end":return _context12.stop();}}});};


var _getDeviceProp=function _getDeviceProp(arr,prop){
for(var i=0;i<arr.length;i++){
var v=arr[i];
if(v&&v.includes(prop))return v.replace(prop,'');
}
return'';
};

var askForNewEmulator=function askForNewEmulator(c,platform){var emuName,_ref,confirm;return _regenerator.default.async(function askForNewEmulator$(_context13){while(1){switch(_context13.prev=_context13.next){case 0:
(0,_logger.logTask)('askForNewEmulator');
emuName=c.files.workspace.config.defaultTargets[platform];_context13.next=4;return _regenerator.default.awrap(

_inquirer.default.prompt({
name:'confirm',
type:'confirm',
message:"Do you want ReNative to create new Emulator ("+_chalk.default.white(emuName)+") for you?"}));case 4:_ref=_context13.sent;confirm=_ref.confirm;if(!


confirm){_context13.next=14;break;}_context13.t0=
platform;_context13.next=_context13.t0===
'android'?10:_context13.t0===


'androidtv'?11:_context13.t0===


'androidwear'?12:13;break;case 10:return _context13.abrupt("return",_createEmulator(c,'28','google_apis',emuName).then(function(){return launchAndroidSimulator(c,platform,emuName,true);}));case 11:return _context13.abrupt("return",_createEmulator(c,'28','android-tv',emuName).then(function(){return launchAndroidSimulator(c,platform,emuName,true);}));case 12:return _context13.abrupt("return",
_createEmulator(c,'28','android-wear',emuName).
then(function(){return launchAndroidSimulator(c,platform,emuName,true);}));case 13:return _context13.abrupt("return",

Promise.reject('Cannot find any active or created emulators'));case 14:return _context13.abrupt("return",


Promise.reject('Action canceled!'));case 15:case"end":return _context13.stop();}}});};exports.askForNewEmulator=askForNewEmulator;


var _createEmulator=function _createEmulator(c,apiVersion,emuPlatform,emuName){
(0,_logger.logTask)('_createEmulator');

return(0,_exec.execCLI)(c,_constants.CLI_ANDROID_SDKMANAGER,"\"system-images;android-"+apiVersion+";"+emuPlatform+";x86\"").
then(function(){return(0,_exec.execCLI)(c,_constants.CLI_ANDROID_AVDMANAGER,"create avd -n "+emuName+" -k \"system-images;android-"+apiVersion+";"+emuPlatform+";x86\"");}).
catch(function(e){return(0,_logger.logError)(e,true);});
};

var waitForEmulatorToBeReady=function waitForEmulatorToBeReady(c,emulator){return(0,_common.waitForEmulator)(c,_constants.CLI_ANDROID_ADB,"-s "+emulator+" shell getprop init.svc.bootanim",function(res){return res.includes('stopped');});};

var checkForActiveEmulator=function checkForActiveEmulator(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("checkForActiveEmulator:"+platform);
var attempts=1;
var maxAttempts=_utils.isSystemWin?20:10;
var running=false;
var poll=setInterval(function(){

if(!running){
running=true;
getAndroidTargets(c,false,true,false).
then(function _callee3(v){return _regenerator.default.async(function _callee3$(_context14){while(1){switch(_context14.prev=_context14.next){case 0:
(0,_logger.logDebug)('Available devices after filtering',v);if(!(
v.length>0)){_context14.next=7;break;}
(0,_logger.logSuccess)("Found active emulator! "+_chalk.default.white(v[0].udid)+". Will use it");
clearInterval(poll);
resolve(v[0]);_context14.next=14;break;case 7:

console.log("looking for active emulators: attempt "+attempts+"/"+maxAttempts);
attempts++;if(!(
[_constants.ANDROID_TV,_constants.ANDROID_WEAR].includes(platform)&&attempts===2)){_context14.next=12;break;}_context14.next=12;return _regenerator.default.awrap(
resetAdb(c));case 12:

if(attempts>maxAttempts){
clearInterval(poll);
reject('Could not find any active emulatros');



}
running=false;case 14:case"end":return _context14.stop();}}});}).


catch(function(e){
clearInterval(poll);
(0,_logger.logError)(e);
});
}
},CHECK_INTEVAL);
});};exports.checkForActiveEmulator=checkForActiveEmulator;
//# sourceMappingURL=deviceManager.js.map