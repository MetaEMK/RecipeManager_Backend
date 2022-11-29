import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource.js";
import { Branch } from "../entities/branch.entity.js";
import { Recipe } from "../entities/recipe.entity.js";

export const recipeRouter = express.Router();

// Get all recipes
recipeRouter.get("/", async function (req: Request, res: Response) {
    const recipes = await AppDataSource
        .getRepository(Recipe)
        .find({
            relations: {
                branches: true
            }
        });

    res.json(recipes);
});

// Create a recipe
recipeRouter.post("/", async function (req: Request, res: Response) {
    const branch = await AppDataSource
        .getRepository(Branch)
        .findOneBy({
            id: req.body.branch_id
        });

    if(branch) {
        const recipe = new Recipe();
        recipe.name = req.body.name;
        await AppDataSource
            .getRepository(Recipe)
            .save(recipe);

        await AppDataSource
            .createQueryBuilder()
            .relation(Branch, "recipes")
            .of(branch)
            .add(recipe);

        res.json(recipe);
    } else {
        res.status(400);
        res.json({
            error: {
                code: 9999,
                message: "Branch doesn't exist"
            }
        })
    }
});

// Delete a recipe
recipeRouter.delete("/:id", async function(req: Request, res: Response) {
    const results = await AppDataSource.getRepository(Recipe).delete(req.params.id);
    res.json(results);
});