import {
  appendFileSync,
  readFileSync,
  closeSync,
  writeFileSync,
  openSync,
} from 'fs'
import { dirname, join } from 'path'

export default class Print {
  static openImports(fileDescriptor: number): void {
    appendFileSync(fileDescriptor, `{\n`)
    appendFileSync(fileDescriptor, `"imports": {\n`)
  }

  /**
   *  Rewrite content and remove last comma from json
   * @param fileDescriptor
   * @param pathToPackageJsonFile
   */
  static removeLastCommaAndGetDescriptor(
    fileDescriptor: number,
    pathToPackageJsonFile: string
  ): number {
    closeSync(fileDescriptor) // close file
    const pathToPackageImportMapFile = join(
      dirname(pathToPackageJsonFile),
      'package.importmap.json'
    )

    const fileContent = readFileSync(pathToPackageImportMapFile, {
      encoding: 'utf-8',
    })
    
    const penultimateChar = fileContent.charAt(fileContent.length - 2);
    if (penultimateChar !== ',') {
      return openSync(pathToPackageImportMapFile, 'a+')
    }
    
    const content = fileContent.slice(0, -2) // del \n and comma

    writeFileSync(pathToPackageImportMapFile, content)
    return openSync(pathToPackageImportMapFile, 'a+')
  }

  static closeImports(fileDescriptor: number): void {
    appendFileSync(fileDescriptor, `\n}\n`)
    appendFileSync(fileDescriptor, `}`)
  }
}
