import validator from "validator";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";
import { ValidationError } from "./validationError.js"

const logger = createLogger();
export class IngredientValidator
{
    private errors: ValidationError[] = [];

    public getErrors(): ValidationError[]
    { 
        return this.errors; 
    }

    private logError(message: string, obj?: string): void
    {
        obj = obj ? obj : "";
        logger.info("IngredientValidator: Validation failed: " + message + ":\t\'" + obj + "\'", LOG_ENDPOINT.MAIN);
    }

    private logSuccess(message: string, obj?: string): void
    {
        obj = obj ? obj : "";
        logger.debug("IngredientValidator: Validation succeeded: " + message + ":\t\'" + obj + "\'", LOG_ENDPOINT.MAIN);
    }


    public isValidIngredientName(name?: any): boolean
    {
        if(!name)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.NAME_MISSING);
            this.logError(err.toString(), name);
            this.errors.push(err);
            return false;
        }

        if(! (typeof name === "string"))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.NAME_INVALID);
            this.logError(err.toString(), name);
            this.errors.push(err);
            return false;
        }
        let nameString = name as string;

        if(!validator.isLength(nameString, {min: 1, max: 100}))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.NAME_INVALID_LENGTH);
            this.logError(err.toString(), nameString);
            this.errors.push(err);
            return false;
        }

        if(!validator.isAlpha(nameString))
        {
            let error = new ValidationError(GeneralValidationErrorCodes.NAME_INVALID);
            this.logError(error.toString(), nameString);
            this.errors.push(error);
            return false;
        }

        this.logSuccess("Ingredient is valid", nameString);
        return true;
    }
}