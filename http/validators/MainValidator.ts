import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { ValidationError } from "./validationError.js";

const logger = createLogger();
export abstract class Validator
{
    protected errors: ValidationError[] = [];

    public getErrors(): ValidationError[]
    { 
        return this.errors; 
    }

    protected logError(validator: string, message: string, obj?: string): void
    {
        logger.info(validator + ": Validation failed: " + message + ":\t\'" + obj + "\'", LOG_ENDPOINT.MAIN);
    }

    protected logSuccess(message: string, obj: string): void
    {
        logger.debug("CategoryValidator: Validation succeeded: " + message + ":\t\'" + obj + "\'", LOG_ENDPOINT.MAIN);
    }  
}