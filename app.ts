import express from "express";
import { apiRouter } from "./api.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config/app.env"});

const app = express();

app.use("/api/v1", apiRouter);

app.listen(process.env.NODE_PORT, () => {
    console.log(`App listening at http://localhost:${process.env.NODE_PORT}`);
});