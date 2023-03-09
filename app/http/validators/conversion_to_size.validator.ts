import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";
import { Validator } from "./MainValidator.js";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities.js";
import { ValidationError } from "./validationError.js";


export class ConversionToSizeValidator extends Validator
{
    /**
     * 
     * @param id id to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the id is valid for a conversion to size id and false otherwise
     */
    public isValidSizeId(id?: any): boolean
    { 
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("ConversionToSizeValidator" ,id))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("ConversionToSizeValidator", "size_id is valid", id.toString());
        return true;
    }

    /**
     * 
     * @param id id to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the id is valid for a conversion to size id and false otherwise
     */
    public isValidConversionId(id?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("ConversionToSizeValidator" ,id))
        {
            this.logError("ConversionToSizeValidator", "Invalid id", id);
            return false;
        }

        this.logSuccess("ConversionToSizeValidator", "conversion_id is valid", id);
        return true;
    }

    /**
     * @param multiplicatorToValidate multiplicator to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the multiplicator is valid for a conversion to size multiplicator and false otherwise
     */
    public isValidMulitplicator(multiplicatorToValidate?: any): boolean
    {
        if (!multiplicatorToValidate)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.MULTIPLICATOR_MISSING);
            this.logError(err.toString(), multiplicatorToValidate);
            this.errors.push(err);
            return false;
        }

        let val = new ValidatorIdUtilities();
        let num = val.convertToNumber("ConversionToSizeValidator", multiplicatorToValidate);
        if (!num)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.MULTIPLICATOR_INVALID);
            this.logError("ConversionToSizeValidator", err.toString(), multiplicatorToValidate);
            this.errors.push(err);
            return false;
        }

        if (num < 0)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.MULTIPLICATOR_INVALID);
            this.logError("ConversionToSizeValidator", err.toString(), multiplicatorToValidate);
            this.errors.push(err);
            return false;
        }

        this.logSuccess("ConversionToSizeValidator", "multiplicator is valid", multiplicatorToValidate);
        return true;
    }
}