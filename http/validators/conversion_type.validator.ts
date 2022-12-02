import { Validator } from "./MainValidator";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities";

export class ConversionTypeValidator extends Validator
{
    /**
     * 
     * @param nameToValidate name to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the name is valid for a conversion type name and false otherwise
     */
    public isValidName(nameToValidate?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("ConversionTypeValidator" ,nameToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("ConversionTypeValidator", "name is valid", nameToValidate);
        return true;
    }
}