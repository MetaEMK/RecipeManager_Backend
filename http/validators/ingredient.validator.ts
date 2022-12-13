import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";
import { Validator } from "./MainValidator.js";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities.js";
import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";
import { ValidatorQuanitiyUtilities } from "./util/validatorQuantityUtilities.js";
import { ValidationError } from "./validationError.js";


export class IngredientValidator extends Validator
{
    /**
     * 
     * @param nameToValidate name to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the name is valid for an ingredient name and false otherwise
     */
     public isValidIngredientName(nameToValidate?: any): boolean
     {
         let val = new ValidatorNameUtilities();
         if(!val.isValidAlpha("IngredientValidator", nameToValidate, {min: 1, max: 100}))
         {
             this.errors = this.errors.concat(val.getErrors());
             return false;
         }
 
         this.logSuccess("IngredientValidator", "Ingredient is valid", nameToValidate);
         return true;
     }

    /**
     * 
     * @param idToValidate id to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the id is valid for a variant id and false otherwise
     */
    public isValidVariantId(idToValidate?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("IngredientValidator" ,idToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("IngredientValidator", "variant_id is valid", idToValidate);
        return true;
    }

    /**
     * 
     * @param quantityToValidate quantity to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the quantity is valid for a ingredient quantity and false otherwise
     */
    public isValidQuantity(quantityToValidate?: any): boolean
    {
        const val = new ValidatorQuanitiyUtilities();
        if(!val.isQuantityValid("IngredientValidator", quantityToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("IngredientValidator", "quantity is valid", quantityToValidate);
        return true;
    }

    /**
     * 
     * @param unitToValidate unit to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the unit is valid for a ingredient unit and false otherwise
     */
    public isValidUnit(unitToValidate?: any): boolean
    {
        if(!unitToValidate)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.UNIT_MISSING);
            this.logError("IngredientValidator", err.toString(), unitToValidate);
            this.errors.push(err);
            return false;
        }

        if(!(typeof unitToValidate === "string"))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.UNIT_INVALID);
            this.logError("IngredientValidator", err.toString(), unitToValidate);
            this.errors.push(err);
            return false;
        }

        if(unitToValidate.length > 10)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.UNIT_INVALID, "unit cannot be longer than 10 characters");
            this.logError("IngredientValidator", err.toString(), unitToValidate);
            this.errors.push(err);
            return false;
        }

        this.logSuccess("IngredientValidator", "unit is valid", unitToValidate);
        return true;
    }

    /**
     * 
     * @param sectionIdToValidate section id to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the section id is valid for a ingredient section id and false otherwise
     */
    public isValidSectionId(sectionIdToValidate?: any): boolean
    {
        if(!sectionIdToValidate)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.SECTION_ID_MISSING);
            this.logError("IngredientValidator", err.toString(), sectionIdToValidate);
            this.errors.push(err);
            return false;
        }
        if(!(typeof sectionIdToValidate === "number"))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.SECTION_ID_INVALID);
            this.logError("IngredientValidator", err.toString(), sectionIdToValidate);
            this.errors.push(err);
            return false;
        }

        if(sectionIdToValidate < 0)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.SECTION_ID_INVALID, "section id cannot be negative");
            this.logError("IngredientValidator", err.toString(), sectionIdToValidate.toString());
            this.errors.push(err);
            return false;
        }

        this.logSuccess("IngredientValidator", "section id is valid", sectionIdToValidate.toString());
        return true;
    }

    /**
     * 
     * @param orderNoToValidate orderNo to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the orderNo is valid for a ingredient orderNo and false otherwise
     */
    public isValidOrder_No(orderNoToValidate?: any): boolean
    {
        if(!orderNoToValidate)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.ORDER_NO_MISSING);
            this.logError("IngredientValidator", err.toString(), orderNoToValidate);
            this.errors.push(err);
            return false;
        }
        if(!(typeof orderNoToValidate === "number"))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.ORDER_NO_INVALID);
            this.logError("IngredientValidator", err.toString(), orderNoToValidate);
            this.errors.push(err);
            return false;
        }

        if(orderNoToValidate < 0)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.ORDER_NO_INVALID, "order no cannot be negative");
            this.logError("IngredientValidator", err.toString(), orderNoToValidate.toString());
            this.errors.push(err);
            return false;
        }

        this.logSuccess("IngredientValidator", "order no is valid", orderNoToValidate.toString());
        return true;
    }
}