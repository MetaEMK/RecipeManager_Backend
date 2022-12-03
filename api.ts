import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import { AppDataSource } from "./config/datasource.js";
import { branchRouter } from "./http/controllers/branch.controller.js";
import { ingredientRouter } from "./http/controllers/ingredient.controller.js";
import { recipeRouter } from "./http/controllers/recipe.controller.js";
import { scheduledItemRouter } from "./http/controllers/scheduled_item.controller.js";
import { setJsonHeader } from "./http/middleware/headers.middleware.js";
import { jsonErrorHandler } from "./http/middleware/json.middleware.js";

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
apiRouter.use("/ingredients", ingredientRouter);
apiRouter.use("/recipes", recipeRouter);
apiRouter.use("/schedule/items", scheduledItemRouter);

// Default route if not exists
apiRouter.use((req: Request, res: Response) => {
    res.status(404);
    res.send();
});
