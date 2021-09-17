import { Json } from './Json.js';
import { PackageNode } from './PackageNode.js';
import GenerateImportMapsArgs from './GenerateImportMapsArgs';
export default class ImportMap {
    #private;
    constructor(args: GenerateImportMapsArgs);
    static fromFile(path: string): ImportMap | undefined;
    /**
     * Get imports field
     * @see https://github.com/WICG/import-maps#specifier-remapping-examples
     */
    get imports(): Json;
    /**
     * Get scopes field
     * @see https://github.com/WICG/import-maps#scoping-examples
     */
    get scopes(): Json;
    /**
     * Add module alias name with path
     * For example:
     * @example
     * importMap.addImport(packageNode);
     * @param node
     */
    addImport(node: PackageNode): void;
    asPrettyStringify(): string;
    private static isHighLevelPackageDependency;
    private makeUnixPathToParentDir;
    private makeUnixPathToMainFile;
    private makeUnixPathToMainDir;
    private addImportItem;
    private addScopeItem;
    private static appendSlash;
}
