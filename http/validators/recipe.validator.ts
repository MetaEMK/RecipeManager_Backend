import validator from "validator";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";
import { ValidationError } from "./validationError.js";

const logger = createLogger();

export class RecipeValidator
{
    private errors: ValidationError[] = [];

    public getErrors(): ValidationError[]
    { 
        return this.errors; 
    }

    private logError(message: string, obj?: string): void
    {
        obj = obj ? obj : "";
        logger.info("RecipeValidator: Validation failed: " + message + ":\t\'" + obj + "\'", LOG_ENDPOINT.MAIN);
    }

    private logSuccess(message: string, obj?: string): void
    {
        obj = obj ? obj : "";
        logger.debug("RecipeValidator: Validation succeeded: " + message + ":\t\'" + obj + "\'", LOG_ENDPOINT.MAIN);
    }

    public isValidRecipeName(name?: any): boolean
    {

        if(!name)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.NAME_MISSING);
            this.logError(err.toString(), name);
            this.errors.push(err);
            return false;
        }
        
        if(! (typeof name === "string"))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.NAME_INVALID);
            this.logError(err.toString(), name);
            this.errors.push(err);
            return false;
        }
        let nameString = name as string;

        if(!validator.isLength(nameString, {min: 1, max: 100}))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.NAME_INVALID_LENGTH);
            this.logError(err.toString(), nameString);
            this.errors.push(err);
            return false;
        }
        
        if(!validator.isAlpha(nameString))
        {
            let error = new ValidationError(GeneralValidationErrorCodes.NAME_INVALID);
            this.logError(error.toString(), nameString);
            this.errors.push(error);
            return false;
        }

        this.logSuccess("Recipe name is valid", nameString);
        return true;
    }

    public isValidRecipeDescription(description?: any): boolean
    {
        if(!description)
        {
            return false;
        }
        if(! (typeof description === "string"))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.DESCRIPTION_INVALID);
            this.logError(err.toString(), description);
            this.errors.push(err);
            return false;
        }
        return true;
    }

    public isValidCategoryIds(categoryIds?: any): boolean
    {
        if(!categoryIds)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.CATEGORY_IDS_MISSING);
            this.logError(err.toString(), categoryIds);
            this.errors.push(err);
            return false;
        }

        if(! (categoryIds instanceof Array))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.CATEGORY_IDS_INVALID);
            this.logError(err.toString(), categoryIds);
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
            this.logError("At least one category ID is invalid", "");
            return false;
        }


        this.logSuccess("Category IDs are valid");
        return true;
    }

    public isValidBranchIds(categoryIds?: any): boolean
    {
        if(!categoryIds)
        {
            let err = new ValidationError(GeneralValidationErrorCodes.BRANCH_IDS_MISSING);
            this.logError(err.toString(), categoryIds);
            this.errors.push(err);
            return false;
        }

        if(! (categoryIds instanceof Array))
        {
            let err = new ValidationError(GeneralValidationErrorCodes.BRANCH_IDS_INVALID);
            this.logError(err.toString(), categoryIds);
            this.errors.push(err);
            return false;

            
        }
        let cat_ids: any[] = [];
        try {
            cat_ids = categoryIds as any[];
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
            this.logError("At least one branch ID is invalid", "");
            return false;
        }


        this.logSuccess("Branch IDs are valid");
        return true;
    }
}