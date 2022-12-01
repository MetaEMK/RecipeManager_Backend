import { Validator } from "./MainValidator.js";
import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";
import { ValidatorStructualUtilities } from "./util/validatorStructualUtilities.js";

export class CategoryValidator extends Validator
{
    public isValidCategoryName(name?: any): boolean
    {
        let val = new ValidatorNameUtilities();

        if(!val.isValidAlpha("CategoryValidator", name))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("CategoryValidator", "Category name is valid", name);
        return true;
    }

    public isValidRecipeIDs(body?: any): boolean
    {
        if(!body) return false;

        let val = new ValidatorStructualUtilities();
        if(!val.isValidNumberArray("CategoryValidator", body.add))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }
        if(!val.isValidNumberArray("CategoryValidator", body.rmv))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("CategoryValidator", "Recipe IDs are valid", body);
        return true;
    }
}