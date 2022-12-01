import { Validator } from "./MainValidator.js";
import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";

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
}