#!/usr/bin/env node
import { Command } from 'commander'

import GenerateImportMapsArgs from './src/types/GenerateImportMapsArgs.js'
import generateImportMap from './src/utils/generateImportMap.js'
import netStatImportMap from "./src/utils/netStatImportMap.js";
import printImportMap from './src/utils/printImportMap.js'
import NetStatArgs from "./src/types/NetStatArgs.js";

const cli = new Command()

cli
  .requiredOption(
    '-b, --baseUrlPath [type]',
    '<string> path to root package.json',
    undefined
  )
  .option(
    '-f, --forceMode [type]',
    '<boolean> if enable - force rewrite previous importmap',
    false
  )
  .option('-x, --prefix [type]', '<string> append prefix to path', '')
  .parse()

/**
 * Usage: node index.js './typedoc/package.json'
 */
// exec
const args: GenerateImportMapsArgs = cli.opts<GenerateImportMapsArgs>()

if (!args.baseUrlPath) {
  console.error('Argument not found: base path to package.json not found')
  process.exit(1)
}

const importMap = generateImportMap(args)
if (importMap === undefined) {
  console.error("Import file couldn't generate")
  process.exit(1)
}

const netStatArgs : NetStatArgs = { // TODO: rewrite later
  scheme: 'http',
  host : 'localhost',
  basePath: '/sdk/web/client',
  port: '8080'
};

netStatImportMap(netStatArgs, importMap); 

//printImportMap(args, importMap) //TODO: enable later
