import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { ScheduledItem } from "../../data/entities/scheduled_item.entity.js";

export const scheduledItemRouter = express.Router();

// Get all scheduled items of the schedule
scheduledItemRouter.get("/", async function (req: Request, res: Response) {
    const scheduledItems = await AppDataSource
        .getRepository(ScheduledItem)
        .find();

    res.json(scheduledItems);
});

// Create a scheduled item
scheduledItemRouter.post("/", async function (req: Request, res: Response) {
    const scheduledItem = new ScheduledItem();
    scheduledItem.day = req.body.day;

    await AppDataSource
        .getRepository(ScheduledItem)
        .save(scheduledItem);
        
    res.json(scheduledItem);
});

// Delete a recipe
scheduledItemRouter.delete("/:id",async function(req: Request, res: Response) {
    const results = await AppDataSource.getRepository(ScheduledItem).delete(req.params.id);
    res.json(results);
});