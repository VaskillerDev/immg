import GenerateImportMapsArgs from '../types/GenerateImportMapsArgs.js'
import tryCreateImportMapFile from './tryCreateImportMapFile.js'
import ImportMap from '../types/ImportMap.js'
import Print from '../types/Print.js'
import { openSync } from 'fs'

export default function printImportMap(
  args: GenerateImportMapsArgs,
  importMap: ImportMap
) {
  try {
    const pathToImportMapFile = tryCreateImportMapFile(args)
    const fd = openSync(pathToImportMapFile, 'a+') // file descriptor
    const prettyJson = importMap.asPrettyStringify()

    Print.to(fd, prettyJson)
    Print.close(fd)
  } catch (e) {
    console.error(e)
  }
}
