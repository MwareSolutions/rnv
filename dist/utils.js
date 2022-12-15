Object.defineProperty(exports,"__esModule",{value:true});exports.getValidLocalhost=exports.replaceOverridesInString=exports.isSystemWin=exports.isSystemLinux=exports.isSystemMac=void 0;
var isSystemMac=process.platform==='darwin';exports.isSystemMac=isSystemMac;

var isSystemLinux=process.platform==='linux';exports.isSystemLinux=isSystemLinux;

var isSystemWin=process.platform==='win32';exports.isSystemWin=isSystemWin;

var replaceOverridesInString=function replaceOverridesInString(string,overrides,mask){var _replacedString;
var replacedString=string;
if((overrides==null?void 0:overrides.length)&&((_replacedString=replacedString)==null?void 0:_replacedString.replace)){
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