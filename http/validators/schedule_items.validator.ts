import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum";
import { Validator } from "./MainValidator";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities";
import { ValidationError } from "./validationError";



export class ScheduleItemsValidator extends Validator
{
    public isValidScheduleId(id?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("ScheduleItemsValidator" ,id))
        {
            this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("ScheduleItemsValidator", "schedule_id is valid", id.toString());
        return true;
    }

    public isValidVariantId(id?: any): boolean
    {
        if(!id) 
        {
            let err = new ValidationError(GeneralValidationErrorCodes.VARIANT_ID_MISSING);
            this.logError(err.toString(), id);
            this.errors.push(err);
            return false;
        }
        let val = new ValidatorIdUtilities();
        let num = val.convertToNumber("ScheduleItemsValidator", id);

        if(!num)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.VARIANT_ID_INVALID);
            this.logError("ScheduleItemsValidator", err.toString(), id);
            this.errors.push(err);
            return false;
        }

        if(num < 0)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.VARIANT_ID_INVALID);
            this.logError("ScheduleItemsValidator", err.toString(), id);
            this.errors.push(err);
            return false;
        }

        this.logSuccess("ScheduleItemsValidator", "variant_id is valid", id);
        return true;
    }

    public isValidBranchId(id?: any): boolean
    {
        if(!id) 
        {
            let err = new ValidationError(GeneralValidationErrorCodes.BRANCH_ID_MISSING);
            this.logError("ScheduleItemsValidator", err.toString(), id);
            this.errors.push(err);
            return false;
        }
        let val = new ValidatorIdUtilities();
        let num = val.convertToNumber("ScheduleItemsValidator", id);

        if(!num)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.BRANCH_ID_INVALID);
            this.logError("ScheduleItemsValidator", err.toString(), id);
            this.errors.push(err);
            return false;
        }

        if(num < 0)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.BRANCH_ID_INVALID);
            this.logError(err.toString(), id);
            this.errors.push(err);
            return false;
        }

        this.logSuccess("ScheduleItemsValidator", "branch_id is valid", id);
        return true;
    }

    public isValidDay(item: any): boolean
    {
        if(!item)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.DAY_MISSING);
            this.logError("ScheduleItemsValidator", err.toString(), item);
            this.errors.push(err);
            return false;
        }

        let val = new ValidatorIdUtilities();

        let day = val.convertToNumber("ScheduleItemsValidator", item);

        if(!day)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.DAY_INVALID);
            this.logError("ScheduleItemsValidator", err.toString(), item);
            this.errors.push(err);
            return false;
        }

        if(day < 1 || day > 7)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.DAY_INVALID);
            this.logError("ScheduleItemsValidator", err.toString(), item);
            this.errors.push(err);
            return false;
        }

        this.logSuccess("ScheduleItemsValidator", "day is valid", item);
        return true;
    }
}