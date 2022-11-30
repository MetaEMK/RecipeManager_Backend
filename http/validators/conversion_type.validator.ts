import { AppDataSource } from '../../config/datasource.js';
import { ValidationError, GenerelValidationErrorCodes } from './validationError.js';
import { createLogger, LOG_ENDPOINT } from '../../utils/logger.js';
import { isNameAlphaAndBetween } from './util.validator.js';
import { ConversionType } from '../../data/entities/conversion_type.entity.js';

const logger = createLogger();

function logError(message: string, errors: ValidationError[]) {
    let str = "";
    errors.forEach(error => { str = str + ', ' + error.code});
    logger.warn("CATEGORY: " + message + "\tErrorCodes: " + str, LOG_ENDPOINT.MAIN);
}

//TODO Create a function that checks if a category is valid

function isConversionTypeNameValid(name?: string)
{
    return isNameAlphaAndBetween(0,30, name);
}

async function isConversionTypeNameUnique(name: string): Promise<ValidationError[]> {
    let errors: ValidationError[] = [];
    const conversion_type = await AppDataSource
        .getRepository(ConversionType)
        .findOneBy({
            name: name
        });
    
    if(conversion_type)
        errors.push(new ValidationError(GenerelValidationErrorCodes.NAME_INVALID_UNIQUE, "Conversion Type name exists already"));
        errors.forEach(element => { console.log(element.code) });
    return errors;
}