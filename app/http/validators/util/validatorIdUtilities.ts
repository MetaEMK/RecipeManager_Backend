import { GeneralValidationErrorCodes } from "../../../enums/GeneralValidationErrors.enum.js";
import { Validator } from "../MainValidator.js";
import { ValidationError } from "../validationError.js";

export class ValidatorIdUtilities extends Validator
{
    isValidId(validator: string, id?: any): boolean
    {
        if(!id)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.ID_MISSING);
            this.logError(validator, err.toString());
            this.errors.push(err);
            return false;
        }

        if(! (typeof id === "number"))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.ID_INVALID);
            this.logError(validator, err.toString(), id);
            this.errors.push(err);
            return false;
        }
        let idNumber = id as number;

        if(idNumber < 0)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.ID_INVALID);
            this.logError(validator, err.toString(), idNumber.toString());
            this.errors.push(err);
            return false;
        }

        return true;
    }

    convertToNumber(validator: string, number: any): number|null
    {
        if(! (typeof number === "number"))
        {
            this.logError(validator, "Could not parse " + number + "to type number");
            return null;
        }
        return number as number;
    }
}