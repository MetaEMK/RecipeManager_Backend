import { AppDataSource } from '../../config/datasource.js';
import validator from 'validator';
import { Ingredient } from '../../data/entities/ingredient.entity.js';
import { ValidationResult } from './validationResult.js';
import { ValidationError, GenerelValidationErrorCodes } from './validationError.js';
import { createLogger, LOG_ENDPOINT } from '../../utils/logger.js';

const logger = createLogger();

function logError(message: string, errors: ValidationError[]) {
    let str = "";
    errors.forEach(error => { str = str + ', ' + error.code});
    logger.info(message + "\tErrorCodes: " + str, LOG_ENDPOINT.MAIN);
}

export async function canCreateIngredient(name: string): Promise<ValidationResult> {
    let result: ValidationResult = new ValidationResult();

    // Validate name
    result.errors = isIngredientNameValid(name);
    
    // Check if name is unique
    if(result.errors.length > 0) 
    {
        let new_errors = await isIngredientNameUnique(name);
        if (new_errors.length > 0) {
            result.errors = new_errors;
        }
    }

    // Return result
    if(result.errors) logError("Ingredient validation failed.", result.errors);
    else 
    {
        result.validatedData = {
            name: name
        };
        logger.info("Ingredient validation succeeded.", LOG_ENDPOINT.MAIN);
    }
    return result;
}

function isIngredientNameValid(name?: string): ValidationError[] {
    let errors: ValidationError[] = [];
    if(!name)
        errors.push(new ValidationError(GenerelValidationErrorCodes.NAME_INVALID, "Name is required"));

    else {
        if(!(validator.isAlpha(name)))
            errors.push(new ValidationError(GenerelValidationErrorCodes.NAME_INVALID, "Name must be alphabetic"));

        if(!(validator.isLength(name, {min: 3, max: 100})))
            errors.push(new ValidationError(GenerelValidationErrorCodes.NAME_INVALID_LENGTH, "Name must be between 3 and 100 characters"));
    }
    return errors;
}

async function isIngredientNameUnique(name: string): Promise<ValidationError[]> {
    let errors: ValidationError[] = [];
    const ingredient = await AppDataSource
        .getRepository(Ingredient)
        .findOneBy({
            name: name
        });
    
    if(ingredient)
        errors.push(new ValidationError(GenerelValidationErrorCodes.NAME_INVALID_UNIQUE, "Ingredient name exists already"));

    return errors;
}