import express, { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { decodeURISpaces, deleteResponse, generateSlug, getResponse, patchResponse, postResponse, prepareForSqlInParams } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Branch } from "../../data/entities/branch.entity.js";
import { Category } from "../../data/entities/category.entity.js";
import { BranchValidator } from "../validators/branch.validator.js";
import { ValidationException } from "../../exceptions/ValidationException.js";
import { Brackets } from "typeorm";

// Router instance
export const branchRouter = express.Router();

// Logger instance
const logger = createLogger();

/**
 * Get all branches.
 * 
 * Filter params
 * - name: Search for similar name
 * - slug: Search for exact same slug
 * - recipe: Search for (multiple) recipe ids
 * - recipeExclude: Exclude (multiple) recipe ids from search
 * - recipeNone: Search for branches with no recipes
 */
branchRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const filterByName: string = <string>req.query.name;
    const filterBySlug: string = <string>req.query.slug;

    let filterByRecipeIds: string|string[] = <string>req.query.recipe;
    let filterByRecipeExcludeIds: string|string[] = <string>req.query.recipeExclude;
    const filterByRecipeNone: string = <string>req.query.recipeNone;

    // Validator instance
    const validator = new BranchValidator();

    // ORM query
    try {
        const query = AppDataSource
            .getRepository(Branch)
            .createQueryBuilder("branch");

        // Validate/Sanitize parameters and build where clause
        if(validator.isValidBranchName(filterByName))
            query.andWhere("branch.name LIKE :branchName", { branchName: `%${ decodeURISpaces(filterByName) }%` });

        if(filterBySlug)
            query.andWhere("branch.slug = :branchSlug", { branchSlug: generateSlug(filterBySlug) });

        if (filterByRecipeIds || filterByRecipeExcludeIds || filterByRecipeNone) {
            query.leftJoin("branch.recipes", "recipe");

            if(filterByRecipeIds || filterByRecipeNone) {
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

        const branches = await query.getMany();

        getResponse(branches, res);
    } catch(err) {
        next(err);
    }
});

/**
 * Get a specific branch by id.
 */
branchRouter.get("/:id", getOneBranch);

/**
 * Get a specific branch by slug.
 */
branchRouter.get("/slug/:slug", getOneBranch);

/**
 * Get specific branch callback.
 * 
 * Loads additional data
 * - Recipe Categories: Distinct categories based on recipe relation
 */
async function getOneBranch(req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId: number = Number(req.params.id);
    const reqSlug: string = req.params.slug;

    // Branch instance
    let branch: Branch|null = null;

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
            branch = await AppDataSource
                .getRepository(Branch)
                .findOne({
                    where: whereClause
                });
            
            if(branch) {
                branch.recipeCategories = await AppDataSource
                    .getRepository(Category)
                    .createQueryBuilder("category")
                    .innerJoin("category.recipes", "recipe")
                    .innerJoin("recipe.branches", "branch")
                    .where("branch.id = :id", { id: branch.id })
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
}

/**
 * Create a branch.
 */
branchRouter.post("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqName: string = req.body.name;

    // Branch instance
    const branch = new Branch();

    // Validator instance
    const validator = new BranchValidator();

    // Validation/Sanitization
    if(validator.isValidBranchName(reqName)) {
        branch.name = reqName;
        branch.slug = generateSlug(reqName);
    }

    // ORM query
    try {
        if(validator.getErrors().length === 0) {
            await AppDataSource
                .getRepository(Branch)
                .save(branch);
            
            postResponse(branch, req, res);

            logger.info("Branch " + branch.id + " created.", LOG_ENDPOINT.DATABASE);
        } else {
           throw new ValidationException(validator.getErrors());
        }        
    } catch (err) {
        next(err);
    }
});

/**
 * (Partially) Update a branch.
 * 
 * Able to add and remove recipes.
 */
branchRouter.patch("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId: number = Number(req.params.id);
    const reqName: string = req.body.name;

    const reqRecipesAdd: Array<number> = req.body.recipe_ids?.add;
    const reqRecipesRmv: Array<number> = req.body.recipe_ids?.rmv;

    // Branch instance
    let branch: Branch|null = null;

    // Validator instance
    const validator = new BranchValidator();

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
    try {
        if(validator.getErrors().length === 0) {
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
                        }

                        await transactionalEntityManager.save(branch);

                        // Updated many-to-many relations
                        await transactionalEntityManager
                            .createQueryBuilder()
                            .relation(Branch, "recipes")
                            .of(branch)
                            .addAndRemove(validatedRecipesAdd, validatedRecipesRmv);

                        logger.info("Branch " + branch!.id + " updated.", LOG_ENDPOINT.DATABASE);
                    });
                }
            }
    
            if(branch) {
                patchResponse(branch, res);
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
 * Delete a branch.
 */
branchRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId: number = Number(req.params.id);

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