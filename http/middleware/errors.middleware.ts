import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { QueryFailedError } from "typeorm";
import { HttpNotFoundException } from "../../exceptions/HttpException.js";
import { NotSupportedMediaTypeException } from "../../exceptions/NotSupportedMediaTypeException.js";
import { ValidationException } from "../../exceptions/ValidationException.js";
import { createLogger, LOG_ENDPOINT, LOG_LEVEL } from "../../utils/logger.js";

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

    // Error handling
    switch(true) {
        case err instanceof HttpNotFoundException:
            notFoundError(err as HttpNotFoundException, res);
            break;
        case err instanceof SyntaxError:
            jsonError(err as SyntaxError, res, logger);
            break;
        case err instanceof QueryFailedError:
            sqliteError(err as QueryFailedError, res, logger);
            break;
        case err instanceof ValidationException:
            validationError(err as ValidationException, res);
            break;
        case err instanceof multer.MulterError:
            multipartFormDataError(err as multer.MulterError, res, logger);
            break;
        case err instanceof NotSupportedMediaTypeException:
            notSupportedMediaTypeError(err as NotSupportedMediaTypeException, res, logger);
            break;
        case err instanceof Error:
            generalError(err as Error, res, logger);
            break;
        default:
            defaultError(err, res, logger);
            break;
    }
}

/**
 * Default error.
 * 
 * @param err Thrown error
 * @param res HTTP response object
 * @param logger Logger instance
 */
function defaultError(err: unknown, res: Response, logger: any): void
{
    // Error response
    const errorResponse: ErrorResponse = {
        error: {
            code: "UNEXPECTED_ERROR",
            type: "UNEXPECTED_ERROR",
            message: "An unexpteced error occurred."
        }
    };

    // Response
    res.status(500);
    res.json(errorResponse);

    // Log
    logger.error(err, LOG_ENDPOINT.MAIN);
}

/**
 * General error.
 * 
 * @param err Thrown error.
 * @param res HTTP response object
 * @param logger Logger instance
 */
function generalError(err: Error, res: Response, logger: any): void
{
    // Error response
    const errorResponse: ErrorResponse = {
        error: {
            code: err.name,
            type: "UNEXPECTED_ERROR",
            message: process.env.NODE_ENV === "production" ? "An unexpteced error occurred." : err.message
        }
    };

    // Response
    res.status(500);
    res.json(errorResponse);

    // Log
    logger.error(err, LOG_ENDPOINT.MAIN);
}

/**
 * Not found error.
 * Doesn't return a response body.
 * 
 * @param err Thrown error
 * @param res HTTP response object
 */
function notFoundError(err: HttpNotFoundException, res: Response): void
{
    // Response
    res.status(404);
    res.send();
}

/**
 * Malformed JSON error.
 * 
 * @param err Thrown error
 * @param res HTTP response object
 * @param logger Logger instance
 */
function jsonError(err: SyntaxError, res: Response, logger: any): void
{
    // Error response
    const errorResponse: ErrorResponse = {
        error: {
            code: "MALFORMED_JSON",
            type: "SYNTAX_ERROR",
            message: err.message
        }
    };

    // Response
    res.status(400);
    res.json(errorResponse);

    // Log
    logger.error("Bad request: " + err.message, LOG_ENDPOINT.MAIN);
}

/**
 * SQLite error.
 * 
 * @param err Thrown error
 * @param res HTTP response object
 * @param logger Logger instance
 */
function sqliteError(err: QueryFailedError, res: Response, logger: any): void
{
    // Error parameters
    const code = err.driverError.code;
    let logLevel: LOG_LEVEL = LOG_LEVEL.LOG_LEVEL_ERROR;
    let statusCode: number = 500;

    // Error response
    const errorResponse: ErrorResponse = {
        error: {
            code: code,
            type: "SQLITE_ERROR",
            message: process.env.NODE_ENV === "production" ? "A SQLite error occurred." : err.message
        }
    };

    // SQLITE_CONSTRAINT error
    if(code === "SQLITE_CONSTRAINT") {
        logLevel = LOG_LEVEL.LOG_LEVEL_WARN;
        statusCode = 409;

        const startIndex = err.message.indexOf(": ") + 2;
        const endIndex = err.message.indexOf(" ", startIndex);
        errorResponse.error.code = "SQLITE_CONSTRAINT_" + err.message.substring(startIndex, endIndex) + "_KEY";
    }

    // Response
    res.status(statusCode);
    res.json(errorResponse);

    // Log
    if(logLevel === LOG_LEVEL.LOG_LEVEL_WARN) {
        logger.warn(err.message, LOG_ENDPOINT.DATABASE);
    } else {
        logger.error(err.message, LOG_ENDPOINT.DATABASE);
    }
}

/**
 * Validation error.
 * Each validator logs separately.
 * 
 * @param err Thrown error
 * @param res HTTP response object
 */
function validationError(err: ValidationException, res: Response): void
{
    // Error response
    const errorResponse: ErrorResponse = {
        error: {
            code: err.code,
            type: err.type,
            message: err.message
        }
    };

    // Response
    res.status(400);
    res.json(errorResponse);
}

/**
 * Multer/Multipart form data error.
 * 
 * @param err Thrown error
 * @param res HTTP response object
 * @param logger Logger instance
 */
function multipartFormDataError(err: multer.MulterError, res: Response, logger: any): void
{
    // Error response
    const errorResponse: ErrorResponse = {
        error: {
            code: err.code,
            type: err.name,
            message: err.message,
        }
    };

    // Response
    res.status(400);
    res.json(errorResponse);

    // Log
    logger.info(err.message, LOG_ENDPOINT.MAIN);
}

function notSupportedMediaTypeError(err: NotSupportedMediaTypeException, res: Response, logger: any): void
{
    // Error response
    const errorResponse: ErrorResponse = {
        error: {
            code: err.code,
            type: err.type,
            message: err.message,
        }
    };

    // Response
    res.status(415);
    res.json(errorResponse);

    // Log
    logger.info(err.message, LOG_ENDPOINT.MAIN);
}