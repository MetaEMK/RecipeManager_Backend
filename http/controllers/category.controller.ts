import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { decodeURISpaces, deleteResponse, generateSlug, getResponse, patchResponse, postResponse } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Category } from "../../data/entities/category.entity.js";
import { CategoryValidator } from "../validators/category.validator.js";
import { ValidationException } from "../../exceptions/ValidationException.js";

// Router instance
export const categoryRouter = express.Router();

// Logger instance
const logger = createLogger();

/**
 * Get all categories.
 * Able to filter the category name, slug and search for a specific recipe id.
 */
categoryRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const filterByName: string|undefined = decodeURISpaces(req.query?.name as string);
    const filterBySlug: string|undefined = decodeURISpaces(req.query?.slug as string);
    const filterByRecipeId: number = Number(req.query?.recipe);

    // Validator instance
    const validator: CategoryValidator = new CategoryValidator();

    // ORM query
    try {
        const query = AppDataSource
            .getRepository(Category)
            .createQueryBuilder("category");

        // Validation and sanitization for filter parameters
        if(validator.isValidCategoryName(filterByName))
            query.andWhere("category.name LIKE :categoryName", { categoryName: `%${ filterByName }%` });
        
        if(filterBySlug)
            query.andWhere("category.slug = :categorySlug", { categorySlug: generateSlug(filterBySlug) });

        if(filterByRecipeId) {
            query.leftJoin("category.recipes", "recipe")
                .andWhere("recipe.id = :recipeId", { recipeId: filterByRecipeId });
        }

        const categories = await query.getMany();

        getResponse(categories, res);
    } catch (err) {
        next(err);
    }
});

/**
 * Get a specific category.
 * 
 * Loads additional data
 * - Recipe realtion
 */
categoryRouter.get("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId: number = Number(req.params?.id);

    // Category instance
    let category: Category|null = null;

    // ORM query
    try {
        if (reqId) {
            category = await AppDataSource
                .getRepository(Category)
                .findOne({
                    where: {
                        id: reqId
                    },
                    relations: {
                        recipes: true
                    }
                });
        }

        if(category) {
            getResponse(category, res);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
});

/**
 * Create a category.
 */
categoryRouter.post("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqName: string = req.body?.name;

    // Category instance
    const category: Category = new Category();

    // Validator instance
    const validator: CategoryValidator = new CategoryValidator();

    // Validation
    if(validator.isValidCategoryName(reqName)) {
        category.name = reqName;
        category.slug = generateSlug(reqName);
    }

    // ORM query
    if(validator.getErrors().length === 0) {
        try {
            await AppDataSource
                .getRepository(Category)
                .save(category);

            postResponse(category, req, res);

            logger.info("Category " + category.id + " created.", LOG_ENDPOINT.DATABASE);
        } catch (err) {
            next(err);
        }
    } else {
        next(new ValidationException(validator.getErrors()));
    }
});

/**
 * (Partially) Update category.
 * Able to add and remove recipes.
 */
categoryRouter.patch("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId: number = Number(req.params?.id);
    const reqName: string = req.body?.name;
    const reqRecipesAdd: Array<number> = req.body?.recipe_ids?.add;
    const reqRecipesRmv: Array<number> = req.body?.recipe_ids?.rmv;

    // Category instance
    let category: Category|null = null;

    // Validator instance
    const validator: CategoryValidator = new CategoryValidator();

    // Validated parameters
    let validatedName: string|undefined = undefined;
    let validatedRecipesAdd: Array<number> = [];
    let validatedRecipesRmv: Array<number> = [];

    // Validation
    if(reqName)
        if(validator.isValidCategoryName(reqName))
            validatedName = reqName;

    if(reqRecipesAdd)
        if(validator.isValidIdArray(reqRecipesAdd))
            validatedRecipesAdd = reqRecipesAdd;
    
    if(reqRecipesRmv)
        if(validator.isValidIdArray(reqRecipesRmv))
            validatedRecipesRmv = reqRecipesRmv;

    // ORM query
    if(validator.getErrors().length === 0) {
        try {
            if (reqId) {
                category = await AppDataSource
                    .getRepository(Category)
                    .findOne({
                        where: {
                            id: reqId
                        }
                    });

                if (category) {
                    await AppDataSource.transaction(async (transactionalEntityManager) => {
                        // Update attributes
                        if(validatedName) {
                            category!.name = validatedName;
                            category!.slug = generateSlug(validatedName);

                            await transactionalEntityManager.save(category);
                        }

                        // Update many-to-many relations
                        await transactionalEntityManager
                            .createQueryBuilder()
                            .relation(Category, "recipes")
                            .of(category)
                            .addAndRemove(validatedRecipesAdd, validatedRecipesRmv);
                        
                        // Refresh entity
                        category = await transactionalEntityManager
                            .getRepository(Category)
                            .findOne({
                                where: {
                                    id: reqId
                                },
                                relations: {
                                    recipes: true
                                }
                            });
                        
                        logger.info("Category " + category!.id + " updated.", LOG_ENDPOINT.DATABASE);
                    });
                }
            }

            if(category) {
                patchResponse(category, res);
            } else {
                throw new HttpNotFoundException();
            }
        } catch (err) {
            next(err);
        }
    } else {
        next(new ValidationException(validator.getErrors()));
    }
});

/**
 * Delete a category.
 */
categoryRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId = Number(req.params.id);

    // Repository instance
    const repository = AppDataSource.getRepository(Category);

    // Category instance
    let category: Category|null = null;

    // ORM query
    try {
        if(reqId) {
            category = await repository
                .findOne({
                    where: {
                        id: reqId
                    }
                });
        }

        if (category) {
            await repository.remove(category);

            deleteResponse(res);

            logger.info("Category with ID " + reqId + " deleted.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
});