import { AppDataSource } from '../../config/datasource.js';
import validator from 'validator';
import { ValidationError, GenerelValidationErrorCodes } from './validationError.js';
import { createLogger, LOG_ENDPOINT } from '../../utils/logger.js';
import { isNameAlphaAndBetween } from './util.validator.js';
import { Branch } from '../../data/entities/branch.entity.js';
import { ValidationResult } from './validationResult.js';

const logger = createLogger();

function logError(message: string, errors: ValidationError[]) {
    let str = "";
    errors.forEach(error => { str = str + ', ' + error.code});
    logger.warn("CATEGORY: " + message + "\tErrorCodes: " + str, LOG_ENDPOINT.MAIN);
}

//TODO Create a function that checks if a branch is valid
async function createBranchValidation(body: any) 
{
    let result: ValidationResult = new ValidationResult();
    result.errors = [];
    let branch = new Branch();

    //Branch name:
    let name_err = isBranchNameValid(body.name);
    if(name_err.length > 0)
        result.errors = result.errors.concat(name_err);
    else 
    {
        name_err = await isBranchNameUnique(body.name);
        if(name_err.length > 0)
        result.errors = result.errors.concat(name_err);
        else
            branch.name = body.name;
    }
    return result;
}

export async function updateBranchValidation(body: any): Promise<ValidationResult>
{
    let result: ValidationResult = new ValidationResult();
    result.errors = [];
    
    if(!body.id) 
    {
        result.errors.push(new ValidationError(GenerelValidationErrorCodes.ID_MISSING, "Id is missing"));
        return result;
    }

    let branch = await AppDataSource.getRepository(Branch).findOneBy({id: body.id});
    if(branch === null) result.errors.push(new ValidationError(GenerelValidationErrorCodes.BRANCH_DOES_NOT_EXIST, "Branch id does not exist"));

    else 
    {
        if(branch.name !== body.name)
        {
            let new_err = isBranchNameValid(body.name);
            new_err = new_err.concat(await isBranchNameUnique(body.name));
            if(new_err.length > 0) result.errors = result.errors.concat(new_err);
            else branch.name = body.name;
        }

    }

    return result;
}

function isBranchNameValid(name?: string)
{
    return isNameAlphaAndBetween(0,100, name);
}

async function isBranchNameUnique(name: string): Promise<ValidationError[]> {
    let errors: ValidationError[] = [];
    const branch = await AppDataSource
        .getRepository(Branch)
        .findOneBy({
            name: name
        });
    
    if(branch)
        errors.push(new ValidationError(GenerelValidationErrorCodes.NAME_INVALID_UNIQUE, "Ingredient name exists already"));
        errors.forEach(element => { console.log(element.code) });
    return errors;
}