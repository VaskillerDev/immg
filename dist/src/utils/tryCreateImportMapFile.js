import { dirname, join } from 'path';
import { existsSync, writeFileSync } from 'fs';
/**
 * @param args
 * @return {PathLike | String} pathToImportMapFile
 */
export default function tryCreateImportMapFile(args) {
    const { baseUrlPath, forceMode } = args;
    const baseDir = dirname(baseUrlPath);
    const pathToImportMapFile = join(baseDir, 'package.importmap.json');
    if (existsSync(pathToImportMapFile) && !forceMode)
        throw Error(`File already exist: ${pathToImportMapFile}`);
    writeFileSync(pathToImportMapFile, '');
    return pathToImportMapFile;
}
//# sourceMappingURL=tryCreateImportMapFile.js.map