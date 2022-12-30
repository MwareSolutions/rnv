Object.defineProperty(exports,"__esModule",{value:true});exports.replaceOverridesInString=exports.isSystemWin=exports.isSystemMac=exports.isSystemLinux=exports.getValidLocalhost=void 0;
var isSystemMac=process.platform==='darwin';exports.isSystemMac=isSystemMac;

var isSystemLinux=process.platform==='linux';exports.isSystemLinux=isSystemLinux;

var isSystemWin=process.platform==='win32';exports.isSystemWin=isSystemWin;

var replaceOverridesInString=function replaceOverridesInString(string,overrides,mask){var _replacedString;
var replacedString=string;
if(overrides!=null&&overrides.length&&(_replacedString=replacedString)!=null&&_replacedString.replace){
overrides.forEach(function(v){
var regEx=new RegExp(v,'g');
replacedString=replacedString.replace(regEx,mask);
});
}
return replacedString;
};exports.replaceOverridesInString=replaceOverridesInString;

var getValidLocalhost=function getValidLocalhost(value,localhost){
if(!value)return localhost;
switch(value){
case'localhost':
case'0.0.0.0':
case'127.0.0.1':
return localhost;
default:
return value;}

};exports.getValidLocalhost=getValidLocalhost;
//# sourceMappingURL=utils.js.map