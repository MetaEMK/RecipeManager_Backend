import express, { NextFunction, Request, Response } from "express";
import * as fs from "node:fs";
import path from "path";
import { AppDataSource } from "../../config/datasource.js";
import { generatePublicURI } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger } from "../../utils/logger.js";
import { Recipe } from "../../data/entities/recipe.entity.js";
import { uploadRecipeImages as upload } from "../../config/storage.js";

// Router instance
export const recipeImageRouter = express.Router({
    mergeParams: true
});

// Logger instance
const logger = createLogger();

recipeImageRouter.put("/", upload.single("image"), async function(req: Request, res: Response, next: NextFunction) {

});

recipeImageRouter.delete("/", async function(req: Request, res: Response, next: NextFunction) {

});