import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { setupPublicDir } from "./utils/directories.util.js";
import { apiRouter } from "./api.js";
import { errorHandler } from "./http/middleware/errors.middleware.js";
import { HttpNotFoundException } from "./exceptions/HttpException.js";

dotenv.config({ path: "./config/app.env"});

// Setup directories
setupPublicDir();

// Express instance
const app = express();

// Setup api and public routes
app.use("/api/v1", apiRouter);
app.use(express.static("public"));

// Default route if not exists
app.use((req: Request, res: Response) => {
    throw new HttpNotFoundException();
});

// Error handler
app.use(errorHandler);

// Port
app.listen(process.env.NODE_PORT, () => {
    console.log(`App listening at http://localhost:${process.env.NODE_PORT}`);
});