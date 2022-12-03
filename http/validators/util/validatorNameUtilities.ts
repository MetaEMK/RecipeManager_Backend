import val from "validator";
import { GeneralValidationErrorCodes } from "../../../enums/GeneralValidationErrors.enum.js";
import { Validator } from "../MainValidator.js";
import { ValidationError } from "../validationError.js";


const alphanumericWithSpaceRegex = /^[a-zA-Z0-9 ]+$/;
const alphaWithSpaceRegex = /^[a-zA-Z ]+$/;

export class ValidatorNameUtilities extends Validator
{
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

        if(alphaWithSpaceRegex.test(nameString) == false)
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

        if(alphanumericWithSpaceRegex.test(nameString) == false)
        {
            let error = new ValidationError(GeneralValidationErrorCodes.NAME_INVALID);
            this.logError(validator, error.toString(), nameString);
            this.errors.push(error);
            return false;
        }
        
        return true;
    }
        
}