/**
 * Allowed file extensions for multipart form data
 */
export const allowedFileExtensions = [
    ".jpg",
    ".jpeg",
    ".jpe",
    ".png"
];

/**
 * Not supported media type exception for error handling.
 */
export class NotSupportedMediaTypeException extends Error
{
    private _code: string;
    private _type: string;
    private _message: string;

    constructor(message?: string) {
        let msg: string|undefined = message;
        
        if(!msg) {
            msg = "Only the follwing file extensions are allowed: ";

            allowedFileExtensions.forEach((element, index) => {
                if(index === allowedFileExtensions.length - 1) {
                    msg += element;
                } else {
                    msg += element + ", "
                }
            });
        }

        super(msg);
        this._code = "NOT_SUPPORTED_MEDIA_TYPE";
        this._type = "MulterError";
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