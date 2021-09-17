import ImportMap from '../types/ImportMap.js';
import { PackageNode } from '../types/PackageNode.js';
/**
 *  Generate import map for dependencies
 *  See: {@link https://github.com/WICG/import-maps Import maps}
 * @param args
 */
export default function generateImportMap(args) {
    try {
        const entryNode = new PackageNode(args.baseUrlPath);
        const importMap = new ImportMap(args);
        entryNode.foreachNode(node => importMap.addImport(node));
        return importMap;
    }
    catch (e) {
        console.error(e);
    }
}
//# sourceMappingURL=generateImportMap.js.map