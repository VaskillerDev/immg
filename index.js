import {readFileSync, existsSync, writeFileSync, openSync, appendFileSync} from 'fs';
import {dirname, join} from "path";
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
    const depsNotFound = !deps
    if (depsNotFound) console.warn(`dependencies not found in ${pathToPackageJson}`)
    
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
    
    if (!existsSync(pathToImportMapFile)) writeFileSync(pathToImportMapFile,'')
    
    return pathToImportMapFile
}

/**
 *  @param {Map} mapWithDeps
 *  @param {PathLike | String} pathToPackageJson
 */
function mapDepsToImportMap(mapWithDeps, pathToPackageJson) {
    const pathToImportMapFile = tryCreateImportMapFile(pathToPackageJson)
    const desc = openSync(pathToImportMapFile,'a+')
    
    appendFileSync(desc,`{\n`)
    appendFileSync(desc,`"imports": {\n`)
    
    for (const key in mapWithDeps) {
        if (!mapWithDeps.hasOwnProperty(key)) continue
        appendFileSync(desc, `"${key}": "/node_modules/src/etc",\n`)
    }

    appendFileSync(desc,`}\n`)
    appendFileSync(desc,`}`)
}

// exec
const userArgs = process.argv.slice(2)
const baseUrlPathArg = userArgs[0]
const baseUrlPathNotFound = !baseUrlPathArg
if (baseUrlPathNotFound) console.error("Argument not found: base url path to sever not found")

const map = new Map();
collectDepsFromPackageJson(map, baseUrlPathArg);
mapDepsToImportMap(map, baseUrlPathArg)