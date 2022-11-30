import { AppDataSource } from '../../config/datasource.js';
import validator from 'validator';
import { Category } from '../../data/entities/category.entity.js';
import { ValidationResult } from './validationResult.js';
import { ValidationError, GenerelValidationErrorCodes } from './validationError.js';
import { createLogger, LOG_ENDPOINT } from '../../utils/logger.js';
import { isNameAlphaAndBetween } from './util.validator.js';

const logger = createLogger();

function logError(message: string, errors: ValidationError[]) {
    let str = "";
    errors.forEach(error => { str = str + ', ' + error.code});
    logger.warn("CATEGORY: " + message + "\tErrorCodes: " + str, LOG_ENDPOINT.MAIN);
}

//TODO Create a function that checks if a category is valid

function isCategoryNameValid(name?: string)
{
    return isNameAlphaAndBetween(0,100, name);
}

async function isCategoryNameUnique(name: string): Promise<ValidationError[]> {
    let errors: ValidationError[] = [];
    const category = await AppDataSource
        .getRepository(Category)
        .findOneBy({
            name: name
        });
    
    if(category)
        errors.push(new ValidationError(GenerelValidationErrorCodes.NAME_INVALID_UNIQUE, "Ingredient name exists already"));
        errors.forEach(element => { console.log(element.code) });
    return errors;
}