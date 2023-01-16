var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.parseAndroidManifestSync=exports.injectPluginManifestSync=void 0;var _path=_interopRequireDefault(require("path"));
var _common=require("../../common");







var _logger=require("../../systemTools/logger");




var _fileutils=require("../../systemTools/fileutils");
var _pluginTools=require("../../pluginTools");

var PROHIBITED_DUPLICATE_TAGS=['intent-filter'];
var SYSTEM_TAGS=['tag','children'];

var _findChildNode=function _findChildNode(tag,name,node){
if(!node){
(0,_logger.logWarning)('_findChildNode: Node is undefined');
return;
}
if(!name&&!PROHIBITED_DUPLICATE_TAGS.includes(tag))return null;
for(var i=0;i<node.children.length;i++){
var ch=node.children[i];
if(ch.tag===tag){
if(ch['android:name']===name||PROHIBITED_DUPLICATE_TAGS.includes(tag))return ch;
}
}
return null;
};

var _convertToXML=function _convertToXML(manifestObj){return _parseNode(manifestObj,0);};

var _parseNode=function _parseNode(n,level){
var output='';
var space='';
for(var i=0;i<level;i++){
space+='    ';
}

var nodeKeysCount=0;
Object.keys(n).forEach(function(v){
if(!SYSTEM_TAGS.includes(v))nodeKeysCount++;
});
var isSingleLine=nodeKeysCount<2;

if(!n.tag){
(0,_logger.logWarning)('Each node must have tag key!');
return;
}

if(n){
var endLine=isSingleLine?' ':'\n';
output+=space+"<"+n.tag+endLine;
for(var _k in n){
if(!SYSTEM_TAGS.includes(_k)){
output+=""+(isSingleLine?'':space+"  ")+_k+"=\""+n[_k]+"\""+endLine;
}
}
}else{
output+=space+"<"+n.tag;
}
if(n.children&&n.children.length){
if(isSingleLine){
output+='>\n';
}else{
output+=space+">\n";
}

var nextLevel=level+=1;
n.children.forEach(function(v){
output+=_parseNode(v,nextLevel);
});
output+=space+"</"+n.tag+">\n";
}else{
output+=(isSingleLine?'':space)+"/>\n";
}
return output;
};

var _mergeNodeParameters=function _mergeNodeParameters(node,nodeParamsExt){
if(!nodeParamsExt){
(0,_logger.logWarning)('_mergeNodeParameters: nodeParamsExt value is null');
return;
}
if(!node){
(0,_logger.logWarning)('_mergeNodeParameters: node value is null');
return;
}

for(var _k2 in nodeParamsExt){
if(!SYSTEM_TAGS.includes(_k2))node[_k2]=nodeParamsExt[_k2];
}
};

var _mergeNodeChildren=function _mergeNodeChildren(node){var nodeChildrenExt=arguments.length>1&&arguments[1]!==undefined?arguments[1]:[];

if(!node){
(0,_logger.logWarning)('_mergeNodeChildren: Node is undefined');
return;
}
if(!node.children)node.children=[];
nodeChildrenExt.forEach(function(v){
var nameExt=v['android:name'];
if(v.tag){
var childNode=_findChildNode(v.tag,nameExt,node);
if(childNode){
console.log('_mergeNodeChildren: FOUND EXISTING NODE TO MERGE',nameExt,v.tag);
_mergeNodeParameters(childNode,v);
_mergeNodeChildren(childNode,v.children);
}else{
console.log('_mergeNodeChildren: NO android:name found. adding to children',nameExt,v.tag);
node.children.push(v);
}
}
});
};

var parseAndroidManifestSync=function parseAndroidManifestSync(c,platform){
(0,_logger.logTask)("parseAndroidManifestSync:"+platform);
var pluginConfig={};
try{var _c$buildConfig,_c$buildConfig$platfo,_c$buildConfig2;
var baseManifestFilePath=_path.default.join(c.paths.rnv.dir,"src/platformTools/android/supportFiles/AndroidManifest_"+platform+".json");
var baseManifestFile=(0,_fileutils.readObjectSync)(baseManifestFilePath);
var appFolder=(0,_common.getAppFolder)(c,platform);
var application=_findChildNode('application','.MainApplication',baseManifestFile);

baseManifestFile.package=(0,_common.getAppId)(c,platform);


var pluginConfigAndroid=(0,_common.getFlavouredProp)(c,(_c$buildConfig=c.buildConfig)==null?void 0:(_c$buildConfig$platfo=_c$buildConfig.platforms)==null?void 0:_c$buildConfig$platfo[platform],'AndroidManifest');

if(pluginConfigAndroid){
var applicationExt=_findChildNode('application','.MainApplication',pluginConfigAndroid);
_mergeNodeParameters(application,applicationExt);
if(applicationExt.children){
_mergeNodeChildren(application,applicationExt.children);
}
}


(0,_pluginTools.parsePlugins)(c,platform,function(plugin,pluginPlat,key){
var androidManifest=(0,_common.getFlavouredProp)(c,pluginPlat,'AndroidManifest');
if(androidManifest){
_mergeNodeChildren(baseManifestFile,androidManifest.children);






}
});


var prms='';
var configPermissions=(_c$buildConfig2=c.buildConfig)==null?void 0:_c$buildConfig2.permissions;

var includedPermissions=(0,_common.getConfigProp)(c,platform,'includedPermissions')||(0,_common.getConfigProp)(c,platform,'permissions');
var excludedPermissions=(0,_common.getConfigProp)(c,platform,'excludedPermissions');
if(includedPermissions&&configPermissions){
var platPerm=configPermissions[platform]?platform:'android';
var pc=configPermissions[platPerm];
if(includedPermissions[0]==='*'){
for(var _k3 in pc){
if(!(excludedPermissions&&excludedPermissions.includes(_k3))){
prms+="\n   <uses-permission android:name=\""+pc[_k3].key+"\" />";
var key=pc[_k3].key||_k3;
baseManifestFile.children.push({
tag:'uses-permission',
'android:name':key
});
}
}
}else{
includedPermissions.forEach(function(v){
if(pc[v]){
prms+="\n   <uses-permission android:name=\""+pc[v].key+"\" />";
var _key=pc[v].key||k;
baseManifestFile.children.push({
tag:'uses-permission',
'android:name':_key
});
}
});
}
}


var includedFeatures=(0,_common.getConfigProp)(c,platform,'includedFeatures');
if(includedFeatures){
includedFeatures.forEach(function(key){
baseManifestFile.children.push({
tag:'uses-feature',
'android:name':key,
'android:required':true
});
});
}

var excludedFeatures=(0,_common.getConfigProp)(c,platform,'excludedFeatures');
if(excludedFeatures){
excludedFeatures.forEach(function(key){
baseManifestFile.children.push({
tag:'uses-feature',
'android:name':key,
'android:required':false
});
});
}

var manifestXml=_convertToXML(baseManifestFile);

var manifestFile='app/src/main/AndroidManifest.xml';

(0,_common.writeCleanFile)((0,_common.getBuildFilePath)(c,platform,manifestFile),_path.default.join(appFolder,manifestFile),[
{pattern:'{{PLUGIN_MANIFEST_FILE}}',override:manifestXml},
{pattern:'{{PERMISIONS}}',override:prms},
{pattern:'{{APPLICATION_ID}}',override:baseManifestFile.package}]);


return;
}catch(e){
(0,_logger.logError)(e);
}
};exports.parseAndroidManifestSync=parseAndroidManifestSync;

var injectPluginManifestSync=function injectPluginManifestSync(c,plugin,key,pkg){
var className=pkg?pkg.split('.').pop():null;
var packageParams='';
if(plugin.packageParams){
packageParams=plugin.packageParams.join(',');
}

var pathFixed=plugin.path?""+plugin.path:"node_modules/"+key+"/android";
var modulePath="../../"+pathFixed;
};exports.injectPluginManifestSync=injectPluginManifestSync;
//# sourceMappingURL=manifestParser.js.map