import express from "express";
import { Request, Response } from "express";
import { decodeURISpaces } from "../../utils/uri.js";
import { AppDataSource } from "../../config/datasource.js";
import { Branch } from "../../data/entities/branch.entity.js";

import { QueryFailedError } from "typeorm";

// Router instance
export const branchRouter = express.Router();

// Get all branches
branchRouter.get("/", async function (req: Request, res: Response) {
    // Query parameters
    const name = decodeURISpaces(req.query.name as string);
    const recipes = req.query.recipes as string;
    const scheduledItems = req.query.scheduledItems as string;

    const filter = Branch.getFilter(name);
    const loadRelations = Branch.getRelationsToBeLoaded(recipes, scheduledItems);

    const branches = await AppDataSource
        .getRepository(Branch)
        .find({
            where: filter,
            relations: loadRelations
        });

    res.json(branches);
});

// Get specific branch
branchRouter.get("/:id", async function (req: Request, res: Response) {
    // Query and body parameters
    const id = Number(req.params.id);
    const recipes = req.query.recipes as string;
    const scheduledItems = req.query.scheduledItems as string;

    const loadRelations = Branch.getRelationsToBeLoaded(recipes, scheduledItems);
    let branch = null;

    if(id) {
        branch = await AppDataSource
            .getRepository(Branch)
            .findOne({
                where: {
                    id: id
                },
                relations: loadRelations
            });
    }

    if(branch) {
        res.json(branch);
    } else {
        res.status(404);
        res.send();
    }
});

// Create a branch
branchRouter.post("/", async function (req: Request, res: Response) {
    const data = req.body;
    const branch = new Branch();
    branch.name = data.name;

    await AppDataSource
        .getRepository(Branch)
        .save(branch);
        
    res.status(201)
    res.set({
        "Location": req.protocol + "://" + req.get("host") + req.originalUrl + "/" + branch.id
    });
    res.json(branch);
});

// (Partially) Update a branch
branchRouter.patch("/:id", async function (req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = req.body;
    const repository = AppDataSource.getRepository(Branch);  
    let branch = null;

    if(id) {
        branch = await repository.findOneBy({
            id: id
        });

        if (branch) {
            // const validator = new BranchValidator();
            
            // if(validator.isValidName(name));
            branch.name = data.name;

            // if(validator.isValidRecipeIds)

            const add = data.recipeIds.add;
            const rmv = data.recipeIds.rmv;

            if (add && rmv) {
                try {
                    await AppDataSource
                    .createQueryBuilder()
                    .relation(Branch, "recipes")
                    .of(branch)
                    .addAndRemove(add, rmv);
                } catch (e) {
                    if (e instanceof QueryFailedError) {
                        console.log("DRIVER");
                        console.log(e.driverError);
                        console.log("MESSAGE");
                        console.log(e.message);
                        console.log("NAME");
                        console.log(e.name);
                        console.log("PARAMS");
                        console.log(e.parameters);
                        console.log("STACK");
                        console.log(e.stack);
                    }
                }
            }


            // if (validator.errors.length === 0)
            repository.save(branch);
            // else 
            // SEND ERROR RESPONSE
        }
    }

    if(branch) {
        res.json(branch);
    } else {
        res.status(404);
        res.send();
    }
});

// Delete a branch
branchRouter.delete("/:id", async function (req: Request, res: Response) {
    const id = Number(req.params.id);
    const repository = AppDataSource.getRepository(Branch);
    let branch = null;

    if(id) {
        branch = await repository.findOneBy({
            id: id
        });

        if(branch) {
            await repository.remove(branch);
            res.status(204);
        } else {
            res.status(404);
        }
    }

    res.send();
});