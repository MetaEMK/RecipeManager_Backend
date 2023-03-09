import { GeneralValidationErrorCodes } from "../../enums/GeneralValidationErrors.enum.js";

const allKeys = Object.keys(GeneralValidationErrorCodes)
const allValues = Object.values(GeneralValidationErrorCodes);

export class ValidationError 
{
    public code: string;
    public type: string = "VALIDATION_ERROR";
    public message: string;
    public info?: string|null;

    constructor(code: GeneralValidationErrorCodes, message?: string) 
    {
        this.code = allKeys[allValues.indexOf(code)];
        if(message) this.message = message;
        else this.message = code;
    }
    public toString(): string { return `Type: ${this.type}\tCode: ${this.code}\tMessage: ${this.message}`; }
}