import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { decodeURISpaces, deleteResponse, generateRecipeImageURI, getResponse, patchResponse, postResponse, prepareForSqlInParams } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Recipe } from "../../data/entities/recipe.entity.js";
import { Variant } from "../../data/entities/variant.entity.js";
import { Ingredient } from "../../data/entities/ingredient.entity.js";
import { Ingredient as IngredientRequest } from "../../interfaces/ingredient.interface.js";
import { VariantValidator } from "../validators/variant.validator.js";
import { ValidationException } from "../../exceptions/ValidationException.js";
import { Size } from "../../data/entities/size.entity.js";
import { SQLiteForeignKeyException } from "../../exceptions/SQLiteForeignKeyException.js";

// Router instance
export const variantRouter = express.Router({
    mergeParams: true
});

// Logger instance
const logger = createLogger();

/**
 * Get all recipe variants.
 * 
 * Filter params
 * - name: Search for similar name
 * - size: Search for (multiple) size ids
 */
variantRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqRecipeId: number = Number(req.params.recipeId);
    const filterByName: string = <string>req.query.name;

    let filterBySizeIds: string|string[] = <string>req.query.size;

    // Validator instance
    const validator = new VariantValidator();

    // ORM query
    try {
        if(!reqRecipeId)
            throw new HttpNotFoundException();

        const query = AppDataSource
            .getRepository(Variant)
            .createQueryBuilder("variant")
            .innerJoinAndSelect("variant.size", "size")
            .innerJoinAndSelect("size.conversionType", "conversionType")
            .where("variant.recipe_id = :recipeId", { recipeId: reqRecipeId });

        // Validate/Sanitize parameters and build where clause
        if (validator.isValidVariantName(filterByName))
            query.andWhere("variant.name LIKE :variantName", { variantName: `%${ decodeURISpaces(filterByName) }%` });

        if (filterBySizeIds) {
            filterBySizeIds = prepareForSqlInParams(filterBySizeIds);

            if(validator.isValidIdArray(filterBySizeIds)) {
                query.innerJoin("variant.size", "size")
                    .andWhere("size.id IN (:...sizeIds)", { sizeIds: filterBySizeIds });
            }
        }

        const variants = await query.getMany();

        getResponse(variants, res);
    } catch (err) {
        next(err);
    }
});

/**
 * Get a specific recipe variant.
 * 
 * Loads relation:
 * - Recipe
 * - Size
 * - Conversion Type of Size
 * - Ingredients
 */
variantRouter.get("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqRecipeId: number = Number(req.params.recipeId);
    const reqId: number = Number(req.params.id);

    // Variant instance
    let variant: Variant|null = null;

    // ORM query
    try {
        if (reqRecipeId && reqId) {
            variant = await AppDataSource
                .getRepository(Variant)
                .createQueryBuilder("variant")
                .leftJoinAndSelect("variant.ingredients", "ingredient")
                .innerJoinAndSelect("variant.recipe", "recipe")
                .innerJoinAndSelect("variant.size", "size")
                .innerJoinAndSelect("size.conversionType", "conversionType")
                .where("variant.id = :id", { id: reqId })
                .andWhere("recipe.id = :recipeId", { recipeId: reqRecipeId })
                .getOne();
        }

        if (variant) {
            if (variant.recipe.imagePath)
                variant.recipe.imagePath = generateRecipeImageURI(variant.recipe.id, variant.recipe.imagePath, req);

            getResponse(variant, res);    
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
});

/**
 * Create a recipe variant.
 */
variantRouter.post("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqRecipeId: number = Number(req.params.recipeId);

    const reqName: string = req.body.name;
    const reqDesc: string = req.body.description;
    const reqSizeId: number = Number(req.body.size);
    const reqIngredients: Array<IngredientRequest> = req.body.ingredients;

    // Variant instance
    const variant = new Variant();

    // Validator instance
    const validator = new VariantValidator();

    // ORM query
    try {
        // Check first if parent resource exists
        if(!reqRecipeId)
            throw new HttpNotFoundException();

        const recipe = await AppDataSource
            .getRepository(Recipe)
            .findOne({
                where: {
                    id: reqRecipeId
                }
            });

        if(!recipe)
            throw new HttpNotFoundException();

        // Foreign keys
        if(!reqSizeId)
            throw new SQLiteForeignKeyException("variant", "size");
    
        const size = await AppDataSource
            .getRepository(Size)
            .findOne({
                where: {
                    id: reqSizeId
                }
            });

        if(!size)
            throw new SQLiteForeignKeyException("variant", "size");

        // Validatation
        if(validator.isValidVariantName(reqName))
            variant.name = reqName;

        if(validator.isValidVariantDescription(reqDesc))
            variant.description = reqDesc;

        validator.isValidIngredientsArray(reqIngredients);

        // Set parent and foreign key
        variant.recipe = recipe;
        variant.size = size;

        if (validator.getErrors().length === 0) {
            if(reqIngredients)
                variant.ingredients = prepareIngredients(reqIngredients);

            await AppDataSource
                .getRepository(Variant)
                .save(variant);

            if (variant.recipe.imagePath)
                variant.recipe.imagePath = generateRecipeImageURI(variant.recipe.id, variant.recipe.imagePath, req);

            postResponse(variant, req, res);

            logger.info("Variant " + variant.id + " created.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new ValidationException(validator.getErrors());
        }
    } catch (err) {
        next(err);
    }
});

/**
 * (Partially) Update a recipe variant.
 * 
 * Able to add and remove recipes.
 */
variantRouter.patch("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqRecipeId: number = Number(req.params.recipeId);
    const reqId: number = Number(req.params.id);

    const reqName: string = req.body.name;
    const reqDesc: string = req.body.description;
    const reqSizeId: number = Number(req.body.size);

    const reqIngredientsAdd: Array<IngredientRequest> = req.body.ingredients?.add;
    const reqIngredientsRmv: Array<number> = req.body.ingredients?.rmv;

    // Variant instance
    let variant: Variant|null = null;

    // Validator instance
    const validator = new VariantValidator();

    // Validated parameters
    let validatedName: string|undefined = undefined;
    let validatedDesc: string|null|undefined = undefined;
    let validatedSizeId: number|undefined = undefined;
    let validatedIngredientsAdd: Array<IngredientRequest>|undefined = undefined;
    let validatedIngredientsRmv: Array<number>|undefined = undefined;

    // Validation
    if (reqName)
        if (validator.isValidVariantName(reqName))
            validatedName = reqName;

    if (reqDesc || reqDesc === null)
        if(validator.isValidVariantDescription(reqDesc))
            validatedDesc = reqDesc;

    if(reqSizeId)
        validatedSizeId = reqSizeId;

    if(validator.isValidIngredientsArray(reqIngredientsAdd))
        validatedIngredientsAdd = reqIngredientsAdd;

    if(validator.isValidIdArray(reqIngredientsRmv) && reqIngredientsRmv.length > 0)
        validatedIngredientsRmv = reqIngredientsRmv;

    // ORM query
    try {
        if (validator.getErrors().length === 0) {
            if (reqRecipeId && reqId) {
                variant = await AppDataSource
                    .getRepository(Variant)
                    .createQueryBuilder("variant")
                    .where("variant.recipe_id = :recipeId", { recipeId: reqRecipeId })
                    .andWhere("variant.id = :id", { id: reqId })
                    .getOne();
                
                if (variant) {
                    await AppDataSource.transaction(async (transactionalEntityManager) => {
                        // Delete ingredients first so that ingredients can be created again with same composite unique key
                        if (validatedIngredientsRmv) {
                            await transactionalEntityManager
                                .getRepository(Ingredient)
                                .delete(validatedIngredientsRmv);
                        }

                        // Refresh entity
                        variant = await AppDataSource
                            .getRepository(Variant)
                            .createQueryBuilder("variant")
                            .leftJoinAndSelect("variant.ingredients", "ingredients")
                            .innerJoinAndSelect("variant.size", "size")
                            .where("variant.recipe_id = :recipeId", { recipeId: reqRecipeId })
                            .andWhere("variant.id = :id", { id: reqId })
                            .getOne();

                        // Update attributes
                        if (validatedName)
                            variant!.name = validatedName;

                        if (validatedDesc || validatedDesc === null)
                            variant!.description = validatedDesc;

                        if (validatedSizeId) {
                            const size = await transactionalEntityManager
                                .getRepository(Size)
                                .findOne({
                                    where: {
                                        id: validatedSizeId
                                    }
                                });

                            if(!size)
                                throw new SQLiteForeignKeyException("variant", "size");

                            variant!.size = size;
                        }

                        if (validatedIngredientsAdd) {
                            variant!.ingredients = [...variant!.ingredients, ...prepareIngredients(validatedIngredientsAdd)];
                        }

                        await transactionalEntityManager.save(variant);

                        logger.info("Variant " + variant!.id + " updated.", LOG_ENDPOINT.DATABASE);
                    });
                }
            }

            if (variant) {
                patchResponse(variant, res);
            } else {
                throw new HttpNotFoundException()
            }
        } else {
            throw new ValidationException(validator.getErrors());
        }
    } catch (err) {
        next(err);
    }
});

/**
 * Delete a recipe variant.
 */
variantRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqRecipeId: number = Number(req.params.recipeId);
    const reqId: number = Number(req.params.id);

    // Repository instance
    const repository = AppDataSource.getRepository(Variant);

    // Variant instance
    let variant: Variant|null = null;

    // ORM query
    try {
        if(reqRecipeId && reqId) {
            variant = await repository
                .createQueryBuilder("variant")
                .where("variant.id = :id", { id: reqId })
                .andWhere("variant.recipe_id = :recipeId", { recipeId: reqRecipeId })
                .getOne();
        }

        if (variant) {
            await repository.remove(variant);

            deleteResponse(res);

            logger.info("Variant with ID " + reqId + " deleted.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
});

/**
 * Helper function to prepare ingredient entities.
 * 
 * @param reqIngredients Valid IngredientRequest array
 * @returns Array with Ingredient entities
 */
function prepareIngredients(reqIngredients: Array<IngredientRequest>): Array<Ingredient>
{
    const ingredients: Array<Ingredient> = [];

    for (const data of reqIngredients) {
        const ingredient = new Ingredient();
        ingredient.name = data.name;
        ingredient.quantity = data.quantity;
        ingredient.unit = data.unit;
        ingredient.section = data.section;
        ingredient.order = data.order;
        
        ingredients.push(ingredient);
    }

    return ingredients;
}