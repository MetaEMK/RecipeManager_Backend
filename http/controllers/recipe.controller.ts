import express, { NextFunction, Request, Response } from "express";
import * as fs from "node:fs";
import { AppDataSource } from "../../config/datasource.js";
import { Brackets } from "typeorm";
import { decodeURISpaces, deleteResponse, generateRecipeImageURI, generateSlug, getResponse, normalizeURI, patchResponse, postResponse, prepareForSqlInParams } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Recipe } from "../../data/entities/recipe.entity.js";
import { RecipeValidator } from "../validators/recipe.validator.js";
import { ValidationException } from "../../exceptions/ValidationException.js";
import { uploadRecipeImages as upload } from "../../config/storage.js";

// Router instance
export const recipeRouter = express.Router();

// Logger instance
const logger = createLogger();

/**
 * Get all recipes.
 * 
 * Filter params:
 * - name: Search for similar name
 * - slug: Search for exact same slug
 * - branch: Search for (multiple) branch ids
 * - category: Search for (multiple) category ids 
 * - branchExclude: Exclude (multiple) branch ids from search - Takes precedence over include
 * - categoryExclude: Exclude (multiple) category ids from search - Takes precedence over include
 * - branchNone: Search for recipes with no branches
 * - categoryNone: Search for recipes with no categories 
 */
recipeRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const filterByName: string = <string>req.query.name;
    const filterBySlug: string = <string>req.query.slug;

    let filterByBranchIds: string|string[] = <string>req.query.branch;
    let filterByCategoryIds: string|string[] = <string>req.query.category;

    let filterByBranchExcludeIds: string|string[] = <string>req.query.branchExclude;
    let filterByCategoryExcludeIds: string|string[] = <string>req.query.categoryExclude;

    const filterByBranchNone: string = <string>req.query.branchNone;
    const filterByCategoryNone: string = <string>req.query.categoryNone;

    // Validation instance
    const validator = new RecipeValidator();

    // ORM query
    try {
        const query = AppDataSource
            .getRepository(Recipe)
            .createQueryBuilder("recipe");

        // Validate/Sanitize parameters and build where clause
        if(validator.isValidRecipeName(filterByName))
            query.andWhere("recipe.name LIKE :recipeName", { recipeName: `%${ decodeURISpaces(filterByName!) }%` });

        if(filterBySlug)
            query.andWhere("recipe.slug = :recipeSlug", { recipeSlug: generateSlug(filterBySlug) });

        if(filterByBranchIds || filterByBranchExcludeIds || filterByBranchNone) {
            query.leftJoin("recipe.branches", "branch");

            if((filterByBranchIds || filterByBranchNone) && !filterByBranchExcludeIds) {
                query.andWhere(
                    new Brackets((qb) => {
                        if(filterByBranchIds) {
                            filterByBranchIds = prepareForSqlInParams(filterByBranchIds);
                
                            if(validator.isValidIdArray(filterByBranchIds))
                                qb.orWhere("branch.id IN (:...branchIds)", { branchIds: filterByBranchIds });
                        }
                        
                        if(filterByBranchNone === "true")
                            qb.orWhere("branch.id IS NULL");
                    })
                );
            }

            if(filterByBranchExcludeIds) {
                filterByBranchExcludeIds = prepareForSqlInParams(filterByBranchExcludeIds);
    
                if(validator.isValidIdArray(filterByBranchExcludeIds)) {
                    query.andWhere(
                        new Brackets((qb) => {
                            qb.orWhere("branch.id NOT IN (:...branchExcludeIds)", { branchExcludeIds: filterByBranchExcludeIds });
                            qb.orWhere("branch.id IS NULL");
                        })
                    );
                }
            }
        }

        if(filterByCategoryIds || filterByCategoryExcludeIds || filterByCategoryNone) {
            query.leftJoin("recipe.categories", "category");

            if (filterByCategoryIds || filterByCategoryNone && !filterByCategoryExcludeIds) {
                query.andWhere(
                    new Brackets((qb) => {
                        if(filterByCategoryIds) {
                            filterByCategoryIds = prepareForSqlInParams(filterByCategoryIds);
                
                            if (validator.isValidIdArray(filterByCategoryIds))
                                qb.orWhere("category.id IN (:...categoryIds)", { categoryIds: filterByCategoryIds });
                        }
    
                        if(filterByCategoryNone === "true")
                            qb.orWhere("category.id IS NULL");
                    })
                );
            }

            if(filterByCategoryExcludeIds) {
                filterByCategoryExcludeIds = prepareForSqlInParams(filterByCategoryExcludeIds);

                if(validator.isValidIdArray(filterByCategoryExcludeIds))
                    query.andWhere(
                        new Brackets((qb) => {
                            qb.orWhere("category.id NOT IN (:...categoryExcludeIds)", { categoryExcludeIds: filterByCategoryExcludeIds});
                            qb.orWhere("category.id IS NULL");
                        })
                    );
            }
        }

        const recipes = await query.getMany();

        // Generate public image uri
        recipes.forEach((recipe) => {
            if(recipe.imagePath)
                recipe.imagePath = generateRecipeImageURI(recipe.id, recipe.imagePath, req);
        });

        getResponse(recipes, res);
    } catch (err) {
        next(err);
    }
});

/**
 * Get a specific recipe by id.
 */
recipeRouter.get("/:id", getOneRecipe);

/**
 * Get a specific recipe by slug.
 */
 recipeRouter.get("/slug/:slug", getOneRecipe);

/**
 * Get specific recipe callback.
 */
async function getOneRecipe(req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId: number = Number(req.params.id);
    const reqSlug: string = req.params.slug;

    // Recipe instance
    let recipe: Recipe|null = null;

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
        if(reqId || reqSlug) {
            recipe = await AppDataSource
                .getRepository(Recipe)
                .findOne({
                    where: whereClause
                });
        }

        if (recipe) {
            if(recipe.imagePath)
                recipe.imagePath = generateRecipeImageURI(recipe.id, recipe.imagePath, req);
            
            getResponse(recipe, res);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
}

/**
 * Create a recipe.
 */
recipeRouter.post("/", upload.single("image"), async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqName: string = req.body.name;
    const reqDesc: string = req.body.description;

    const reqFilePath: string = req.file?.path || "";

    // Recipe instance
    const recipe = new Recipe();

    // Validator instance
    const validator = new RecipeValidator();

    // Validation/Sanitization
    if(validator.isValidRecipeName(reqName)) {
        recipe.name = reqName;
        recipe.slug = generateSlug(reqName);
    }

    if(validator.isValidRecipeDescription(reqDesc))
        recipe.description = reqDesc;

    if(reqFilePath) {
        recipe.imagePath = normalizeURI(reqFilePath);
    }

    // ORM query
    try {
        if(validator.getErrors().length === 0) {
            await AppDataSource
                .getRepository(Recipe)
                .save(recipe);

            if(recipe.imagePath)
                recipe.imagePath = generateRecipeImageURI(recipe.id, recipe.imagePath, req);

            postResponse(recipe, req, res);

            logger.info("Recipe " + recipe.id + " created.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new ValidationException(validator.getErrors());
        }
    } catch (err) {
        // Delete uploaded image
        if(fs.existsSync(reqFilePath))
            fs.rmSync(reqFilePath);

        next(err);
    }
});

/**
 * (Partially) Update a recipe.
 * 
 * Able to add and remove branches.
 * Able to add and remove categories.
 */
recipeRouter.patch("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId: number = Number(req.params.id);
    const reqName: string = req.body.name;
    const reqDesc: string = req.body.description;

    const reqBranchesAdd: Array<number> = req.body.branch_ids?.add;
    const reqBranchesRmv: Array<number> = req.body.branch_ids?.rmv;

    const reqCategoriesAdd: Array<number> = req.body.category_ids?.add;
    const reqCategoriesRmv: Array<number> = req.body.category_ids?.rmv;

    // Recipe instance
    let recipe: Recipe|null = null;

    // Validator instance
    const validator = new RecipeValidator();

    // Validated parameters
    let validatedName: string|undefined = undefined;
    let validatedDesc: string|null = null;
    let validatedBranchesAdd: Array<number> = [];
    let validatedBranchesRmv: Array<number> = [];
    let validatedCategoriesAdd: Array<number> = [];
    let validatedCategoriesRmv: Array<number> = [];

    // Validation
    if(reqName)
        if(validator.isValidRecipeName(reqName))
            validatedName = reqName;

    if(reqDesc || reqDesc === null)
        if(validator.isValidRecipeDescription(reqDesc))
            validatedDesc = reqDesc;

    if(reqBranchesAdd)
        if(validator.isValidIdArray(reqBranchesAdd))
            validatedBranchesAdd = reqBranchesAdd;

    if(reqBranchesRmv)
        if(validator.isValidIdArray(reqBranchesRmv))
            validatedBranchesRmv = reqBranchesRmv;

    if(reqCategoriesAdd)
        if(validator.isValidIdArray(reqCategoriesAdd))
            validatedCategoriesAdd = reqCategoriesAdd;

    if(reqCategoriesRmv)
        if(validator.isValidIdArray(reqCategoriesRmv))
            validatedCategoriesRmv = reqCategoriesRmv;
            
    // ORM query
    try {
        if (validator.getErrors().length === 0) {
            if(reqId) {
                recipe = await AppDataSource
                    .getRepository(Recipe)
                    .findOne({
                        where: {
                            id: reqId
                        }
                    });
                
                if (recipe) {
                    await AppDataSource.transaction(async (transactionalEntityManager) => {
                        // Update attributes
                        if(validatedName) {
                            recipe!.name = validatedName;
                            recipe!.slug = generateSlug(validatedName);
                        }

                        if(validatedDesc || validatedDesc === null)
                            recipe!.description = validatedDesc;

                        await transactionalEntityManager.save(recipe);

                        // Update many-to-many and one-to-many relations
                        await transactionalEntityManager
                            .createQueryBuilder()
                            .relation(Recipe, "branches")
                            .of(recipe)
                            .addAndRemove(validatedBranchesAdd, validatedBranchesRmv);

                        await transactionalEntityManager
                            .createQueryBuilder()
                            .relation(Recipe, "categories")
                            .of(recipe)
                            .addAndRemove(validatedCategoriesAdd, validatedCategoriesRmv);

                        logger.info("Recipe " + recipe!.id + " updated.", LOG_ENDPOINT.DATABASE);
                    });
                }
            }

            if(recipe) {
                if(recipe.imagePath)
                    recipe.imagePath = generateRecipeImageURI(recipe.id, recipe.imagePath, req);

                patchResponse(recipe, res);
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
 * Delete a recipe.
 */
recipeRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId: number = Number(req.params.id);

    // Repository instance
    const repository = AppDataSource.getRepository(Recipe);

    // Recipe instance
    let recipe: Recipe|null = null;

    // ORM query
    try {
        if(reqId) {
            recipe = await repository
                .findOne({
                    where: {
                        id: reqId
                    }
                });
        }

        if (recipe) {
            const imagePath = recipe.imagePath;
            await repository.remove(recipe);

            // Delete corresponding image
            if(imagePath)
                if(fs.existsSync(imagePath))
                    fs.rmSync(imagePath);

            deleteResponse(res);

            logger.info("Recipe with ID " + reqId + " deleted.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
});