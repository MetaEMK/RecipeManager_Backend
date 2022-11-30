import { AppDataSource } from '../../config/datasource.js';
import { ValidationError, GenerelValidationErrorCodes } from './validationError.js';
import { createLogger, LOG_ENDPOINT } from '../../utils/logger.js';
import { areIdsUnique, isNameAlphaAndBetween } from './util.validator.js';
import { Recipe } from '../../data/entities/recipe.entity.js';
import { Category } from '../../data/entities/category.entity.js';
import { Branch } from '../../data/entities/branch.entity.js';

const logger = createLogger();

function logError(message: string, errors: ValidationError[]) {
    let str = "";
    errors.forEach(error => { str = str + ', ' + error.code});
    logger.warn("CATEGORY: " + message + "\tErrorCodes: " + str, LOG_ENDPOINT.MAIN);
}

//TODO Create a function that checks if a category is valid


function isRecipeNameValid(name?: string): ValidationError[] 
{
    return isNameAlphaAndBetween(0, 255, name);
}

export async function createRecipeValidation(body: any )
{
    let errors: ValidationError[] = [];
    let recipe = new Recipe();

    let category_ids: number[] = body.categories;
    let branch_ids: number[] = body.branches;
    errors = errors.concat(areIdsUnique(category_ids));
    errors = errors.concat(areIdsUnique(branch_ids));

    let category_task: Promise<Category|null>[] = [];
    let branch_task: Promise<Branch|null>[] = [];

    category_ids.forEach((id: number) => {
        category_task.push(AppDataSource.getRepository(Category).findOneBy({id: id}))
    });

    branch_ids.forEach((id: number) => {
        branch_task.push(AppDataSource.getRepository(Branch).findOneBy({id: id}))
    });

    //Recipe name:
    let name_err = isRecipeNameValid(body.name);
    name_err = name_err.concat(await isRecipeNameUnique(body.name));
    if(name_err.length > 0)
        errors = errors.concat(name_err);
    else
        recipe.name = body.name;
    

    //Recipe description:
    recipe.description = body.description ? body.description : "";

    //Category:
    category_task.forEach(async cat => {
        if(await cat === null)
            errors.push(new ValidationError(GenerelValidationErrorCodes.CATEGORY_DOES_NOT_EXIST, "Category does not exist"));
    });

    //Branch:
    branch_task.forEach(async branch => {
        if(await branch === null)
            errors.push(new ValidationError(GenerelValidationErrorCodes.BRANCH_DOES_NOT_EXIST, "Branch does not exist"));
    });
}


async function isRecipeNameUnique(name: string): Promise<ValidationError[]> {
    let errors: ValidationError[] = [];
    const recipe = await AppDataSource
        .getRepository(Recipe)
        .findOneBy({
            name: name
        });
    
    if(recipe)
        errors.push(new ValidationError(GenerelValidationErrorCodes.NAME_INVALID_UNIQUE, "Ingredient name exists already"));
        errors.forEach(element => { console.log(element.code) });
    return errors;
}