import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { decodeURISpaces, generateSlug, getResponse, postResponse, prepareForSqlInParams } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Recipe } from "../../data/entities/recipe.entity.js";
import { Variant } from "../../data/entities/variant.entity.js";
import { Ingredient } from "../../data/entities/ingredient.entity.js";
import { Ingredient as IngredientRequest, isIngredient as isIngredientRequest } from "../../interfaces/ingredient.interface.js";
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
 * - name
 * - size
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
            .innerJoin("variant.recipe", "recipe")
            .where("recipe.id = :recipeId", { recipeId: reqRecipeId });

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
                .innerJoinAndSelect("variant.ingredients", "ingredient")
                .innerJoinAndSelect("variant.recipe", "recipe")
                .innerJoinAndSelect("variant.size", "size")
                .where("variant.id = :id", { id: reqId })
                .andWhere("recipe.id = :recipeId", { recipeId: reqRecipeId })
                .getOne();
        }

        if (variant) {
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
            // Create all variant ingredients
            const ingredients = [];

            for (const data of reqIngredients) {
                const ingredient = new Ingredient();
                ingredient.name = data.name;
                ingredient.quantity = data.quantity;
                ingredient.unit = data.unit;
                ingredient.section = data.section;
                ingredient.order = data.order;
                
                ingredients.push(ingredient);
            }
            variant.ingredients = ingredients;

            await AppDataSource
                .getRepository(Variant)
                .save(variant);

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
 */
variantRouter.patch("/:id", async function (req: Request, res: Response, next: NextFunction) {

});

/**
 * Delete a recipe variant.
 */
variantRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {

});