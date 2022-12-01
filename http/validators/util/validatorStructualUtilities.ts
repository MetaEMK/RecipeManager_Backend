import { GeneralValidationErrorCodes } from "../../../enums/GeneralValidationErrors.enum";
import { Validator } from "../MainValidator";
import { ValidationError } from "../validationError";


export class ValidatorStructualUtilities extends Validator
{
    
    // "add": [1,2,3,4,5],
    public isValidNumberArray(validator: string, body: any)
    {
        if(!body)
        {
            return false;
        }
    
        let array: any[] = [];
        try 
        {
            if(body instanceof Array)
            {
                array = body as any[];

                array.forEach(element => {
                if(typeof(element) !== "number")
                    {
                        let err = new ValidationError(GeneralValidationErrorCodes.ARRAY_INVALID);
                        this.errors.push(err);
                        this.logError(validator, err.toString());
                        return false;
                    }
                });
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
    }
}
