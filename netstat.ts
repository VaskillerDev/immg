#!/usr/bin/env node
import { URL } from 'url'
import { Command } from 'commander'

import NetStatArgs from './src/types/NetStatArgs.js'
import ImportMap from './src/types/ImportMap.js'
import netStatImportMap from './src/utils/netStatImportMap.js'

const cli = new Command()

cli
  .requiredOption(
    '-p, --pathToFile [type]',
    '<string> path to package.importmap.json'
  )
  .option(
    '-u, --baseUrl [type]',
    '<string> base url to server with modules'
  )
  .parse()

const opts = cli.opts()
const pathToFile = opts['pathToFile']
const baseUrl = opts['baseUrl']
const parsedBaseUrl = new URL(baseUrl)

const netStatArgs: NetStatArgs = {
  pathToPackageImportmapJson: pathToFile,

  protocol: parsedBaseUrl.protocol,
  hostname: parsedBaseUrl.hostname,
  pathname: parsedBaseUrl.pathname,
  port: parsedBaseUrl.port,
}
const importMap = ImportMap.fromFile(pathToFile)
if (importMap === undefined) {
  console.error(`import map not found`)
  process.exit(1)
}
await netStatImportMap(netStatArgs, importMap)
