import validator from "validator";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";
import { ValidationError } from "./validationError.js";
import { Validator } from "./MainValidator.js";
import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";
import { ValidatorDescriptionUtilities } from "./util/validatorDescriptionUtilities.js";

const logger = createLogger();

export class RecipeValidator extends Validator
{
    public isValidRecipeName(name?: any): boolean
    {
        let val = new ValidatorNameUtilities();

        if(!val.isValidAlpha("RecipeValidator", name))
        {
            this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("RecipeValidator", "Recipe name is valid", name);
        return true;
    }

    public isValidRecipeDescription(description?: any): boolean
    {
        let val = new ValidatorDescriptionUtilities();

        if(!val.isValidDescription("RecipeValidator", description))
        {
            this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("RecipeValidator", "Recipe description is valid", description);
        return true;
    }

    public isValidCategoryIds(categoryIds?: any): boolean
    {
        if(!categoryIds)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.CATEGORY_IDS_MISSING);
            this.logError("RecipeValidator", err.toString(), categoryIds);
            this.errors.push(err);
            return false;
        }

        if(! (categoryIds instanceof Array))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.CATEGORY_IDS_INVALID);
            this.logError("RecipeValidator", err.toString(), categoryIds);
            this.errors.push(err);
            return false;
        }
        let cat_ids: any[] = [];
        try {
            cat_ids = categoryIds as any[];
        } catch (error) {
            let err = new ValidationError(GeneralValidationErrorCodes.CATEGORY_IDS_INVALID, "Could not convert to number[]: " + error);;
            this.errors.push(err);
            return false;
        }

        let status = true;
        for(let i = 0; i < cat_ids.length; i++)
        {
            let cat_obj: any = cat_ids[i];
            let cat_id = cat_obj?.id;
            if(!cat_id || typeof cat_id !== "number")
            {
                let err = new ValidationError(GeneralValidationErrorCodes.CATEGORY_ID_INVALID, cat_id);
                this.errors.push(err);
                status = false;
            }
            if(cat_id < 0) 
            {
                let err = new ValidationError(GeneralValidationErrorCodes.CATEGORY_ID_INVALID, "Category id is negative");
                this.errors.push(err);
                status = false;
            }
            if(cat_ids.filter((id) => id.id === cat_id).length > 1)
            {
                let err = new ValidationError(GeneralValidationErrorCodes.CATEGORY_ID_NOT_UNIQUE);
                this.errors.push(err);
                status = false;
            }
        }
        if(!status)
        {
            this.logError("RecipeValidator", "At least one category ID is invalid", "");
            return false;
        }


        this.logSuccess("RecipeValidator", "Category IDs are valid");
        return true;
    }

    public isValidBranchIds(branchIds?: any): boolean
    {
        if(!branchIds)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.BRANCH_IDS_MISSING);
            this.logError("RecipeValidator", err.toString(), branchIds);
            this.errors.push(err);
            return false;
        }

        if(! (branchIds instanceof Array))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.BRANCH_IDS_INVALID);
            this.logError("RecipeValidator", err.toString(), branchIds);
            this.errors.push(err);
            return false;

            
        }
        let cat_ids: any[] = [];
        try {
            cat_ids = branchIds as any[];
        } catch (error) {
            let err = new ValidationError(GeneralValidationErrorCodes.BRANCH_IDS_INVALID, "Could not convert to number[]: " + error);;
            this.errors.push(err);
            return false;
        }

        let status = true;
        for(let i = 0; i < cat_ids.length; i++)
        {
            let cat_obj: any = cat_ids[i];
            let cat_id = cat_obj?.id;
            if(!cat_id || typeof cat_id !== "number")
            {
                let err = new ValidationError(GeneralValidationErrorCodes.BRANCH_ID_INVALID, cat_id);
                this.errors.push(err);
                status = false;
            }

            if(cat_id < 0) 
            {
                let err = new ValidationError(GeneralValidationErrorCodes.BRANCH_ID_INVALID, "Branch id is negative");
                this.errors.push(err);
                status = false;
            }

            if(cat_ids.filter((id) => id.id === cat_id).length > 1)
            {
                let err = new ValidationError(GeneralValidationErrorCodes.BRANCH_ID_NOT_UNIQUE);
                this.errors.push(err);
                status = false;
            }
        }
        if(!status)
        {
            this.logError("RecipeValidator", "At least one branch ID is invalid", "");
            return false;
        }


        this.logSuccess("RecipeValidator","Branch IDs are valid");
        return true;
    }
}