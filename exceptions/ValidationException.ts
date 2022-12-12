import { ValidationError } from "../http/validators/validationError.js"

/**
 * Validator exception for error handling.
 */
export class ValidationException extends Error 
{
    private _code: string;
    private _type: string;
    private _message: string;

    constructor(err: ValidationError[])
    {
        const validationError = err?.[0];

        super(validationError.message);
        this._code = validationError.code;
        this._type = validationError.type;
        this._message = validationError.message;
    }

    public get code()
    {
        return this._code;
    }

    public get type()
    {
        return this._type;
    }

    public get message()
    {
        return this._message;
    }
}