import { NextFunction, Request, Response } from "express";
import { createLogger, LOG_ENDPOINT } from "../../utils/logger.js";

/**
 * Error response type interface.
 */
interface ErrorResponse {
    error: {
        code: string,
        type: string,
        message: string
    }
}

/**
 * General error handler of the API.
 * 
 * @param err Thrown error
 * @param req HTTP request object
 * @param res HTTP response object
 * @param next Callback argument to the middlware function
 */
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void
{
    // Logger instance
    const logger = createLogger();

    // Error response instance
    let errorResponse: ErrorResponse = {
        error: {
            code: "UNCAUGHT_ERROR",
            type: "UNCAUGHT_ERROR",
            message: "An uncaught error occurred."
        }
    };

    // Error handling
    switch(true) {
        case err instanceof SyntaxError:
            res.status(400);
            errorResponse = jsonError(err as SyntaxError, logger);
            break;
        default:
            res.status(500);
            break;
    }

    // Send response
    res.json(errorResponse!);
}

/**
 * Malformed JSON error.
 * 
 * @param err Thrown error
 * @param logger Logger instance
 */
function jsonError(err: SyntaxError, logger: any): ErrorResponse
{
    logger.error("Bad request: " + err.message, LOG_ENDPOINT.MAIN);

    return {
        error: {
            code: "MALFORMED_JSON",
            type: "SYNTAX_ERROR",
            message: err.message
        }
    }
}