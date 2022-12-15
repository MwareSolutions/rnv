var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.parseXcodeProject=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _common=require("../../common");





var _logger=require("../../systemTools/logger");



var _prompt=require("../../systemTools/prompt");
var _constants=require("../../constants");
var _pluginTools=require("../../pluginTools");
var _index=require("./index");
var _provisionParser=require("./provisionParser");
var _fileutils=require("../../systemTools/fileutils");

var parseXcodeProject=function parseXcodeProject(c,platform){var result,eligibleProfile,_ref,autoFix;return _regenerator.default.async(function parseXcodeProject$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_logger.logTask)('parseXcodeProject');

c.runtime.xcodeProj={};
c.runtime.xcodeProj.provisioningStyle=(0,_common.getConfigProp)(c,platform,'provisioningStyle','Automatic');
c.runtime.xcodeProj.deploymentTarget=(0,_common.getConfigProp)(c,platform,'deploymentTarget','10.0');
c.runtime.xcodeProj.provisionProfileSpecifier=(0,_common.getConfigProp)(c,platform,'provisionProfileSpecifier');
c.runtime.xcodeProj.codeSignIdentity=(0,_common.getConfigProp)(c,platform,'codeSignIdentity','iPhone Developer');
c.runtime.xcodeProj.systemCapabilities=(0,_common.getConfigProp)(c,platform,'systemCapabilities');
c.runtime.xcodeProj.runScheme=(0,_common.getConfigProp)(c,platform,'runScheme');
c.runtime.xcodeProj.teamID=(0,_common.getConfigProp)(c,platform,'teamID');
c.runtime.xcodeProj.id=(0,_common.getConfigProp)(c,platform,'id');
c.runtime.xcodeProj.appId=(0,_common.getAppId)(c,platform);if(!(

c.runtime.xcodeProj.provisioningStyle!=='Automatic'&&!c.runtime.xcodeProj.provisionProfileSpecifier)){_context.next=25;break;}_context.next=14;return _regenerator.default.awrap(
(0,_provisionParser.parseProvisioningProfiles)(c));case 14:result=_context.sent;



result.eligable.forEach(function(v){
var bundleId=v.Entitlements['application-identifier'];

if(bundleId===c.runtime.xcodeProj.teamID+"."+c.runtime.xcodeProj.id){
eligibleProfile=v;
}
});if(!

eligibleProfile){_context.next=24;break;}_context.next=19;return _regenerator.default.awrap(
(0,_prompt.inquirerPrompt)({
type:'confirm',
name:'autoFix',
message:"Found following eligible provisioning profile on your system: "+eligibleProfile.Entitlements['application-identifier']+". Do you want ReNative to fix your app confing?",
warningMessage:'No provisionProfileSpecifier configured in appConfig despite setting provisioningStyle to manual'}));case 19:_ref=_context.sent;autoFix=_ref.autoFix;

if(autoFix){
c.runtime.xcodeProj.provisionProfileSpecifier=eligibleProfile.Name;
c.files.appConfig.config.platforms[platform].buildSchemes[c.program.scheme].provisionProfileSpecifier=eligibleProfile.Name;
(0,_fileutils.writeFileSync)(c.paths.appConfig.config,c.files.appConfig.config);
}_context.next=25;break;case 24:

(0,_logger.logWarning)("Your build config has provisioningStyle set to manual but no provisionProfileSpecifier configured in appConfig and no available provisioning profiles availiable for "+c.runtime.xcodeProj.id);case 25:_context.next=27;return _regenerator.default.awrap(



_parseXcodeProject(c,platform));case 27:case"end":return _context.stop();}}});};exports.parseXcodeProject=parseXcodeProject;


var _parseXcodeProject=function _parseXcodeProject(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)('_parseXcodeProject');

var xcode=require(c.paths.project.nodeModulesDir+"/xcode");
var appFolder=(0,_common.getAppFolder)(c,platform);
var appFolderName=(0,_index.getAppFolderName)(c,platform);
var projectPath=_path.default.join(appFolder,appFolderName+".xcodeproj/project.pbxproj");
var xcodeProj=xcode.project(projectPath);
xcodeProj.parse(function(){var _c$runtime$xcodeProj=



c.runtime.xcodeProj,provisioningStyle=_c$runtime$xcodeProj.provisioningStyle,deploymentTarget=_c$runtime$xcodeProj.deploymentTarget,provisionProfileSpecifier=_c$runtime$xcodeProj.provisionProfileSpecifier,codeSignIdentity=_c$runtime$xcodeProj.codeSignIdentity,systemCapabilities=_c$runtime$xcodeProj.systemCapabilities,runScheme=_c$runtime$xcodeProj.runScheme,teamID=_c$runtime$xcodeProj.teamID,appId=_c$runtime$xcodeProj.appId;

if(c.runtime.xcodeProj.teamID){
xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM',teamID);
}else{
xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM','""');
}

xcodeProj.addTargetAttribute('ProvisioningStyle',provisioningStyle);
xcodeProj.addBuildProperty('CODE_SIGN_STYLE',provisioningStyle);
xcodeProj.updateBuildProperty('PRODUCT_BUNDLE_IDENTIFIER',appId);

if(platform===_constants.IOS){
xcodeProj.updateBuildProperty('IPHONEOS_DEPLOYMENT_TARGET',deploymentTarget);
}else if(platform===_constants.TVOS){
xcodeProj.updateBuildProperty('TVOS_DEPLOYMENT_TARGET',deploymentTarget);
}

if(provisionProfileSpecifier){
xcodeProj.updateBuildProperty('PROVISIONING_PROFILE_SPECIFIER',"\""+provisionProfileSpecifier+"\"");
}

xcodeProj.updateBuildProperty('CODE_SIGN_IDENTITY',"\""+codeSignIdentity+"\"");
xcodeProj.updateBuildProperty('"CODE_SIGN_IDENTITY[sdk=iphoneos*]"',"\""+codeSignIdentity+"\"");














if(systemCapabilities){
var sysCapObj={};
for(var sk in systemCapabilities){
var val=systemCapabilities[sk];
sysCapObj[sk]={enabled:val===true?1:0};
}

xcodeProj.addTargetAttribute('SystemCapabilities',sysCapObj);
}

c.pluginConfigiOS.embeddedFontSources.forEach(function(v){
xcodeProj.addResourceFile(v);
});


(0,_pluginTools.parsePlugins)(c,platform,function(plugin,pluginPlat,key){
var xcodeprojObj=(0,_common.getFlavouredProp)(c,pluginPlat,'xcodeproj');
if(xcodeprojObj){
if(xcodeprojObj.resourceFiles){
xcodeprojObj.resourceFiles.forEach(function(v){
xcodeProj.addResourceFile(_path.default.join(appFolder,v));
});
}
if(xcodeprojObj.sourceFiles){
xcodeprojObj.sourceFiles.forEach(function(v){

xcodeProj.addSourceFile(v,null,'200132F21F6BF9CF00450340');
});
}
if(xcodeprojObj.headerFiles){
xcodeprojObj.headerFiles.forEach(function(v){
xcodeProj.addHeaderFile(v,null,'200132F21F6BF9CF00450340');
});
}
if(xcodeprojObj.buildPhases){
xcodeprojObj.buildPhases.forEach(function(v){
xcodeProj.addBuildPhase([],'PBXShellScriptBuildPhase','ShellScript',null,{
shellPath:v.shellPath||'/bin/sh',
shellScript:v.shellScript,
inputPaths:v.inputPaths||['"$(SRCROOT)/$(BUILT_PRODUCTS_DIR)/$(INFOPLIST_PATH)"']});

});
}
if(xcodeprojObj.frameworks){
for(var k in xcodeprojObj.frameworks){
var fPath=void 0;
var opts=void 0;
if(k.startsWith('./')){
fPath=_path.default.join(appFolder,k.replace('./',''));
opts={
customFramework:true,
embed:true,
link:true};

}else{
fPath=_path.default.join('System/Library/Frameworks',k);
opts={
embed:true};

}
xcodeProj.addFramework(fPath,opts);
}
}
if(xcodeprojObj.buildSettings){
for(var _k in xcodeprojObj.buildSettings){
xcodeProj.addToBuildSettings(_k,xcodeprojObj.buildSettings[_k]);
}
}
}
});
_fs.default.writeFileSync(projectPath,xcodeProj.writeSync());
resolve();
});
});};
//# sourceMappingURL=xcodeParser.js.map