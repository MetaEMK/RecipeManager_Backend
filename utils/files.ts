import { createLogger, LOG_ENDPOINT } from "./logger.js";
import * as fs from 'fs';
import * as fsAsync from 'fs/promises';

const logger = createLogger();

export function doesFileExist(path: string): boolean
{
    try 
    {
        return (fs.statSync(path)).isFile();
    }
    catch (error: any)
    {
        logger.debug(error, LOG_ENDPOINT.FILE_SYSTEM);
        return false;
    }
}