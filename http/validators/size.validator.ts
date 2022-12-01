import validator from "validator";
import { Size } from "../../data/entities/size.entity";
import { ValidationError, GenerelValidationErrorCodes } from "./validationError";
import { ValidationResult } from "./validationResult.js";
export class SizeValidator
{
    private errors: ValidationError[] = [];
    public getErrors(): ValidationError[] { return this.errors; }
    
    public isValidSizeName(name?: any): boolean
    {
        if(!name) return false;
        if(!name.typeof(String)) return false;
        if(name.length > 100) return false;
        if(validator.isAlphanumeric(name)) return true;
        return true;
    }
}