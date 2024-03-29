import express, { Request, Response } from "express";
import cors from "cors";
import { AppDataSource } from "./config/datasource.js";
import { seedHandler } from "./data/seeder/main.seeder.js";
import { setJsonHeader } from "./http/middleware/headers.middleware.js";
import { HttpNotFoundException } from "./exceptions/HttpException.js";
import { branchRouter } from "./http/controllers/branch.controller.js";
import { categoryRouter } from "./http/controllers/category.controller.js";
import { conversionRouter } from "./http/controllers/conversion.controller.js";
import { conversionTypeRouter } from "./http/controllers/conversion_type.controller.js";
import { recipeRouter } from "./http/controllers/recipe.controller.js";
import { recipeImageRouter } from "./http/controllers/recipe_image.controller.js";
import { scheduleRouter } from "./http/controllers/schedule.controller.js";
import { variantRouter } from "./http/controllers/variant.controller.js";
import { sizeRouter } from "./http/controllers/size.controller.js";

// Establish database connection
AppDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized.");

        //seedHandler();
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
        throw new Error("Error during Data Source initialization");
    });

// Setup express
export const apiRouter = express.Router();
apiRouter.use(cors());
apiRouter.use(express.json());
apiRouter.use(setJsonHeader);

// Routes
apiRouter.use("/branches", branchRouter);
apiRouter.use("/branches/:branchId/schedule", scheduleRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/conversion_types", conversionTypeRouter);
apiRouter.use("/conversion_types/:conversionTypeId/conversions", conversionRouter);
apiRouter.use("/conversion_types/:conversionTypeId/sizes", sizeRouter);
apiRouter.use("/recipes", recipeRouter);
apiRouter.use("/recipes/:recipeId/image", recipeImageRouter);
apiRouter.use("/recipes/:recipeId/variants", variantRouter);

// Default route if not exists
apiRouter.use((req: Request, res: Response) => {
    throw new HttpNotFoundException();
});