import { Validator } from "./MainValidator.js";
import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";

export class IngredientValidator extends Validator
{
    public isValidIngredientName(name?: any): boolean
    {
        let val = new ValidatorNameUtilities();
        if(!val.isValidAlpha("IngredientValidator", name))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("IngredientValidator", "Ingredient is valid", name);
        return true;
    }
}