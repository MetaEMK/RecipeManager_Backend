import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { decodeURISpaces, generateSlug } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger } from "../../utils/logger.js";
import { Recipe } from "../../data/entities/recipe.entity.js";
import { Variant } from "../../data/entities/variant.entity.js";
import { Ingredient } from "../../data/entities/ingredient.entity.js";
import { VariantValidator } from "../validators/variant.validator.js";
import { IngredientValidator } from "../validators/ingredient.validator.js";
import { ValidationException } from "../../exceptions/ValidationException.js";

// Router instance
export const variantRouter = express.Router({
    mergeParams: true
});

// Logger instance
const logger = createLogger();

/**
 * Get all recipe variants.
 */
variantRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {

});

/**
 * Get a specific recipe variant.
 */
 variantRouter.get("/:id", async function (req: Request, res: Response, next: NextFunction) {

});

/**
 * Create a recipe variant.
 */
variantRouter.post("/", async function (req: Request, res: Response, next: NextFunction) {

});

/**
 * (Partially) Update a recipe variant.
 */
variantRouter.patch("/:id", async function (req: Request, res: Response, next: NextFunction) {

});

/**
 * Delete a recipe variant.
 */
variantRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {

});