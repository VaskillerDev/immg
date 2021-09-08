import { existsSync, readFileSync } from 'fs'
import path, { dirname, join } from 'path'
import { Json } from './Json'

export class PackageNode {
  readonly #name: PackageName = ''
  readonly #version: PackageVersion = ''
  readonly #nodes: PackageNode[] = []
  readonly #pathToPackageJson: string = ''
  readonly #main: PackageMain = ''
  readonly #parent: PackageNode | undefined

  constructor(pathToPackageJson: string, parent?: PackageNode) {
    this.#parent = parent
    this.#pathToPackageJson = pathToPackageJson

    const packageJsonContent = readFileSync(pathToPackageJson, {
      encoding: 'utf-8',
    })
    const packageJsonContentAsJson = JSON.parse(packageJsonContent) as Json

    this.#name = PN.extractName(packageJsonContentAsJson)
    this.#version = PN.extractVersion(packageJsonContentAsJson)
    this.#main = PN.extractMain(packageJsonContentAsJson)
    this.#nodes = this.extractNodes(packageJsonContentAsJson)
  }

  /**
   * Iterate all nodes
   * @param {{UsageLambda}} lambda
   */
  public foreachNode(lambda: UsageLambda): void {
    lambda(this)
    for (const node of this.#nodes) node.foreachNode(lambda)
  }

  /**
   * Get parent package
   * if return undefined - is root package
   */
  public get parent(): PackageNode | undefined {
    return this.#parent
  }

  /**
   * Get other packages
   */
  public get children(): PackageNode[] {
    return this.#nodes
  }

  /**
   * Get package name
   */
  public get name(): PackageName {
    return this.#name
  }

  /**
   * Get package version
   */
  public get version(): PackageVersion {
    return this.#version
  }

  /**
   * Get path to package.json
   */
  public get pathToPackageJson(): string {
    return this.#pathToPackageJson
  }

  /**
   * Get main entry point for package
   */
  public get main(): PackageMain {
    return this.#main
  }

  //-----------------------------------------------------------------------------
  private static extractName(packageJsonContent: Json): PackageName {
    return packageJsonContent['name'] as PackageName
  }

  private static extractVersion(packageJsonContent: Json): PackageVersion {
    return packageJsonContent['version'] as PackageVersion
  }

  private static extractMain(packageJsonContent: Json): PackageMain {
    return (packageJsonContent['main'] || 'index.js') as PackageMain
  }

  private extractNodes(packageJsonContent: Json): PackageNode[] {
    const packages = packageJsonContent['dependencies'] as Json
    if (!packages) return [] // dependencies not found

    const nodes: PackageNode[] = []

    for (const packageName in packages) {
      if (!packages.hasOwnProperty(packageName)) continue
      if (packageName.includes('@types')) continue
      let packageJsonPath: string | null = this.genPackageJsonPath(packageName)
      packageJsonPath = this.findPackageJson(packageJsonPath)
      if (packageJsonPath === null) continue

      const node = new PackageNode(packageJsonPath, this)
      nodes.push(node)
    }

    return nodes
  }

  private genPackageJsonPath(packageName: string): string {
    const dirWithPackageJson = dirname(this.#pathToPackageJson)
    return join(dirWithPackageJson, 'node_modules', packageName, 'package.json')
  }

  /**
   * @param pathToPackageJson
   * @private
   */
  private findPackageJson(pathToPackageJson: string): string | null {
    if (existsSync(pathToPackageJson)) return pathToPackageJson

    let elems = pathToPackageJson.split(path.sep)
    const nmsIdx: number[] = []
    for (let i = 0; i < elems.length; i++)
      if (elems[i] === 'node_modules') nmsIdx.push(i)

    const startPos =nmsIdx[nmsIdx.length -2];
    const endPos = nmsIdx[nmsIdx.length - 1];
    
    const rmElemsCount = endPos - startPos
    elems.splice(startPos, rmElemsCount)
    pathToPackageJson = elems.join(path.sep)

    return this.findPackageJson(pathToPackageJson)
  }
}

const PN = PackageNode
export type PackageName = string
export type PackageVersion = string
export type PackageMain = string

export type PackageInfo = {
  name: PackageName
  version: PackageVersion
  main: PackageMain
  pathToPackageJson: string
}

export type UsageLambda = (node: PackageNode) => void
