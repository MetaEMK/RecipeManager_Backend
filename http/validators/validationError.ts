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
    //ID
    ID_INVALID_UNIQUE = "ID_INVALID_UNIQUE",
    ID_INVALID = "ID_INVALID",
    
    //NAME
    NAME_MISSING = "NAME_MISSING",
    NAME_INVALID = "INVALID_NAME",
    NAME_INVALID_LENGTH = "INVALID_NAME_LENGTH",
    NAME_INVALID_UNIQUE = "INVALID_NAME_UNIQUE",

    //Category
    CATEGORY_DOES_NOT_EXIST = "CATEGORY_DOES_NOT_EXIST",

    //Branch
    BRANCH_DOES_NOT_EXIST = "BRANCH_DOES_NOT_EXIST"
}