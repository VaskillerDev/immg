import { existsSync, readFileSync } from 'fs';
import path, { dirname, join } from 'path';
export class PackageNode {
    #name = '';
    #version = '';
    #nodes = [];
    #pathToPackageJson = '';
    #main = '';
    #parent;
    constructor(pathToPackageJson, parent) {
        this.#parent = parent;
        this.#pathToPackageJson = pathToPackageJson;
        const packageJsonContent = readFileSync(pathToPackageJson, {
            encoding: 'utf-8',
        });
        const packageJsonContentAsJson = JSON.parse(packageJsonContent);
        this.#name = PN.extractName(packageJsonContentAsJson);
        this.#version = PN.extractVersion(packageJsonContentAsJson);
        this.#main = PN.extractMain(packageJsonContentAsJson);
        this.#nodes = this.extractNodes(packageJsonContentAsJson);
    }
    /**
     * Iterate all nodes
     * @param {{UsageLambda}} lambda
     */
    foreachNode(lambda) {
        lambda(this);
        for (const node of this.#nodes)
            node.foreachNode(lambda);
    }
    /**
     * Get parent package
     * if return undefined - is root package
     */
    get parent() {
        return this.#parent;
    }
    /**
     * Get other packages
     */
    get children() {
        return this.#nodes;
    }
    /**
     * Get package name
     */
    get name() {
        return this.#name;
    }
    /**
     * Get package version
     */
    get version() {
        return this.#version;
    }
    /**
     * Get path to package.json
     */
    get pathToPackageJson() {
        return this.#pathToPackageJson;
    }
    /**
     * Get main entry point for package
     */
    get main() {
        return this.#main;
    }
    //-----------------------------------------------------------------------------
    static extractName(packageJsonContent) {
        return packageJsonContent['name'];
    }
    static extractVersion(packageJsonContent) {
        return packageJsonContent['version'];
    }
    static extractMain(packageJsonContent) {
        return (packageJsonContent['main'] || 'index.js');
    }
    extractNodes(packageJsonContent) {
        const packages = packageJsonContent['dependencies'];
        if (!packages)
            return []; // dependencies not found
        const nodes = [];
        for (const packageName in packages) {
            if (!packages.hasOwnProperty(packageName))
                continue;
            if (packageName.includes('@types'))
                continue;
            let packageJsonPath = this.genPackageJsonPath(packageName);
            packageJsonPath = this.findPackageJson(packageJsonPath);
            if (packageJsonPath === null)
                continue;
            const node = new PackageNode(packageJsonPath, this);
            nodes.push(node);
        }
        return nodes;
    }
    genPackageJsonPath(packageName) {
        const dirWithPackageJson = dirname(this.#pathToPackageJson);
        return join(dirWithPackageJson, 'node_modules', packageName, 'package.json');
    }
    /**
     * @param pathToPackageJson
     * @private
     */
    findPackageJson(pathToPackageJson) {
        if (existsSync(pathToPackageJson))
            return pathToPackageJson;
        let elems = pathToPackageJson.split(path.sep);
        const nmsIdx = [];
        for (let i = 0; i < elems.length; i++)
            if (elems[i] === 'node_modules')
                nmsIdx.push(i);
        const startPos = nmsIdx[nmsIdx.length - 2];
        const endPos = nmsIdx[nmsIdx.length - 1];
        const rmElemsCount = endPos - startPos;
        elems.splice(startPos, rmElemsCount);
        pathToPackageJson = elems.join(path.sep);
        return this.findPackageJson(pathToPackageJson);
    }
}
const PN = PackageNode;
//# sourceMappingURL=PackageNode.js.map