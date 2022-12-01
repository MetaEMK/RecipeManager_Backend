import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";
import { Validator } from "./MainValidator.js";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities.js";
import { ValidationError } from "./validationError.js";


export class VariantIngredientValidator extends Validator
{
    public idValidIngredientId(id?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("VariantIngredientValidator" ,id))
        {
            this.logError("Invalid id", id);
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
            this.logError("Invalid id", id);
            return false;
        }

        this.logSuccess("VariantIngredientValidator", "recipe_id is valid", id);
        return true;
    }

    public isValidQuantity(quantity?: any): boolean
    {
        if (!quantity)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.QUANTITY_MISSING);
            this.logError(err.toString(), quantity);
            this.errors.push(err);
            return false;
        }
        let val = new ValidatorIdUtilities();
        let num = val.convertToNumber("VariantIngredientValidator", quantity);
        if (!num)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.QUANTITY_INVALID);
            this.logError(err.toString(), quantity);
            this.errors.push(err);
            return false;
        }

        if (num < 0)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.QUANTITY_INVALID);
            this.logError(err.toString(), quantity);
            this.errors.push(err);
            return false;
        }

        this.logSuccess("VariantIngredientValidator", "quantity is valid", quantity);
        return true;
    }

}