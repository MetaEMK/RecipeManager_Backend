import express  from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { decodeURISpaces } from "../../utils/controller.util.js";
import { SQLiteErrorResponse } from "../../utils/sqliteErrorResponse.js";
import { ConversionType } from "../../data/entities/conversion_type.entity.js";
import { ConversionTypeValidator } from "../validators/conversion_type.validator.js";

// Router instance
export const conversionTypeRouter = express.Router();

// Logger instance
const logger = createLogger();

/**
 * Get all conversion types.
 * Able to filter the category type name.
 */
conversionTypeRouter.get("/", async function (req: Request, res: Response) {
    // Parameters
    const filterByName: string|undefined = decodeURISpaces(req.query?.name as string);

    // Filter instance
    let filter: Object = {};
    let filterName: string|undefined;

    // Validator instance
    const validator: ConversionTypeValidator = new ConversionTypeValidator();

    // Validation
    if(validator.isValidName(filterByName))
        filterName = filterByName;

    // Set filter
    filter = ConversionType.getFilter(filterName);

    // ORM query
    try {
        const conversionTypes = await AppDataSource
            .getRepository(ConversionType)
            .find({
                where: filter
            });

        res.json({
            data: conversionTypes
        });
    } catch (err) {
        const errRes = new SQLiteErrorResponse(err); 
        errRes.log();

        res.status(errRes.statusCode);
        res.json(errRes.toResponseObject());
    }
});

/**
 * Create a conversion type.
 */
conversionTypeRouter.post("/", async function (req: Request, res: Response) {
    // Parameters
    const reqName: string = req.body?.name;

    // Conversion type instance
    const conversionType: ConversionType = new ConversionType();

    // Validator instance
    const validator: ConversionTypeValidator = new ConversionTypeValidator();

    // Validation
    if(validator.isValidName(reqName))
        conversionType.name = reqName;
    
    // ORM query
    if (validator.getErrors().length === 0) {
        try {
            await AppDataSource
                .getRepository(ConversionType)
                .save(conversionType);

            logger.info("Conversion type " + conversionType.id + " created.", LOG_ENDPOINT.DATABASE);

            res.status(201)
            res.set({
                "Location": req.protocol + "://" + req.get("host") + req.originalUrl + "/" + conversionType.id
            });
            res.json({
                data: conversionType
            });
        } catch (err) {
            const errRes = new SQLiteErrorResponse(err); 
            errRes.log();
    
            res.status(errRes.statusCode);
            res.json(errRes.toResponseObject());
        }
    } else {
        res.status(400);
        res.json({
            error: validator.getErrors()?.[0]
        });
    }
});

/**
 * Delete a conversion type.
 */
conversionTypeRouter.delete("/:id", async function (req: Request, res: Response) {
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

            logger.info("Conversion type with ID " + reqId + " deleted.", LOG_ENDPOINT.DATABASE);

            res.status(204);
        } else {
            res.status(404);
        }

        res.send();
    } catch (err) {
        const errRes = new SQLiteErrorResponse(err);
        errRes.log();

        res.status(errRes.statusCode);
        res.json(errRes.toResponseObject());
    }
});