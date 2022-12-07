import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { Branch } from "../../data/entities/branch.entity.js";
import { Category } from "../../data/entities/category.entity.js";
import { decodeURISpaces, generateSlug } from "../../utils/controller.util.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { SQLiteErrorResponse } from "../../utils/sqliteErrorResponse.js";
import { BranchValidator } from "../validators/branch.validator.js";

// Router instance
export const branchRouter = express.Router();

// Logger instance
const logger = createLogger();

/**
 * Get all branches.
 * Able to filter the branch name.
 */
branchRouter.get("/", async function (req: Request, res: Response) {
    // Parameters
    const filterByName: string|undefined = decodeURISpaces(req.query?.name as string);

    // Filter instance
    let filter: Object = {};

    // Validator instance
    const validator: BranchValidator = new BranchValidator();

    // Validation
    if(validator.isValidBranchName(filterByName))
        filter = Branch.getFilter(filterByName);

    // ORM query
    try {
        const branches = await AppDataSource
            .getRepository(Branch)
            .find({
                where: filter
            });

        res.json({
            data: branches
        });
    } catch(err) {
        const errRes = new SQLiteErrorResponse(err); 
        errRes.log();

        res.status(errRes.statusCode);
        res.json(errRes.toResponseObject());
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
branchRouter.get("/:id", async function (req: Request, res: Response) {
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
                branch.recipe_categories = await AppDataSource
                    .getRepository(Category)
                    .createQueryBuilder("category")
                    .innerJoin("category.recipes", "recipe")
                    .innerJoin("recipe.branches", "branch")
                    .where("branch.id = :id", { id: reqId })
                    .getMany();
            }
        }

        if(branch) {
            res.json({
                data: branch
            });
        } else {
            res.status(404);
            res.send();
        }
    } catch (err) {
        const errRes = new SQLiteErrorResponse(err); 
        errRes.log();

        res.status(errRes.statusCode);
        res.json(errRes.toResponseObject());
    }
});

/**
 * Create a branch.
 */
branchRouter.post("/", async function (req: Request, res: Response) {
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
            
            res.status(201)
            res.set({
                "Location": req.protocol + "://" + req.get("host") + req.originalUrl + "/" + branch.id
            });

            logger.info("Branch " + branch.id + " created.", LOG_ENDPOINT.DATABASE);

            res.json({
                data: branch
            });
        } catch(err) {
            const errRes = new SQLiteErrorResponse(err); 
            errRes.log();
    
            res.status(errRes.statusCode);
            res.json(errRes.toResponseObject());
        }
    } else {
        res.status(400);
        res.json({
            error: validator.getErrors()?.[0]
        });
    }
});

/**
 * (Partially) Update a branch.
 */
branchRouter.patch("/:id", async function (req: Request, res: Response) {
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
    if(reqName) {
        if(validator.isValidBranchName(reqName)) {
            validatedName = reqName;
        }
    }

    if(reqRecipesAdd) {
        if(validator.isValidIdArray(reqRecipesAdd)) {
            validatedRecipesAdd = reqRecipesAdd;
        }
    }
    
    if(reqRecipesRmv) {
        if(validator.isValidIdArray(reqRecipesRmv)) {
            validatedRecipesRmv = reqRecipesRmv;
        }
    }

    // ORM query
    if(validator.getErrors().length === 0) {
        try {
            if(reqId) {
                branch = await AppDataSource.getRepository(Branch).findOne({
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
                        branch = await AppDataSource.getRepository(Branch).findOne({
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
                res.json({
                    data: branch
                });
            } else {
                res.status(404);
                res.send();
            }  
        } catch(err) {
            const errRes = new SQLiteErrorResponse(err);
            errRes.log();
    
            res.status(errRes.statusCode);
            res.json(errRes.toResponseObject());
        }
    } else {
        res.status(400);
        res.json({
            error: validator.getErrors()?.[0]
        });
    }
});

/**
 * Delete a branch.
 */
branchRouter.delete("/:id", async function (req: Request, res: Response) {
    // Parameters
    const reqId = Number(req.params.id);

    // Repository instance
    const repository = AppDataSource.getRepository(Branch);

    // Branch instance
    let branch: Branch|null = null;

    // ORM query
    try {
        if(reqId) {
            branch = await repository.findOneBy({
                id: reqId
            });
        }

        if(branch) {
            await repository.remove(branch);

            logger.info("Branch with" + reqId + " deleted.", LOG_ENDPOINT.DATABASE);

            res.status(204);
        } else {
            res.status(404);
        }
    
        res.send();
    } catch (err) {
        const errRes = new SQLiteErrorResponse(err);
        errRes.log();

        res.status(errRes.statusCode);
        res.json(errRes.toResponseObject());
    }
});