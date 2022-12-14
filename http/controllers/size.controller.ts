import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { decodeURISpaces, deleteResponse, getResponse, postResponse } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { ConversionType } from "../../data/entities/conversion_type.entity.js";
import { Size } from "../../data/entities/size.entity.js";
import { SizeValidator } from "../validators/size.validator.js";
import { ValidationException } from "../../exceptions/ValidationException.js";

// Router instance
export const sizeRouter = express.Router({
    mergeParams: true
});

// Logger instance
const logger = createLogger();

/**
 * Get all sizes of a conversion type.
 *
 * Filter params
 * - name: Search for similar name
 */
sizeRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqConversionTypeId: number = Number(req.params.conversionTypeId);
    const filteryByName: string = <string>req.query.name;

    // Validator instance
    const validator = new SizeValidator();

    // ORM query
    try {
        const query = AppDataSource
            .getRepository(Size)
            .createQueryBuilder("size")
            .innerJoin("size.conversionType", "conversionType")
            .where("conversionType.id = :conversionTypeId", { conversionTypeId: reqConversionTypeId});

        // Validate/Sanitize parameters and build where clause
        if (validator.isValidSizeName(filteryByName))
            query.andWhere("size.name LIKE :sizeName", { sizeName: `%${ decodeURISpaces(filteryByName) }%` });

        const sizes = await query.getMany();

        getResponse(sizes, res);
    } catch (err) {
        next(err);
    }
});

/**
 * Create a size of a conversion type.
 */
sizeRouter.post("/", async function (req: Request, res: Response, next: NextFunction) {
    // Paramters
    const reqConversionTypeId: number = Number(req.params.conversionTypeId);
    const reqName: string = req.body.name;

    // Size instance
    const size = new Size();

    // Validator instance
    const validator = new SizeValidator();

    // ORM query
    try {
        // Check first if parent resource exists
        if (!reqConversionTypeId)
            throw new HttpNotFoundException();

        const conversionType = await AppDataSource
            .getRepository(ConversionType)
            .findOne({
                where: {
                    id: reqConversionTypeId
                }
            });

        if (!conversionType)
            throw new HttpNotFoundException();

        // Validation
        if(validator.isValidSizeName(reqName))
            size.name = reqName;

        // Set foreign key
        size.conversionType = conversionType;

        if(validator.getErrors().length === 0) {
            await AppDataSource
                .getRepository(Size)
                .save(size);

            postResponse(size, req, res);

            logger.info("Size " + size.id + " created.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new ValidationException(validator.getErrors());
        }
    } catch (err) {
        next(err);
    }
});

/**
 * Delete a size of a conversion type.
 */
sizeRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqConversionTypeId: number = Number(req.params.conversionTypeId);
    const reqId: number = Number(req.params.id);

    // Repository instance
    const repository = AppDataSource.getRepository(Size);

    // Size instance
    let size: Size|null = null;

    // ORM query
    try {
        if(reqId) {
            size = await repository
                .createQueryBuilder("size")
                .innerJoin("size.conversionType", "conversionType")
                .where("size.id = :id", { id: reqId })
                .andWhere("conversionType.id = :conversionTypeId", { conversionTypeId: reqConversionTypeId })
                .getOne();
        }

        if (size) {
            await repository.remove(size);

            deleteResponse(res);

            logger.info("Size with ID " + reqId + " deleted.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
});