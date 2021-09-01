import path from 'path'
import { Json } from './Json.js'
import { PackageNode } from './PackageNode.js'
import GenerateImportMapsArgs from './GenerateImportMapsArgs'

export default class ImportMap {
  /**
   * "imports" field
   * @private
   */
  #imports: Json = {}
  /**
   * "scope" field
   * @private
   */
  #scopes: Json = {}
  /**
   *  Base url for relative resolve path
   * @private
   */
  readonly #baseUrl: string = ''

  readonly #prefix: string = ''

  constructor(args: GenerateImportMapsArgs) {
    const { baseUrlPath, prefix } = args

    this.#baseUrl = path.dirname(baseUrlPath)
    this.#prefix = prefix
  }

  /**
   * Get imports field
   * @see https://github.com/WICG/import-maps#specifier-remapping-examples
   */
  public get imports(): Json {
    return this.#imports
  }

  /**
   * Get scopes field
   * @see https://github.com/WICG/import-maps#scoping-examples
   */
  public get scopes(): Json {
    return this.#scopes
  }

  /**
   * Add module alias name with path
   * For example:
   * @example
   * importMap.addImport(packageNode);
   * @param node
   */
  public addImport(node: PackageNode): void {
    if (node.parent === undefined) return // is root

    if (IM.isHighLevelPackageDependency(node)) {
      this.#imports[node.name] = this.makeUnixPathToMainFile(node)
      return
    }

    const pathToParentPackageDir = this.makeUnixPathToParentDir(node.parent)

    const scopeNode = (this.#scopes[pathToParentPackageDir] || {}) as Json
    scopeNode[node.name] = this.makeUnixPathToMainFile(node)
    this.#scopes[pathToParentPackageDir] = scopeNode
  }

  public asPrettyStringify(): string {
    const obj = Object.create(null)
    obj['imports'] = this.imports
    obj['scopes'] = this.scopes
    return JSON.stringify(obj, null, '\t')
  }
  //-------------------------------------------------------------------------
  private static isHighLevelPackageDependency(node: PackageNode): boolean {
    if (node.parent === undefined) return false // is root
    return node.parent.parent === undefined
  }

  private makeUnixPathToParentDir(parent: PackageNode): string {
    const relToParentPackageDir = path.relative(
      this.#baseUrl,
      parent.pathToPackageJson
    )
    return (
      path
        .join(this.#prefix, path.dirname(relToParentPackageDir))
        .replaceAll('\\', '/') + '/'
    )
  }

  private makeUnixPathToMainFile(node: PackageNode): string {
    const pathToPackageDir = path.dirname(node.pathToPackageJson)
    const mainDir = node.main.split('/').slice(0, -1).join(path.sep)
    const relativePath = path.relative(
      this.#baseUrl,
      path.join(pathToPackageDir, mainDir)
    )

    return this.#prefix + relativePath.replaceAll('\\', '/') + '/'
  }
}

const IM = ImportMap
