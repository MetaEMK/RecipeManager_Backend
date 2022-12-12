import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { decodeURISpaces, generateSlug } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger } from "../../utils/logger.js";
import { Size } from "../../data/entities/size.entity.js";
import { SizeValidator } from "../validators/size.validator.js";
import { ValidationException } from "../../exceptions/ValidationException.js";

// Router instance
export const sizeRouter = express.Router({
    mergeParams: true
});

// Logger instance
const logger = createLogger();

/**
 * Get all sizes of a conversion type.
 */
sizeRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
    
});

/**
 * Create a size of a conversion type.
 */
sizeRouter.post("/", async function (req: Request, res: Response, next: NextFunction) {
    
});

/**
 * Delete a size of a conversion type.
 */
sizeRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {
    
});