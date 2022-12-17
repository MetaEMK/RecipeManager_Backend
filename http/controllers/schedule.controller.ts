import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { deleteResponse, getResponse, postResponse, prepareForSqlInParams } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Branch } from "../../data/entities/branch.entity.js";
import { ScheduledItem } from "../../data/entities/scheduled_item.entity.js";
import { ScheduleItemsValidator } from "../validators/schedule_items.validator.js";
import { ValidationException } from "../../exceptions/ValidationException.js";
import { Days } from "../../enums/Days.enum.js";
import { SQLiteForeignKeyException } from "../../exceptions/SQLiteForeignKeyException.js";
import { Variant } from "../../data/entities/variant.entity.js";
import { Size } from "../../data/entities/size.entity.js";

// Router instance
export const scheduleRouter = express.Router({
    mergeParams: true
});

// Logger instance
const logger = createLogger();

/**
 * Get a specific branch schedule with all its items.
 * 
 * Filter params:
 * - day: Search (multiple) days
 * - variant: Search a variant id
 * - size: Search a size id
 * - limit: Limit returned rows
 * - offset: Set starting index of returned rows
 */
scheduleRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqBranchId: number = Number(req.params.branchId);

    let filterByDays: string|string[] = <string>req.query.day;
    const filterByVariantId: number = Number(req.query.variant);
    const filterBySizeId: number = Number(req.query.size);

    const limit: number = Number(req.query.limit);
    const offset: number = Number(req.query.offset);

    // Validator instance
    const validator = new ScheduleItemsValidator();

    // ORM query
    try {
        // Check first if parent resource exists
        if (!reqBranchId)
            throw new HttpNotFoundException();

        if (!(await getBranch(reqBranchId)))
            throw new HttpNotFoundException();

        // Get schedule
        const query = AppDataSource
            .getRepository(ScheduledItem)
            .createQueryBuilder("item")
            .innerJoinAndSelect("item.variant", "variant")
            .innerJoinAndSelect("item.size", "size")
            .where("item.branch_id = :branchId", { branchId: reqBranchId });

        // Validation/Sanitize parameters and build where clause
        if (filterByDays) {
            filterByDays = prepareForSqlInParams(filterByDays);

            if(validator.isValidDayArray(filterByDays)) {
                query.andWhere("item.day IN (:...days)", { days: filterByDays });
            }
        }

        if (filterByVariantId)
            query.andWhere("item.variant_id = :variantId", { variantId: filterByVariantId });

        if (filterBySizeId)
            query.andWhere("item.size_id = :sizeId", { sizeId: filterBySizeId });

        // Pagination
        if (offset)
            query.skip(offset);
        if (limit)
            query.take(limit);

        const schedule = await query.getMany();

        getResponse(schedule, res);
    } catch (err) {
        next(err);
    }
});

/**
 * Create a scheduled item for a branch specific schedule.
 */
scheduleRouter.post("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqBranchId: number = Number(req.params.branchId);

    const reqDay: Days = Number(req.body.day);
    const reqVariantId: number = Number(req.body.variant);
    const reqSizeId: number = Number(req.body.size);
    const reqQuantity: number = Number(req.body.quantity);

    // Scheduled item instance
    const scheduledItem = new ScheduledItem()

    // Validator instance
    const validator = new ScheduleItemsValidator();

    // ORM query
    try {
        // Check first if parent resource exists
        if (!reqBranchId)
            throw new HttpNotFoundException();

        const branch = await getBranch(reqBranchId);

        if (!branch)
            throw new HttpNotFoundException();

        // Foreign keys
        if (!reqVariantId) {
            throw new SQLiteForeignKeyException("scheduledItem", "variant");
        }
        const variant = await AppDataSource
            .getRepository(Variant)
            .findOne({
                where: {
                    id: reqVariantId,
                    recipe: {
                        branches: {
                            id: reqBranchId
                        }
                    }
                },
                relations: {
                    conversionType: true
                }
            });
        if (!variant) {
            throw new SQLiteForeignKeyException("scheduledItem", "variant");
        }

        if (!reqSizeId) {
            throw new SQLiteForeignKeyException("scheduledItem", "size");
        }
        const size = await AppDataSource
            .getRepository(Size)
            .createQueryBuilder("size")
            .where("size.conversion_type_id = :conversionTypeId", { conversionTypeId: variant!.conversionType?.id })
            .andWhere("size.id = :sizeId", { sizeId: reqSizeId })
            .getOne();
        if (!size) {
            throw new SQLiteForeignKeyException("scheduledItem", "size");
        }

        // Validation
        if (validator.isValidDay(reqDay))
            scheduledItem.day = reqDay;

        if (validator.isValidQuantity(reqQuantity))
            scheduledItem.quantity = reqQuantity;

        // Set parent and foreign key
        scheduledItem.branch = branch;
        scheduledItem.variant = variant;
        scheduledItem.size = size;

        if (validator.getErrors().length === 0) {
            await AppDataSource
                .getRepository(ScheduledItem)
                .save(scheduledItem);
                
            postResponse(scheduledItem, req, res);

            logger.info("Scheduled item " + scheduledItem.id + " created.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new ValidationException(validator.getErrors());
        }
    } catch (err) {
        next(err);
    }
});

/**
 * Delete a scheduled item of a specific branch schedule.
 */
scheduleRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqBranchId: number = Number(req.params.branchId);
    const reqId: number = Number(req.params.id);

    // Repository instance
    const repository = AppDataSource.getRepository(ScheduledItem);

    // Scheduled item instance
    let scheduledItem: ScheduledItem|null = null;

    // ORM query
    try {
        if (reqBranchId && reqId) {
            // Check first if parent resource exists
            if (!(await getBranch(reqBranchId)))
                throw new HttpNotFoundException();

            scheduledItem = await repository
                .createQueryBuilder("scheduledItem")
                .where("scheduledItem.id = :id", { id: reqId })
                .andWhere("scheduledItem.branch_id = :branchId", { branchId: reqBranchId })
                .getOne();
        }

        if (scheduledItem) {
            await repository.remove(scheduledItem);

            deleteResponse(res);

            logger.info("Scheduled item with ID " + reqId + " deleted.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
});

/**
 * Get branch by id.
 * 
 * @param branchId 
 * @returns Branch on success else null
 */
async function getBranch(branchId: any): Promise<Branch | null> 
{
    branchId = Number(branchId);

    if (!branchId)
        return null;

    const branch = await AppDataSource
        .getRepository(Branch)
        .findOne({
            where: {
                id: branchId
            }
        });

    if (!branch)
        return null;

    return branch;
}