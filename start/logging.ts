export class Logging {
    // Path: start/logging.ts
    public static warn(message: any) {
        console.warn("\x1b[33m%s\x1b[0m", "WARNING: " + message);
    }
    public static error(message: any) {
        console.error("\x1b[31m%s\x1b[0m","ERROR: " + message);
    }
    public static info(message: any) {
        console.info("\x1b[32m%s\x1b[0m","INFO: " + message);
    }
    public static log(message: string) {     
        console.log(message);
    }
}