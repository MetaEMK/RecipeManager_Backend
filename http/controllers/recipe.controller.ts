import express, { NextFunction, Request, Response } from "express";
import * as fs from "node:fs";
import path from "path";
import { AppDataSource } from "../../config/datasource.js";
import { decodeURISpaces, deleteResponse, generatePublicURI, generateSlug, getResponse, patchResponse, postResponse } from "../../utils/controller.util.js";
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
 * Able to filter the recipe name, slug and search for a specific branch id or category id.
 */
recipeRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const filterByName: string|undefined = decodeURISpaces(req.query?.name as string);
    const filterBySlug: string|undefined = decodeURISpaces(req.query?.slug as string);
    const filterByBranchId: number = Number(req.query?.branch);
    const filterByCategoryId: number = Number(req.query?.category);

    // Validation instance
    const validator: RecipeValidator = new RecipeValidator();

    // ORM query
    try {
        const query = AppDataSource
            .getRepository(Recipe)
            .createQueryBuilder("recipe");

        // Validation and sanitization for filter parameters
        if(validator.isValidRecipeName(filterByName))
            query.andWhere("recipe.name LIKE :recipeName", { recipeName: `%${ filterByName }%` });

        if(filterBySlug)
            query.andWhere("recipe.slug = :recipeSlug", { recipeSlug: generateSlug(filterBySlug) });

        if(filterByBranchId) {
            query.leftJoin("recipe.branches", "branch")
                .andWhere("branch.id = :branchId", { branchId: filterByBranchId });
        }

        if(filterByCategoryId) {
            query.leftJoin("recipe.categories", "category")
                .andWhere("category.id = :categoryId", { categoryId: filterByCategoryId });
        }

        const recipes = await query.getMany();

        recipes.forEach((recipe) => {
            if(recipe.imagePath)
                recipe.imagePath = generatePublicURI(recipe.imagePath, req);
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
 * 
 * Loads additional data
 * - Branch relation
 * - Category relation
 * - Variant relation
 */
async function getOneRecipe(req: Request, res: Response, next: NextFunction)
{
    // Parameters
    const reqId: number = Number(req.params?.id);
    const reqSlug: string = req.params?.slug;

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
                    where: whereClause,
                    relations: {
                        branches: true,
                        categories: true,
                        variants: true
                    }
                });
        }

        if (recipe) {
            if(recipe.imagePath)
                recipe.imagePath = generatePublicURI(recipe.imagePath, req);
            
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
    const reqName: string = req.body?.name;
    const reqDesc: string = req.body?.description;
    const reqFilePath: string = req.file?.path || "";

    // Recipe instance
    const recipe: Recipe = new Recipe();

    // Validator instance
    const validator: RecipeValidator = new RecipeValidator();

    // Validation and sanitization
    if(validator.isValidRecipeName(reqName)) {
        recipe.name = reqName;
        recipe.slug = generateSlug(reqName);
    }

    if(validator.isValidRecipeDescription(reqDesc))
        recipe.description = reqDesc;

    if(reqFilePath) {
        recipe.imagePath = path
            .normalize(reqFilePath)
            .split(path.sep)
            .join("/");
    }

    // ORM query
    try {
        if(validator.getErrors().length === 0) {
            await AppDataSource
                .getRepository(Recipe)
                .save(recipe);

            if(recipe.imagePath)
                recipe.imagePath = generatePublicURI(recipe.imagePath, req);

            postResponse(recipe, req, res);

            logger.info("Recipe " + recipe.id + " created.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new ValidationException(validator.getErrors());
        }
    } catch (err) {
        // Delete uploaded image
        if(fs.existsSync(reqFilePath)) {
            fs.rmSync(reqFilePath);
        }

        next(err);
    }
});

/**
 * (Partially) Update a recipe.
 * Able to add and remove branches.
 * Able to add and remove categories.
 */
recipeRouter.patch("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId: number = Number(req.params?.id);
    const reqName: string = req.body?.name;
    const reqDesc: string = req.body?.description;
    const reqBranchesAdd: Array<number> = req.body?.branch_ids?.add;
    const reqBranchesRmv: Array<number> = req.body?.branch_ids?.rmv;
    const reqCategoriesAdd: Array<number> = req.body?.category_ids?.add;
    const reqCategoriesRmv: Array<number> = req.body?.category_ids?.rmv;

    // Recipe instance
    let recipe: Recipe|null = null;

    // Validator instance
    const validator: RecipeValidator = new RecipeValidator();

    // Validated parameters
    let validatedName: string|undefined = undefined;
    let validatedDesc: string|undefined = undefined;
    let validatedBranchesAdd: Array<number> = [];
    let validatedBranchesRmv: Array<number> = [];
    let validatedCategoriesAdd: Array<number> = [];
    let validatedCategoriesRmv: Array<number> = [];

    // Validation
    if(reqName)
        if(validator.isValidRecipeName(reqName))
            validatedName = reqName;

    if(reqDesc)
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

                        if(validatedDesc)
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

                        // Refresh entity
                        recipe = await transactionalEntityManager
                            .getRepository(Recipe)
                            .findOne({
                                where: {
                                    id: reqId
                                },
                                relations: {
                                    branches: true,
                                    categories: true,
                                    variants: true
                                }
                            });

                        logger.info("Recipe " + recipe!.id + " updated.", LOG_ENDPOINT.DATABASE);
                    });
                }
            }

            if(recipe) {
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
    const reqId = Number(req.params.id);

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
            // Delete corresponding image afterwards
            const imagePath = recipe.imagePath;
            await repository.remove(recipe);

            if(fs.existsSync(imagePath)) {
                fs.rmSync(imagePath);
            }

            deleteResponse(res);

            logger.info("Recipe with ID " + reqId + " deleted.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
});