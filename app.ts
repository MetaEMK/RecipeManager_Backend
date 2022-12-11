import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { apiRouter } from "./api.js";
import { setupPublicDir } from "./utils/directories.util.js";

dotenv.config({ path: "./config/app.env"});

// Setup directories
setupPublicDir();

// Express instance
const app = express();

// API router instance
app.use("/api/v1", apiRouter);

// Default route if not exists
app.use((req: Request, res: Response) => {
    res.status(404);
    res.send();
});

// Port
app.listen(process.env.NODE_PORT, () => {
    console.log(`App listening at http://localhost:${process.env.NODE_PORT}`);
});