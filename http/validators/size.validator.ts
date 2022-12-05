import { Validator } from "./MainValidator.js";
import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities.js";

export class SizeValidator extends Validator
{
    /**
     * 
     * @param idToValidate id to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the id is valid for a size id and false otherwise
     */
    public isValidSizeId(idToValidate?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("SizeValidator", idToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("SizeValidator", "size_id is valid", idToValidate.toString());
        return true;
    }

    /**
     * 
     * @param nameToValidate name to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the name is valid for a size name and false otherwise
     */
    public isValidSizeName(nameToValidate?: any): boolean
    {
        let val = new ValidatorNameUtilities();
        
        if(!val.isValidAlphanummeric("SizeValidator", nameToValidate, {min: 1, max: 100}))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("SizeValidator", "Size name is valid", nameToValidate);
        return true;
    }

    /**
     * 
     * @param idToValidate id to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the id is valid for a size id and false otherwise
     */
    public isValidConversionTypeId(idToValidate?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("SizeValidator", idToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }
        
        this.logSuccess("SizeValidator", "Conversion Type ID is valid", idToValidate.toString());
        return true;
    }
}