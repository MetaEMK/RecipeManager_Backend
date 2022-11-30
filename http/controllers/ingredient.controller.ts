import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { Ingredient } from "../../data/entities/ingredient.entity.js";
import { isIngredientNameValid } from "../validators/ingredient.validator.js";

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
});