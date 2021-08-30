import {existsSync, readFileSync} from "fs";
import {Json} from "./Json";
import path, {dirname, join} from "path";

export class PackageNode {
    readonly #name : PackageName = "";
    readonly #version : PackageVersion = "";
    readonly #nodes : PackageNode[] = [];
    readonly #pathToPackageJson : string = "";
    
    constructor(pathToPackageJson : string) {

        pathToPackageJson = this.findPackageJson(pathToPackageJson);
        this.#pathToPackageJson = pathToPackageJson;
        
        const packageJsonContent = readFileSync(pathToPackageJson, { encoding: 'utf-8'});
        const packageJsonContentAsJson = JSON.parse(packageJsonContent) as Json;

        this.#name = PN.extractName(packageJsonContentAsJson);
        this.#version = PN.extractVersion(packageJsonContentAsJson);
        this.#nodes = this.extractNodes(packageJsonContentAsJson);
    }
    
    public get children() : PackageNode[]{
        return this.#nodes;
    }
    
    public get name() : PackageName {
        return this.#name;
    }
    
    public get version() : PackageVersion {
        return this.#version;
    }
    
    private static extractName(packageJsonContent : Json) : PackageName {
        return packageJsonContent['name'] as PackageName;
    }
    
    private static extractVersion(packageJsonContent : Json) : PackageVersion {
        return packageJsonContent['version'] as PackageVersion;
    }
    
    private extractNodes(packageJsonContent : Json) : PackageNode[] {
        const packages = packageJsonContent['dependencies'] as Json;
        if (!packages) return [] // dependencies not found
        
        const nodes : PackageNode[] = []
        
        for (const packageName in packages) {
            if (PN.isInclude(packageName, JestList)) continue;
            if (!packages.hasOwnProperty(packageName)) continue;
            const packageJsonPath = this.genPackageJsonPath(packageName);
            const node = new PackageNode(packageJsonPath);
            nodes.push(node);
        }
        
        return nodes;
    }
    
    private static isInclude(value: string, list : string[]) : boolean {
        return list.includes(value);
    }
    
    private genPackageJsonPath( packageName : string) : string {
        const dirWithPackageJson = dirname(this.#pathToPackageJson);
        return join(dirWithPackageJson, 'node_modules', packageName, 'package.json');
    }
    
    private findPackageJson(pathToPackageJson : string) : string {
        if (existsSync(pathToPackageJson)) 
            return pathToPackageJson;
        
        let elems = pathToPackageJson.split(path.sep);
        const nmsIdx : number[] = [];
        elems.forEach((elem, i) =>  { if (elem === 'node_modules') nmsIdx.push(i) })
        const startPos = nmsIdx[0];
        const rmElemsCount = nmsIdx[1] - nmsIdx[0];
        elems.splice(startPos, rmElemsCount);
        pathToPackageJson = elems.join(path.sep);
        
        return this.findPackageJson(pathToPackageJson);
    }
}

const PN = PackageNode;
type PackageName = string;
type PackageVersion = string;

// for unknown reasons, jest breaks the recursion
// and provoke call stack exceptions
const JestList : string[] = [
    "jest",
    "@types/jest",
    "ts-jest"
];