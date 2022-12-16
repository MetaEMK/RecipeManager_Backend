import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../config/datasource.js";
import { deleteResponse, getResponse, postResponse } from "../../utils/controller.util.js";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";
import { Conversion } from "../../data/entities/conversion.entity.js";
import { ConversionToSizeValidator } from "../validators/conversion_to_size.validator.js";
import { ValidationException } from "../../exceptions/ValidationException.js";
import { ConversionType } from "../../data/entities/conversion_type.entity.js";
import { SQLiteForeignKeyException } from "../../exceptions/SQLiteForeignKeyException.js";
import { Size } from "../../data/entities/size.entity.js";

// Router instance
export const conversionRouter = express.Router({
    mergeParams: true
});

// Logger instance
const logger = createLogger();

/**
 * Get all conversion type conversions.
 * 
 * Filter params:
 * - fromSize: Search for a specific from size
 * - toSize: Search for a specific to size
 */
conversionRouter.get("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqConversionTypeId: number = Number(req.params.conversionTypeId);
    const filterByFromSizeId: number = Number(req.query.fromSize);
    const filterByToSizeId: number = Number(req.query.toSize);

    // Validator instance
    const validator = new ConversionToSizeValidator();

    // ORM query
    try {
        // Check first if parent resource exists
        if (!reqConversionTypeId)
            throw new HttpNotFoundException();

        if (!(await getConversionType(reqConversionTypeId)))
            throw new HttpNotFoundException();

        // Get conversions
        const query = AppDataSource
            .getRepository(Conversion)
            .createQueryBuilder("conversion")
            .innerJoinAndSelect("conversion.fromSize", "fromSize")
            .innerJoinAndSelect("conversion.toSize", "toSize")
            .where("conversion.conversion_type_id = :conversionType", { conversionType: reqConversionTypeId });

        // Validate/Sanitize parameters and build where clause
        if (validator.isValidSizeId(filterByFromSizeId))
            query.andWhere("conversion.from_size_id = :fromSizeId", { fromSizeId: filterByFromSizeId });

        if (validator.isValidSizeId(filterByToSizeId))
            query.andWhere("conversion.to_size_id = :toSizeId", { toSizeId: filterByToSizeId });
        
        const conversions = await query.getMany();

        getResponse(conversions, res);
    } catch (err) {
        next(err);
    }
});

/**
 * Create a conversion type conversion.
 */
conversionRouter.post("/", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqConversionTypeId: number = Number(req.params.conversionTypeId);

    const reqFromSizeId: number = Number(req.body.fromSize);
    const reqToSizeId: number = Number(req.body.toSize);
    const reqMultiplicator: number = Number(req.body.multiplicator);

    // Conversion instance
    const conversion = new Conversion();

    // Validator instance
    const validator = new ConversionToSizeValidator();

    // ORM query
    try {
        // Check first if parent resource exists
        if (!reqConversionTypeId)
            throw new HttpNotFoundException();

        const conversionType = await getConversionType(reqConversionTypeId);

        if (!conversionType)
            throw new HttpNotFoundException();

        // Foreign keys
        if (!reqFromSizeId) {
            throw new SQLiteForeignKeyException("conversion", "fromSize");
        }
        if (!reqToSizeId) {
            throw new SQLiteForeignKeyException("conversion", "toSize");
        }
        if(reqFromSizeId === reqToSizeId)
            throw new SQLiteForeignKeyException("conversion", "size", "FromSize and ToSize can't be the same size.");

        // Both sizes have to belong to the same conversion type        
        const fromSize = await AppDataSource
            .getRepository(Size)
            .createQueryBuilder("size")
            .where("size.conversion_type_id = :conversionTypeId", { conversionTypeId: reqConversionTypeId })
            .andWhere("size.id = :fromSizeId", { fromSizeId: reqFromSizeId })
            .getOne();
        if (!fromSize) {
            throw new SQLiteForeignKeyException("conversion", "fromSize");
        }

        const toSize = await AppDataSource
            .getRepository(Size)
            .createQueryBuilder("size")
            .where("size.conversion_type_id = :conversionTypeId", { conversionTypeId: reqConversionTypeId })
            .andWhere("size.id = :toSizeId", { toSizeId: reqToSizeId })
            .getOne();
        if(!toSize) {
            throw new SQLiteForeignKeyException("conversion", "fromSize");
        }

        // Validation
        if(validator.isValidMulitplicator(reqMultiplicator))
            conversion.multiplicator = reqMultiplicator;

        // Set parent and foreign key
        conversion.conversionType = conversionType;
        conversion.fromSize = fromSize;
        conversion.toSize = toSize;

        if (validator.getErrors().length === 0) {
            await AppDataSource
                .getRepository(Conversion)
                .save(conversion);

            postResponse(conversion, req, res);

            logger.info("Conversion " + conversion.id + " created.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new ValidationException(validator.getErrors());
        }

    } catch (err) {
        next(err);
    }
});

/**
 * Delete a conversion type conversion.
 */
conversionRouter.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {
    // Parameters
    const reqConversionTypeId: number = Number(req.params.conversionTypeId);
    const reqId: number = Number(req.params.id);

    // Repository instance
    const repository = AppDataSource.getRepository(Conversion);

    // Conversion instance
    let conversion: Conversion|null = null;

    // ORM query
    try {
        if (reqConversionTypeId && reqId) {
            // Check first if parent resource exists
            if (!(await getConversionType(reqConversionTypeId)))
                throw new HttpNotFoundException();

            // Delete
            conversion = await repository
                .createQueryBuilder("conversion")
                .where("conversion.id = :id", { id: reqId })
                .andWhere("conversion.conversion_type_id = :conversionTypeId", { conversionTypeId: reqConversionTypeId })
                .getOne();
        }

        if (conversion) {
            await repository.remove(conversion);

            deleteResponse(res);

            logger.info("Conversion with ID " + reqId + " deleted.", LOG_ENDPOINT.DATABASE);
        } else {
            throw new HttpNotFoundException();
        }
    } catch (err) {
        next(err);
    }
});

/**
 * Get conversion type by id.
 * 
 * @param conversionTypeId 
 * @returns ConversionType on success else null
 */
async function getConversionType (conversionTypeId: any): Promise<ConversionType | null>
{
    conversionTypeId = Number(conversionTypeId);

    if (!conversionTypeId)
        return null;

    const conversionType = AppDataSource
        .getRepository(ConversionType)
        .findOne({
            where: {
                id: conversionTypeId
            }
        });

    if (!conversionType)
        return null;

    return conversionType;
}