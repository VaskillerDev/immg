import {existsSync, readFileSync} from "fs";
import path, {dirname, join} from "path";
import {Json} from "./Json";

export class PackageNode {
    readonly #name : PackageName = "";
    readonly #version : PackageVersion = "";
    readonly #nodes : PackageNode[] = [];
    readonly #pathToPackageJson : string = "";
    readonly #main : PackageMain = "";
    readonly #parent : PackageNode | undefined;
    
    constructor(pathToPackageJson : string, parent ?: PackageNode) {
        this.#parent = parent;
        this.#pathToPackageJson = pathToPackageJson;
        
        const packageJsonContent = readFileSync(pathToPackageJson, { encoding: 'utf-8'});
        const packageJsonContentAsJson = JSON.parse(packageJsonContent) as Json;
        
        this.#name = PN.extractName(packageJsonContentAsJson);
        this.#version = PN.extractVersion(packageJsonContentAsJson);
        this.#main = PN.extractMain(packageJsonContentAsJson);
        this.#nodes = this.extractNodes(packageJsonContentAsJson);
    }
    
    public foreachNode(lambda: UsageLambda) : void {
        const info : PackageInfo = {
            name: this.#name,
            main: this.#main,
            version: this.#version,
            pathToPackageJson: this.#pathToPackageJson
        }
        lambda(info);
        for (const node of this.#nodes) node.foreachNode(lambda);
    }
    
    public get parent() : PackageNode | undefined {
        return this.#parent;
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
    
    private static extractMain(packageJsonContent : Json) : PackageMain {
        return (packageJsonContent['main'] || 'index.js') as PackageMain
    }
    
    private extractNodes(packageJsonContent : Json) : PackageNode[] {
        const packages = packageJsonContent['dependencies'] as Json;
        if (!packages) return [] // dependencies not found
        
        const nodes : PackageNode[] = []
        
        for (const packageName in packages) {
            if (!packages.hasOwnProperty(packageName)) continue;
            
            let packageJsonPath : string | null = this.genPackageJsonPath(packageName);
            packageJsonPath = this.findPackageJson(packageJsonPath);
            if (packageJsonPath === null) 
                continue;
            
            const node = new PackageNode(packageJsonPath, this);
            nodes.push(node);
        }
        
        return nodes;
    }
    
    private genPackageJsonPath( packageName : string) : string {
        const dirWithPackageJson = dirname(this.#pathToPackageJson);
        return join(dirWithPackageJson, 'node_modules', packageName, 'package.json');
    }
    
    private findPackageJson(pathToPackageJson : string) : string | null {
        if (existsSync(pathToPackageJson)) 
            return pathToPackageJson;
        
        let elems = pathToPackageJson.split(path.sep);
        const nmsIdx : number[] = [];
        for (let i = 0; i < elems.length; i++) 
            if (elems[i] === 'node_modules') nmsIdx.push(i)
        
        if (nmsIdx.length < 2) return null;
        
        const [startPos, endPos] = nmsIdx;
        const rmElemsCount = endPos - startPos;
        elems.splice(startPos, rmElemsCount);
        pathToPackageJson = elems.join(path.sep);
        
        return this.findPackageJson(pathToPackageJson);
    }
}

const PN = PackageNode;
type PackageName = string;
type PackageVersion = string;
type PackageMain = string;

export type PackageInfo = {
    name: PackageName,
    version: PackageVersion,
    main : PackageMain,
    pathToPackageJson : string
}

export type UsageLambda = (info: PackageInfo) => void;