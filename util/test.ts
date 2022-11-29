import { createLogger } from "./logger.js";

class test {
    public static async main(): Promise<void> {
        let logger = await createLogger();
         await logger.info("Hello World!");
         await logger.info("Hello World!");
         await logger.info("Hello World!");
         await logger.info("Hello World!");
         await logger.info("Hello World!");
         await logger.info("Hello World!");
         await logger.info("Hello World!");
         await logger.info("Hello World!");
         await logger.info("Hello World!");
         await logger.info("Hello World!");
         await logger.error("Hello World!");
         console.log("Hello World!");
    }
}
test.main();
