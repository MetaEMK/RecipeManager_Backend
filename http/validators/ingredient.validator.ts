import validator from 'validator';
import { AppDataSource } from '../../config/datasource.js';
import { Ingredient } from '../../data/entities/ingredient.entity.js';


export async function isIngredientNameValid(name: string): Promise<Error || null> {
    let status = true;
    if(!validator.isAlpha(name)) status = false;
    if(! await isIngredientNameUnique(name)) status = false;
    return status;;
}

export async function isIngredientNameUnique(name: string): Promise<boolean> {
    const ingredient = await AppDataSource.getRepository(Ingredient);
    let filter = await ingredient.findOneBy({name: name}) == null;
    if(!filter) console.log("Ingredient name already exists");
    return filter;
}

class ValidationError 
{
    public code: string;
    public message: string;
}

class Response {
    public errors: ValidationError[];
    public isValid: boolean;
    public validatedData: object;
}