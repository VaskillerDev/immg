#!/usr/bin/env node
import {Command} from 'commander';

import GenerateImportMapsArgs from './src/types/GenerateImportMapsArgs.js'
import generateImportMap from './src/utils/generateImportMap.js'
import printImportMap from './src/utils/printImportMap.js'

const cli = new Command();

cli
    .option('-b, --baseUrlPath [type]', '<string> path to root package.json', undefined)
    .option('-f, --forceMode [type]', '<boolean> if enable - force rewrite previous importmap', false)
    .option('-x, --prefix [type]', '<string> append prefix to path', '')
    .parse();

/**
 * Usage: node index.js './typedoc/package.json'
 */
// exec
const args: GenerateImportMapsArgs = cli.opts<GenerateImportMapsArgs>()

if (!args.baseUrlPath) {
  console.error('Argument not found: base url path to sever not found')
  process.exit(1)
}

const importMap = generateImportMap(args)
if (importMap === undefined) {
  console.error("Import file couldn't generate")
  process.exit(1)
}

printImportMap(args, importMap)
