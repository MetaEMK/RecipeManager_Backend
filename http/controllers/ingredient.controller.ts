import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { Ingredient } from "../../data/entities/ingredient.entity.js";

export const ingredientRouter = express.Router();

// Get all ingredients
ingredientRouter.get("/", async function (req: Request, res: Response) {
    const ingredients = await AppDataSource
        .getRepository(Ingredient)
        .find();

    res.json(ingredients);
});

// Create an ingredient
ingredientRouter.post("/", async function (req: Request, res: Response) {
    const ingredient = new Ingredient();
    ingredient.name = req.body.name;

    await AppDataSource
        .getRepository(Ingredient)
        .save(ingredient);
        
    res.json(ingredient);
});

// Delete an ingredient
ingredientRouter.delete("/:id", async function (req: Request, res: Response) {
    const results = await AppDataSource.getRepository(Ingredient).delete(req.params.id);
    res.json(results);
});