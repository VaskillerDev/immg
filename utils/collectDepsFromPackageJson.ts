import {readFileSync} from "fs";
type Json = { [key: string]: Json | string }

/** Collect dependencies from specified package.json
 *  @param {Map<String,String>} map
 *  @param {PathLike | String} pathToPackageJson
 */
export default function collectDepsFromPackageJson(pathToPackageJson : string, map : Map<string, string>) {
    const packageJsonNotFound = !pathToPackageJson
    if (packageJsonNotFound) throw new Error('package.json file not found')

    const packageJsonContent = readFileSync(pathToPackageJson, {encoding: 'utf-8'})
    const packageJsonContentAsJson = JSON.parse(packageJsonContent) as Json
    const deps = packageJsonContentAsJson['dependencies'] as Json

    const depsNotFound = !deps
    if (depsNotFound) return // dependencies not found

    for (const key in deps) {
        if (!deps.hasOwnProperty(key)) continue
        map.set(key, deps[key] as string)
    }
}