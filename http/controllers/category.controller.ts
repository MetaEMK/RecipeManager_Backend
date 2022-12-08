import express  from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { createLogger } from "../../utils/logger.js";
import { decodeURISpaces, generateSlug } from "../../utils/controller.util.js";
import { SQLiteErrorResponse } from "../../utils/sqliteErrorResponse.js";
import { Category } from "../../data/entities/category.entity.js";
import { CategoryValidator } from "../validators/category.validator.js";

// Router instance
export const categoryRouter = express.Router();

// Logger instance
const logger = createLogger();

/**
 * Get all categories.
 */
categoryRouter.get("/", async function (req: Request, res: Response) {

});

/**
 * Get a specific category.
 */
categoryRouter.get("/:id", async function (req: Request, res: Response) {

});

/**
 * Create a category.
 */
categoryRouter.post("/", async function (req: Request, res: Response) {

});

/**
 * (Partially) Update category
 */
categoryRouter.patch("/:id", async function (req: Request, res: Response) {

});

/**
 * Delete a category.
 */
categoryRouter.delete("/:id", async function (req: Request, res: Response) {

});