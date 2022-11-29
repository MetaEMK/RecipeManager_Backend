import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource.js";
import { Branch } from "../entities/branch.entity.js";
import { ScheduledItem } from "../entities/scheduled_item.entity.js";

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
    const branch = await AppDataSource
        .getRepository(Branch)
        .findOneBy({
            id: req.body.branch_id
        });
    
    if(branch) {
        const scheduledItem = new ScheduledItem();
        scheduledItem.day = req.body.day;
        scheduledItem.branch = branch;
    
        await AppDataSource
            .getRepository(ScheduledItem)
            .save(scheduledItem);
            
        res.json(scheduledItem);
    } else {
        res.status(400);
        res.json({
            error: {
                code: 9999,
                message: "Branch doesn't exist"
            }
        })
    }
});