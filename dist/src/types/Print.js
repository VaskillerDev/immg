import { appendFileSync, closeSync } from 'fs';
export default class Print {
    /**
     * @param fileDescriptor
     * @param msg
     */
    static to(fileDescriptor, msg) {
        appendFileSync(fileDescriptor, msg);
    }
    /**
     * @param fileDescriptor
     */
    static close(fileDescriptor) {
        closeSync(fileDescriptor);
    }
}
//# sourceMappingURL=Print.js.map