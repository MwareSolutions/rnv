var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.parseProvisioningProfiles=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _iosMobileprovisionFinder=require("ios-mobileprovision-finder");
var _common=require("../../common");

var parseProvisioningProfiles=function parseProvisioningProfiles(c){var teamID,id,certificates,provisionProfiles,result;return _regenerator.default.async(function parseProvisioningProfiles$(_context){while(1){switch(_context.prev=_context.next){case 0:

teamID=(0,_common.getConfigProp)(c,c.platform,'teamID');
id=(0,_common.getConfigProp)(c,c.platform,'id');
certificates=_iosMobileprovisionFinder.cert.read();
provisionProfiles=_iosMobileprovisionFinder.provision.read();
result=_iosMobileprovisionFinder.provision.select(provisionProfiles,{
AppId:id,
TeamIdentifier:teamID,
Certificates:certificates.valid});return _context.abrupt("return",

result);case 6:case"end":return _context.stop();}}});};exports.parseProvisioningProfiles=parseProvisioningProfiles;
//# sourceMappingURL=provisionParser.js.map