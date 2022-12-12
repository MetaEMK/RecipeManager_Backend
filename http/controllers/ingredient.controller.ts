import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { decodeURISpaces, deleteResponse, getResponse, postResponse } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Ingredient } from "../../data/entities/ingredient.entity.js";
import { IngredientValidator } from "../validators/ingredient.validator.js";
import { ValidationException } from "../../exceptions/ValidationException.js";

// Router instance
export const ingredientRouter = express.Router();

// Logger instance
const logger = createLogger();

/**
 * Get all ingredients.
 * Able to filter the ingredient name.
 */
ingredientRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
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

        getResponse(ingredients, res);
    } catch (err) {
        next(err);
    }
});

/**
 * Create an ingredient.
 */
ingredientRouter.post("/", async function (req: Request, res:Response, next: NextFunction) {
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
    try {
        if (validator.getErrors().length === 0) {
            await AppDataSource
                .getRepository(Ingredient)
                .save(ingredient);

            postResponse(ingredient, req, res);

            logger.info("Ingredient " + ingredient.id + " created.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new ValidationException(validator.getErrors());
        }
    } catch (err) {
        next(err);
    }
});

/**
 * Delete an ingredient.
 */
ingredientRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {
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

            deleteResponse(res);

            logger.info("Ingredient with ID " + reqId + " deleted.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
});