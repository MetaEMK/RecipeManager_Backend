import validator from "validator";
import { Size } from "../../data/entities/size.entity";
import { GeneralValidationErrorCodes } from "./GeneralValidationErrors.js";
import { ValidationError } from "./validationError.js";
export class SizeValidator
{
    private errors: ValidationError[] = [];

    public getErrors(): ValidationError[] 
    { 
        return this.errors; 
    }
    constructor() { }
    
    public isValidSizeName(name?: any): boolean
    {
        if(!name) 
        {
            this.errors.push(new ValidationError(GeneralValidationErrorCodes.NAME_MISSING));
            return false;
        }

        if(! (typeof name === "string"))
        {
            this.errors.push(new ValidationError(GeneralValidationErrorCodes.NAME_INVALID, "The name must be a alphanumeric string"));
            return false;
        }
        let nameString = name as string;
        if(!validator.isLength(nameString, {min: 1, max: 100}))
        {
            this.errors.push(new ValidationError(GeneralValidationErrorCodes.NAME_INVALID_LENGTH, "The name must be between 1 and 100 characters"));
            return false;
        }

        if(!validator.isAlphanumeric(nameString))
        {
            this.errors.push(new ValidationError(GeneralValidationErrorCodes.NAME_INVALID, "The name must be a alphanumeric string"));
            return false;
        }
        return true;
    }

    public isValidConversionTypeId(id?: any): boolean
    {
        if(!id)
        {
            this.errors.push(new ValidationError(GeneralValidationErrorCodes.CONVERSION_TYPE_ID_MISSING));
            return false;
        }

        if(! (typeof id === "number"))
        {
            this.errors.push(new ValidationError(GeneralValidationErrorCodes.CONVERSION_TYPE_ID_INVALID, "The conversion type ID must be a number"));
            return false;
        }

        let idNumber = id as number;

        if(idNumber < 0) 
        {
            this.errors.push(new ValidationError(GeneralValidationErrorCodes.CONVERSION_TYPE_ID_INVALID, "The conversion type ID greater than or equal to 0"));
            return false;
        }
        
        return true;
    }
}
export function checkSizeValidator(displayError: boolean)
{
    console.log("Checking SizeValidator");
    let val = new SizeValidator();

    if(val.isValidSizeName("1") == false) return false;
    if(val.isValidSizeName() == true) return false;
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