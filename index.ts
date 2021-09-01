import GenerateImportMapsArgs from './src/types/GenerateImportMapsArgs.js'
import generateImportMap from './src/utils/generateImportMap.js'

/**
 * Usage: node index.js './typedoc/package.json'
 */
// exec
const userArgs = process.argv.slice(2)

const baseUrlPathArg: string | undefined = userArgs[0]
const forceModeArg: boolean = userArgs[1] === 'true' || false
const prefixArg: string = userArgs[2] || ''

if (!baseUrlPathArg)
  console.error('Argument not found: base url path to sever not found')

const args: GenerateImportMapsArgs = {
  baseUrlPath: baseUrlPathArg,
  forceMode: forceModeArg,
  prefix: prefixArg,
}

generateImportMap(args)

export default { generateImportMap }
