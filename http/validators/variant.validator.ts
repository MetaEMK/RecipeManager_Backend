import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";
import { ValidatorDescriptionUtilities } from "./util/validatorDescriptionUtilities.js";
import { Validator } from "./MainValidator.js";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities.js";
import { ValidatorStructualUtilities } from "./util/validatorStructualUtilities.js";
import { ValidationError } from "./validationError.js";
import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";
import { getIngredientPropertyNames, isIngredient } from "../../interfaces/ingredient.interface.js";
import { IngredientValidator } from "./ingredient.validator.js";

export class VariantValidator extends Validator
{
    /**
     * 
     * @param idToValidate id to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false 
     * @returns true if the id is valid and false otherwise
     */
    public isValidVariantId(idToValidate?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("VariantValidator", idToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantValidator", "Variant ID is valid", idToValidate.toString());
        return true;
    }

    /**
     * 
     * @param nameToValidate name to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the name is valid for a variant name and false otherwise
     */
    public isValidVariantName(nameToValidate?: any): boolean
    {
        const val = new ValidatorNameUtilities();
        if(!val.isValidAlpha("VariantValidator", nameToValidate, {min: 1, max: 255}))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantValidator", "Variant name is valid", nameToValidate);
        return true;
    }

    /**
     * 
     * @param descriptionToValidate description to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the description is valid for a variant description and false otherwise
     */
    public isValidVariantDescription(descriptionToValidate?: any): boolean
    {
        const val = new ValidatorDescriptionUtilities();
        if(!val.isValidDescription("VariantValidator", descriptionToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantValidator", "Variant description is valid", descriptionToValidate);
        return true;
    }

    /**
     * 
     * @param idToValidate id to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the id is valid for a variant id and false otherwise
     */
    public isValidRecipeId(idToValidate?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("VariantValidator", idToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantValidator", "recipe_id is valid", idToValidate);
        return true;
    }

    /**
     * 
     * @param idToValidate id to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the id is valid for a variant id and false otherwise
     */
    public isValidSizeId(idToValidate?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("VariantValidator", idToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantValidator", "size_id is valid", idToValidate);
        return true;
    }

    /**
     * 
     * @param idsToValidate an array of numbers. If you pass null or undefined or any other Object than number[], the method will return false
     * @returns true if the ids are valid for a size id and false otherwise. It will also return true if the array is empty
     */
    public isValidIdArray(idsToValidate?: any): boolean
    {
        if(!idsToValidate) return false;

        let val = new ValidatorStructualUtilities();
        if(!val.isValidNumberArray("VariantValidator", idsToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantValidator", "id_array is valid", idsToValidate);
        return true;
    }

    /**
     * 
     * @param ingredientArrayToValidate an array. will return false if array elements arent ingredients
     * @returns true if the array is a valid array of ingredients and false otherwise
     */
    public isValidIngredientsArray(ingredientArrayToValidate?: any): boolean
    {
        if(!ingredientArrayToValidate) return false;
        
        const val = new ValidatorStructualUtilities();
        if(!val.isValidArray("VariantValidator", ingredientArrayToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        const valIngredient = new IngredientValidator();

        for (let i = 0; i < ingredientArrayToValidate.length; i++) {
            const ingredient = ingredientArrayToValidate[i];

            if(!isIngredient(ingredient))
            {
                let err = new ValidationError(GeneralValidationErrorCodes.ARRAY_INVALID_ELEMENT, 
                    `Element at index ${ i } is no valid ingredient. An ingredient has following properties: ${ getIngredientPropertyNames() }`);
                this.errors.push(err);
                this.logError("VariantValidator", err.toString());
                return false;
            }

            valIngredient.isValidQuantity(ingredient.quantity);
            valIngredient.isValidUnit(ingredient.unit);
            valIngredient.isValidSectionId(ingredient.section);
            valIngredient.isValidOrder_No(ingredient.order);

            if(valIngredient.getErrors().length !== 0)
            {
                let err = valIngredient.getErrors()[0];
                err.message = `Invalid ingredient at index ${i}: ` + err.message;
                this.errors.push(err);
                this.logError("VariantValidator", err.toString());
                return false;
            }
        }

        return true;
    }
}