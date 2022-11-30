import { createLogger, LOG_ENDPOINT } from "./logger.js";

console.log("Hello world!");

const logger = createLogger();

logger.debug("DebugLog on Logger Endpoint", LOG_ENDPOINT.LOGGER);
logger.info("InfoLog on Logger Endpoint", LOG_ENDPOINT.LOGGER);
logger.warn("WarnLog on Logger Endpoint", LOG_ENDPOINT.LOGGER);
logger.error("ErrorLog on Logger Endpoint", LOG_ENDPOINT.LOGGER);

logger.debug("DebugLog on Database Endpoint", LOG_ENDPOINT.DATABASE);
logger.info("InfoLog on Database Endpoint", LOG_ENDPOINT.DATABASE);
logger.warn("WarnLog on Database Endpoint", LOG_ENDPOINT.DATABASE);
logger.error("ErrorLog on Database Endpoint", LOG_ENDPOINT.DATABASE);

logger.debug("DebugLog on filesystem Endpoint", LOG_ENDPOINT.FILE_SYSTEM);
logger.info("InfoLog on filesystem Endpoint", LOG_ENDPOINT.FILE_SYSTEM);
logger.warn("WarnLog on filesystem Endpoint", LOG_ENDPOINT.FILE_SYSTEM);
logger.error("ErrorLog on filesystem Endpoint", LOG_ENDPOINT.FILE_SYSTEM);

logger.debug("DebugLog on Main Endpoint", LOG_ENDPOINT.MAIN);
logger.info("InfoLog on Main Endpoint", LOG_ENDPOINT.MAIN);
logger.warn("WarnLog on Main Endpoint", LOG_ENDPOINT.MAIN);
logger.error("ErrorLog on Main Endpoint", LOG_ENDPOINT.MAIN);