import axios from 'axios';
/**
 *  URL access checker. Send to module url request and expect code 200
 */
export default async function (args, importMap) {
    const { protocol, hostname, port, pathname } = args;
    const baseUrl = `${protocol}//${hostname}:${port}${pathname}`;
    const imports = importMap.imports;
    const scopes = importMap.scopes;
    for (let lib in imports) {
        let relPathToLib = imports[lib];
        relPathToLib = relPathToLib.substring(1);
        const url = `${baseUrl}${relPathToLib}`;
        await checkStatus(url);
    }
    for (let scopePath in scopes) {
        let libs = scopes[scopePath];
        for (let lib in libs) {
            let relPathToLib = libs[lib];
            relPathToLib = relPathToLib.substring(1);
            const url = `${baseUrl}${relPathToLib}`;
            await checkStatus(url, {
                scopePath,
                lib,
            });
        }
    }
}
/**
 * Check status code for url
 * @param url
 * @param payload
 * @param expectStatusCode
 */
async function checkStatus(url, payload = {}, expectStatusCode = 200) {
    const lastChar = url.charAt(url.length - 1);
    const isDir = lastChar === '/';
    if (isDir)
        return;
    try {
        const res = await axios.get(url, { method: 'GET' });
        if (res.status !== expectStatusCode) {
            console.warn(`[netStat] unable code: in  ${url} return ${res.status} expect ${expectStatusCode}`);
            console.warn('[netStat] payload: ', payload);
        }
    }
    catch (e) {
        console.error(`[netStat] ${url} error : ${e}`);
    }
}
//# sourceMappingURL=netStatImportMap.js.map