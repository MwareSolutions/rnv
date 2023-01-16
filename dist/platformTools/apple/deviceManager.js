var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.listAppleDevices=exports.launchAppleSimulator=exports.getAppleDevices=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));var _inquirer=_interopRequireDefault(require("inquirer"));
var _chalk=_interopRequireDefault(require("chalk"));
var _child_process=_interopRequireDefault(require("child_process"));
var _common=require("../../common");


var _logger=require("../../systemTools/logger");
var _constants=require("../../constants");
var _exec=require("../../systemTools/exec");function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;})),keys.push.apply(keys,symbols);}return keys;}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach(function(key){(0,_defineProperty2.default)(target,key,source[key]);}):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}return target;}

var getAppleDevices=function getAppleDevices(c,platform,ignoreDevices,ignoreSimulators){var skipTargetCheck,devicesAndSims,simctl,availableSims,devicesArr,simulatorsArr,allDevices;return _regenerator.default.async(function getAppleDevices$(_context){while(1)switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)("getAppleDevices:"+platform+",ignoreDevices:"+ignoreDevices+",ignoreSimulators"+ignoreSimulators);
skipTargetCheck=c.program.skipTargetCheck;_context.next=4;return _regenerator.default.awrap(




(0,_exec.executeAsync)('xcrun instruments -s'));case 4:devicesAndSims=_context.sent;_context.t0=
JSON;_context.next=8;return _regenerator.default.awrap((0,_exec.executeAsync)('xcrun simctl list --json'));case 8:_context.t1=_context.sent;simctl=_context.t0.parse.call(_context.t0,_context.t1);
availableSims=[];
Object.keys(simctl.devices).forEach(function(runtime){
console.log('runtime',runtime);
simctl.devices[runtime].forEach(function(device){
if(device.isAvailable)availableSims.push(_objectSpread(_objectSpread({},device),{},{version:runtime.split('.').pop()}));
});
});

devicesArr=_parseIOSDevicesList(devicesAndSims,platform,ignoreDevices,ignoreSimulators);
simulatorsArr=_parseIOSDevicesList(availableSims,platform,ignoreDevices,ignoreSimulators);
allDevices=[].concat((0,_toConsumableArray2.default)(devicesArr),(0,_toConsumableArray2.default)(simulatorsArr));

if(!skipTargetCheck){

allDevices=allDevices.filter(function(d){return!d.version.includes('watchOS');});

allDevices=allDevices.filter(function(d){var _d$icon,_d$icon2,_d$icon3;
if(platform===_constants.IOS&&((_d$icon=d.icon)!=null&&_d$icon.includes('Phone')||(_d$icon2=d.icon)!=null&&_d$icon2.includes('Tablet')))return true;
if(platform===_constants.TVOS&&(_d$icon3=d.icon)!=null&&_d$icon3.includes('TV'))return true;
return false;
});
}return _context.abrupt("return",
allDevices);case 17:case"end":return _context.stop();}},null,null,null,Promise);};exports.getAppleDevices=getAppleDevices;


var _parseIOSDevicesList=function _parseIOSDevicesList(rawDevices,platform){var ignoreDevices=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;var ignoreSimulators=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;
var devices=[];
var decideIcon=function decideIcon(device){
var name=device.name,isDevice=device.isDevice;
switch(platform){
case _constants.IOS:
if(name.includes('iPhone')||name.includes('iPad')||name.includes('iPod')){
var icon='Phone 📱';
if(name.includes('iPad'))icon='Tablet 💊';
return icon;
}
return null;
case _constants.TVOS:
if(name.includes('TV')&&!name.includes('iPhone')&&!name.includes('iPad')){
return'TV 📺';
}
return null;
default:
if(isDevice){
return'Apple Device';
}
return null;}

};
if(typeof rawDevices==='string'&&!ignoreDevices){
rawDevices.split('\n').forEach(function(line){
var s1=line.match(/\[.*?\]/);
var s2=line.match(/\(.*?\)/g);
var s3=line.substring(0,line.indexOf('(')-1);
var s4=line.substring(0,line.indexOf('[')-1);
var isSim=false;
if(s2&&s1){
if(s2[s2.length-1]==='(Simulator)'){
isSim=true;
s2.pop();
}
var version=s2.pop();
var name=""+s4.substring(0,s4.lastIndexOf('(')-1);
name=name||'undefined';
var udid=s1[0].replace(/\[|\]/g,'');
var isDevice=!isSim;
if(!isDevice)return;

if(!ignoreDevices){
var device={udid:udid,name:name,version:version,isDevice:isDevice};
devices.push(_objectSpread(_objectSpread({},device),{},{icon:decideIcon(device)}));
}
}
});
}else if(typeof rawDevices==='object'&&!ignoreSimulators){
rawDevices.forEach(function(d){
var name=d.name,udid=d.udid,version=d.version;
var device={
name:name,
udid:udid,
isDevice:false,
version:version
};
devices.push(_objectSpread(_objectSpread({},device),{},{icon:decideIcon(device)}));
});
}

return devices;
};

var launchAppleSimulator=function launchAppleSimulator(c,platform,target){var devicesArr,selectedDevice,i,devices,_await$inquirer$promp,sim;return _regenerator.default.async(function launchAppleSimulator$(_context2){while(1)switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)("launchAppleSimulator:"+platform+":"+target);_context2.next=3;return _regenerator.default.awrap(

getAppleDevices(c,platform,true));case 3:devicesArr=_context2.sent;

for(i=0;i<devicesArr.length;i++){
if(devicesArr[i].name===target){
selectedDevice=devicesArr[i];
}
}if(!
selectedDevice){_context2.next=8;break;}
_launchSimulator(selectedDevice);return _context2.abrupt("return",
selectedDevice.name);case 8:


(0,_logger.logWarning)("Your specified simulator target "+_chalk.default.white(target)+" doesn't exists");
devices=devicesArr.map(function(v){return{name:v.name+" | "+v.icon+" | v: "+_chalk.default.green(v.version)+" | udid: "+_chalk.default.grey(v.udid)+(v.isDevice?_chalk.default.red(' (device)'):''),value:v};});_context2.next=12;return _regenerator.default.awrap(

_inquirer.default.prompt({
name:'sim',
message:'Select the simulator you want to launch',
type:'list',
choices:devices
}));case 12:_await$inquirer$promp=_context2.sent;sim=_await$inquirer$promp.sim;if(!

sim){_context2.next=17;break;}
_launchSimulator(sim);return _context2.abrupt("return",
sim.name);case 17:return _context2.abrupt("return",

Promise.reject('Action canceled!'));case 18:case"end":return _context2.stop();}},null,null,null,Promise);};exports.launchAppleSimulator=launchAppleSimulator;


var _launchSimulator=function _launchSimulator(selectedDevice){
try{
_child_process.default.spawnSync('xcrun',['instruments','-w',selectedDevice.udid]);
}catch(e){


}
};

var listAppleDevices=function listAppleDevices(c,platform){var devicesArr,devicesString;return _regenerator.default.async(function listAppleDevices$(_context3){while(1)switch(_context3.prev=_context3.next){case 0:
(0,_logger.logTask)("listAppleDevices:"+platform);_context3.next=3;return _regenerator.default.awrap(

getAppleDevices(c,platform));case 3:devicesArr=_context3.sent;
devicesString='';
devicesArr.forEach(function(v,i){
devicesString+=" ["+(i+1)+"]> "+_chalk.default.bold(v.name)+" | "+v.icon+" | v: "+_chalk.default.green(v.version)+" | udid: "+_chalk.default.grey(v.udid)+(
v.isDevice?_chalk.default.red(' (device)'):'')+"\n";

});

(0,_logger.logToSummary)(platform+" Targets:\n\n"+devicesString);case 7:case"end":return _context3.stop();}},null,null,null,Promise);};exports.listAppleDevices=listAppleDevices;
//# sourceMappingURL=deviceManager.js.map