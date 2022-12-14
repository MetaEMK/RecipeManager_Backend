import { Validator } from "./MainValidator.js";
import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";
import { ValidatorDescriptionUtilities } from "./util/validatorDescriptionUtilities.js";
import { ValidatorStructualUtilities } from "./util/validatorStructualUtilities.js";

export class RecipeValidator extends Validator
{
    /**
     * @param nameToValidate name to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns 
     */
    public isValidRecipeName(nameToValidate?: any): boolean
    {
        let val = new ValidatorNameUtilities();

        if(!val.isValidAlpha("RecipeValidator", nameToValidate, {min: 1, max: 255}))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("RecipeValidator", "Recipe name is valid", nameToValidate);
        return true;
    }

    /**
     * 
     * @param descriptionToValidate description to validate. can be null or undefined. If you pass undefined or an Object, the method will return false. Null is an allowed value
     * @returns true if the description is valid for a recipe description and false otherwise
     */
    public isValidRecipeDescription(descriptionToValidate?: any): boolean
    {
        let val = new ValidatorDescriptionUtilities();

        if(!val.isValidDescription("RecipeValidator", descriptionToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("RecipeValidator", "Recipe description is valid", descriptionToValidate);
        return true;
    }

    /**
     * 
     * @param idsToValidate an array of numbers. If you pass null or undefined or any other Object than number[], the method will return false
     * @returns true if the ids are valid for a category id and false otherwise. It will also return true if the array is empty
     */
    public isValidIdArray(idsToValidate: any): boolean
    {
        let val = new ValidatorStructualUtilities();
        if(!val.isValidNumberArray("RecipeValidator", idsToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("RecipeValidator", "id_array is valid", idsToValidate);
        return true
    }

    //TODO: ImagePath is missing!
}