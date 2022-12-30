var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.createNewProject=void 0;var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));

var _path=_interopRequireDefault(require("path"));
var _chalk=_interopRequireDefault(require("chalk"));
var _inquirer=_interopRequireDefault(require("inquirer"));
var _semver=_interopRequireDefault(require("semver"));
var _fs=_interopRequireDefault(require("fs"));
var _prompt=require("../systemTools/prompt");
var _constants=require("../constants");



var _templateTools=require("../templateTools");
var _fileutils=require("../systemTools/fileutils");
var _exec=require("../systemTools/exec");
var _logger=require("../systemTools/logger");




var _workspace=require("./workspace");
var _configParser=require("../configTools/configParser");
var _analytics=_interopRequireDefault(require("../systemTools/analytics"));function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;})),keys.push.apply(keys,symbols);}return keys;}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach(function(key){(0,_defineProperty2.default)(target,key,source[key]);}):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}return target;}

var highlight=_chalk.default.green;

var configureGit=function configureGit(c){var projectPath;return _regenerator.default.async(function configureGit$(_context){while(1){switch(_context.prev=_context.next){case 0:
projectPath=c.paths.project.dir;
(0,_logger.logTask)("configureGit:"+projectPath);if(

_fs.default.existsSync(_path.default.join(projectPath,'.git'))){_context.next=14;break;}
(0,_logger.logInfo)('Your project does not have a git repo. Creating one...');if(!
(0,_exec.commandExistsSync)('git')){_context.next=13;break;}_context.next=7;return _regenerator.default.awrap(
(0,_exec.executeAsync)('git init',{cwd:projectPath}));case 7:_context.next=9;return _regenerator.default.awrap(
(0,_exec.executeAsync)('git add -A',{cwd:projectPath}));case 9:_context.next=11;return _regenerator.default.awrap(
(0,_exec.executeAsync)('git commit -m "Initial"',{cwd:projectPath}));case 11:_context.next=14;break;case 13:

(0,_logger.logWarning)('We tried to create a git repo inside your project but you don\'t seem to have git installed');case 14:case"end":return _context.stop();}}},null,null,null,Promise);};




var _generateProject=function _generateProject(c,data){var base,templates,config;return _regenerator.default.async(function _generateProject$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
(0,_logger.logTask)('_generateProject');

base=_path.default.resolve('.');

c.paths.project.dir=_path.default.join(base,data.projectName.replace(/(\s+)/g,'_'));
c.paths.project.package=_path.default.join(c.paths.project.dir,'package.json');
c.paths.project.config=_path.default.join(c.paths.project.dir,_constants.RENATIVE_CONFIG_NAME);

data.packageName=data.appTitle.replace(/\s+/g,'-').toLowerCase();

(0,_fileutils.mkdirSync)(c.paths.project.dir);

templates={};


(0,_logger.logTask)("_generateProject:"+data.optionTemplates.selectedOption+":"+data.optionTemplates.selectedVersion,_chalk.default.grey);

templates[data.optionTemplates.selectedOption]={
version:data.optionTemplates.selectedVersion};


config={
projectName:data.projectName,
workspaceID:data.optionWorkspaces.selectedOption,
paths:{
appConfigsDir:'./appConfigs',
platformTemplatesDir:'$RNV_HOME/platformTemplates',
entryDir:'./',
platformAssetsDir:'./platformAssets',
platformBuildsDir:'./platformBuilds',
projectConfigDir:'./projectConfig'},

defaults:{
title:data.appTitle,
id:data.appID,
supportedPlatforms:data.optionPlatforms.selectedOptions},

templates:templates,
currentTemplate:data.optionTemplates.selectedOption,
isNew:true};


(0,_fileutils.writeFileSync)(c.paths.project.config,config);if(!

data.gitEnabled){_context2.next=15;break;}_context2.next=15;return _regenerator.default.awrap(
configureGit(c));case 15:


(0,_logger.logSuccess)("Your project is ready! navigate to project "+
_chalk.default.white("cd "+data.projectName)+" and run "+_chalk.default.white("rnv run -p "+
data.optionPlatforms.selectedOptions[0])+" to see magic happen!");case 16:case"end":return _context2.stop();}}},null,null,null,Promise);};




var _prepareProjectOverview=function _prepareProjectOverview(c,data){
data.projectName=data.inputProjectName;
data.appTitle=data.inputAppTitle||data.defaultAppTitle;
data.teamID='';
data.appID=data.inputAppID?data.inputAppID.replace(/\s+/g,'-').toLowerCase():data.appID;
data.version=data.inputVersion||data.defaultVersion;
var tempString=data.optionTemplates.selectedOption+"@"+data.optionTemplates.selectedVersion;

var str=(0,_logger.printBoxStart)('🚀  ReNative Project Generator');
str+=(0,_logger.printIntoBox)('');
str+=(0,_logger.printIntoBox)("Project Name (folder): "+highlight(data.projectName),1);
str+=(0,_logger.printIntoBox)("Workspace: "+highlight(data.optionWorkspaces.selectedOption),1);
str+=(0,_logger.printIntoBox)("Project Title: "+highlight(data.appTitle),1);
str+=(0,_logger.printIntoBox)("Project Version: "+highlight(data.version),1);
str+=(0,_logger.printIntoBox)("App ID: "+highlight(data.appID),1);
str+=(0,_logger.printIntoBox)("Project Template: "+highlight(tempString),1);
str+=(0,_logger.printIntoBox)("Git Enabled: "+highlight(data.gitEnabled),1);
str+=(0,_logger.printIntoBox)('');
str+=(0,_logger.printIntoBox)('Project Platforms:');
str+=(0,_logger.printArrIntoBox)(data.optionPlatforms.selectedOptions);
str+=(0,_logger.printIntoBox)('');
str+=(0,_logger.printIntoBox)('Project Structure:');
str+=(0,_logger.printIntoBox)('');
str+=(0,_logger.printIntoBox)(data.projectName);
str+=_chalk.default.gray("\u2502   \u251C\u2500\u2500 appConfigs            # Application flavour configuration files/assets \u2502\n\u2502   \u2502   \u2514\u2500\u2500 [APP_ID]          # Example application flavour                    \u2502\n\u2502   \u2502       \u251C\u2500\u2500 assets        # Platform assets injected to ./platformAssets   \u2502\n\u2502   \u2502       \u251C\u2500\u2500 builds        # Platform files injected to ./platformBuilds    \u2502\n\u2502   \u2502       \u251C\u2500\u2500 fonts             # Folder for all custom fonts                \u2502\n\u2502   \u2502       \u251C\u2500\u2500 plugins           # Multi-platform plugins injections          \u2502\n\u2502   \u2502       \u2514\u2500\u2500 renative.json # Application flavour config                     \u2502\n\u2502   \u251C\u2500\u2500 platformAssets        # Generated cross-platform assets                \u2502\n\u2502   \u251C\u2500\u2500 platformBuilds        # Generated platform app projects                \u2502\n\u2502   \u251C\u2500\u2500 src                   # Source code files                              \u2502\n\u2502   \u251C\u2500\u2500 index.*.js            # Entry files                                    \u2502\n\u2502   \u2514\u2500\u2500 renative.json         # ReNative project configuration                 \u2502\n");












str+=(0,_logger.printIntoBox)('');
str+=(0,_logger.printBoxEnd)();
str+='\n';

data.confirmString=str;
};

var createNewProject=function createNewProject(c){var args,data,inputProjectName,inputProjectNameObj,_await$inquirer$promp,inputAppTitle,inputAppID,inputVersion,inputWorkspace,_await$inquirer$promp2,inputTemplate,templateVersionsStr,versionArr,rnvVersion,validVersions,_await$inquirer$promp3,inputTemplateVersion,_await$inquirer$promp4,inputSupportedPlatforms,_await$inquirer$promp5,gitEnabled,_await$inquirer$promp6,confirm;return _regenerator.default.async(function createNewProject$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:
(0,_logger.logTask)('createNewProject');
args=c.program.args;

data={
defaultVersion:'0.1.0',
defaultTemplate:'renative-template-hello-world',
defaultProjectName:'helloRenative',
defaultAppTitle:'Hello Renative',
defaultWorkspace:'rnv'};

data.optionPlatforms=(0,_prompt.generateOptions)(_constants.SUPPORTED_PLATFORMS,true);
data.optionTemplates={};
data.optionWorkspaces=(0,_workspace.getWorkspaceOptions)(c);if(!(




args[1]&&args[1]!=='')){_context3.next=10;break;}
inputProjectName=args[1];_context3.next=14;break;case 10:_context3.next=12;return _regenerator.default.awrap(

_inquirer.default.prompt({
name:'inputProjectName',
type:'input',
validate:function validate(value){return!!value;},
message:"What's your project Name? (no spaces, folder based on ID will be created in this directory)"}));case 12:inputProjectNameObj=_context3.sent;

inputProjectName=inputProjectNameObj.inputProjectName;case 14:_context3.next=16;return _regenerator.default.awrap(




_inquirer.default.prompt([{
name:'inputAppTitle',
type:'input',
default:data.defaultAppTitle,
validate:function validate(val){return!!val||'Please enter a title';},
message:'What\'s your project Title?'},
{
name:'inputAppID',
type:'input',
default:function _default(){
data.appID="com.mycompany."+inputProjectName.replace(/\s+/g,'').toLowerCase();
return data.appID;
},
validate:function validate(id){return!!id.match(/[a-z]+\.[a-z0-9]+\.[a-z0-9]+/)||'Please enter a valid appID (com.test.app)';},
message:'What\'s your App ID?'},
{
name:'inputVersion',
type:'input',
default:data.defaultVersion,
validate:function validate(v){return!!_semver.default.valid(_semver.default.coerce(v))||'Please enter a valid semver version (1.0.0, 42.6.7.9.3-alpha, etc.)';},
message:'What\'s your Version?'},
{
name:'inputWorkspace',
type:'list',
message:'What workspace to use?',
default:data.defaultWorkspace,
choices:data.optionWorkspaces.keysAsArray}]));case 16:_await$inquirer$promp=_context3.sent;inputAppTitle=_await$inquirer$promp.inputAppTitle;inputAppID=_await$inquirer$promp.inputAppID;inputVersion=_await$inquirer$promp.inputVersion;inputWorkspace=_await$inquirer$promp.inputWorkspace;

data.optionWorkspaces.selectedOption=inputWorkspace;

c.runtime.selectedWorkspace=inputWorkspace;_context3.next=25;return _regenerator.default.awrap(
(0,_configParser.parseRenativeConfigs)(c));case 25:
data.optionTemplates=(0,_templateTools.getTemplateOptions)(c);_context3.next=28;return _regenerator.default.awrap(



_inquirer.default.prompt({
name:'inputTemplate',
type:'list',
message:'What template to use?',
default:data.defaultTemplate,
choices:data.optionTemplates.keysAsArray}));case 28:_await$inquirer$promp2=_context3.sent;inputTemplate=_await$inquirer$promp2.inputTemplate;

data.optionTemplates.selectedOption=inputTemplate;_context3.next=33;return _regenerator.default.awrap(

(0,_exec.executeAsync)(c,"npm view "+data.optionTemplates.selectedOption+" versions"));case 33:templateVersionsStr=_context3.sent;
versionArr=templateVersionsStr.replace(/\r?\n|\r|\s|'|\[|\]/g,'').split(',').reverse();
rnvVersion=c.rnvVersion;


validVersions=versionArr.filter(function(version){return _semver.default.lte(version,rnvVersion);}).map(function(v){return{name:v,value:v};});
if(validVersions[0].name===rnvVersion){

validVersions[0].name=validVersions[0].name+" (recommended)";
}

data.optionTemplates.selectedVersion=versionArr[0];_context3.next=41;return _regenerator.default.awrap(



_inquirer.default.prompt({
name:'inputTemplateVersion',
type:'list',
message:'What version of template to use?',
default:data.optionTemplates.selectedVersion,
choices:validVersions}));case 41:_await$inquirer$promp3=_context3.sent;inputTemplateVersion=_await$inquirer$promp3.inputTemplateVersion;

data.optionTemplates.selectedVersion=inputTemplateVersion;_context3.next=46;return _regenerator.default.awrap(




_inquirer.default.prompt({
name:'inputSupportedPlatforms',
type:'checkbox',
pageSize:20,
message:'What platforms would you like to use?',
validate:function validate(val){return!!val.length||'Please select at least a platform';},
default:data.optionPlatforms.keysAsArray,
choices:data.optionPlatforms.keysAsArray}));case 46:_await$inquirer$promp4=_context3.sent;inputSupportedPlatforms=_await$inquirer$promp4.inputSupportedPlatforms;_context3.next=50;return _regenerator.default.awrap(




_inquirer.default.prompt({
name:'gitEnabled',
type:'confirm',
message:'Do you want to set-up git in your new project?'}));case 50:_await$inquirer$promp5=_context3.sent;gitEnabled=_await$inquirer$promp5.gitEnabled;


data=_objectSpread(_objectSpread({},
data),{},{inputProjectName:inputProjectName,inputAppTitle:inputAppTitle,inputAppID:inputAppID,inputVersion:inputVersion,inputTemplate:inputTemplate,inputSupportedPlatforms:inputSupportedPlatforms,inputWorkspace:inputWorkspace,gitEnabled:gitEnabled});

data.optionPlatforms.selectedOptions=inputSupportedPlatforms;


_prepareProjectOverview(c,data);_context3.next=57;return _regenerator.default.awrap(

_inquirer.default.prompt({
type:'confirm',
name:'confirm',
message:"\n"+data.confirmString+"\nIs all this correct?"}));case 57:_await$inquirer$promp6=_context3.sent;confirm=_await$inquirer$promp6.confirm;if(!


confirm){_context3.next=69;break;}_context3.prev=60;_context3.next=63;return _regenerator.default.awrap(

_analytics.default.captureEvent({
type:'newProject',
template:inputTemplate,
platforms:inputSupportedPlatforms}));case 63:_context3.next=67;break;case 65:_context3.prev=65;_context3.t0=_context3["catch"](60);case 67:_context3.next=69;return _regenerator.default.awrap(



_generateProject(c,data));case 69:case"end":return _context3.stop();}}},null,null,[[60,65]],Promise);};exports.createNewProject=createNewProject;
//# sourceMappingURL=projectGenerator.js.map