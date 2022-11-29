import { createLogger } from "./logger.js";
import { LOG_ENDPOINT } from "./logger-enum.js";

class test {
    public static async main(): Promise<void> {
        let logger = await createLogger();

        await logger.info("Hello World!", LOG_ENDPOINT.LOGGER);
         console.log("Hello World!");
    }
}
test.main();
