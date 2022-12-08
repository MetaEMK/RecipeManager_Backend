import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { createLogger } from "../../utils/logger.js";
import { decodeURISpaces, generateSlug } from "../../utils/controller.util.js";
import { SQLiteErrorResponse } from "../../utils/sqliteErrorResponse.js";
import { Branch } from "../../data/entities/branch.entity.js";
import { ScheduledItem } from "../../data/entities/scheduled_item.entity";
import { ScheduleItemsValidator } from "../validators/schedule_items.validator";

// Router instance
export const scheduleRouter = express.Router({
    mergeParams: true
});

// Logger instance
const logger = createLogger();

/**
 * Get a specific schedule with all its items.
 */
scheduleRouter.get("/", async function (req: Request, res: Response) {

});

/**
 * Create a schedule item for a specific schedule.
 */
scheduleRouter.post("/", async function (req: Request, res: Response) {

});

/**
 * Delete a schedule item of a specific schedule.
 */
scheduleRouter.delete("/:id", async function (req: Request, res: Response) {

});