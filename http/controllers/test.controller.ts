import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { canCreateIngredient } from "../validators/ingredient.validator.js";

export const testRouter = express.Router();

testRouter.post("/", async function (req: Request, res: Response) {
    let test = await canCreateIngredient(req.body.name);
    res.json(test);
});