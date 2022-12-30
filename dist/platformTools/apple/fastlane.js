var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.updateProfile=exports.registerDevice=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _path=_interopRequireDefault(require("path"));
var _chalk=_interopRequireDefault(require("chalk"));
var _common=require("../../common");



var _logger=require("../../systemTools/logger");




var _exec=require("../../systemTools/exec");
var _constants=require("../../constants");
var _configParser=require("../../configTools/configParser");

var registerDevice=function registerDevice(c){var teamID,udid,deviceName,args;return _regenerator.default.async(function registerDevice$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)("registerDevice:"+c.platform);


teamID=(0,_common.getConfigProp)(c,c.platform,'teamID');
udid=c.runtime.targetUDID;
deviceName=c.runtime.target;

args=[
'run',
'register_device',"team_id:\""+
teamID+"\"","udid:\""+
udid+"\"","name:\""+
deviceName+"\""];_context.prev=5;_context.next=8;return _regenerator.default.awrap(



(0,_exec.executeAsync)(c,"fastlane "+args.join(' '),{shell:true,stdio:'inherit',silent:true}));case 8:
(0,_logger.logSuccess)("Succesfully registered device "+deviceName+":"+udid+":"+teamID);return _context.abrupt("return",
true);case 12:_context.prev=12;_context.t0=_context["catch"](5);

(0,_logger.logWarning)(_context.t0);return _context.abrupt("return",
true);case 16:case"end":return _context.stop();}}},null,null,[[5,12]],Promise);};exports.registerDevice=registerDevice;



var updateProfile=function updateProfile(c,appConfigId){var _getConfigProp;var scheme,platform,appId,id,teamID,pMethod,runScheme,provisioning,certsPath,args;return _regenerator.default.async(function updateProfile$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)("updateProfile:"+appConfigId,_chalk.default.grey);if(!








appConfigId){_context2.next=4;break;}_context2.next=4;return _regenerator.default.awrap((0,_configParser.setAppConfig)(c,appConfigId));case 4:if(!(

c.platform!==_constants.IOS&&c.platform!==_constants.TVOS)){_context2.next=6;break;}return _context2.abrupt("return",
Promise.reject("updateProfile:platform "+c.platform+" not supported"));case 6:

scheme=c.program.scheme;


platform=c.platform;

appId=c.runtime.appId;

id=(0,_common.getAppId)(c,platform);
teamID=(0,_common.getConfigProp)(c,platform,'teamID');
pMethod=(_getConfigProp=(0,_common.getConfigProp)(c,platform,'exportOptions'))==null?void 0:_getConfigProp.method;
runScheme=(0,_common.getConfigProp)(c,platform,'runScheme');

if(pMethod==='ad-hoc')provisioning='adhoc';
if(pMethod==='development'||runScheme==='Debug')provisioning='development';

certsPath=_path.default.join(c.paths.workspace.appConfig.dir,'certs');

args=[
'sigh',
'--app_identifier',
id,
'--team_id',
teamID,
'--output_path',
certsPath,
'--force',
'--platform',
platform];

if(process.env.APPLE_DEVELOPER_USERNAME){
args=args.concat([
'--username',
process.env.APPLE_DEVELOPER_USERNAME]);

}
if(provisioning){
args.push("--"+provisioning);
}_context2.prev=19;_context2.next=22;return _regenerator.default.awrap(


(0,_exec.executeAsync)(c,"fastlane "+args.join(' '),{shell:true,stdio:'inherit',silent:true}));case 22:
(0,_logger.logSuccess)("Succesfully updated provisioning profile for "+appId+":"+scheme+":"+id);return _context2.abrupt("return",
true);case 26:_context2.prev=26;_context2.t0=_context2["catch"](19);

(0,_logger.logWarning)(_context2.t0);return _context2.abrupt("return",
true);case 30:case"end":return _context2.stop();}}},null,null,[[19,26]],Promise);};exports.updateProfile=updateProfile;
//# sourceMappingURL=fastlane.js.map