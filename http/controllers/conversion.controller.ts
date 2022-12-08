import express  from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { createLogger } from "../../utils/logger.js";
import { decodeURISpaces, generateSlug } from "../../utils/controller.util.js";
import { SQLiteErrorResponse } from "../../utils/sqliteErrorResponse.js";
import { Conversion } from "../../data/entities/conversion.entity.js";
import { ConversionToSizeValidator } from "../validators/conversion_to_size.validator.js";

// Router instance
export const conversionRouter = express.Router({
    mergeParams: true
});

// Logger instance
const logger = createLogger();

/**
 * Get all conversion type conversions.
 */
conversionRouter.get("/", async function (req: Request, res: Response) {
    
});

/**
 * Create a conversion type conversion.
 */
conversionRouter.post("/", async function (req: Request, res: Response) {
    
});

/**
 * Delete a conversion type conversion.
 */
conversionRouter.delete("/:id", async function (req: Request, res: Response) {
    
});