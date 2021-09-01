import ImportMap from '../types/ImportMap.js'
import { PackageNode } from '../types/PackageNode.js'
import GenerateImportMapsArgs from '../types/GenerateImportMapsArgs.js'

/**
 *  Generate import map for dependencies
 *  See: {@link https://github.com/WICG/import-maps Import maps}
 * @param args
 */
export default function generateImportMap(
  args: GenerateImportMapsArgs
): ImportMap | undefined {
  try {
    const entryNode = new PackageNode(args.baseUrlPath)
    const importMap: ImportMap = new ImportMap(args)
    entryNode.foreachNode(node => importMap.addImport(node))

    return importMap
  } catch (e) {
    console.error(e)
  }
}
