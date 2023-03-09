import { GeneralValidationErrorCodes } from "../../../enums/GeneralValidationErrors.enum.js";
import { Validator } from "../MainValidator.js";
import { ValidationError } from "../validationError.js";


export class ValidatorStructualUtilities extends Validator
{
    public isValidArray(validator: string, body: any): boolean
    {
        if(!body) return false;

        if(!Array.isArray(body)) 
        {
            let err = new ValidationError(GeneralValidationErrorCodes.ARRAY_INVALID, "The content could not be interpreted as an array");
            this.errors.push(err);
            this.logError(validator, err.toString());
            return false;
        }

        return true;
    }

    public isValidNumberArray(validator: string, body: any): boolean
    {
        if(!body)
            return false;
    
        let array: any[] = [];
        try 
        {
            if(body instanceof Array)
            {
                array = body as any[];

                for(const element of array) {
                    if(Number.isNaN(+element))
                    {
                        let err = new ValidationError(GeneralValidationErrorCodes.ARRAY_INVALID, "Array contains non-number element:" + element);
                        this.errors.push(err);
                        this.logError(validator, err.toString(), element);
                        return false;
                    }
                }
            }
            else
            {
                let err = new ValidationError(GeneralValidationErrorCodes.ARRAY_INVALID, "The content could not be interpreted as an array");
                this.errors.push(err);
                this.logError(validator, err.toString());
                return false;   
            }
        } catch (error)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.ARRAY_INVALID);
            this.errors.push(err);
            this.logError(validator, err.toString(), "Error in parsing array: " + error);
            return false;
        }

        return true;
    }
}
