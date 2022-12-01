import validator from 'validator';
import { ValidationResult } from "./validationResult.js";



export function validateCreateBranch(body: any): ValidationResult
{
    let result: ValidationResult = new ValidationResult();
    let branch: Branch = new Branch();
    result.errors = [];

    if(!body.name) result.errors.push({code: "NAME_MISSING", message: "Name is missing"});
    else if (body.name.length < 100) result.errors.push({code: "NAME_INVALID_LENGTH", message: "Name is too long"});
    if(!validator.isAlpha(body.name)) result.errors.push({code: "NAME_INVALID", message: "Name must be alphabetic"});

    if(result.errors.length > 0) // Error
    else branch.name = body.name;
    return result;
}