import { AppDataSource } from '../../config/datasource.js';
import validator from 'validator';
import { Ingredient } from '../../data/entities/ingredient.entity.js';
import { ValidationResult } from './validationResult.js';
import { ValidationError, GenerelValidationErrorCodes } from './validationError.js';
import { createLogger, LOG_ENDPOINT } from '../../utils/logger.js';
import { Category } from '../../data/entities/category.entity.js';
import { Recipe } from '../../data/entities/recipe.entity.js';
import { Branch } from '../../data/entities/branch.entity.js';

//TODO - Add general validation for all entities


export function areIdsUnique(ids: number[]): ValidationError[]
{
    let errors: ValidationError[] = [];
    for (let index = 0; index < ids.length; index++) {
        const id = ids.pop();
        if (id) 
            if(ids.includes(id)) errors.push(new ValidationError(GenerelValidationErrorCodes.ID_INVALID_UNIQUE, "Id is not unique"));
            else errors.push(new ValidationError(GenerelValidationErrorCodes.ID_INVALID, "Id is invalid"));
    }
    return errors;
}

export function isNameAlphaAndBetween(min: number, max: number, name?: string,): ValidationError[] {
    let errors: ValidationError[] = [];
    if(!name)
        errors.push(new ValidationError(GenerelValidationErrorCodes.NAME_MISSING, "Name is required"));

    else {
        if(!(validator.isAlpha(name)))
            errors.push(new ValidationError(GenerelValidationErrorCodes.NAME_INVALID, "Name must be alphabetic"));

        if(!(validator.isLength(name, {min: min, max: max})))
            errors.push(new ValidationError(GenerelValidationErrorCodes.NAME_INVALID_LENGTH, `Name must be between ${min} and ${max} characters`));
    }
    return errors;
}


export async function getCategoryById(category_id: number): Promise<Category|null>
{
    const category = await AppDataSource
        .getRepository(Category)
        .findOneBy({
                id: category_id
            });

    if(!category)
        return null;
    else
        return category;
}

export async function getIngredientById(ingredient_id: number): Promise<Ingredient|null>
{
    const ingredient = await AppDataSource
        .getRepository(Ingredient)
        .findOneBy({
                id: ingredient_id
            });

    if(!ingredient)
        return null;
    else
        return ingredient;
}

export async function getRecipeById(recipe_id: number): Promise<Recipe|null>
{
    const recipe = await AppDataSource
        .getRepository(Recipe)
        .findOneBy({
                id: recipe_id
            });

    if(!recipe)
        return null;
    else
        return recipe;
}

export async function getBranchById(branch_id: number): Promise<Branch|null>
{
    const branch = await AppDataSource
        .getRepository(Branch)
        .findOneBy({
                id: branch_id
            });

    if(!branch)
        return null;
    else
        return branch;
}