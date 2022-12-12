import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { decodeURISpaces, generateSlug } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Branch } from "../../data/entities/branch.entity.js";
import { ScheduledItem } from "../../data/entities/scheduled_item.entity";
import { ScheduleItemsValidator } from "../validators/schedule_items.validator";
import { ValidationException } from "../../exceptions/ValidationException.js";

// Router instance
export const scheduleRouter = express.Router({
    mergeParams: true
});

// Logger instance
const logger = createLogger();

/**
 * Get a specific schedule with all its items.
 */
scheduleRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {

});

/**
 * Create a schedule item for a specific schedule.
 */
scheduleRouter.post("/", async function (req: Request, res: Response, next: NextFunction) {

});

/**
 * Delete a schedule item of a specific schedule.
 */
scheduleRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {

});