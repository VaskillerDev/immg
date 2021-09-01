import ImportMap from '../types/ImportMap.js'
import GenerateImportMapsArgs from '../types/GenerateImportMapsArgs.js'
import { openSync } from 'fs'
import Print from '../types/Print'
import tryCreateImportMapFile from './tryCreateImportMapFile'

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
