var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.injectPluginKotlinSync=exports.parseSplashActivitySync=exports.parseMainActivitySync=exports.parseMainApplicationSync=void 0;var _path=_interopRequireDefault(require("path"));
var _common=require("../../common");









var _logger=require("../../systemTools/logger");



var JS_BUNDLE_DEFAULTS={
android:'"super.getJSBundleFile()"',
androidtv:'"super.getJSBundleFile()"',

androidwear:'"assets://index.androidwear.bundle"'};


var JS_BUNDLE_DEFAULTS_BUNDLED={
android:'"assets://index.android.bundle"',
androidtv:'"assets://index.android.bundle"',
androidwear:'"assets://index.android.bundle"'};


var parseMainApplicationSync=function parseMainApplicationSync(c,platform){
var appFolder=(0,_common.getAppFolder)(c,platform);
var applicationPath='app/src/main/java/rnv/MainApplication.kt';
var bundleAssets=(0,_common.getConfigProp)(c,platform,'bundleAssets');
var bundleFile=(0,_common.getGetJsBundleFile)(c,platform)||bundleAssets?JS_BUNDLE_DEFAULTS_BUNDLED[platform]:JS_BUNDLE_DEFAULTS[platform];

var bundlerIp=(0,_common.getIP)()||'10.0.2.2';
if(!bundleAssets){
c.pluginConfigAndroid.pluginApplicationDebugServer+='    var mPreferences: SharedPreferences = PreferenceManager.getDefaultSharedPreferences(this)\n';
c.pluginConfigAndroid.pluginApplicationDebugServer+="    mPreferences?.edit().putString(\"debug_http_host\", \""+bundlerIp+":"+c.runtime.port+"\").apply()\n";
}


(0,_common.writeCleanFile)((0,_common.getBuildFilePath)(c,platform,applicationPath),_path.default.join(appFolder,applicationPath),[
{pattern:'{{APPLICATION_ID}}',override:(0,_common.getAppId)(c,platform)},
{pattern:'{{ENTRY_FILE}}',override:(0,_common.getEntryFile)(c,platform)},
{pattern:'{{GET_JS_BUNDLE_FILE}}',override:bundleFile},
{pattern:'{{PLUGIN_IMPORTS}}',override:c.pluginConfigAndroid.pluginApplicationImports},
{pattern:'{{PLUGIN_PACKAGES}}',override:c.pluginConfigAndroid.pluginPackages},
{pattern:'{{PLUGIN_METHODS}}',override:c.pluginConfigAndroid.pluginApplicationMethods},
{pattern:'{{PLUGIN_ON_CREATE}}',override:c.pluginConfigAndroid.pluginApplicationCreateMethods},
{pattern:'{{PLUGIN_DEBUG_SERVER}}',override:c.pluginConfigAndroid.pluginApplicationDebugServer}]);


};exports.parseMainApplicationSync=parseMainApplicationSync;

var parseMainActivitySync=function parseMainActivitySync(c,platform){
var appFolder=(0,_common.getAppFolder)(c,platform);
var activityPath='app/src/main/java/rnv/MainActivity.kt';
(0,_common.writeCleanFile)((0,_common.getBuildFilePath)(c,platform,activityPath),_path.default.join(appFolder,activityPath),[
{pattern:'{{APPLICATION_ID}}',override:(0,_common.getAppId)(c,platform)},
{pattern:'{{PLUGIN_ACTIVITY_IMPORTS}}',override:c.pluginConfigAndroid.pluginActivityImports},
{pattern:'{{PLUGIN_ACTIVITY_METHODS}}',override:c.pluginConfigAndroid.pluginActivityMethods},
{pattern:'{{PLUGIN_ON_CREATE}}',override:c.pluginConfigAndroid.pluginActivityCreateMethods},
{pattern:'{{PLUGIN_ON_ACTIVITY_RESULT}}',override:c.pluginConfigAndroid.pluginActivityResultMethods}]);

};exports.parseMainActivitySync=parseMainActivitySync;

var parseSplashActivitySync=function parseSplashActivitySync(c,platform){
var appFolder=(0,_common.getAppFolder)(c,platform);
var splashPath='app/src/main/java/rnv/SplashActivity.kt';



var enableAndroidX=(0,_common.getConfigProp)(c,platform,'enableAndroidX',true);
if(enableAndroidX===true){
c.pluginConfigAndroid.pluginSplashActivityImports+='import androidx.appcompat.app.AppCompatActivity\n';
}else{
c.pluginConfigAndroid.pluginSplashActivityImports+='import android.support.v7.app.AppCompatActivity\n';
}

(0,_common.writeCleanFile)((0,_common.getBuildFilePath)(c,platform,splashPath),_path.default.join(appFolder,splashPath),[
{pattern:'{{APPLICATION_ID}}',override:(0,_common.getAppId)(c,platform)},
{pattern:'{{PLUGIN_SPLASH_ACTIVITY_IMPORTS}}',override:c.pluginConfigAndroid.pluginSplashActivityImports}]);

};exports.parseSplashActivitySync=parseSplashActivitySync;

var injectPluginKotlinSync=function injectPluginKotlinSync(c,plugin,key,pkg){
var pathFixed=plugin.path?""+plugin.path:"node_modules/"+key+"/android";
var modulePath="../../"+pathFixed;

if(plugin.activityImports instanceof Array){
plugin.activityImports.forEach(function(activityImport){

if(c.pluginConfigAndroid.pluginActivityImports.indexOf(activityImport)===-1){
c.pluginConfigAndroid.pluginActivityImports+="import "+activityImport+"\n";
}
});
}

if(plugin.activityMethods instanceof Array){
c.pluginConfigAndroid.pluginActivityMethods+='\n';
c.pluginConfigAndroid.pluginActivityMethods+=""+plugin.activityMethods.join('\n    ');
}var

mainActivity=plugin.mainActivity;
if(mainActivity){
if(mainActivity.createMethods instanceof Array){
c.pluginConfigAndroid.pluginActivityCreateMethods+='\n';
c.pluginConfigAndroid.pluginActivityCreateMethods+=""+mainActivity.createMethods.join('\n    ');
}

if(mainActivity.resultMethods instanceof Array){
c.pluginConfigAndroid.pluginActivityResultMethods+='\n';
c.pluginConfigAndroid.pluginActivityResultMethods+=""+mainActivity.resultMethods.join('\n    ');
}

if(mainActivity.imports instanceof Array){
mainActivity.imports.forEach(function(v){
c.pluginConfigAndroid.pluginActivityImports+="import "+v+"\n";
});
}

if(mainActivity.methods instanceof Array){
c.pluginConfigAndroid.pluginActivityMethods+='\n';
c.pluginConfigAndroid.pluginActivityMethods+=""+mainActivity.methods.join('\n    ');
}
}

if(plugin.imports){
plugin.imports.forEach(function(v){
c.pluginConfigAndroid.pluginApplicationImports+="import "+v+"\n";
});
}

_injectPackage(c,plugin,pkg);

if(plugin.MainApplication){
if(plugin.MainApplication.packages){
plugin.MainApplication.packages.forEach(function(v){
_injectPackage(c,plugin,v);
});
}
}var

mainApplication=plugin.mainApplication;
if(mainApplication){
if(mainApplication.createMethods instanceof Array){
c.pluginConfigAndroid.pluginApplicationCreateMethods+='\n';
c.pluginConfigAndroid.pluginApplicationCreateMethods+=""+mainApplication.createMethods.join('\n    ');
}

if(mainApplication.imports instanceof Array){
mainApplication.imports.forEach(function(v){
c.pluginConfigAndroid.pluginApplicationImports+="import "+v+"\n";
});
}

if(mainApplication.methods instanceof Array){
c.pluginConfigAndroid.pluginApplicationMethods+='\n';
c.pluginConfigAndroid.pluginApplicationMethods+=""+mainApplication.methods.join('\n    ');
}
}

if(plugin.mainApplicationMethods){
(0,_logger.logWarning)("Plugin "+key+" in "+c.paths.project.config+" is using DEPRECATED \""+c.platform+"\": { MainApplicationMethods }. Use \""+c.platform+"\": { \"mainApplication\": { \"methods\": []}} instead");
c.pluginConfigAndroid.pluginApplicationMethods+="\n"+plugin.mainApplicationMethods+"\n";
}
};exports.injectPluginKotlinSync=injectPluginKotlinSync;

var _injectPackage=function _injectPackage(c,plugin,pkg){
if(pkg)c.pluginConfigAndroid.pluginApplicationImports+="import "+pkg+"\n";
var packageParams='';
if(plugin.packageParams){
packageParams=plugin.packageParams.join(',');
}

var className=_extractClassName(pkg);
if(className)c.pluginConfigAndroid.pluginPackages+=className+"("+packageParams+"),\n";
};

var _extractClassName=function _extractClassName(pkg){return pkg?pkg.split('.').pop():null;};
//# sourceMappingURL=kotlinParser.js.map