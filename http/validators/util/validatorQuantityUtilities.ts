import { GeneralValidationErrorCodes } from "../../../enums/GeneralValidationErrors.enum.js";
import { Validator } from "../MainValidator.js";
import { ValidationError } from "../validationError.js";
import { ValidatorIdUtilities } from "./validatorIdUtilities.js";

export class ValidatorQuanitiyUtilities extends Validator
{
    isQuantityValid(validator: string, quantity?: any): boolean
    {
        if (!quantity)
            {
                let err = new ValidationError(GeneralValidationErrorCodes.QUANTITY_MISSING);
                this.logError(err.toString(), quantity);
                this.errors.push(err);
                return false;
            }
            let val = new ValidatorIdUtilities();
            let num = val.convertToNumber("IngredientValidator", quantity);
            if (!num)
            {
                let err = new ValidationError(GeneralValidationErrorCodes.QUANTITY_INVALID);
                this.logError(validator, err.toString(), quantity);
                this.errors.push(err);
                return false;
            }
    
            if (num < 0)
            {
                let err = new ValidationError(GeneralValidationErrorCodes.QUANTITY_INVALID);
                this.logError(validator ,err.toString(), quantity);
                this.errors.push(err);
                return false;
            }

            return true;
    }
}