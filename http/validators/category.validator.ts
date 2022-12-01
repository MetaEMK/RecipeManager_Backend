import { Validator } from "./MainValidator.js";
import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";

export class CategoryValidator extends Validator
{
    public isValidCategoryName(name?: any): boolean
    {
        let val = new ValidatorNameUtilities();

        if(!val.isValidAlpha("CategoryValidator", name))
        {
            this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("Category name is valid", name);
        return true;
    }
}

export function checkCategoryalidator(displayError: boolean)
{
    console.log("Checking CategoryValidator");
    let val = new CategoryValidator();

    if(val.isValidCategoryName() == true) return false;
    if(val.isValidCategoryName("1") == true) return false;
    if(val.isValidCategoryName("") == true) return false;
    if(val.isValidCategoryName("Test123") == true) return false;
    if(val.isValidCategoryName("Test") == false) return false;
    if(val.isValidCategoryName({name: "name", test: "test"}) == true) return false;

    let err = val.getErrors();
    if(displayError) err.forEach(e => console.log(e.toString()));

    console.log("CategoryValidator passed");

    return true;
}