var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.injectPluginSwiftSync=exports.parseAppDelegate=void 0;var _path=_interopRequireDefault(require("path"));
var _chalk=_interopRequireDefault(require("chalk"));
var _common=require("../../common");








var _logger=require("../../systemTools/logger");


var _pluginTools=require("../../pluginTools");

var parseAppDelegate=function parseAppDelegate(c,platform,appFolder,appFolderName){var isBundled=arguments.length>4&&arguments[4]!==undefined?arguments[4]:false;var ip=arguments.length>5&&arguments[5]!==undefined?arguments[5]:'localhost';var port=arguments.length>6?arguments[6]:undefined;return new Promise(function(resolve,reject){
if(!port)port=c.runtime.port;
(0,_logger.logTask)("parseAppDelegateSync:"+platform+":"+ip+":"+port);
var appDelegate='AppDelegate.swift';

var entryFile=(0,_common.getEntryFile)(c,platform);var
backgroundColor=c.buildConfig.platforms[platform].backgroundColor;

var forceBundle=(0,_common.getGetJsBundleFile)(c,platform);
var bundle;
if(forceBundle){
bundle=forceBundle;
}else if(isBundled){
bundle="RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: \""+entryFile+"\", fallbackResource: nil)";
}else{
bundle="URL(string: \"http://"+ip+":"+port+"/"+entryFile+".bundle?platform=ios\")";
}


(0,_pluginTools.parsePlugins)(c,platform,function(plugin,pluginPlat,key){
injectPluginSwiftSync(c,pluginPlat,key,pluginPlat.package);
});












var clr=(0,_common.sanitizeColor)((0,_common.getConfigProp)(c,platform,'backgroundColor')).rgbDecimal;
var pluginBgColor="vc.view.backgroundColor = UIColor(red: "+clr[0]+", green: "+clr[1]+", blue: "+clr[2]+", alpha: "+clr[3]+")";
var methods={
application:{
didFinishLaunchingWithOptions:{
isRequired:true,
func:'func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {',
begin:"\n        self.window = UIWindow(frame: UIScreen.main.bounds)\n        let vc = UIViewController()\n        let v = RCTRootView(\n            bundleURL: bundleUrl!,\n            moduleName: moduleName,\n            initialProperties: nil,\n            launchOptions: launchOptions)\n        vc.view = v\n        "+








pluginBgColor+"\n        v.frame = vc.view.bounds\n        self.window?.rootViewController = vc\n        self.window?.makeKeyAndVisible()\n        UNUserNotificationCenter.current().delegate = self\n                ",





render:function render(v){return""+v;},
end:'return true'},


applicationDidBecomeActive:{
func:'func applicationDidBecomeActive(_ application: UIApplication) {',
begin:null,
render:function render(v){return""+v;},
end:null},

open:{
func:'func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {',
begin:'var handled = false',
render:function render(v){return"if(!handled) { handled = "+v+" }";},
end:'return handled'},


supportedInterfaceOrientationsFor:{
func:'func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {',
begin:null,
render:function render(v){return"return "+v;},
end:null},


didReceiveRemoteNotification:{
func:'func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {',
begin:null,
render:function render(v){return""+v;},
end:null},


didFailToRegisterForRemoteNotificationsWithError:{
func:'func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {',
begin:null,
render:function render(v){return""+v;},
end:null},


didReceive:{
func:'func application(_ application: UIApplication, didReceive notification: UILocalNotification) {',
begin:null,
render:function render(v){return""+v;},
end:null},


didRegister:{
func:'func application(_ application: UIApplication, didRegister notificationSettings: UIUserNotificationSettings) {',
begin:null,
render:function render(v){return""+v;},
end:null},


didRegisterForRemoteNotificationsWithDeviceToken:{
func:'func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {',
begin:null,
render:function render(v){return""+v;},
end:null}},



userNotificationCenter:{
willPresent:{
func:'func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {',
begin:null,
render:function render(v){return""+v;},
end:null}}};




var constructMethod=function constructMethod(lines,method){
var output='';
if(lines.length||method.isRequired){
output+="\n"+method.func+"\n";
if(method.begin)output+="   "+method.begin+"\n";
lines.forEach(function(v){
output+="    "+method.render(v)+"\n";
});
if(method.end)output+="   "+method.end+"\n";
output+='}\n';
}
return output;
};

for(var key in methods){
var method=methods[key];
for(var key2 in method){
var f=method[key2];
c.pluginConfigiOS.pluginAppDelegateMethods+=constructMethod(c.pluginConfigiOS.appDelegateMethods[key][key2],f);
}
}

(0,_common.writeCleanFile)(
_path.default.join((0,_common.getAppTemplateFolder)(c,platform),appFolderName,appDelegate),
_path.default.join(appFolder,appFolderName,appDelegate),
[
{pattern:'{{BUNDLE}}',override:bundle},
{pattern:'{{ENTRY_FILE}}',override:entryFile},
{pattern:'{{IP}}',override:ip},
{pattern:'{{PORT}}',override:port},
{pattern:'{{BACKGROUND_COLOR}}',override:pluginBgColor},
{
pattern:'{{APPDELEGATE_IMPORTS}}',
override:c.pluginConfigiOS.pluginAppDelegateImports},

{
pattern:'{{APPDELEGATE_METHODS}}',
override:c.pluginConfigiOS.pluginAppDelegateMethods}]);



resolve();
});};exports.parseAppDelegate=parseAppDelegate;

var injectPluginSwiftSync=function injectPluginSwiftSync(c,plugin,key,pkg){
(0,_logger.logTask)("injectPluginSwiftSync:"+c.platform+":"+key,_chalk.default.grey);
var appDelegateImports=(0,_common.getFlavouredProp)(c,plugin,'appDelegateImports');
if(appDelegateImports instanceof Array){
appDelegateImports.forEach(function(appDelegateImport){

(0,_logger.logTask)('appDelegateImports add',_chalk.default.grey);
if(c.pluginConfigiOS.pluginAppDelegateImports.indexOf(appDelegateImport)===-1){
(0,_logger.logTask)('appDelegateImports add ok',_chalk.default.grey);
c.pluginConfigiOS.pluginAppDelegateImports+="import "+appDelegateImport+"\n";
}
});
}




var appDelegateMethods=(0,_common.getFlavouredProp)(c,plugin,'appDelegateMethods');
if(appDelegateMethods){
for(var _key in appDelegateMethods){var _loop=function _loop(
key2){
var plugArr=c.pluginConfigiOS.appDelegateMethods[_key][key2];
var plugVal=appDelegateMethods[_key][key2];
if(plugVal){
plugVal.forEach(function(v){
if(!plugArr.includes(v)){
plugArr.push(v);
}
});
}};for(var key2 in appDelegateMethods[_key]){_loop(key2);
}
}
}
};exports.injectPluginSwiftSync=injectPluginSwiftSync;
//# sourceMappingURL=swiftParser.js.map