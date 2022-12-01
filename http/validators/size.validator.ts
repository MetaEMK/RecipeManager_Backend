import validator from "validator";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";
import { ValidationError } from "./validationError.js";
import { Validator } from "./MainValidator.js";
import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities.js";

export class SizeValidator extends Validator
{
    public isValidSizeName(name?: any): boolean
    {
        let val = new ValidatorNameUtilities();
        
        if(!val.isValidAlphanummeric("SizeValidator", name))
        {
            this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("SizeValidator", "Size name is valid", name);
        return true;
    }

    public isValidConversionTypeId(id?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("SizeValidator", id))
        {
            this.errors.concat(val.getErrors());
            return false;
        }
        
        this.logSuccess("SizeValidator", "Conversion Type ID is valid", id.toString());
        return true;
    }
}