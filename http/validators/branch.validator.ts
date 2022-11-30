import { AppDataSource } from '../../config/datasource.js';
import validator from 'validator';
import { ValidationError, GenerelValidationErrorCodes } from './validationError.js';
import { createLogger, LOG_ENDPOINT } from '../../utils/logger.js';
import { isNameAlphaAndBetween } from './util.validator.js';
import { Branch } from '../../data/entities/branch.entity.js';

const logger = createLogger();

function logError(message: string, errors: ValidationError[]) {
    let str = "";
    errors.forEach(error => { str = str + ', ' + error.code});
    logger.warn("CATEGORY: " + message + "\tErrorCodes: " + str, LOG_ENDPOINT.MAIN);
}

//TODO Create a function that checks if a branch is valid

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