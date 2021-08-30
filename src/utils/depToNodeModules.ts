import { dirname, join, posix, sep } from 'path'
import { appendFileSync, readFileSync } from 'fs'

import collectDepsFromPackageJson from './collectDepsFromPackageJson.js'
import depsToNodeModules from './depsToNodeModules.js'
import { Deps } from '../types/Deps.js'
import { StaticArgs } from '../types/StaticArgs.js'
import { Json } from '../types/Json.js'

/**
 *  @param {fileDescriptor : Number, baseUrlPath : String} staticArgs
 *  @param {String} dep
 *  @param {PathLike | String} pathToPackageJson
 */
export default function depToNodeModules(
  pathToPackageJson: string,
  dep: string,
  staticArgs: StaticArgs
): void {
  const { fileDescriptor, baseUrlPath } = staticArgs
  const pathToDep = join('/node_modules/', dep)
  const pathDepToPackageJson = join(pathToDep, 'package.json')
  const fullPathToPackageJson = join(dirname(baseUrlPath), pathDepToPackageJson)
  
  2+2;
  
  const depPackageJsonContent = readFileSync(fullPathToPackageJson, {
    encoding: 'utf-8',
  })
  const depPackageJsonContentAsJson = JSON.parse(depPackageJsonContent) as Json
  const main = (depPackageJsonContentAsJson['main'] as string) || 'index.js' // js entry-point script
  const pathToDepWithMain = join(pathToDep, main)

  const pathToDepPosixLike = pathToDepWithMain.split(sep).join(posix.sep)
  // console.log("appendFileSync", `"${dep}" : "${pathToDepPosixLike}",\n`)
  appendFileSync(fileDescriptor, `"${dep}" : ".${pathToDepPosixLike}",\n`)

  const mapFromDeps: Deps = new Map()
  collectDepsFromPackageJson(fullPathToPackageJson, mapFromDeps)
  depsToNodeModules(pathDepToPackageJson, mapFromDeps, staticArgs)
}
