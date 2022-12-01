import { createLogger, LOG_ENDPOINT } from "../../utils/logger";
import { ValidationError } from "./validationError";

const logger = createLogger();
export abstract class Validator
{
    protected errors: ValidationError[] = [];

    public getErrors(): ValidationError[]
    { 
        return this.errors; 
    }
}

export abstract class ValidatorUtilities extends Validator
{
    protected logError(validator: string, message: string, obj?: string): void
    {
        logger.info(validator + ": Validation failed: " + message + ":\t\'" + obj + "\'", LOG_ENDPOINT.MAIN);
    }
}