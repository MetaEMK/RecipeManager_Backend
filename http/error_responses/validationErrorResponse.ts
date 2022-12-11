import { Response } from "express";
import { ValidationError } from "../validators/validationError";

/**
 * Simple validation error response function.
 * 
 * @param err Validation error array
 * @param res Express response object
 */
export function validationErrorResponse(err: ValidationError[], res: Response)
{
    res.status(400);
    res.json({
        error: err?.[0]
    });
}