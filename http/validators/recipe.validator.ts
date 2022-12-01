import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Validator } from "./MainValidator.js";
import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";
import { ValidatorDescriptionUtilities } from "./util/validatorDescriptionUtilities.js";
import { ValidatorStructualUtilities } from "./util/validatorStructualUtilities.js";

const logger = createLogger();

export class RecipeValidator extends Validator
{
    public isValidRecipeName(name?: any): boolean
    {
        let val = new ValidatorNameUtilities();

        if(!val.isValidAlpha("RecipeValidator", name))
        {
            this.errors = this.errors.concat(val.getErrors());
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
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("RecipeValidator", "Recipe description is valid", description);
        return true;
    }

    /**
     * @description Validates if the given body has an array called add
     * @param body body of the request
     * @returns true if the body is valid, false otherwise
     */
    public isValidCreationRelationIds(body?: any): boolean
    {
        if(!body) return false;

        let val = new ValidatorStructualUtilities();
        if(!val.isValidNumberArray("RecipeValidator", body.add))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("RecipeValidator", "Relation IDs are valid", body);
        return true
    }

    public isValidRelationIDs(body?: any): boolean
    {
        if(!body) return false;

        let val = new ValidatorStructualUtilities();
        if(!val.isValidNumberArray("RecipeValidator", body.add))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }
        if(!val.isValidNumberArray("RecipeValidator", body.rmv))
        {
            this.errors = this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("RecipeValidator", "Relation IDs are valid", body);
        return true;
    }
}