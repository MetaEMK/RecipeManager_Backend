import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";

const allKeys = Object.keys(GeneralValidationErrorCodes)
const allValues = Object.values(GeneralValidationErrorCodes);

export class ValidationError 
{
    public code: string;
    public message: string;

    constructor(code: GeneralValidationErrorCodes, message?: string) 
    {
        this.code = allKeys[allValues.indexOf(code)];
        if(message) this.message = message;
        else this.message = code;
    }
    public toString(): string { return this.code + ": " + this.message; }
}