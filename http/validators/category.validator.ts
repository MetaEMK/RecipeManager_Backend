import validator from "validator";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { GeneralValidationErrorCodes } from "./GeneralValidationErrors.js";
import { ValidationError } from "./validationError.js";

const logger = createLogger()
export class CategoryValidator
{
    private errors: ValidationError[] = [];

    public getErrors(): ValidationError[] 
    { 
        return this.errors; 
    }
    
    private logError(message: string, obj: string): void
    {
        logger.info("CategoryValidator: Validation failed: " + message + ":\t\'" + obj + "\'", LOG_ENDPOINT.MAIN);
    }

    private logSuccess(message: string, obj: string): void
    {
        logger.debug("CategoryValidator: Validation succeeded: " + message + ":\t\'" + obj + "\'", LOG_ENDPOINT.MAIN);
    }

    public isValidCategoryName(name?: any): boolean
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

        this.logSuccess("Category name is valid", nameString);
        return true;
    }
}

export function checkCategoryalidator(displayError: boolean)
{
    console.log("Checking CategoryValidator");
    let val = new CategoryValidator();

    if(val.isValidCategoryName() == true) return false;
    if(val.isValidCategoryName("1") == true) return false;
    if(val.isValidCategoryName("") == true) return false;
    if(val.isValidCategoryName("Test123") == true) return false;
    if(val.isValidCategoryName("Test") == false) return false;
    if(val.isValidCategoryName({name: "name", test: "test"}) == true) return false;

    let err = val.getErrors();
    if(displayError) err.forEach(e => console.log(e.toString()));

    console.log("CategoryValidator passed");

    return true;
}