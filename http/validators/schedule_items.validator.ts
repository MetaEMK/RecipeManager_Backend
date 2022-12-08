import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";
import { Validator } from "./MainValidator.js";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities.js";
import { ValidatorQuanitiyUtilities } from "./util/validatorQuantityUtilities.js";
import { ValidationError } from "./validationError.js";



export class ScheduleItemsValidator extends Validator
{

    /**
     * 
     * @param idToValidate id to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the id is valid for a schedule item id and false otherwise
     */
    public isValidScheduleId(idToValidate?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("ScheduleItemsValidator" ,idToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("ScheduleItemsValidator", "schedule_id is valid", idToValidate.toString());
        return true;
    }

    /**
     * 
     * @param idToValidate id to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the id is valid for a schedule item id and false otherwise
     */
    public isValidVariantId(idToValidate?: any): boolean
    {
        if(!idToValidate) 
        {
            let err = new ValidationError(GeneralValidationErrorCodes.VARIANT_ID_MISSING);
            this.logError(err.toString(), idToValidate);
            this.errors.push(err);
            return false;
        }
        let val = new ValidatorIdUtilities();
        let num = val.convertToNumber("ScheduleItemsValidator", idToValidate);

        if(!num)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.VARIANT_ID_INVALID);
            this.logError("ScheduleItemsValidator", err.toString(), idToValidate);
            this.errors.push(err);
            return false;
        }

        if(num < 0)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.VARIANT_ID_INVALID);
            this.logError("ScheduleItemsValidator", err.toString(), idToValidate);
            this.errors.push(err);
            return false;
        }

        this.logSuccess("ScheduleItemsValidator", "variant_id is valid", idToValidate);
        return true;
    }

    /**
     * 
     * @param idToValidate id to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the id is valid for a schedule item id and false otherwise
    */
    public isValidBranchId(idToValidate?: any): boolean
    {
        if(!idToValidate) 
        {
            let err = new ValidationError(GeneralValidationErrorCodes.BRANCH_ID_MISSING);
            this.logError("ScheduleItemsValidator", err.toString(), idToValidate);
            this.errors.push(err);
            return false;
        }
        let val = new ValidatorIdUtilities();
        let num = val.convertToNumber("ScheduleItemsValidator", idToValidate);

        if(!num)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.BRANCH_ID_INVALID);
            this.logError("ScheduleItemsValidator", err.toString(), idToValidate);
            this.errors.push(err);
            return false;
        }

        if(num < 0)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.BRANCH_ID_INVALID);
            this.logError(err.toString(), idToValidate);
            this.errors.push(err);
            return false;
        }

        this.logSuccess("ScheduleItemsValidator", "branch_id is valid", idToValidate);
        return true;
    }


    /**
     * 
     * @param dayToValidate day to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns 
     */
    public isValidDay(dayToValidate: any): boolean
    {
        if(!dayToValidate)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.DAY_MISSING);
            this.logError("ScheduleItemsValidator", err.toString(), dayToValidate);
            this.errors.push(err);
            return false;
        }

        let val = new ValidatorIdUtilities();

        let day = val.convertToNumber("ScheduleItemsValidator", dayToValidate);

        if(!day)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.DAY_INVALID);
            this.logError("ScheduleItemsValidator", err.toString(), dayToValidate);
            this.errors.push(err);
            return false;
        }

        if(day < 1 || day > 7)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.DAY_INVALID);
            this.logError("ScheduleItemsValidator", err.toString(), dayToValidate);
            this.errors.push(err);
            return false;
        }

        this.logSuccess("ScheduleItemsValidator", "day is valid", dayToValidate);
        return true;
    }

    /**
     * 
     * @param quantityToValidate quantity to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the quantity is valid for a schedule item quantity and false otherwise
     */
    public isValidQuantity(quantityToValidate: any): boolean
    {
        if(!quantityToValidate)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.QUANTITY_MISSING);
            this.logError("ScheduleItemsValidator", err.toString(), quantityToValidate);
            this.errors.push(err);
            return false;
        }

        let val = new ValidatorQuanitiyUtilities();
        if(!val.isQuantityValid(quantityToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("ScheduleItemsValidator", "quantity is valid", quantityToValidate);
        return true;
    }
}