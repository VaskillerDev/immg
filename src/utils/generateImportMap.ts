import { openSync } from 'fs'

import tryCreateImportMapFile from './tryCreateImportMapFile.js'

import Print from '../types/Print.js'
import { StaticArgs } from '../types/StaticArgs'
import GenerateImportMapsArgs from '../types/GenerateImportMapsArgs.js'
import {PackageNode} from "../types/PackageNode.js";
import path from "path";

/**
 *  Generate import map for dependencies
 *  See: {@link https://github.com/WICG/import-maps Import maps}
 * @param args
 */
export default function generateImportMap(args: GenerateImportMapsArgs): void {
  const { baseUrlPath, forceMode } = args
  
  const pathToImportMapFile = tryCreateImportMapFile(baseUrlPath, forceMode)
  const fd = openSync(pathToImportMapFile, 'a+') // file descriptor

  const staticArgs: StaticArgs = {
    fileDescriptor: fd,
    baseUrlPath: baseUrlPath,
  }
  
  const entryNode = new PackageNode(baseUrlPath);
  const packageSet = new Set<string>();
  
  try {
    Print.openImports(fd)
    
    entryNode.foreachNode(info => {
      const {name, version, pathToPackageJson, main} = info;
      if (packageSet.has(name)) return;
      const pathToPackageJsonDirs = pathToPackageJson.split(path.sep);
      
      const nodeModulesIndex = pathToPackageJsonDirs.findIndex((dir)=> dir === 'node_modules');
      const nodeModulesFound = nodeModulesIndex !== -1;
      if (!nodeModulesFound) return;
      
      const sliceDir = pathToPackageJsonDirs.slice(nodeModulesIndex, pathToPackageJsonDirs.length - 1);
      const mainRes = main.split('/').slice(0,-1).join(path.sep);
      let relPath = path.join(...sliceDir, mainRes);
      relPath = '.\\' + relPath;
      relPath = relPath.split(path.sep).join(path.posix.sep);
      
      packageSet.add(name);
      Print.to(fd, `"${name}" : "${relPath}",\n`);
    });
    
    const newDescriptor = Print.removeLastCommaAndGetDescriptor(
      staticArgs.fileDescriptor,
      baseUrlPath
    )
    Print.closeImports(newDescriptor)
  } catch (e) {
    console.error(e)
  }
}
