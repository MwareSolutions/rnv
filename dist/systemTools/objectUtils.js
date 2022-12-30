Object.defineProperty(exports,"__esModule",{value:true});exports.isUndefined=exports.isSymbol=exports.isString=exports.isRegExp=exports.isObject=exports.isNumber=exports.isNull=exports.isLikeNull=exports.isFunction=exports.isError=exports.isDate=exports.isBool=exports.isArray=void 0;
var isObject=function isObject(value){return value&&typeof value==='object'&&value.constructor===Object;};exports.isObject=isObject;

var isArray=function isArray(value){return value&&typeof value==='object'&&value.constructor===Array;};exports.isArray=isArray;

var isString=function isString(value){return typeof value==='string'||value instanceof String;};exports.isString=isString;

var isNumber=function isNumber(value){return typeof value==='number'&&isFinite(value);};exports.isNumber=isNumber;

var isFunction=function isFunction(value){return typeof value==='function';};exports.isFunction=isFunction;

var isBool=function isBool(value){return typeof value==='boolean';};exports.isBool=isBool;

var isNull=function isNull(value){return value===null;};exports.isNull=isNull;

var isUndefined=function isUndefined(value){return typeof value==='undefined';};exports.isUndefined=isUndefined;

var isRegExp=function isRegExp(value){return value&&typeof value==='object'&&value.constructor===RegExp;};exports.isRegExp=isRegExp;

var isError=function isError(value){return value instanceof Error&&typeof value.message!=='undefined';};exports.isError=isError;

var isDate=function isDate(value){return value instanceof Date;};exports.isDate=isDate;

var isSymbol=function isSymbol(value){return typeof value==='symbol';};exports.isSymbol=isSymbol;

var isLikeNull=function isLikeNull(value){return isNull(value)||isUndefined(value);};exports.isLikeNull=isLikeNull;
//# sourceMappingURL=objectUtils.js.map