import { createLogger } from "./logger.js";
import { LOG_ENDPOINT } from "./logger_enum.js";

class test {
    public static async main(): Promise<void> {
        let logger = await createLogger();

        await logger.debug("Hello World!", LOG_ENDPOINT.LOGGER);
        await logger.info("Hello World!", LOG_ENDPOINT.LOGGER);
        await logger.warn("Hello World!", LOG_ENDPOINT.LOGGER);
        await logger.error("Hello World!", LOG_ENDPOINT.LOGGER);
         console.log("Hello World!");
    }
}
test.main();
