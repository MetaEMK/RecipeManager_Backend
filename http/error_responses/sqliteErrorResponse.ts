import { Response } from "express";
import { QueryFailedError } from "typeorm";
import { createLogger, LOG_ENDPOINT, LOG_LEVEL } from "../../utils/logger.js";

/**
 * Simple sqlite error response class.
 */
export class SQLiteErrorResponse 
{
    // Logging
    private _caught: boolean = false;
    private _initialError: unknown;
    private _logger: any;
    private _level: LOG_LEVEL = LOG_LEVEL.LOG_LEVEL_ERROR;

    // HTTP response status code
    private _statusCode: number = 500;

    // Error parameters
    private _code: any = "UNCAUGHT_EXCEPTION";
    private _type: any = "UNCAUGHT_EXCEPTION_ERROR";
    private _message: string = "An uncaught exception occurred.";

    constructor (err: unknown, message?: string)
    {
        this._initialError = err;
        this._logger = createLogger();

        if(this._initialError instanceof QueryFailedError) {
            this._caught = true;
            this.setErrorWeight(this._initialError.driverError.code, this._initialError.message);

            this._type = "SQLITE_ERROR";
            this._message = message ?? this._initialError.message;
        } else {
            this._message = message ?? this._message;
        }
    }

    /**
     * Sets error weight based on error code.
     * Error weight includes error log level, error http status code and error code.
     * 
     * @param code SQLite driverError code 
     * @param message SQLite error message
     */
    private setErrorWeight(code: any, message: string ): void {
        switch(code) {
            case "SQLITE_CONSTRAINT":
                const start = message.indexOf(": ") + 2;
                const end = message.indexOf(" ", start);
        
                this._level = LOG_LEVEL.LOG_LEVEL_WARN;
                this._statusCode = 409;
                this._code = "SQLITE_CONSTRAINT_" + message.substring(start, end) + "_KEY";

                break;
            default:
                this._level = LOG_LEVEL.LOG_LEVEL_ERROR;
                this._statusCode = 500;
                this._code = code;

                break;
        }
    }

    /**
     * Parses error to response object.
     * 
     * @returns Response object
     */
    private toResponseObject(): object 
    {
        return {
            error: {
                code: this._code,
                type: this._type,
                message: this._message
            }
        }
    }

    /**
     * Logs the error.
     */
    private log(): void
    {
        // Determines message based on if the exception is known
        let message = this.toString();
        if(this._caught) {
            message = this._initialError as any;
        }

        switch(this._level) {
            case LOG_LEVEL.LOG_LEVEL_DEBUG:
                this._logger.debug(message, LOG_ENDPOINT.DATABASE);
                break;
            case LOG_LEVEL.LOG_LEVEL_INFO:
                this._logger.info(message, LOG_ENDPOINT.DATABASE);
                break;
            case LOG_LEVEL.LOG_LEVEL_WARN:
                this._logger.warn(message, LOG_ENDPOINT.DATABASE);
                break;
            default:
                this._logger.error(message, LOG_ENDPOINT.DATABASE);
                break;       
        }
    }

    /**
     * Parses error to a string.
     * 
     * @returns Error response string 
     */
    public toString(): string
    {
        return "Code: " + this._code + " - " + this._type + ": " + this._message;
    }    

    /**
     * Sends the error response.
     * 
     * @param res Express response object
     */
    public response(res: Response): void 
    {
        this.log();

        res.status(this._statusCode);
        res.json(this.toResponseObject());
    }
}