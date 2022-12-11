import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { createLogger } from "../../utils/logger.js";
import { decodeURISpaces, generateSlug } from "../../utils/controller.util.js";
import { SQLiteErrorResponse } from "../error_responses/sqliteErrorResponse.js";
import { Recipe } from "../../data/entities/recipe.entity.js";
import { Variant } from "../../data/entities/variant.entity.js";
import { VariantIngredient } from "../../data/entities/variant_ingredient.entity.js";
import { VariantValidator } from "../validators/variant.validator.js";
import { VariantIngredientValidator } from "../validators/variantIngredient.validator.js";

// Router instance
export const variantRouter = express.Router({
    mergeParams: true
});

// Logger instance
const logger = createLogger();

/**
 * Get all recipe variants.
 */
variantRouter.get("/", async function (req: Request, res: Response) {

});

/**
 * Get a specific recipe variant.
 */
 variantRouter.get("/:id", async function (req: Request, res: Response) {

});

/**
 * Create a recipe variant.
 */
variantRouter.post("/", async function (req: Request, res: Response) {

});

/**
 * (Partially) Update a recipe variant.
 */
variantRouter.patch("/:id", async function (req: Request, res: Response) {

});

/**
 * Delete a recipe variant.
 */
variantRouter.delete("/:id", async function (req: Request, res: Response) {

});