import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { decodeURISpaces, deleteResponse, getResponse, postResponse } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { ConversionType } from "../../data/entities/conversion_type.entity.js";
import { ConversionTypeValidator } from "../validators/conversion_type.validator.js";
import { ValidationException } from "../../exceptions/ValidationException.js";

// Router instance
export const conversionTypeRouter = express.Router();

// Logger instance
const logger = createLogger();

/**
 * Get all conversion types.
 * 
 * Filter params
 * - name: Search for similar name
 */
conversionTypeRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const filterByName: string = <string>req.query.name;

    // Validator instance
    const validator = new ConversionTypeValidator();

    // ORM query
    try {
        const query = AppDataSource
            .getRepository(ConversionType)
            .createQueryBuilder("conversionType");

        // Validate/Sanitize parameters and build where clause
        if(validator.isValidName(filterByName))
            query.andWhere("conversionType.name LIKE :conversionTypeName", { conversionTypeName: `%${ decodeURISpaces(filterByName) }%` });

        const conversionTypes = await query.getMany();

        getResponse(conversionTypes, res);
    } catch (err) {
        next(err);
    }
});

/**
 * Create a conversion type.
 */
conversionTypeRouter.post("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqName: string = req.body.name;

    // Conversion type instance
    const conversionType = new ConversionType();

    // Validator instance
    const validator = new ConversionTypeValidator();

    // Validation
    if(validator.isValidName(reqName))
        conversionType.name = reqName;
    
    // ORM query
    try {
        if (validator.getErrors().length === 0) {
            await AppDataSource
                .getRepository(ConversionType)
                .save(conversionType);

            postResponse(conversionType, req, res);
            
            logger.info("Conversion type " + conversionType.id + " created.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new ValidationException(validator.getErrors());
        }        
    } catch (err) {
        next(err);
    }
});

/**
 * Delete a conversion type.
 */
conversionTypeRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqId = Number(req.params.id);

    // Repository instance
    const repository = AppDataSource.getRepository(ConversionType);

    // Conversion type instance
    let conversionType: ConversionType|null = null;

    // ORM query
    try {
        if (reqId) {
            conversionType = await repository
                .findOne({
                    where: {
                        id: reqId
                    }
                });
        }

        if (conversionType) {
            await repository.remove(conversionType);

            deleteResponse(res);

            logger.info("Conversion type with ID " + reqId + " deleted.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
});