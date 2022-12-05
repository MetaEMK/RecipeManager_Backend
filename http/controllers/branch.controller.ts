import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { Branch } from "../../data/entities/branch.entity.js";
import { decodeURISpaces } from "../../utils/controller.util.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { SQLiteErrorResponse } from "../../utils/sqliteErrorResponse.js";
import { BranchValidator } from "../validators/branch.validator.js";

// Router instance
export const branchRouter = express.Router();

// Logger instance
const logger = createLogger();

/**
 * Get all branches.
 * Ability to filter the branch name.
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
            success: true,
            data: branches
        });
    } catch(err) {
        const errRes = new SQLiteErrorResponse(err); 
        errRes.log();

        res.status(errRes.getStatusCode());
        res.json(errRes.toResponseObject());
    }
});

/**
 * Get a specific branch.
 * Loads all relations as well:
 * - Recipes
 * - ScheduledItems
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
                        recipes: true,
                        scheduledItems: true
                    }
                });
        }
    
        if(branch) {
            res.json({
                success: true,
                data: branch
            });
        } else {
            res.status(404);
            res.send();
        }
    } catch (err) {
        const errRes = new SQLiteErrorResponse(err); 
        errRes.log();

        res.status(errRes.getStatusCode());
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
        branch.slug = reqName.toLowerCase().replaceAll(" ", "_");
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
            res.json({
                success: true,
                data: branch
            });

            logger.info("Branch " + branch.id + " created.", LOG_ENDPOINT.DATABASE);
        } catch(err) {
            const errRes = new SQLiteErrorResponse(err); 
            errRes.log();
    
            res.status(errRes.getStatusCode());
            res.json(errRes.toResponseObject());
        }
    } else {
        res.json({
            success: false,
            error: validator.getErrors()
        });
    }
});

/**
 * (Partially) Update a branch.
 * Loads all relations as well:
 * - Recipes
 * - ScheduledItems
 */
branchRouter.patch("/:id", async function (req: Request, res: Response) {
    // Parameters
    const reqId: number = Number(req.params?.id);
    let reqName: string = req.body?.name;
    let reqRecipesAdd: Array<number> = req.body?.recipe_ids?.add;
    let reqRecipesRmv: Array<number> = req.body?.recipe_ids?.rmv;
    let reqScheduledItemsAdd: Array<number> = req.body?.scheduled_item_ids?.add;
    let reqScheduledItemsRmv: Array<number> = req.body?.scheduled_item_ids?.rmv;

    // Branch instance
    let branch: Branch|null = null;

    // Validator instance
    const validator: BranchValidator = new BranchValidator();

    // Validated parameters
    let validatedName: string|undefined = undefined;
    let validatedRecipesAdd: Array<number> = [];
    let validatedRecipesRmv: Array<number> = [];
    let validatedScheduledItemsAdd: Array<number> = [];
    let validatedScheduledItemsRmv: Array<number> = [];

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
        
    if(reqScheduledItemsAdd)
        if(validator.isValidIdArray(reqScheduledItemsAdd))
            validatedScheduledItemsAdd = reqScheduledItemsAdd;

    if(reqScheduledItemsRmv)
        if(validator.isValidIdArray(reqScheduledItemsRmv))
            validatedScheduledItemsRmv = reqScheduledItemsRmv;

    // ORM query
    if(validator.getErrors.length === 0) {
        try {
            if(reqId) {
                branch = await AppDataSource.getRepository(Branch).findOne({
                    where: {
                        id: reqId
                    },
                    relations: {
                        recipes: true,
                        scheduledItems: true
                    }
                });
    
                if(branch) {
                    if(validatedName)
                        branch.name = validatedName;

                    await AppDataSource.transaction(async (transactionalEntityManager) => {
                            await transactionalEntityManager.save(branch);
                            
                            await transactionalEntityManager
                                .createQueryBuilder()
                                .relation(Branch, "recipes")
                                .of(branch)
                                .add(reqRecipesAdd);
                            await transactionalEntityManager
                                .createQueryBuilder()
                                .relation(Branch, "recipes")
                                .of(branch)
                                .remove(reqRecipesRmv);

                            await transactionalEntityManager
                                .createQueryBuilder()
                                .relation(Branch, "scheduledItems")
                                .of(branch)
                                .add(reqScheduledItemsAdd);
                            await transactionalEntityManager
                                .createQueryBuilder()
                                .relation(Branch, "scheduledItems")
                                .of(branch)
                                .remove(reqScheduledItemsRmv);    
                    });
                }
            }
    
            if(branch) {
                res.json(branch);
            } else {
                res.status(404);
                res.send();
            }  
        } catch(err) {
            const errRes = new SQLiteErrorResponse(err);
            errRes.log();
    
            res.status(errRes.getStatusCode());
            res.json(errRes.toResponseObject());
        }
    } else {
        res.json({
            success: false,
            error: validator.getErrors()
        });
    }
});

/**
 * Delete a branch.
 */
branchRouter.delete("/:id", async function (req: Request, res: Response) {
    // Parameters
    const reqId = Number(req.params.id);

    const repository = AppDataSource.getRepository(Branch);
    let branch = null;

    // ORM query
    try {
        if(reqId) {
            branch = await repository.findOneBy({
                id: reqId
            });
        }

        if(branch) {
            await repository.remove(branch);
            res.status(204);

            logger.info("Branch with" + reqId + " deleted.", LOG_ENDPOINT.DATABASE);
        } else {
            res.status(404);
        }
    
        res.send();
    } catch (err) {
        const errRes = new SQLiteErrorResponse(err);
        errRes.log();

        res.status(errRes.getStatusCode());
        res.json(errRes.toResponseObject());
    }
});