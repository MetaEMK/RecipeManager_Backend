import express  from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
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
 * Able to filter the ingredient name.
 */
ingredientRouter.get("/", async function (req: Request, res: Response) {
    // Parameters
    const filterByName: string|undefined = decodeURISpaces(req.query?.name as string);

    // Validator instance
    const validator: IngredientValidator = new IngredientValidator();

    // ORM query
    try {
        const query = AppDataSource
            .getRepository(Ingredient)
            .createQueryBuilder("ingredient");

        // Validation for filter parameter
        if(validator.isValidIngredientName(filterByName))
            query.andWhere("ingredient.name LIKE :ingredientName", { ingredientName: `%${ filterByName }` });

        const ingredients = await query.getMany();

        res.json({
            data: ingredients
        });
    } catch (err) {
        const errRes = new SQLiteErrorResponse(err); 
        errRes.log();

        res.status(errRes.statusCode);
        res.json(errRes.toResponseObject());
    }
});

/**
 * Create an ingredient.
 */
ingredientRouter.post("/", async function (req: Request, res:Response) {
    // Parameters
    const reqName: string = req.body?.name;

    // Ingredient instance
    const ingredient: Ingredient = new Ingredient();

    // Validator instance
    const validator: IngredientValidator = new IngredientValidator();

    // Validation
    if(validator.isValidIngredientName(reqName))
        ingredient.name = reqName;

    // ORM query
    if (validator.getErrors().length === 0) {
        try {
            await AppDataSource
                .getRepository(Ingredient)
                .save(ingredient);

            logger.info("Ingredient " + ingredient.id + " created.", LOG_ENDPOINT.DATABASE);

            res.status(201);
            res.set({
                "Location": req.protocol + "://" + req.get("host") + req.originalUrl + "/" + ingredient.id
            });
            res.json({
                data: ingredient
            });
        } catch (err) {
            const errRes = new SQLiteErrorResponse(err); 
            errRes.log();
    
            res.status(errRes.statusCode);
            res.json(errRes.toResponseObject());
        }
    } else {
        res.status(400);
        res.json({
            error: validator.getErrors()?.[0]
        });
    }
});

/**
 * Delete an ingredient.
 */
ingredientRouter.delete("/:id", async function (req: Request, res: Response) {
    // Parameters
    const reqId = Number(req.params.id);

    // Repository instance
    const repository = AppDataSource.getRepository(Ingredient);

    // Ingredient instance
    let ingredient: Ingredient|null = null;

    // ORM query
    try {
        if (reqId) {
            ingredient = await repository
                .findOne({
                    where: {
                        id: reqId
                    }
                });
        }

        if (ingredient) {
            await repository.remove(ingredient);

            logger.info("Ingredient with ID " + reqId + " deleted.", LOG_ENDPOINT.DATABASE);

            res.status(204);
        } else {
            res.status(404);
        }

        res.send();
    } catch (err) {
        const errRes = new SQLiteErrorResponse(err);
        errRes.log();

        res.status(errRes.statusCode);
        res.json(errRes.toResponseObject());
    }
});