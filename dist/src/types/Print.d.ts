export default class Print {
    /**
     * @param fileDescriptor
     * @param msg
     */
    static to(fileDescriptor: number, msg: string): void;
    /**
     * @param fileDescriptor
     */
    static close(fileDescriptor: number): void;
}
