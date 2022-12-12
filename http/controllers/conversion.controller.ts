import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { decodeURISpaces, generateSlug } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Conversion } from "../../data/entities/conversion.entity.js";
import { ConversionToSizeValidator } from "../validators/conversion_to_size.validator.js";
import { ValidationException } from "../../exceptions/ValidationException.js";

// Router instance
export const conversionRouter = express.Router({
    mergeParams: true
});

// Logger instance
const logger = createLogger();

/**
 * Get all conversion type conversions.
 */
conversionRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
    
});

/**
 * Create a conversion type conversion.
 */
conversionRouter.post("/", async function (req: Request, res: Response, next: NextFunction) {
    
});

/**
 * Delete a conversion type conversion.
 */
conversionRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {
    
});