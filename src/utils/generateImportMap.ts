import { openSync } from 'fs'

import tryCreateImportMapFile from './tryCreateImportMapFile.js'

import Print from '../types/Print.js'
import ImportMap from "../types/ImportMap.js";
import {PackageNode} from "../types/PackageNode.js";
import GenerateImportMapsArgs from '../types/GenerateImportMapsArgs.js'

/**
 *  Generate import map for dependencies
 *  See: {@link https://github.com/WICG/import-maps Import maps}
 * @param args
 */
export default function generateImportMap(args: GenerateImportMapsArgs): void {
  const { baseUrlPath, forceMode, prefix } = args
  
  const pathToImportMapFile = tryCreateImportMapFile(baseUrlPath, forceMode)
  const fd = openSync(pathToImportMapFile, 'a+') // file descriptor
  
  const entryNode = new PackageNode(baseUrlPath);
  
  try {
    
    const importMap : ImportMap = new ImportMap(baseUrlPath, prefix);
    entryNode.foreachNode(node => importMap.addImport(node));
    const prettyJson = importMap.asPrettyStringify()
    
    Print.to(fd, prettyJson);
    Print.close(fd);
  } catch (e) {
    console.error(e)
  }
}