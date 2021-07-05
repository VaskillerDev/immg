import depToNodeModules from "./depToNodeModules.js";
import {StaticArgs} from "../types/StaticArgs.js";

type Deps = Map<string, string>
 /**
 * Recursion
 * @param {fileDescriptor : Number, baseUrlPath : String} staticArgs
 *  @param {Map} mapWithDeps
 *  @param {PathLike | String} pathToPackageJson
 */
export default function depsToNodeModules(pathToPackageJson : string, mapWithDeps : Deps, staticArgs: StaticArgs) {
    mapWithDeps.forEach((_, key) => depToNodeModules(pathToPackageJson, key, staticArgs))
}