import express  from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { decodeURISpaces } from "../../utils/controller.util.js";
import { SQLiteErrorResponse } from "../error_responses/sqliteErrorResponse.js";
import { ConversionType } from "../../data/entities/conversion_type.entity.js";
import { ConversionTypeValidator } from "../validators/conversion_type.validator.js";
import { validationErrorResponse } from "../error_responses/validationErrorResponse.js";

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

    // Validator instance
    const validator: ConversionTypeValidator = new ConversionTypeValidator();

    // ORM query
    try {
        const query = AppDataSource
            .getRepository(ConversionType)
            .createQueryBuilder("conversionType");

        // Validation for filter parameter
        if(validator.isValidName(filterByName))
            query.andWhere("conversionType.name LIKE :conversionTypeName", { conversionTypeName: `%${ filterByName }%` });

        const conversionTypes = await query.getMany();

        res.json({
            data: conversionTypes
        });
    } catch (err) {
        const errRes = new SQLiteErrorResponse(err); 
        errRes.response(res);
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
            errRes.response(res);
        }
    } else {
        validationErrorResponse(validator.getErrors(), res);
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
        errRes.response(res);
    }
});