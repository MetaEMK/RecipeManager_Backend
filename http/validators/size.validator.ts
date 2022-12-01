import validator from "validator";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";
import { ValidationError } from "./validationError.js";
import { Validator } from "./MainValidator.js";
import { ValidatorNameUtilities } from "./util/validatorNameUtilities.js";
import { ValidatorIdUtilities } from "./util/validatorIdUtilities.js";

export class SizeValidator extends Validator
{
    public isValidSizeName(name?: any): boolean
    {
        let val = new ValidatorNameUtilities();
        
        if(!val.isValidAlphanummeric("SizeValidator", name))
        {
            this.errors.concat(val.getErrors());
            return false;
        }

        this.logSuccess("Size name is valid", name);
        return true;
    }

    public isValidConversionTypeId(id?: any): boolean
    {
        let val = new ValidatorIdUtilities();
        if(!val.isValidId("SizeValidator", id))
        {
            this.errors.concat(val.getErrors());
            return false;
        }
        
        this.logSuccess("Conversion Type ID is valid", id.toString());
        return true;
    }
}

export function checkSizeValidator(displayError: boolean)
{
    console.log("Checking SizeValidator");
    let val = new SizeValidator();

    if(val.isValidSizeName() == true) return false;
    if(val.isValidSizeName("1") == false) return false;
    if(val.isValidSizeName("") == true) return false;
    if(val.isValidSizeName({name: "name", test: "test"}) == true) return false;

    if(val.isValidConversionTypeId() == true) return false;
    if(val.isValidConversionTypeId("1") == true) return false;
    if(val.isValidConversionTypeId(-1) == true) return false;
    if(val.isValidConversionTypeId(1) == false) return false;

    let err = val.getErrors();
    if(displayError) err.forEach(e => console.log(e.toString()));

    console.log("SizeValidator passed");

    return true;
}