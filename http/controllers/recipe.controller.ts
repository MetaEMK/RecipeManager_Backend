import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { createLogger } from "../../utils/logger.js";
import { decodeURISpaces, generateSlug } from "../../utils/controller.util.js";
import { SQLiteErrorResponse } from "../../utils/sqliteErrorResponse.js";
import { Recipe } from "../../data/entities/recipe.entity.js";
import { RecipeValidator } from "../validators/recipe.validator.js";

// Router instance
export const recipeRouter = express.Router();

// Logger instance
const logger = createLogger();

/**
 * Get all recipes.
 * 
 * Able to choose which relations should be loaded.
 * - description
 * - image_path
 */
recipeRouter.get("/", async function (req: Request, res: Response) {
    const recipes = await AppDataSource
        .getRepository(Recipe)
        .find();

    res.json(recipes);
});

/**
 * Get a specific recipe.
 */
recipeRouter.get("/:id", async function (req: Request, res: Response) {

});

/**
 * Create a recipe.
 */
recipeRouter.post("/", async function (req: Request, res: Response) {
    const recipe = new Recipe();
    recipe.name = req.body.name;
    recipe.slug = generateSlug(req.body.name);

    await AppDataSource
        .getRepository(Recipe)
        .save(recipe);

    res.json(recipe);
});

/**
 * (Partially) Update a recipe.
 */
recipeRouter.patch("/:id", async function (req: Request, res: Response) {

});

/**
 * Delete a recipe.
 */
recipeRouter.delete("/:id", async function (req: Request, res: Response) {
    const results = await AppDataSource.getRepository(Recipe).delete(req.params.id);
    res.json(results);
});