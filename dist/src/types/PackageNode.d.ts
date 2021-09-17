export declare class PackageNode {
    #private;
    constructor(pathToPackageJson: string, parent?: PackageNode);
    /**
     * Iterate all nodes
     * @param {{UsageLambda}} lambda
     */
    foreachNode(lambda: UsageLambda): void;
    /**
     * Get parent package
     * if return undefined - is root package
     */
    get parent(): PackageNode | undefined;
    /**
     * Get other packages
     */
    get children(): PackageNode[];
    /**
     * Get package name
     */
    get name(): PackageName;
    /**
     * Get package version
     */
    get version(): PackageVersion;
    /**
     * Get path to package.json
     */
    get pathToPackageJson(): string;
    /**
     * Get main entry point for package
     */
    get main(): PackageMain;
    private static extractName;
    private static extractVersion;
    private static extractMain;
    private extractNodes;
    private genPackageJsonPath;
    /**
     * @param pathToPackageJson
     * @private
     */
    private findPackageJson;
}
export declare type PackageName = string;
export declare type PackageVersion = string;
export declare type PackageMain = string;
export declare type PackageInfo = {
    name: PackageName;
    version: PackageVersion;
    main: PackageMain;
    pathToPackageJson: string;
};
export declare type UsageLambda = (node: PackageNode) => void;
