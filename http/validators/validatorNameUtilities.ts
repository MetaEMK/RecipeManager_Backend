import val from "validator";
import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger";
import { ValidationError } from "./validationError";

const logger = createLogger();

export class ValidatorNameUtilities
{
    private errors: ValidationError[] = [];
    
    public getErrors(): ValidationError[] 
    { 
        return this.errors; 
    }

    private logError(validator: string, message: string, obj?: string): void
    {
        logger.info(validator + ": Validation failed: " + message + ":\t\'" + obj + "\'", LOG_ENDPOINT.MAIN);
    }

    public isValidName(validator: string, name?: any, min_max?: object): boolean
    {
        if(!name)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.NAME_MISSING);
            this.logError(validator, err.toString());
            this.errors.push(err);
            return false;
        }

        if(! (typeof name === "string"))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.NAME_INVALID);
            this.logError(validator, err.toString(), name);
            this.errors.push(err);
            return false;
        }
        let nameString = name as string;

        if(min_max) if(!val.isLength(nameString, min_max))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.NAME_INVALID_LENGTH);
            this.logError(validator, err.toString(), nameString);
            this.errors.push(err);
            return false;
        }
        return true;
    }

    public isValidAlpha(validator: string, text?: any, min_max?: object): boolean
    {
        if(!this.isValidName(validator, text, min_max)) return false;
        let nameString = text as string;

        if(!val.isAlpha(nameString))
        {
            let error = new ValidationError(GeneralValidationErrorCodes.NAME_INVALID);
            this.logError(validator, error.toString(), nameString);
            this.errors.push(error);
            return false;
        }
        return true;
    }
    public isValidAlphanummeric(validator: string, text?: any, min_max?: object): boolean
    {
        if(!this.isValidName(validator, text, min_max)) return false;
        let nameString = text as string;

        if(!val.isAlphanumeric(nameString))
        {
            let error = new ValidationError(GeneralValidationErrorCodes.NAME_INVALID);
            this.logError(validator, error.toString(), nameString);
            this.errors.push(error);
            return false;
        }
        
        return true;
    }
        
}