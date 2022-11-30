import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { Branch } from "../../data/entities/branch.entity.js";

export const branchRouter = express.Router();

// Get all branches
branchRouter.get("/", async function (req: Request, res: Response) {
    const branches = await AppDataSource
        .getRepository(Branch)
        .find({
            relations: {
                recipes: true
            }
        });

    res.json(branches);
});

// Create a branch
branchRouter.post("/", async function (req: Request, res: Response) {
    const branch = new Branch();
    
    branch.name = req.body.name;

    await AppDataSource
        .getRepository(Branch)
        .save(branch);
    
    res.json(branch);
});

// Delete a branch
branchRouter.delete("/:id", async function (req: Request, res: Response) {
    const results = await AppDataSource
        .getRepository(Branch)
        .delete(req.params.id);
        
    res.json(results);
});