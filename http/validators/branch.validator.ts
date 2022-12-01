import { Validator } from "./MainValidator.js";
import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";

export class BranchValidator extends Validator
{
    
    public isValidBranchName(name?: any): boolean
    {
        let val = new ValidatorNameUtilities();
        if(!val.isValidAlpha("BranchValidator", name))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("BranchValidator", "Branch name is valid", name);
        return true;
    }

}