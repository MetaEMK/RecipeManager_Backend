import { Validator } from "./MainValidator.js";
import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";
import { ValidatorStructualUtilities } from "./util/validatorStructualUtilities.js";

export class BranchValidator extends Validator
{

    /**
     * @param nameToValidate name to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false.
     * @returns true if the name is valid for a branch name and false otherwise
     */
    public isValidBranchName(nameToValidate?: any): boolean
    {
        let val = new ValidatorNameUtilities();
        if(!val.isValidAlpha("BranchValidator", nameToValidate, {min: 1, max: 20}))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("BranchValidator", "Branch name is valid", nameToValidate);
        return true;
    }

    /**
     * @param idsToValidate an array of numbers. If you pass null or undefined or any other Object than number[], the method will return false
     * @returns true if the ids are valid for a category id and false otherwise. It will also return true if the array is empty
     */
    public isValidIdArray(idsToValidate?: any): boolean
    {
        if(!idsToValidate) return false;

        let val = new ValidatorStructualUtilities();
        if(!val.isValidNumberArray("BranchValidator", idsToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("BranchValidator", "id_array is valid", idsToValidate);
        return true;
    }

}