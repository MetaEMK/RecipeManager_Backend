import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";
import { Validator } from "./MainValidator.js";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities.js";
import { ValidationError } from "./validationError.js";


export class ConversionToSizeValidator extends Validator
{
    public isValidSizeId(id?: any): boolean
    { 
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("ConversionToSizeValidator" ,id))
        {
            this.logError("Invalid id", id);
            return false;
        }

        this.logSuccess("ConversionToSizeValidator", "size_id is valid", id.toString());
        return true;
    }

    public isValidConversionId(id?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("ConversionToSizeValidator" ,id))
        {
            this.logError("Invalid id", id);
            return false;
        }

        this.logSuccess("ConversionToSizeValidator", "conversion_id is valid", id);
        return true;
    }

    public isValidMulitplicator(multiplicator?: any): boolean
    {
        if (!multiplicator)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.MULTIPLICATOR_MISSING);
            this.logError(err.toString(), multiplicator);
            this.errors.push(err);
            return false;
        }

        let val = new ValidatorIdUtilities();
        let num = val.convertToNumber("ConversionToSizeValidator", multiplicator);
        if (!num)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.MULTIPLICATOR_INVALID);
            this.logError(err.toString(), multiplicator);
            this.errors.push(err);
            return false;
        }

        if (num < 0)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.MULTIPLICATOR_INVALID);
            this.logError(err.toString(), multiplicator);
            this.errors.push(err);
            return false;
        }

        this.logSuccess("ConversionToSizeValidator", "multiplicator is valid", multiplicator);
        return true;
    }
}