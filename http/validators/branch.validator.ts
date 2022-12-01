import { Validator } from "./MainValidator.js";
import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";
import { ValidatorStructualUtilities } from "./util/validatorStructualUtilities.js";

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

    public isValidRecipeIDs(body?: any): boolean
    {
        if(!body) return false;

        let val = new ValidatorStructualUtilities();
        if(!val.isValidNumberArray("BranchValidator", body.add))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }
        if(!val.isValidNumberArray("BranchValidator", body.rmv))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("BranchValidator", "Recipe IDs are valid", body);
        return true;
    }

}