var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.injectPluginXmlValuesSync=exports.parseValuesColorsSync=exports.parseValuesStringsSync=void 0;var _path=_interopRequireDefault(require("path"));
var _common=require("../../common");







var _fileutils=require("../../systemTools/fileutils");

var parseValuesStringsSync=function parseValuesStringsSync(c){
var appFolder=(0,_common.getAppFolder)(c,c.platform);
var stringsPath='app/src/main/res/values/strings.xml';
var strings='<resources>\n';
strings+="  <string name=\"app_name\">"+(0,_common.getAppTitle)(c,c.platform)+"</string>\n";
c.pluginConfigAndroid.resourceStrings.forEach(function(v){
strings+="  <"+v.tag+" name=\""+v.name+"\">"+v.child_value+"</"+v.tag+">\n";
});
strings+='</resources>';
(0,_fileutils.writeFileSync)(_path.default.join(appFolder,stringsPath),strings);
};exports.parseValuesStringsSync=parseValuesStringsSync;

var parseValuesColorsSync=function parseValuesColorsSync(c){
var appFolder=(0,_common.getAppFolder)(c,c.platform);
var stringsPath='app/src/main/res/values/colors.xml';
(0,_common.writeCleanFile)((0,_common.getBuildFilePath)(c,c.platform,stringsPath),_path.default.join(appFolder,stringsPath),[
{pattern:'{{PLUGIN_COLORS_BG}}',override:(0,_common.sanitizeColor)((0,_common.getConfigProp)(c,c.platform,'backgroundColor')).hex}]);

};exports.parseValuesColorsSync=parseValuesColorsSync;

var injectPluginXmlValuesSync=function injectPluginXmlValuesSync(c,plugin,key,pkg){var _plugin$ResourceStrin;
var rStrings=(_plugin$ResourceStrin=plugin.ResourceStrings)==null?void 0:_plugin$ResourceStrin.children;
if(rStrings){
rStrings.forEach(function(obj){
c.pluginConfigAndroid.resourceStrings.push(obj);
});
}
};exports.injectPluginXmlValuesSync=injectPluginXmlValuesSync;
//# sourceMappingURL=xmlValuesParser.js.map