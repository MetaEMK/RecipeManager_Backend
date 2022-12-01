import { Validator } from "./MainValidator";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities";


export class ConversionTypeValidator extends Validator
{
    public isValidName(name?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("ConversionTypeValidator" ,name))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("ConversionTypeValidator", "name is valid", name);
        return true;
    }
}