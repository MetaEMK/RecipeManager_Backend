import express  from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { createLogger } from "../../utils/logger.js";
import { decodeURISpaces, generateSlug } from "../../utils/controller.util.js";
import { SQLiteErrorResponse } from "../../utils/sqliteErrorResponse.js";
import { Ingredient } from "../../data/entities/ingredient.entity.js";
import { IngredientValidator } from "../validators/ingredient.validator.js";

// Router instance
export const ingredientRouter = express.Router();

// Logger instance
const logger = createLogger();

/**
 * Get all ingredients.
 */
ingredientRouter.get("/", async function (req: Request, res: Response) {

});

/**
 * Create an ingredient.
 */
ingredientRouter.post("/", async function (req: Request, res:Response) {
    
});

/**
 * Delete an ingredient.
 */
ingredientRouter.delete("/:id", async function (req: Request, res: Response) {
    
});