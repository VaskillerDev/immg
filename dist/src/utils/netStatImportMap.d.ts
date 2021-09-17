import ImportMap from '../types/ImportMap.js';
import NetStatArgs from '../types/NetStatArgs.js';
/**
 *  URL access checker. Send to module url request and expect code 200
 */
export default function (args: NetStatArgs, importMap: ImportMap): Promise<void>;
