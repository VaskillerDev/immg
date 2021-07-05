import {readFileSync, existsSync, writeFileSync, openSync, appendFileSync} from 'fs';
import {dirname, join, sep , posix} from "path";


/**
 * Usage: node index.js './typedoc/package.json'  
 */

// utils
/**
 *  @param {Map} map
 *  @param {PathLike | String} pathToPackageJson
 */
function collectDepsFromPackageJson(map, pathToPackageJson) {
    const packageJsonNotFound = !pathToPackageJson
    if (packageJsonNotFound) throw new Error('package.json file not found')

    const packageJsonContent = readFileSync(pathToPackageJson, {encoding: 'utf-8'})
    const packageJsonContentAsJson = JSON.parse(packageJsonContent)
    
    const deps = packageJsonContentAsJson['dependencies']
    
    // const depsNotFound = !deps
    //if (depsNotFound) throw new Error(`dependencies not found in ${pathToPackageJson}`)
    
    for (const key in deps) {
        if (!deps.hasOwnProperty(key)) continue
        map[key] = deps[key]
    }
}

/**
 *  @param {PathLike | String} pathToPackageJson
 *  @return {PathLike | String} pathToImportMapFile
 */
function tryCreateImportMapFile(pathToPackageJson) {
    const baseDir = dirname(pathToPackageJson)
    const pathToImportMapFile = join(baseDir, 'package.importmap.json')
    
    if (existsSync(pathToImportMapFile) && !forceMode) throw Error(`File already exist: ${pathToImportMapFile}`)
    writeFileSync(pathToImportMapFile,'')
    
    return pathToImportMapFile
}

/**
*  @param {Map} mapWithDeps
*  @param {PathLike | String} pathToPackageJson
*/
function depsToNodeModules(pathToPackageJson, mapWithDeps){
    for (const key in mapWithDeps) {
        if (!mapWithDeps.hasOwnProperty(key)) continue
        depToNodeModules(pathToPackageJson, key)
    }
}

/**
*  @param {String} dep
*  @param {PathLike | String} pathToPackageJson
*/
function depToNodeModules(pathToPackageJson, dep) {
    const pathToDep = join('/node_modules/', dep)
    const pathDepToPackageJson = join(pathToDep, 'package.json')
    
    const pathToDepPosixLike = pathToDep.split(sep).join(posix.sep)
    appendFileSync(fd, `"${dep}" : "${pathToDepPosixLike}",\n`);
    
    const fullPathToPackageJson = join (dirname(baseUrlPathArg), pathDepToPackageJson);
    
    const _map = new Map();
    collectDepsFromPackageJson(_map, fullPathToPackageJson )
    depsToNodeModules(pathDepToPackageJson, _map)
}

// exec
const userArgs = process.argv.slice(2)

// base url: 'example-project/package.json'
const baseUrlPathArg = userArgs[0]
const baseUrlPathNotFound = !baseUrlPathArg
if (baseUrlPathNotFound) console.error("Argument not found: base url path to sever not found")

// force mode: true / false
const forceMode = userArgs[1] === 'true' || false
const map = new Map();

const pathToImportMapFile = tryCreateImportMapFile(baseUrlPathArg)
const fd = openSync(pathToImportMapFile,'a+'); // file descriptor

try {

    appendFileSync(fd,`{\n`)
    appendFileSync(fd,`"imports": {\n`)
    
    collectDepsFromPackageJson(map, baseUrlPathArg);
    // mapDepsToImportMap(map, baseUrlPathArg)
    depsToNodeModules(baseUrlPathArg, map);

    appendFileSync(fd,`}\n`)
    appendFileSync(fd,`}`)
    
} catch (e) {
    console.error(e)
}