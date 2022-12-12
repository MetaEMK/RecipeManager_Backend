import express, { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { decodeURISpaces, deleteResponse, generateSlug, getResponse, patchResponse, postResponse } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Branch } from "../../data/entities/branch.entity.js";
import { Category } from "../../data/entities/category.entity.js";
import { BranchValidator } from "../validators/branch.validator.js";
import { ValidationException } from "../../exceptions/ValidationException.js";

// Router instance
export const branchRouter = express.Router();

// Logger instance
const logger = createLogger();

/**
 * Get all branches.
 * Able to filter the branch name, slug and search for a specific recipe id.
 */
branchRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const filterByName: string|undefined = decodeURISpaces(req.query?.name as string);
    const filterBySlug: string|undefined = decodeURISpaces(req.query?.slug as string);
    const filterByRecipeId: number = Number(req.query?.recipe);

    // Validator instance
    const validator: BranchValidator = new BranchValidator();

    // ORM query
    try {
        const query = AppDataSource
            .getRepository(Branch)
            .createQueryBuilder("branch");

        // Validation and sanitization for filter parameters
        if(validator.isValidBranchName(filterByName))
            query.andWhere("branch.name LIKE :branchName", { branchName: `%${ filterByName }%` });

        if(filterBySlug)
            query.andWhere("branch.slug = :branchSlug", { branchSlug: generateSlug(filterBySlug) });

        if(filterByRecipeId) {
            query.leftJoin("branch.recipes", "recipe")
                .andWhere("recipe.id = :recipeId", { recipeId: filterByRecipeId });
        }

        const branches = await query.getMany();

        getResponse(branches, res);
    } catch(err) {
        next(err);
    }
});

/**
 * Get a specific branch.
 * 
 * Loads addtional data
 * - Recipe Categories: Distinct categories based on recipe relation
 * - Recipe relation with category sub relation
 * - Scheduled item relation
 */
branchRouter.get("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId: number = Number(req.params?.id);

    // Branch instance
    let branch: Branch|null = null;

    // ORM query
    try {
        if(reqId) {
            branch = await AppDataSource
                .getRepository(Branch)
                .findOne({
                    where: {
                        id: reqId
                    },
                    relations: {
                        recipes: {
                            categories: true
                        },
                        scheduledItems: true
                    }
                });
            
            if(branch) {
                branch.recipeCategories = await AppDataSource
                    .getRepository(Category)
                    .createQueryBuilder("category")
                    .innerJoin("category.recipes", "recipe")
                    .innerJoin("recipe.branches", "branch")
                    .where("branch.id = :id", { id: reqId })
                    .getMany();
            }
        }

        if(branch) {
            getResponse(branch, res);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
});

/**
 * Create a branch.
 */
branchRouter.post("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqName: string = req.body?.name;

    // Branch instance
    const branch: Branch = new Branch();

    // Validator instance
    const validator: BranchValidator = new BranchValidator();

    // Validation
    if(validator.isValidBranchName(reqName)) {
        branch.name = reqName;
        branch.slug = generateSlug(reqName);
    }

    // ORM query
    if(validator.getErrors().length === 0) {
        try {
            await AppDataSource
                .getRepository(Branch)
                .save(branch);
            
            postResponse(branch, req, res);

            logger.info("Branch " + branch.id + " created.", LOG_ENDPOINT.DATABASE);
        } catch(err) {
            next(err);
        }
    } else {
        next(new ValidationException(validator.getErrors()));
    }
});

/**
 * (Partially) Update a branch.
 * Able to add and remove recipes.
 */
branchRouter.patch("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId: number = Number(req.params?.id);
    const reqName: string = req.body?.name;
    const reqRecipesAdd: Array<number> = req.body?.recipe_ids?.add;
    const reqRecipesRmv: Array<number> = req.body?.recipe_ids?.rmv;

    // Branch instance
    let branch: Branch|null = null;

    // Validator instance
    const validator: BranchValidator = new BranchValidator();

    // Validated parameters
    let validatedName: string|undefined = undefined;
    let validatedRecipesAdd: Array<number> = [];
    let validatedRecipesRmv: Array<number> = [];

    // Validation
    if(reqName)
        if(validator.isValidBranchName(reqName))
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
            if(reqId) {
                branch = await AppDataSource
                    .getRepository(Branch)
                    .findOne({
                        where: {
                            id: reqId
                        }
                    });
    
                if(branch) {
                    await AppDataSource.transaction(async (transactionalEntityManager) => {
                        // Update attributes
                        if(validatedName) {
                            branch!.name = validatedName;
                            branch!.slug = generateSlug(validatedName);

                            await transactionalEntityManager.save(branch!);
                        }

                        // Updated many-to-many relations
                        await transactionalEntityManager
                            .createQueryBuilder()
                            .relation(Branch, "recipes")
                            .of(branch)
                            .addAndRemove(validatedRecipesAdd, validatedRecipesRmv);

                        // Refresh entity
                        branch = await transactionalEntityManager
                            .getRepository(Branch)
                            .findOne({
                                where: {
                                    id: reqId
                                },
                                relations: {
                                    recipes: {
                                        categories: true
                                    },
                                    scheduledItems: true
                                }
                            });

                        logger.info("Branch " + branch!.id + " updated.", LOG_ENDPOINT.DATABASE);
                    });
                }
            }
    
            if(branch) {
                patchResponse(branch, res);
            } else {
                throw new HttpNotFoundException();
            }  
        } catch(err) {
            next(err);
        }
    } else {
        next(new ValidationException(validator.getErrors()));
    }
});

/**
 * Delete a branch.
 */
branchRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId = Number(req.params.id);

    // Repository instance
    const repository = AppDataSource.getRepository(Branch);

    // Branch instance
    let branch: Branch|null = null;

    // ORM query
    try {
        if(reqId) {
            branch = await repository
                .findOne({
                    where: {
                        id: reqId
                    }
                });
        }

        if(branch) {
            await repository.remove(branch);

            deleteResponse(res);

            logger.info("Branch with ID " + reqId + " deleted.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
});