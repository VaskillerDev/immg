import { openSync } from 'fs'
import GenerateImportMapsArgs from '../types/GenerateImportMapsArgs.js'
import { Deps } from '../types/Deps'
import { StaticArgs } from '../types/StaticArgs'
import collectDepsFromPackageJson from './collectDepsFromPackageJson.js'
import depsToNodeModules from './depsToNodeModules.js'
import tryCreateImportMapFile from './tryCreateImportMapFile.js'
import Print from '../types/Print.js'

/**
 *  Generate import map for dependencies
 *  See: {@link https://github.com/WICG/import-maps Import maps}
 * @param args
 */
export default function generateImportMap(args: GenerateImportMapsArgs): void {
  const { baseUrlPath, forceMode } = args

  const map: Deps = new Map()
  const pathToImportMapFile = tryCreateImportMapFile(baseUrlPath, forceMode)
  const fd = openSync(pathToImportMapFile, 'a+') // file descriptor

  const staticArgs: StaticArgs = {
    fileDescriptor: fd,
    baseUrlPath: baseUrlPath,
  }

  try {
    Print.openImports(fd)
    collectDepsFromPackageJson(baseUrlPath, map)
    depsToNodeModules(baseUrlPath, map, staticArgs)
    const newDescriptor = Print.removeLastCommaAndGetDescriptor(
      staticArgs.fileDescriptor,
      baseUrlPath
    )
    Print.closeImports(newDescriptor)
  } catch (e) {
    console.error(e)
  }
}
