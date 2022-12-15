var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard");Object.defineProperty(exports,"__esModule",{value:true});Object.defineProperty(exports,"Common",{enumerable:true,get:function get(){return _common.default;}});Object.defineProperty(exports,"Logger",{enumerable:true,get:function get(){return _logger.default;}});Object.defineProperty(exports,"CLI",{enumerable:true,get:function get(){return _cli.default;}});Object.defineProperty(exports,"Constants",{enumerable:true,get:function get(){return _constants.default;}});Object.defineProperty(exports,"Exec",{enumerable:true,get:function get(){return _exec.default;}});Object.defineProperty(exports,"FileUtils",{enumerable:true,get:function get(){return _fileutils.default;}});Object.defineProperty(exports,"Doctor",{enumerable:true,get:function get(){return _doctor.default;}});Object.defineProperty(exports,"PluginTools",{enumerable:true,get:function get(){return _pluginTools.default;}});Object.defineProperty(exports,"SetupTools",{enumerable:true,get:function get(){return _setupTools.default;}});exports.default=exports.run=void 0;var _common=_interopRequireWildcard(require("./common"));
var _logger=_interopRequireWildcard(require("./systemTools/logger"));
var _cli=_interopRequireDefault(require("./cli"));
var _constants=_interopRequireDefault(require("./constants"));
var _exec=_interopRequireDefault(require("./systemTools/exec"));
var _fileutils=_interopRequireDefault(require("./systemTools/fileutils"));
var _doctor=_interopRequireDefault(require("./systemTools/doctor"));
var _pluginTools=_interopRequireDefault(require("./pluginTools"));
var _setupTools=_interopRequireDefault(require("./setupTools"));
var _config=_interopRequireDefault(require("./config"));
var _analytics=_interopRequireDefault(require("./systemTools/analytics"));

require("source-map-support/register");

_analytics.default.initialize();

var run=function run(cmd,subCmd,program,process){
(0,_common.initializeBuilder)(cmd,subCmd,process,program).
then(function(c){return _config.default.initializeConfig(c);}).
then(function(c){return(0,_cli.default)(c);}).
then(function(){return(0,_logger.logComplete)(true);}).
catch(function(e){return(0,_logger.logError)(e,true);});
};exports.run=run;var _default=







{run:run,Config:_config.default};exports.default=_default;
//# sourceMappingURL=index.js.map