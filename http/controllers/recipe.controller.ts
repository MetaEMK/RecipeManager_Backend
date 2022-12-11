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
 * Able to filter the recipe name, slug and search for a specific branch id or category id.
 */
recipeRouter.get("/", async function (req: Request, res: Response) {
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

        res.json({
            data: recipes
        });
    } catch (err) {
        const errRes = new SQLiteErrorResponse(err); 
        errRes.log();

        res.status(errRes.statusCode);
        res.json(errRes.toResponseObject());
    }
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