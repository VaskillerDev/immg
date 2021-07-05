import {dirname, join, posix, sep} from "path";
import {appendFileSync} from "fs";

import collectDepsFromPackageJson from "./collectDepsFromPackageJson.js";
import depsToNodeModules from "./depsToNodeModules.js";
import {Deps} from "../types/Deps.js";
import {StaticArgs} from "../types/StaticArgs.js";

/**
 * @param {fileDescriptor : Number, baseUrlPath : String} staticArgs
 *  @param {String} dep
 *  @param {PathLike | String} pathToPackageJson
 */
export default function depToNodeModules(pathToPackageJson: string, dep: string, staticArgs: StaticArgs) : void {
    const {fileDescriptor, baseUrlPath} = staticArgs
    const pathToDep = join('/node_modules/', dep)
    const pathDepToPackageJson = join(pathToDep, 'package.json')

    const pathToDepPosixLike = pathToDep.split(sep).join(posix.sep)
    console.log("appendFileSync", `"${dep}" : "${pathToDepPosixLike}",\n`)
    appendFileSync(fileDescriptor, `"${dep}" : "${pathToDepPosixLike}",\n`)

    const fullPathToPackageJson = join (dirname(baseUrlPath), pathDepToPackageJson)

    const mapFromDeps : Deps = new Map();
    collectDepsFromPackageJson(fullPathToPackageJson, mapFromDeps)
    depsToNodeModules(pathDepToPackageJson, mapFromDeps, staticArgs);
}