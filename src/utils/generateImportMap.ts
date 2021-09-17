import ImportMap from '../importData/ImportMap.js'
import { PackageNode } from '../importData/PackageNode.js'
import GenerateImportMapsArgs from '../importData/GenerateImportMapsArgs.js'

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
