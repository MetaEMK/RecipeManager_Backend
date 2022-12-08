import express  from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { createLogger } from "../../utils/logger.js";
import { decodeURISpaces, generateSlug } from "../../utils/controller.util.js";
import { SQLiteErrorResponse } from "../../utils/sqliteErrorResponse.js";
import { Size } from "../../data/entities/size.entity.js";
import { SizeValidator } from "../validators/size.validator.js";

// Router instance
export const sizeRouter = express.Router({
    mergeParams: true
});

// Logger instance
const logger = createLogger();

/**
 * Get all sizes of a conversion type.
 */
sizeRouter.get("/", async function (req: Request, res: Response) {
    
});

/**
 * Create a size of a conversion type.
 */
sizeRouter.post("/", async function (req: Request, res: Response) {
    
});

/**
 * Delete a size of a conversion type.
 */
sizeRouter.delete("/:id", async function (req: Request, res: Response) {
    
});