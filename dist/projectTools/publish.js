var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _semver=_interopRequireDefault(require("semver"));

var _config=_interopRequireDefault(require("../config"));
var _exec=require("../systemTools/exec");
var _logger=require("../systemTools/logger");
var _fileutils=require("../systemTools/fileutils");
















var includesPre=function includesPre(version){
if(version.includes('alpha'))return'alpha';
if(version.includes('beta'))return'beta';
if(version.includes('rc'))return'rc';
return false;
};

var rnvPublish=function rnvPublish(){var _pkgJson$releaseIt,_pkgJson$releaseIt$ho;var pkgJson,existingPath,args,maybeVersion,secondArg,prereleaseMark,dir,execCommonOpts,ci,publishMode,_pkgJson$releaseIt2,skipRootPublish,rootPublishCommand,rootPublishIfNecessary,releaseIt;return _regenerator.default.async(function rnvPublish$(_context2){while(1)switch(_context2.prev=_context2.next){case 0:_context2.next=2;return _regenerator.default.awrap(

_config.default.checkRequiredPackage('release-it','12.4.3','devDependencies'));case 2:

pkgJson=_config.default.getProjectConfig().package;
existingPath=_config.default.getConfig().paths.project.package;

if(!pkgJson['release-it']){
pkgJson['release-it']={
git:{

tagName:'v${version}',
requireCleanWorkingDir:false
},
npm:{
publish:false
},
hooks:{

'before:git':'npx rnv pkg version ${version}'
}
};
(0,_fileutils.writeFileSync)(existingPath,pkgJson);
}


if(!((_pkgJson$releaseIt=pkgJson['release-it'])!=null&&(_pkgJson$releaseIt$ho=_pkgJson$releaseIt.hooks)!=null&&_pkgJson$releaseIt$ho['before:git'])){
if(!pkgJson['release-it'].hooks){
pkgJson['release-it'].hooks={};
}

pkgJson['release-it'].hooks['before:git']='npx rnv pkg version ${version}';
(0,_fileutils.writeFileSync)(existingPath,pkgJson);
}

if(!pkgJson['release-it'].publish){
pkgJson['release-it'].publish='local';
pkgJson['release-it'].skipRootPublish=true;
pkgJson['release-it'].rootPublishCommand='npx rnv deploy -p ios -s debug';
(0,_fileutils.writeFileSync)(existingPath,pkgJson);
}

args=(0,_toConsumableArray2.default)(_config.default.getConfig().program.rawArgs);
args=args.slice(3);

maybeVersion=args[0];
secondArg=args[1];
prereleaseMark='';


if(['alpha','beta','rc'].includes(secondArg)){
args.splice(1,1);
prereleaseMark="--preRelease="+secondArg;
}


if(_semver.default.valid(maybeVersion)&&includesPre(maybeVersion)){
prereleaseMark="--preRelease="+includesPre(maybeVersion);
}

dir=_config.default.getConfig().paths.project.dir;
execCommonOpts={interactive:true,env:process.env,cwd:dir};
ci=_config.default.getConfig().program.ci;
publishMode=pkgJson['release-it'].publish||'local';_pkgJson$releaseIt2=
pkgJson['release-it'],skipRootPublish=_pkgJson$releaseIt2.skipRootPublish,rootPublishCommand=_pkgJson$releaseIt2.rootPublishCommand;

rootPublishIfNecessary=function rootPublishIfNecessary(){return _regenerator.default.async(function rootPublishIfNecessary$(_context){while(1)switch(_context.prev=_context.next){case 0:_context.next=2;return _regenerator.default.awrap(
(0,_exec.executeAsync)('npx rnv pkg publish',execCommonOpts));case 2:if(
skipRootPublish){_context.next=6;break;}if(
rootPublishCommand){_context.next=5;break;}throw new Error('You don\'t have a rootPublishCommand specified in package.json');case 5:return _context.abrupt("return",
(0,_exec.executeAsync)(rootPublishCommand,execCommonOpts));case 6:case"end":return _context.stop();}},null,null,null,Promise);};



releaseIt=function releaseIt(){return(0,_exec.executeAsync)("npx release-it "+args.join(' ')+" "+prereleaseMark,execCommonOpts).catch(function(e){
if(e.includes('SIGINT'))return Promise.resolve();
if(e.includes('--no-git.requireUpstream'))return Promise.reject(new Error('Seems like you have no upstream configured for current branch. Run `git push -u <origin> <your_branch>` to fix it then try again.'));
return Promise.reject(e);
}).then(rootPublishIfNecessary);};if(!


ci){_context2.next=25;break;}if(!(
publishMode!=='ci')){_context2.next=24;break;}return _context2.abrupt("return",(0,_logger.logWarning)('You are running publish with --ci flag but this project is set for local deployments. Check package.json release-it.publish property'));case 24:return _context2.abrupt("return",
rootPublishIfNecessary());case 25:return _context2.abrupt("return",


releaseIt());case 26:case"end":return _context2.stop();}},null,null,null,Promise);};var _default=


rnvPublish;exports.default=_default;
//# sourceMappingURL=publish.js.map