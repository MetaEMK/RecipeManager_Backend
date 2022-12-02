import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";
import { ValidatorDescriptionUtilities } from "./util/validatorDescriptionUtilities.js";
import { Validator } from "./MainValidator.js";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities.js";

export class VariantValidator extends Validator
{

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
}