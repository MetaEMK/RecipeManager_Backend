import express from 'express';
import cors from 'cors';
import { Request, Response } from "express";
import { AppDataSource } from './config/datasource.js';
import { ingredientRouter } from './controllers/ingredient_controller.js';

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

// Routes
apiRouter.use('/ingredients', ingredientRouter);

// Default route if not exists
apiRouter.use((req: Request, res: Response) => {
    res.status(404);
    res.send('Route does not exist');
});
