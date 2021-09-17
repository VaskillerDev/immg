import tryCreateImportMapFile from './tryCreateImportMapFile.js';
import Print from '../types/Print.js';
import { openSync } from 'fs';
export default function printImportMap(args, importMap) {
    try {
        const pathToImportMapFile = tryCreateImportMapFile(args);
        const fd = openSync(pathToImportMapFile, 'a+'); // file descriptor
        const prettyJson = importMap.asPrettyStringify();
        Print.to(fd, prettyJson);
        Print.close(fd);
    }
    catch (e) {
        console.error(e);
    }
}
//# sourceMappingURL=printImportMap.js.map