import {appendFileSync} from "fs";

export default class Print {
    static openImports(fileDescriptor: number) : void {
        appendFileSync(fileDescriptor,`{\n`)
        appendFileSync(fileDescriptor,`"imports": {\n`)
    }

    static closeImports(fileDescriptor: number) : void {
        appendFileSync(fileDescriptor,`}\n`)
        appendFileSync(fileDescriptor,`}`)
    }
}