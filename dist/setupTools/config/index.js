Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _fileutils=require("../../systemTools/fileutils");
var _utils=require("../../utils");

var androidPlatform='linux';
var tizenPlatform='ubuntu';
var tizenExtension='bin';

if(_utils.isSystemWin){
androidPlatform='windows';
tizenPlatform='windows';
tizenExtension='exe';
}

if(process.platform==='darwin'){
tizenPlatform='macos';
tizenExtension='dmg';
}var _default=

{
android:{
sdkUrl:"https://dl.google.com/android/repository/sdk-tools-"+androidPlatform+"-4333796.zip",
downloadLocation:(0,_fileutils.replaceHomeFolder)("~/sdk-tools-"+androidPlatform+"-4333796.zip"),
location:(0,_fileutils.replaceHomeFolder)('~/Android')
},
tizen:{
sdkUrl:"http://download.tizen.org/sdk/Installer/tizen-studio_3.3/web-ide_Tizen_Studio_3.3_"+tizenPlatform+"-64."+tizenExtension,
downloadLocation:(0,_fileutils.replaceHomeFolder)("~/web-ide_Tizen_Studio_3.3_"+tizenPlatform+"-64."+tizenExtension)
},
webos:{
downloadLink:'http://webostv.developer.lge.com/sdk/installation/#'
}
};exports.default=_default;
//# sourceMappingURL=index.js.map