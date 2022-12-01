import validator from "validator";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { GeneralValidationErrorCodes } from "./GeneralValidationErrors.js";
import { ValidationError } from "./validationError.js";

const logger = createLogger()
export class SizeValidator
{
    private errors: ValidationError[] = [];

    public getErrors(): ValidationError[] 
    { 
        return this.errors; 
    }
    
    private logError(message: string, obj: string): void
    {
        logger.info("SizeValidator: Validation failed: " + message + ":\t\'" + obj + "\'", LOG_ENDPOINT.MAIN);
    }

    private logSuccess(message: string, obj: string): void
    {
        logger.debug("SizeValidator: Validation succeeded: " + message + ":\t\'" + obj + "\'", LOG_ENDPOINT.MAIN);
    }

    public isValidSizeName(name?: any): boolean
    {
        if(!name) 
        {
            this.logError("Size name is missing", name);
            this.errors.push(new ValidationError(GeneralValidationErrorCodes.NAME_MISSING));
            return false;
        }

        if(! (typeof name === "string"))
        {
            this.logError("Size name is no string", name);
            this.errors.push(new ValidationError(GeneralValidationErrorCodes.NAME_INVALID, "The name must be a alphanumeric string"));
            return false;
        }
        let nameString = name as string;
        if(!validator.isLength(nameString, {min: 1, max: 100}))
        {
            this.logError("Size name is invalid length", nameString);
            this.errors.push(new ValidationError(GeneralValidationErrorCodes.NAME_INVALID_LENGTH, "The name must be between 1 and 100 characters"));
            return false;
        }

        if(!validator.isAlphanumeric(nameString))
        {
            this.logError("Size name is not alphanumeric", nameString);
            this.errors.push(new ValidationError(GeneralValidationErrorCodes.NAME_INVALID, "The name must be a alphanumeric string"));
            return false;
        }

        this.logSuccess("Size name is valid", nameString);
        return true;
    }

    public isValidConversionTypeId(id?: any): boolean
    {
        if(!id)
        {
            this.logError("Conversion Type ID is missing", id);
            this.errors.push(new ValidationError(GeneralValidationErrorCodes.CONVERSION_TYPE_ID_MISSING));
            return false;
        }

        if(! (typeof id === "number"))
        {
            this.logError("Conversion Type ID is no number", id);
            this.errors.push(new ValidationError(GeneralValidationErrorCodes.CONVERSION_TYPE_ID_INVALID, "The conversion type ID must be a number"));
            return false;
        }

        let idNumber = id as number;

        if(idNumber < 0) 
        {
            this.logError("Conversion Type ID is negative", idNumber.toString());
            this.errors.push(new ValidationError(GeneralValidationErrorCodes.CONVERSION_TYPE_ID_INVALID, "The conversion type ID greater than or equal to 0"));
            return false;
        }
        
        this.logSuccess("Conversion Type ID is valid", idNumber.toString());
        return true;
    }
}

export function checkSizeValidator(displayError: boolean)
{
    console.log("Checking SizeValidator");
    let val = new SizeValidator();

    if(val.isValidSizeName() == true) return false;
    if(val.isValidSizeName("1") == false) return false;
    if(val.isValidSizeName("") == true) return false;
    if(val.isValidSizeName({name: "name", test: "test"}) == true) return false;

    if(val.isValidConversionTypeId() == true) return false;
    if(val.isValidConversionTypeId("1") == true) return false;
    if(val.isValidConversionTypeId(-1) == true) return false;
    if(val.isValidConversionTypeId(1) == false) return false;

    let err = val.getErrors();
    if(displayError) err.forEach(e => console.log(e.toString()));

    console.log("SizeValidator passed");

    return true;
}