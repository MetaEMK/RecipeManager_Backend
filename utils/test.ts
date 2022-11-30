import { createLoggerAsync, LOG_ENDPOINT } from "./logger.js";

console.log("Hello world!");

const logger = createLoggerAsync();

logger.info("Hello world!", LOG_ENDPOINT.LOGGER);
