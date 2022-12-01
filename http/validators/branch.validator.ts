import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Validator } from "./MainValidator.js";
import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";

const logger = createLogger();

export class BranchValidator extends Validator
{
    
    public isValidBranchName(name?: any): boolean
    {
        let val = new ValidatorNameUtilities();
        if(!val.isValidAlpha("BranchValidator", name))
        {
            this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("Branch name is valid", name);
        return true;
    }

}

export function checkBranchValidator(displayError: boolean)
{
    console.log("Checking Branch Validator");
    let val = new BranchValidator();

    if(val.isValidBranchName() == true) return false;
    if(val.isValidBranchName("1") == true) return false;
    if(val.isValidBranchName("") == true) return false;
    if(val.isValidBranchName("Test123") == true) return false;
    if(val.isValidBranchName("Test") == false) return false;
    if(val.isValidBranchName({name: "name", test: "test"}) == true) return false;

    let err = val.getErrors();
    if(displayError) err.forEach(e => console.log(e.toString()));

    console.log("BranchValidator passed");

    return true;
}