import { Validator } from "./MainValidator.js";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities.js";
import { ValidatorQuanitiyUtilities } from "./util/validatorQuantityUtilities.js";;


export class VariantIngredientValidator extends Validator
{
    /**
     * 
     * @param idToValidate id to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the id is valid for a variant ingredient id and false otherwise
     */
    public idValidIngredientId(idToValidate?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("VariantIngredientValidator" ,idToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantIngredientValidator", "ingredient_id is valid", idToValidate.toString());
        return true;
    }

    /**
     * 
     * @param idToValidate id to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the id is valid for a variant ingredient id and false otherwise
     */
    public isValidRecipeId(idToValidate?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("VariantIngredientValidator" ,idToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantIngredientValidator", "recipe_id is valid", idToValidate);
        return true;
    }

    /**
     * 
     * @param quantityToValidate quantity to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the quantity is valid for a variant ingredient quantity and false otherwise
     */
    public isValidQuantity(quantityToValidate?: any): boolean
    {
        const val = new ValidatorQuanitiyUtilities();
        if(!val.isQuantityValid("VariantIngredientValidator", quantityToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantIngredientValidator", "quantity is valid", quantityToValidate);
        return true;
    }

}