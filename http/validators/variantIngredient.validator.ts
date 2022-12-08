import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";
import { Validator } from "./MainValidator.js";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities.js";
import { ValidatorQuanitiyUtilities } from "./util/validatorQuantityUtilities.js";
import { ValidationError } from "./validationError.js";


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
    public isValidVariantId(idToValidate?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("VariantIngredientValidator" ,idToValidate))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantIngredientValidator", "variant_id is valid", idToValidate);
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

    /**
     * 
     * @param unitToValidate unit to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the unit is valid for a variant ingredient unit and false otherwise
     */
    public isValidUnit(unitToValidate?: any): boolean
    {
        if(!unitToValidate)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.UNIT_MISSING);
            this.logError("VariantIngredientValidator", err.toString(), unitToValidate);
            this.errors.push(err);
            return false;
        }

        if(!(typeof unitToValidate === "string"))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.UNIT_INVALID);
            this.logError("VariantIngredientValidator", err.toString(), unitToValidate);
            this.errors.push(err);
            return false;
        }

        if(unitToValidate.length > 10)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.UNIT_INVALID, "unit cannot be longer than 10 characters");
            this.logError("VariantIngredientValidator", err.toString(), unitToValidate);
            this.errors.push(err);
            return false;
        }

        this.logSuccess("VariantIngredientValidator", "unit is valid", unitToValidate);
        return true;
    }

    /**
     * 
     * @param sectionIdToValidate section id to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the section id is valid for a variant ingredient section id and false otherwise
     */
    public isValidSectionId(sectionIdToValidate?: any): boolean
    {
        if(!sectionIdToValidate)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.SECTION_ID_MISSING);
            this.logError("VariantIngredientValidator", err.toString(), sectionIdToValidate);
            this.errors.push(err);
            return false;
        }
        if(!(typeof sectionIdToValidate === "number"))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.SECTION_ID_INVALID);
            this.logError("VariantIngredientValidator", err.toString(), sectionIdToValidate);
            this.errors.push(err);
            return false;
        }

        if(sectionIdToValidate < 0)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.SECTION_ID_INVALID, "section id cannot be negative");
            this.logError("VariantIngredientValidator", err.toString(), sectionIdToValidate.toString());
            this.errors.push(err);
            return false;
        }

        this.logSuccess("VariantIngredientValidator", "section id is valid", sectionIdToValidate.toString());
        return true;
    }

    /**
     * 
     * @param orderNoToValidate orderNo to validate. can be null or undefined. If you pass null or undefined or an Object, the method will return false
     * @returns true if the orderNo is valid for a variant ingredient orderNo and false otherwise
     */
    public isValidOrder_No(orderNoToValidate?: any): boolean
    {
        if(!orderNoToValidate)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.ORDER_NO_MISSING);
            this.logError("VariantIngredientValidator", err.toString(), orderNoToValidate);
            this.errors.push(err);
            return false;
        }
        if(!(typeof orderNoToValidate === "number"))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.ORDER_NO_INVALID);
            this.logError("VariantIngredientValidator", err.toString(), orderNoToValidate);
            this.errors.push(err);
            return false;
        }

        if(orderNoToValidate < 0)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.ORDER_NO_INVALID, "order no cannot be negative");
            this.logError("VariantIngredientValidator", err.toString(), orderNoToValidate.toString());
            this.errors.push(err);
            return false;
        }

        this.logSuccess("VariantIngredientValidator", "order no is valid", orderNoToValidate.toString());
        return true;
    }
}