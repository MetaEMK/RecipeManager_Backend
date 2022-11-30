export class ValidationError 
{
    public code: string;
    public message: string;

    constructor(code: string, message: string) {
        this.code = code;
        this.message = message;
    }
}

export enum GenerelValidationErrorCodes {
    NAME_MISSING = "NAME_MISSING",
    NAME_INVALID = "INVALID_NAME",
    NAME_INVALID_LENGTH = "INVALID_NAME_LENGTH",
    NAME_INVALID_UNIQUE = "INVALID_NAME_UNIQUE",
}