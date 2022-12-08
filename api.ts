import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import { AppDataSource } from "./config/datasource.js";
import { setJsonHeader } from "./http/middleware/headers.middleware.js";
import { jsonErrorHandler } from "./http/middleware/json.middleware.js";
import { branchRouter } from "./http/controllers/branch.controller.js";
import { categoryRouter } from "./http/controllers/category.controller.js";
import { conversionRouter } from "./http/controllers/conversion.controller.js";
import { conversionTypeRouter } from "./http/controllers/conversion_type.controller.js";
import { ingredientRouter } from "./http/controllers/ingredient.controller.js";
import { recipeRouter } from "./http/controllers/recipe.controller.js";
import { scheduleRouter } from "./http/controllers/schedule.controller.js";
import { variantRouter } from "./http/controllers/variant.controller.js";
import { sizeRouter } from "./http/controllers/size.controller.js";

// Establish database connection
AppDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized.");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

// Setup express
export const apiRouter = express.Router();
apiRouter.use(cors());
apiRouter.use(express.json());
apiRouter.use(setJsonHeader);
apiRouter.use(jsonErrorHandler);

// Routes
apiRouter.use("/branches", branchRouter);
apiRouter.use("/branches/:branchId/schedule", scheduleRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/conversion_types", conversionTypeRouter);
apiRouter.use("/conversion_types/:conversionTypeId/conversions", conversionRouter);
apiRouter.use("/conversion_types/:conversionTypeId/sizes", sizeRouter);
apiRouter.use("/ingredients", ingredientRouter);
apiRouter.use("/recipes", recipeRouter);
apiRouter.use("/recipes/:recipeId/variants", variantRouter);

// Default route if not exists
apiRouter.use((req: Request, res: Response) => {
    res.status(404);
    res.send();
});
