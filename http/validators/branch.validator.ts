import validator from "validator";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";
import { ValidationError } from "./validationError.js";

const logger = createLogger();

export class BranchValidator
{
    private errors: ValidationError[] = [];

    public getErrors(): ValidationError[]
    { 
        return this.errors; 
    }

    private logError(message: string, obj: string): void
    {
        logger.info("BranchValidator: Validation failed: " + message + ":\t\'" + obj + "\'", LOG_ENDPOINT.MAIN);
    }

    private logSuccess(message: string, obj: string): void
    {
        logger.debug("BranchValidator: Validation succeeded: " + message + ":\t\'" + obj + "\'", LOG_ENDPOINT.MAIN);
    }

    public isValidBranchName(name?: any): boolean
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

        this.logSuccess("Branch name is valid", nameString);
        return true;
    }

}

export function checkBranchValidator(displayError: boolean)
{
    console.log("Checking Branch Validator");
    let val = new BranchValidator();

    if(val.isValidBranchName() == true) return false;
    if(val.isValidBranchName("1") == true) return false;
    if(val.isValidBranchName("") == true) return false;
    if(val.isValidBranchName("Test123") == true) return false;
    if(val.isValidBranchName("Test") == false) return false;
    if(val.isValidBranchName({name: "name", test: "test"}) == true) return false;

    let err = val.getErrors();
    if(displayError) err.forEach(e => console.log(e.toString()));

    console.log("BranchValidator passed");

    return true;
}