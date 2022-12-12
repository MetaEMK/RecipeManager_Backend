/**
 * Http not found exception for error handling.
 */
export class HttpNotFoundException extends Error
{
    private _status: number;
    private _type: string;
    private _message: string;

    constructor(message?: string)
    {
        const msg = message ?? "Not found."

        super(msg);
        this._status = 404;
        this._type = "HTTP_NOT_FOUND_EXCEPTION";
        this._message = msg;
    }

    public get status()
    {
        return this._status;
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