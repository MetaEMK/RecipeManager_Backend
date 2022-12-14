import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { decodeURISpaces, deleteResponse, generateSlug, getResponse, patchResponse, postResponse, prepareForSqlInParams } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Branch } from "../../data/entities/branch.entity.js";
import { Category } from "../../data/entities/category.entity.js";
import { CategoryValidator } from "../validators/category.validator.js";
import { ValidationException } from "../../exceptions/ValidationException.js";
import { Brackets } from "typeorm";

// Router instance
export const categoryRouter = express.Router();

// Logger instance
const logger = createLogger();

/**
 * Get all categories.
 * 
 * Filter params
 * - name: Search for similar name
 * - slug: Search for exaxt same slug
 * - recipe: Search for (multiple) recipe ids
 * - recipeExclude: Exclude (multiple) recipe ids from search - Takes precedence over include
 * - recipeNone: Search for branches with no recipes
 */
categoryRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const filterByName: string = <string>req.query.name;
    const filterBySlug: string = <string>req.query.slug;

    let filterByRecipeIds: string|string[] = <string>req.query.recipe;
    let filterByRecipeExcludeIds: string|string[] = <string>req.query.recipeExclude;
    const filterByRecipeNone: string = <string>req.query.recipeNone;

    // Validator instance
    const validator = new CategoryValidator();

    // ORM query
    try {
        const query = AppDataSource
            .getRepository(Category)
            .createQueryBuilder("category");

        // Validate/Sanitize parameters and build where clause
        if(validator.isValidCategoryName(filterByName))
            query.andWhere("category.name LIKE :categoryName", { categoryName: `%${ decodeURISpaces(filterByName) }%` });
        
        if(filterBySlug)
            query.andWhere("category.slug = :categorySlug", { categorySlug: generateSlug(filterBySlug) });

        if(filterByRecipeIds || filterByRecipeExcludeIds || filterByRecipeNone) {
            query.leftJoin("category.recipes", "recipe");

            if((filterByRecipeIds || filterByRecipeNone) && !filterByRecipeExcludeIds) {
                query.andWhere(
                    new Brackets((qb) => {
                        if(filterByRecipeIds) {
                            filterByRecipeIds = prepareForSqlInParams(filterByRecipeIds);
    
                            if(validator.isValidIdArray(filterByRecipeIds))
                                qb.orWhere("recipe.id IN (:...recipeIds)", { recipeIds: filterByRecipeIds });
                        }

                        if(filterByRecipeNone === "true")
                            qb.orWhere("recipe.id IS NULL");
                    })
                );
            }

            if (filterByRecipeExcludeIds) {
                filterByRecipeExcludeIds = prepareForSqlInParams(filterByRecipeExcludeIds);
    
                if(validator.isValidIdArray(filterByRecipeExcludeIds)) {
                    query.andWhere(
                        new Brackets((qb) => {
                            qb.orWhere("recipe.id NOT IN (:...recipeExcludeIds)", { recipeExcludeIds: filterByRecipeExcludeIds });
                            qb.orWhere("recipe.id IS NULL");
                        })
                    );
                }
            }
        }

        const categories = await query.getMany();

        getResponse(categories, res);
    } catch (err) {
        next(err);
    }
});

/**
 * Get a specific category by id.
 */
categoryRouter.get("/:id", getOneCategory);

/**
 * Get a specific category by slug.
 */
categoryRouter.get("/slug/:slug", getOneCategory);

/**
 * Get specific category callback.
 * 
 * Loads additional data
 * - Recipe Branches: Distinct branches based on recipe relation
 */
async function getOneCategory(req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId: number = Number(req.params.id);
    const reqSlug: string = req.params.slug;

    // Category instance
    let category: Category|null = null;

    // Check which route and setup where clause with sanitized parameters
    let whereClause = {};

    if(reqId) {
        whereClause = {
            id: reqId
        };
    } else if(reqSlug) {
        whereClause = {
            slug: generateSlug(reqSlug)
        };
    }

    // ORM query
    try {
        if (reqId || reqSlug) {
            category = await AppDataSource
                .getRepository(Category)
                .findOne({
                    where: whereClause
                });

            if(category) {
                category.recipeBranches = await AppDataSource
                    .getRepository(Branch)
                    .createQueryBuilder("branch")
                    .innerJoin("branch.recipes", "recipe")
                    .innerJoin("recipe.categories", "category")
                    .where("category.id = :id", { id: category.id })
                    .getMany();
            }
        }

        if(category) {
            getResponse(category, res);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
}

/**
 * Create a category.
 */
categoryRouter.post("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqName: string = req.body.name;

    // Category instance
    const category = new Category();

    // Validator instance
    const validator = new CategoryValidator();

    // Validation/Sanitization
    if(validator.isValidCategoryName(reqName)) {
        category.name = reqName;
        category.slug = generateSlug(reqName);
    }

    // ORM query
    try {
        if(validator.getErrors().length === 0) {
            await AppDataSource
                .getRepository(Category)
                .save(category);

            postResponse(category, req, res);

            logger.info("Category " + category.id + " created.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new ValidationException(validator.getErrors());
        }        
    } catch (err) {
        next(err);
    }
});

/**
 * (Partially) Update category.
 * 
 * Able to add and remove recipes.
 */
categoryRouter.patch("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId: number = Number(req.params.id);
    const reqName: string = req.body.name;

    const reqRecipesAdd: Array<number> = req.body.recipe_ids?.add;
    const reqRecipesRmv: Array<number> = req.body.recipe_ids?.rmv;

    // Category instance
    let category: Category|null = null;

    // Validator instance
    const validator = new CategoryValidator();

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
    try {
        if(validator.getErrors().length === 0) {
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
                        }

                        await transactionalEntityManager.save(category);

                        // Update many-to-many relations
                        await transactionalEntityManager
                            .createQueryBuilder()
                            .relation(Category, "recipes")
                            .of(category)
                            .addAndRemove(validatedRecipesAdd, validatedRecipesRmv);
                        
                        logger.info("Category " + category!.id + " updated.", LOG_ENDPOINT.DATABASE);
                    });
                }
            }

            if(category) {
                patchResponse(category, res);
            } else {
                throw new HttpNotFoundException();
            }
        } else {
            throw new ValidationException(validator.getErrors());
        }        
    } catch (err) {
        next(err);
    }
});

/**
 * Delete a category.
 */
categoryRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId: number = Number(req.params.id);

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