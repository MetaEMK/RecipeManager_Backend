import express, { NextFunction, Request, Response } from "express";
import * as fs from "node:fs";
import path from "node:path";
import { AppDataSource } from "../../config/datasource.js";
import { deleteResponse, generateFileURI, generateRecipeImageURI, normalizeURI, putResponse } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Recipe } from "../../data/entities/recipe.entity.js";
import { uploadRecipeImages as upload } from "../../config/storage.js";

// Router instance
export const recipeImageRouter = express.Router({
    mergeParams: true
});

// Logger instance
const logger = createLogger();

/**
 * Get a recipe image
 */
recipeImageRouter.get("/", async function(req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqRecipeId: number = Number(req.params.recipeId);

    // Recipe instance
    let recipe: Recipe|null = null;

    // ORM query
    try {
        if (reqRecipeId) {
            recipe = await AppDataSource
                .getRepository(Recipe)
                .findOne({
                    where: {
                        id: reqRecipeId
                    }
                });
        }

        if (!recipe)
            throw new HttpNotFoundException();
        
        if (!recipe.imagePath)
            throw new HttpNotFoundException();

        res.contentType(path.basename(recipe.imagePath));
        res.header({
            "Cache-Control": "no-cache"
        });
        res.sendFile(generateFileURI(recipe.imagePath));
    } catch (err) {
        next(err);
    }
});

/**
 * Upsert a recipe image.
 */
recipeImageRouter.put("/", upload.single("image"), async function(req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqRecipeId: number = Number(req.params.recipeId);
    const reqFilePath: string = req.file?.path || "";

    // Repository instance
    const repository = AppDataSource.getRepository(Recipe);

    // Recipe instance
    let recipe: Recipe|null = null;

    try {
        if (reqRecipeId) {
            recipe = await repository
                .findOne({
                    where: {
                        id: reqRecipeId
                    }
                });

            if (recipe && reqFilePath) {
                // Remove old image
                if (recipe.imagePath) {
                    if(fs.existsSync(recipe.imagePath)) {
                        fs.rmSync(recipe.imagePath);
                        recipe.imagePath = null;
                    }
                }

                // Save new image path
                recipe.imagePath = normalizeURI(reqFilePath);
                await repository.save(recipe);

                logger.info("Image for recipe " +  recipe.id + "  upserted", LOG_ENDPOINT.MAIN);
            }
        }

        if (recipe) {
            if (recipe.imagePath)
                recipe.imagePath = generateRecipeImageURI(recipe.id, req);

            res.header({
                "Cache-Control": "no-cache"
            });    
            putResponse(recipe, res);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        // Delete uploaded image
        if(fs.existsSync(reqFilePath))
            fs.rmSync(reqFilePath);

        next(err);
    }
});

/**
 * Delete a recipe image.
 */
recipeImageRouter.delete("/", async function(req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqRecipeId: number = Number(req.params.recipeId);

    // Repository instance
    const repository = AppDataSource.getRepository(Recipe);

    // Recipe instance
    let recipe: Recipe|null = null;

    // ORM query
    try {
        if (reqRecipeId) {
            recipe = await repository
                .findOne({
                    where: {
                        id: reqRecipeId
                    }
                });
        }

        if (!recipe)
            throw new HttpNotFoundException();

        if (!recipe.imagePath)
            throw new HttpNotFoundException();

        if (!fs.existsSync(recipe.imagePath)) {
            recipe.imagePath = null;
            await repository.save(recipe);

            throw new HttpNotFoundException();
        }

        fs.rmSync(recipe.imagePath);
        recipe.imagePath = null;
        await repository.save(recipe);
        
        deleteResponse(res);

        logger.info("Image for recipe " + recipe.id + " deleted.", LOG_ENDPOINT.MAIN);
    } catch (err) {
        next(err);
    }
});