import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";
import { Validator } from "./MainValidator.js";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities.js";
import { ValidatorQuanitiyUtilities } from "./util/validatorQuantityUtilities.js";
import { ValidationError } from "./validationError.js";


export class VariantIngredientValidator extends Validator
{
    public idValidIngredientId(id?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("VariantIngredientValidator" ,id))
        {
            this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantIngredientValidator", "ingredient_id is valid", id.toString());
        return true;
    }

    public isValidRecipeId(id?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("VariantIngredientValidator" ,id))
        {
            this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantIngredientValidator", "recipe_id is valid", id);
        return true;
    }

    public isValidQuantity(quantity?: any): boolean
    {
        const val = new ValidatorQuanitiyUtilities();
        if(!val.isQuantityValid("VariantIngredientValidator", quantity))
        {
            this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantIngredientValidator", "quantity is valid", quantity);
        return true;
    }

}