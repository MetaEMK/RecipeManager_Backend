import { QueryFailedError } from "typeorm";
import { createLogger, LOG_ENDPOINT, LOG_LEVEL } from "./logger.js";

/**
 * Simple sqlite error response class for parsing.
 */
export class SQLiteErrorResponse 
{
    // Logging
    private caught: boolean = false;
    private initialError: unknown;
    private logger: any;
    private level: LOG_LEVEL = LOG_LEVEL.LOG_LEVEL_ERROR;

    // HTTP response status code
    private statusCode: number = 500;

    // Error parameters
    private code: any = 9000;
    private type: any = "UNCAUGHT_EXCEPTION";
    private message: string = "An uncaught exception occurred.";
    private details: string = "An uncaught exception occurred.";
    private parameters: any[]|undefined = [];

    constructor (err: unknown, message?: string)
    {
        this.initialError = err;
        this.logger = createLogger();

        if(this.initialError instanceof QueryFailedError) {
            this.caught = true;
            this.setErrorWeight(this.initialError.driverError.code, this.initialError.message);

            this.code = this.initialError.driverError.errno;
            this.message = message ?? this.initialError.message;
            this.details = this.initialError.message;
            this.parameters = this.initialError.parameters;
        }
    }

    /**
     * Sets error weight based on error type.
     * Error weight includes error log level, error http status code and error type.
     * 
     * @param type SQLite driverError code 
     * @param message SQLite error message
     */
    private setErrorWeight(type: any, message: string ): void {
        switch(type) {
            case "SQLITE_CONSTRAINT":
                const start = message.indexOf(": ") + 2;
                const end = message.indexOf(" ", start);
        
                this.level = LOG_LEVEL.LOG_LEVEL_WARN;
                this.statusCode = 409;
                this.type = "SQLITE_CONSTRAINT_" + message.substring(start, end) + "_KEY";

                break;
            default:
                this.type = type;
                this.level = LOG_LEVEL.LOG_LEVEL_ERROR;

                break;
        }
    }

    /**
     * Returns error HTTP response status code.
     * 
     * @returns HTTP response status code
     */
    public getStatusCode(): number
    {
        return this.statusCode;
    }

    /**
     * Parses error to response object.
     * 
     * @returns Response object
     */
    public toResponseObject(): object 
    {
        return {
            success: false,
            error: {
                code: this.code,
                type: this.type,
                message: this.message,
                info: {
                    details: this.details,
                    parameters: this.parameters
                }
            }
        }
    }

    /**
     * Parses error to a string.
     * 
     * @returns Error response string 
     */
    public toString(): string
    {
        return "Code: " + this.code + " - " + this.type + ": " + this.message + " | Details: " + this.details + ", Parameters: " + this.parameters;
    }

    /**
     * Logs the error.
     */
    public log(): void
    {
        // Determines message based on if the exception is known
        let message = this.toString();
        if(this.caught) {
            message = this.initialError as any;
        }

        switch(this.level) {
            case LOG_LEVEL.LOG_LEVEL_DEBUG:
                this.logger.debug(message, LOG_ENDPOINT.DATABASE);
                break;
            case LOG_LEVEL.LOG_LEVEL_INFO:
                this.logger.info(message, LOG_ENDPOINT.DATABASE);
                break;
            case LOG_LEVEL.LOG_LEVEL_WARN:
                this.logger.warn(message, LOG_ENDPOINT.DATABASE);
                break;
            default:
                this.logger.error(message, LOG_ENDPOINT.DATABASE);
                break;       
        }
    }
}