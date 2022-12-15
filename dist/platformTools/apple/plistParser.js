var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.saveObjToPlistSync=exports.objToPlist=exports.parseInfoPlist=exports.parseEntitlementsPlist=exports.parseExportOptionsPlist=void 0;var _path=_interopRequireDefault(require("path"));
var _fs=_interopRequireDefault(require("fs"));
var _objectUtils=require("../../systemTools/objectUtils");
var _common=require("../../common");









var _logger=require("../../systemTools/logger");




var _pluginTools=require("../../pluginTools");
var _index=require("./index");
var _fileutils=require("../../systemTools/fileutils");


var parseExportOptionsPlist=function parseExportOptionsPlist(c,platform){return new Promise(function(resolve){

var tId=(0,_common.getConfigProp)(c,platform,'teamID');
var appFolder=(0,_common.getAppFolder)(c,platform);
var exportOptions=(0,_common.getConfigProp)(c,platform,'exportOptions')||{};
var id=(0,_common.getConfigProp)(c,platform,'id');

c.pluginConfigiOS.exportOptions=objToPlist(exportOptions);

if(exportOptions.provisioningProfiles){
var expProvProfile=exportOptions.provisioningProfiles[id];
if(!expProvProfile){
(0,_logger.logError)("Your exportOptions.provisionProfiles object in "+c.paths.appConfig.config+" does not include id "+id+"!");
}
}

var bPath=(0,_common.getBuildFilePath)(c,platform,'exportOptions.plist');
(0,_common.writeCleanFile)(bPath,_path.default.join(appFolder,'exportOptions.plist'),[
{pattern:'{{TEAM_ID}}',override:tId},
{pattern:'{{PLUGIN_EXPORT_OPTIONS}}',override:c.pluginConfigiOS.exportOptions}]);

resolve();
});};exports.parseExportOptionsPlist=parseExportOptionsPlist;

var parseEntitlementsPlist=function parseEntitlementsPlist(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("parseEntitlementsPlistSync:"+platform);

var appFolder=(0,_common.getAppFolder)(c,platform);
var appFolderName=(0,_index.getAppFolderName)(c,platform);
var entitlementsPath=_path.default.join(appFolder,appFolderName+"/"+appFolderName+".entitlements");

var pluginsEntitlementsObj=(0,_common.getConfigProp)(c,platform,'entitlements');
if(!pluginsEntitlementsObj){
pluginsEntitlementsObj=(0,_fileutils.readObjectSync)(_path.default.join(c.paths.rnv.dir,'src/platformTools/apple/supportFiles/entitlements.json'));
}

saveObjToPlistSync(c,entitlementsPath,pluginsEntitlementsObj);
resolve();
});};exports.parseEntitlementsPlist=parseEntitlementsPlist;

var parseInfoPlist=function parseInfoPlist(c,platform){return new Promise(function(resolve,reject){
(0,_logger.logTask)("parseInfoPlist:"+platform);

var appFolder=(0,_common.getAppFolder)(c,platform);
var appFolderName=(0,_index.getAppFolderName)(c,platform);
var plat=c.buildConfig.platforms[platform];var
orientationSupport=plat.orientationSupport,urlScheme=plat.urlScheme;
var plistPath=_path.default.join(appFolder,appFolderName+"/Info.plist");


var plistObj=(0,_fileutils.readObjectSync)(_path.default.join(c.paths.rnv.dir,"src/platformTools/apple/supportFiles/info.plist."+platform+".json"));
plistObj.CFBundleDisplayName=(0,_common.getAppTitle)(c,platform);
plistObj.CFBundleShortVersionString=(0,_common.getAppVersion)(c,platform);
plistObj.CFBundleVersion=(0,_common.getAppVersionCode)(c,platform);

if(c.pluginConfigiOS.embeddedFonts.length){
plistObj.UIAppFonts=c.pluginConfigiOS.embeddedFonts;
}

var pluginPermissions='';
var includedPermissions=(0,_common.getConfigProp)(c,platform,'includedPermissions')||(0,_common.getConfigProp)(c,platform,'permissions');
if(includedPermissions&&c.buildConfig.permissions){
var _plat=c.buildConfig.permissions[platform]?platform:'ios';
var pc=c.buildConfig.permissions[_plat];
if(includedPermissions.length&&includedPermissions[0]==='*'){
for(var v in pc){
var key=pc[v].key||v;
plistObj[key]=pc[v].desc;
}
}else{
includedPermissions.forEach(function(v){
if(pc[v]){
var _key=pc[v].key||v;
plistObj[_key]=pc[v].desc;
}
});
}
}

if(orientationSupport){
if(orientationSupport.phone){
plistObj.UISupportedInterfaceOrientations=orientationSupport.phone;
}else{
plistObj.UISupportedInterfaceOrientations=['UIInterfaceOrientationPortrait'];
}
if(orientationSupport.tab){
plistObj['UISupportedInterfaceOrientations~ipad']=orientationSupport.tab;
}else{
plistObj['UISupportedInterfaceOrientations~ipad']=['UIInterfaceOrientationPortrait'];
}
}

if(urlScheme){
(0,_logger.logWarning)('urlScheme is DEPRECATED. use "plist:{ CFBundleURLTypes: []}" object instead');
plistObj.CFBundleURLTypes.push({
CFBundleTypeRole:'Editor',
CFBundleURLName:urlScheme,
CFBundleURLSchemes:[urlScheme]});

}


var plist=(0,_common.getConfigProp)(c,platform,'plist');
if(plist){
plistObj=(0,_fileutils.mergeObjects)(c,plistObj,plist,true,true);
}


(0,_pluginTools.parsePlugins)(c,platform,function(plugin,pluginPlat,key){
var plist=(0,_common.getFlavouredProp)(c,pluginPlat,'plist');
if(plist){
plistObj=(0,_fileutils.mergeObjects)(c,plistObj,plist,true,false);
}
});
saveObjToPlistSync(c,plistPath,plistObj);
resolve();
});};exports.parseInfoPlist=parseInfoPlist;

var PLIST_START="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n<plist version=\"1.0\">\n";



var PLIST_END='</plist>\n';

var objToPlist=function objToPlist(obj){
var output=PLIST_START;
output+=_parseObject(obj,0);
output+=PLIST_END;
return output;
};exports.objToPlist=objToPlist;

var _parseObject=function _parseObject(obj,level){
var output='';
var space='';
for(var i=0;i<level;i++){
space+='  ';
}
if((0,_objectUtils.isArray)(obj)){
output+=space+"<array>\n";
obj.forEach(function(v){
output+=_parseObject(v,level+1);
});
output+=space+"</array>\n";
}else if((0,_objectUtils.isBool)(obj)){
output+=space+"<"+obj+" />\n";
}else if((0,_objectUtils.isObject)(obj)){
output+=space+"<dict>\n";
for(var key in obj){
output+="  "+space+"<key>"+key+"</key>\n";
output+=_parseObject(obj[key],level+1);
}
output+=space+"</dict>\n";
}else if((0,_objectUtils.isString)(obj)){
output+=space+"<string>"+obj+"</string>\n";
}

return output;
};

var saveObjToPlistSync=function saveObjToPlistSync(c,filePath,obj){

_fs.default.writeFileSync(filePath,objToPlist(obj));
};exports.saveObjToPlistSync=saveObjToPlistSync;
//# sourceMappingURL=plistParser.js.map