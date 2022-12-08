import express  from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { createLogger } from "../../utils/logger.js";
import { decodeURISpaces, generateSlug } from "../../utils/controller.util.js";
import { SQLiteErrorResponse } from "../../utils/sqliteErrorResponse.js";
import { ConversionType } from "../../data/entities/conversion_type.entity.js";
import { ConversionTypeValidator } from "../validators/conversion_type.validator.js";

// Router instance
export const conversionTypeRouter = express.Router();

// Logger instance
const logger = createLogger();

/**
 * Get all conversion types.
 */
conversionTypeRouter.get("/", async function (req: Request, res: Response) {
    
});

/**
 * Create a conversion type.
 */
conversionTypeRouter.post("/", async function (req: Request, res: Response) {
    
});

/**
 * Delete a conversion type.
 */
conversionTypeRouter.delete("/:id", async function (req: Request, res: Response) {
    
});