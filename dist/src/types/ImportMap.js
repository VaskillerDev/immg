import path from 'path';
import * as fs from 'fs';
export default class ImportMap {
    /**
     * "imports" field
     * @private
     */
    #imports = {};
    /**
     * "scope" field
     * @private
     */
    #scopes = {};
    /**
     *  Base url for relative resolve path
     * @private
     */
    #baseUrl = '';
    #prefix = '';
    constructor(args) {
        const { baseUrlPath, prefix } = args;
        this.#baseUrl = path.dirname(baseUrlPath);
        this.#prefix = prefix;
    }
    static fromFile(path) {
        try {
            const packageImportmapJsonAsString = fs
                .readFileSync(path)
                .toString('utf-8');
            const packageImportmapJson = JSON.parse(packageImportmapJsonAsString);
            const importMap = new ImportMap({
                baseUrlPath: '',
                prefix: '',
                forceMode: false,
            });
            importMap.#imports = packageImportmapJson['imports'];
            importMap.#scopes = packageImportmapJson['scopes'];
            return importMap;
        }
        catch (e) {
            console.error(e);
        }
    }
    /**
     * Get imports field
     * @see https://github.com/WICG/import-maps#specifier-remapping-examples
     */
    get imports() {
        return this.#imports;
    }
    /**
     * Get scopes field
     * @see https://github.com/WICG/import-maps#scoping-examples
     */
    get scopes() {
        return this.#scopes;
    }
    /**
     * Add module alias name with path
     * For example:
     * @example
     * importMap.addImport(packageNode);
     * @param node
     */
    addImport(node) {
        this.addImportItem(node);
        {
            // add scope key by filesystem parent
            const pathToParentPackageDir = this.makeUnixPathToParentDir(node);
            this.addScopeItem(pathToParentPackageDir, node);
        }
        {
            // add scope from current node and his children
            const pathToMainDir = this.makeUnixPathToMainDir(node).substring(2); // remove './' from path
            const scopeNode = this.addScopeItem(pathToMainDir, node);
            for (const child of node.children) {
                scopeNode[node.name] = this.makeUnixPathToMainFile(child);
                scopeNode[IM.appendSlash(node.name)] = this.makeUnixPathToMainDir(child);
            }
            this.#scopes[pathToMainDir] = scopeNode;
        }
    }
    asPrettyStringify() {
        const obj = Object.create(null);
        obj['imports'] = this.imports;
        obj['scopes'] = this.scopes;
        return JSON.stringify(obj, null, '\t');
    }
    //-------------------------------------------------------------------------
    static isHighLevelPackageDependency(node) {
        if (node.parent === undefined)
            return false; // is root
        return node.parent.parent === undefined;
    }
    // In the previous version, we accessed the wrong parent,
    // because the actual parent may differ from what is formed in the file system,
    // so some paths may be uncorrected.
    makeUnixPathToParentDir(node) {
        const indexLastNodeModulesPoint = node.pathToPackageJson.lastIndexOf('node_modules');
        // parent from filesystem, not by package.json
        const pathToFsParent = node.pathToPackageJson.substring(indexLastNodeModulesPoint, -1);
        const relToParentPackageDir = path.relative(this.#baseUrl, pathToFsParent);
        let res = path.join(this.#prefix, relToParentPackageDir);
        res = res.replaceAll('\\', '/');
        res = IM.appendSlash(res);
        return res;
    }
    // TODO: remove later
    /*  private makeUnixPathToParentDirOld(parent: PackageNode): string {
      const relToParentPackageDir = path.relative(
        this.#baseUrl,
        parent.pathToPackageJson
      )
      return (
        path
          .join(this.#prefix, path.dirname(relToParentPackageDir))
          .replaceAll('\\', '/') + '/'
      )
    }*/
    makeUnixPathToMainFile(node) {
        const pathToPackageDir = path.dirname(node.pathToPackageJson);
        const relativePath = path.relative(this.#baseUrl, path.join(pathToPackageDir, node.main));
        return this.#prefix + relativePath.replaceAll('\\', '/');
    }
    makeUnixPathToMainDir(node) {
        const pathToPackageDir = path.dirname(node.pathToPackageJson);
        const relativePath = path.relative(this.#baseUrl, pathToPackageDir);
        return IM.appendSlash(this.#prefix + relativePath.replaceAll('\\', '/'));
    }
    addImportItem(node) {
        const isRoot = node.parent === undefined;
        const isCanAddToImports = isRoot || IM.isHighLevelPackageDependency(node);
        if (!isCanAddToImports)
            return;
        this.#imports[node.name] = this.makeUnixPathToMainFile(node);
        this.#imports[IM.appendSlash(node.name)] = this.makeUnixPathToMainDir(node);
    }
    addScopeItem(scopePath, node) {
        const scopeNode = (this.#scopes[scopePath] || {});
        scopeNode[node.name] = this.makeUnixPathToMainFile(node);
        scopeNode[IM.appendSlash(node.name)] = this.makeUnixPathToMainDir(node);
        this.#scopes[scopePath] = scopeNode;
        return scopeNode;
    }
    static appendSlash(val) {
        const hasSlash = val.charAt(val.length - 1) === '/';
        return hasSlash ? val : val + '/';
    }
}
const IM = ImportMap;
//# sourceMappingURL=ImportMap.js.map