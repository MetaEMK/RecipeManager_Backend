/**
 * Custom foreign key exception for error handling.
 */
export class SQLiteForeignKeyException extends Error
{
    private _code: string;
    private _type: string;
    private _message: string;

    constructor(entity: string, attribute: string, message?: string) {
        let msg: string|undefined = message;

        if(!msg) {
            msg = `SQLITE_CONSTRAINT: FOREIGN_KEY constraint failed: ${ entity }.${ attribute }`;
        }

        super(msg);
        this._code = "SQLITE_CONSTRAINT_FOREIGN_KEY";
        this._type = "SQLITE_ERROR";
        this._message = msg;
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