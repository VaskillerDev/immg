import {
  appendFileSync,
  closeSync,
} from 'fs'

export default class Print {
  /**
   * @param fileDescriptor
   * @param msg
   */
  static to(fileDescriptor: number, msg : string) : void {
    appendFileSync(fileDescriptor, msg);
  }

  /**
   * @param fileDescriptor
   */
  static close(fileDescriptor: number) {
    closeSync(fileDescriptor);
  }
  
}
