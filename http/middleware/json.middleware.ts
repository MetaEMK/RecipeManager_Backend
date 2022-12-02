import {  Request, Response, NextFunction } from "express";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";

/**
 * Catches malforme JSON requests.
 * 
 * @param err Thrown error
 * @param req  HTTP request object
 * @param res  HTTP response object
 * @param next Callback argument to the middlware function
 * @returns Error response
 */
export function jsonErrorHandler(err: any, req: Request, res: Response, next: NextFunction)
{
    const logger = createLogger();

    if (err instanceof SyntaxError) {
        logger.error("Bad request: " + err.message, LOG_ENDPOINT.MAIN);

        return res.status(400).json({
            success: false,
            error: {
                code: 9999,
                type: "Bad Request",
                message: err.message,
                info: err.message
            }
        });
    }

    next();
}