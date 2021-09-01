import { openSync } from 'fs'

import tryCreateImportMapFile from './tryCreateImportMapFile.js'

import Print from '../types/Print.js'
import ImportMap from '../types/ImportMap.js'
import { PackageNode } from '../types/PackageNode.js'
import GenerateImportMapsArgs from '../types/GenerateImportMapsArgs.js'

/**
 *  Generate import map for dependencies
 *  See: {@link https://github.com/WICG/import-maps Import maps}
 * @param args
 */
export default function generateImportMap(args: GenerateImportMapsArgs): void {
  const pathToImportMapFile = tryCreateImportMapFile(args);
  const fd = openSync(pathToImportMapFile, 'a+') // file descriptor
  const entryNode = new PackageNode(args.baseUrlPath)

  try {
    const importMap: ImportMap = new ImportMap(args);
    entryNode.foreachNode(node => importMap.addImport(node))
    const prettyJson = importMap.asPrettyStringify()

    Print.to(fd, prettyJson)
    Print.close(fd)
  } catch (e) {
    console.error(e)
  }
}
