var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.parsePodFile=void 0;var _path=_interopRequireDefault(require("path"));
var _common=require("../../common");






var _logger=require("../../systemTools/logger");



var _pluginTools=require("../../pluginTools");

var parsePodFile=function parsePodFile(c,platform){return new Promise(function(resolve){var _c$buildConfig,_c$buildConfig$platfo;
(0,_logger.logTask)("parsePodFileSync:"+platform);

var appFolder=(0,_common.getAppFolder)(c,platform);
var pluginInject='';


c.pluginConfigiOS.podfileInject='';
(0,_pluginTools.parsePlugins)(c,platform,function(plugin,pluginPlat,key){
var podName=(0,_common.getFlavouredProp)(c,pluginPlat,'podName');
if(podName){
pluginInject+=_injectPod(podName,pluginPlat,plugin,key);
}
var podNames=(0,_common.getFlavouredProp)(c,pluginPlat,'podNames');
if(podNames){
podNames.forEach(function(v){
pluginInject+=_injectPod(v,pluginPlat,plugin,key);
});
}

var reactSubSpecs=(0,_common.getFlavouredProp)(c,pluginPlat,'reactSubSpecs');
if(reactSubSpecs){
(0,_logger.logWarning)('reactSubSpecs prop is deprecated. yoy can safely remove it');
}

var podfile=(0,_common.getFlavouredProp)(c,pluginPlat,'Podfile');
if(podfile){var
injectLines=podfile.injectLines;

if(injectLines){
injectLines.forEach(function(v){
c.pluginConfigiOS.podfileInject+=v+"\n";
});
}
}
});


var ignoreWarnings=(0,_common.getConfigProp)(c,platform,'ignoreWarnings');
var podWarnings=ignoreWarnings?'inhibit_all_warnings!':'';


c.pluginConfigiOS.podfileSources='';
var podfileObj=(0,_common.getFlavouredProp)(c,(_c$buildConfig=c.buildConfig)==null?void 0:(_c$buildConfig$platfo=_c$buildConfig.platforms)==null?void 0:_c$buildConfig$platfo[platform],'Podfile');
var podfileSources=podfileObj==null?void 0:podfileObj.sources;
if(podfileSources&&podfileSources.length){
podfileSources.forEach(function(v){
c.pluginConfigiOS.podfileSources+="source '"+v+"'\n";
});
}


var deploymentTarget=(0,_common.getConfigProp)(c,platform,'deploymentTarget','10.0');
c.pluginConfigiOS.deploymentTarget=deploymentTarget;

(0,_common.writeCleanFile)(_path.default.join((0,_common.getAppTemplateFolder)(c,platform),'Podfile'),_path.default.join(appFolder,'Podfile'),[
{pattern:'{{PLUGIN_PATHS}}',override:pluginInject},
{pattern:'{{PLUGIN_WARNINGS}}',override:podWarnings},
{pattern:'{{PLUGIN_PODFILE_INJECT}}',override:c.pluginConfigiOS.podfileInject},
{pattern:'{{PLUGIN_PODFILE_SOURCES}}',override:c.pluginConfigiOS.podfileSources},
{pattern:'{{PLUGIN_DEPLOYMENT_TARGET}}',override:c.pluginConfigiOS.deploymentTarget}]);

resolve();
});};exports.parsePodFile=parsePodFile;

var _injectPod=function _injectPod(podName,pluginPlat,plugin,key){
var pluginInject='';
var isNpm=plugin['no-npm']!==true;
if(isNpm){
var podPath=pluginPlat.path?"../../"+pluginPlat.path:"../../node_modules/"+key;
pluginInject+="  pod '"+podName+"', :path => '"+podPath+"'\n";
}else if(pluginPlat.git){
var commit=pluginPlat.commit?", :commit => '"+pluginPlat.commit+"'":'';
pluginInject+="  pod '"+podName+"', :git => '"+pluginPlat.git+"'"+commit+"\n";
}else if(pluginPlat.version){
pluginInject+="  pod '"+podName+"', '"+pluginPlat.version+"'\n";
}else{
pluginInject+="  pod '"+podName+"'\n";
}
return pluginInject;
};
//# sourceMappingURL=podfileParser.js.map