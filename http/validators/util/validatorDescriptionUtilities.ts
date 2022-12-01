import val from "validator";
import { GeneralValidationErrorCodes } from "../../../enums/GeneralValidationErrors.enum";
import { Validator } from "../MainValidator";
import { ValidationError } from "../validationError";

export class ValidatorDescriptionUtilities extends Validator
{
    public isValidDescription(validator: string, description?: any): boolean
    {
        if(!description)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.DESCRIPTION_MISSING);
            this.logError(validator, err.toString());
            this.errors.push(err);
            return false;
        }

        if(! (typeof description === "string"))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.DESCRIPTION_INVALID);
            this.logError(validator, err.toString(), description);
            this.errors.push(err);
            return false;
        }

        return true;
    }
}