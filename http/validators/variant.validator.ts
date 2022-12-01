import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";
import { ValidatorDescriptionUtilities } from "./util/validatorDescriptionUtilities.js";
import { Validator } from "./MainValidator.js";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities.js";

export class VariantValidator extends Validator
{
    public isValidVariantName(name?: any): boolean
    {
        const val = new ValidatorNameUtilities();
        if(!val.isValidAlpha("VariantValidator", name))
        {
            this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantValidator", "Variant name is valid", name);
        return true;
    }

    public isValidVariantDescription(description?: any): boolean
    {
        const val = new ValidatorDescriptionUtilities();
        if(!val.isValidDescription("VariantValidator", description))
        {
            this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantValidator", "Variant description is valid", description);
        return true;
    }

    public isValidRecipeId(id?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("VariantValidator", id))
        {
            this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("VariantValidator", "recipe_id is valid", id);
        return true;
    }
}