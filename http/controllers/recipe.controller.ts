import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { Recipe } from "../../data/entities/recipe.entity.js";

export const recipeRouter = express.Router();

// Get all recipes
recipeRouter.get("/", async function (req: Request, res: Response) {
    const recipes = await AppDataSource
        .getRepository(Recipe)
        .find();

    res.json(recipes);
});

// Create a recipe
recipeRouter.post("/", async function (req: Request, res: Response) {
    const recipe = new Recipe();
    recipe.name = req.body.name;

    await AppDataSource
        .getRepository(Recipe)
        .save(recipe);

    res.json(recipe);
});

// Delete a recipe
recipeRouter.delete("/:id", async function (req: Request, res: Response) {
    const results = await AppDataSource.getRepository(Recipe).delete(req.params.id);
    res.json(results);
});