import express, { NextFunction, Request, Response } from "express";
import * as fs from "node:fs";
import path from "path";
import { AppDataSource } from "../../config/datasource.js";
import { decodeURISpaces, generatePublicURI, generateSlug, getResponse, postResponse } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Recipe } from "../../data/entities/recipe.entity.js";
import { RecipeValidator } from "../validators/recipe.validator.js";
import { ValidationException } from "../../exceptions/ValidationException.js";
import { uploadRecipeImages as upload } from "../../config/storage.js";

// Router instance
export const recipeRouter = express.Router();

// Logger instance
const logger = createLogger();

/**
 * Get all recipes.
 * Able to filter the recipe name, slug and search for a specific branch id or category id.
 */
recipeRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const filterByName: string|undefined = decodeURISpaces(req.query?.name as string);
    const filterBySlug: string|undefined = decodeURISpaces(req.query?.slug as string);
    const filterByBranchId: number = Number(req.query?.branch);
    const filterByCategoryId: number = Number(req.query?.category);

    // Validation instance
    const validator: RecipeValidator = new RecipeValidator();

    // ORM query
    try {
        const query = AppDataSource
            .getRepository(Recipe)
            .createQueryBuilder("recipe");

        // Validation and sanitization for filter parameters
        if(validator.isValidRecipeName(filterByName))
            query.andWhere("recipe.name LIKE :recipeName", { recipeName: `%${ filterByName }%` });

        if(filterBySlug)
            query.andWhere("recipe.slug = :recipeSlug", { recipeSlug: generateSlug(filterBySlug) });

        if(filterByBranchId) {
            query.leftJoin("recipe.branches", "branch")
                .andWhere("branch.id = :branchId", { branchId: filterByBranchId });
        }

        if(filterByCategoryId) {
            query.leftJoin("recipe.categories", "category")
                .andWhere("category.id = :categoryId", { categoryId: filterByCategoryId });
        }

        const recipes = await query.getMany();

        getResponse(recipes, res);
    } catch (err) {
        next(err);
    }
});

// TODO GET SPECIFIC BY SLUG
/**
 * Get a specific recipe.
 * 
 * Loads additional data
 * - Branch relation
 * - Category relation
 * - Variant relation
 */
recipeRouter.get("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId: number = Number(req.params?.id);

    // Recipe instance
    let recipe: Recipe|null = null;

    // ORM query
    try {
        if(reqId) {
            recipe = await AppDataSource
                .getRepository(Recipe)
                .findOne({
                    where: {
                        id: reqId
                    },
                    relations: {
                        branches: true,
                        categories: true,
                        variants: true
                    }
                });
        }

        if (recipe) {
            getResponse(recipe, res);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
});

/**
 * Create a recipe.
 */
recipeRouter.post("/", upload.single("image"), async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqName: string = req.body?.name;
    const reqDesc: string = req.body?.description;
    const reqFilePath: string = req.file?.path || "";

    // Recipe instance
    const recipe: Recipe = new Recipe();

    // Validator instance
    const validator: RecipeValidator = new RecipeValidator();

    // Validation and sanitization
    if(validator.isValidRecipeName(reqName)) {
        recipe.name = reqName;
        recipe.slug = generateSlug(reqName);
    }

    if(validator.isValidRecipeDescription(reqDesc))
        recipe.description = reqDesc;

    if(reqFilePath) {
        recipe.imagePath = path
            .normalize(reqFilePath)
            .split(path.sep)
            .join("/");
    }

    // ORM query
    try {
        if(validator.getErrors().length === 0) {
            await AppDataSource
                .getRepository(Recipe)
                .save(recipe);

            if(recipe.imagePath)
                recipe.imagePath = generatePublicURI(recipe.imagePath, req);

            postResponse(recipe, req, res);

            logger.info("Recipe " + recipe.id + " created.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new ValidationException(validator.getErrors());
        }
    } catch (err) {
        // Delete uploaded image
        if(fs.existsSync(reqFilePath)) {
            fs.rmSync(reqFilePath);
        }

        next(err);
    }
});

/**
 * (Partially) Update a recipe.
 */
recipeRouter.patch("/:id", async function (req: Request, res: Response, next: NextFunction) {

});

/**
 * Delete a recipe.
 */
recipeRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {
    const results = await AppDataSource.getRepository(Recipe).delete(req.params.id);
    res.json(results);
});