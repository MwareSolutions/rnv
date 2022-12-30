var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.configureExportIfRequired=exports.configureDeploymentIfRequired=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _config=_interopRequireDefault(require("../config"));
var _setupTools=_interopRequireDefault(require("../setupTools"));
var _exec=require("../systemTools/exec");


var configureDeploymentIfRequired=function configureDeploymentIfRequired(deploymentTarget){var setupInstance;return _regenerator.default.async(function configureDeploymentIfRequired$(_context){while(1){switch(_context.prev=_context.next){case 0:if(!(
deploymentTarget==='docker')){_context.next=7;break;}_context.next=3;return _regenerator.default.awrap(
_config.default.checkRequiredPackage('@rnv/deploy-docker',false,'devDependencies'));case 3:if(
(0,_exec.commandExistsSync)('docker')){_context.next=7;break;}
setupInstance=(0,_setupTools.default)();_context.next=7;return _regenerator.default.awrap(
setupInstance.askToInstallSDK('docker'));case 7:case"end":return _context.stop();}}},null,null,null,Promise);};exports.configureDeploymentIfRequired=configureDeploymentIfRequired;




var configureExportIfRequired=function configureExportIfRequired(exportTarget){return _regenerator.default.async(function configureExportIfRequired$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:if(!(
exportTarget==='docker')){_context2.next=3;break;}_context2.next=3;return _regenerator.default.awrap(
_config.default.checkRequiredPackage('@rnv/deploy-docker',false,'devDependencies'));case 3:case"end":return _context2.stop();}}},null,null,null,Promise);};exports.configureExportIfRequired=configureExportIfRequired;
//# sourceMappingURL=configure.js.map