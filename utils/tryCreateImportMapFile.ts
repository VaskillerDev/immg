import {dirname, join} from "path";
import {existsSync, writeFileSync} from "fs";

/**
 *  @param {PathLike | String} pathToPackageJson
 *  @param {Boolean} forceMode
 *  @return {PathLike | String} pathToImportMapFile
 */
export default function tryCreateImportMapFile(pathToPackageJson : string, forceMode : boolean) : string {
    const baseDir = dirname(pathToPackageJson)
    const pathToImportMapFile = join(baseDir, 'package.importmap.json')

    if (existsSync(pathToImportMapFile) && !forceMode) throw Error(`File already exist: ${pathToImportMapFile}`)
    writeFileSync(pathToImportMapFile,'')

    return pathToImportMapFile
}