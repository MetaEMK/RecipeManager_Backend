import * as fs from 'fs/promises';
import { createLogger } from './logger.js';
import { LOG_ENDPOINT } from './logger-enum.js';
import { Logging } from '../start/logging.js';


export async function doesFileExist(path: string): Promise<boolean>
{
    try 
    {
        return (await fs.stat(path)).isFile();
    }
    catch
    {
        await (await createLogger()).debug(`File ${path} does not exist`, LOG_ENDPOINT.FILE_SYSTEM);
        return false;
    }
}

export async function doesDirectoryExist(path: string): Promise<boolean>
{
    try 
    {
        return (await fs.stat(path)).isDirectory();
    }
    catch
    {
        const logger = await createLogger();
        logger.debug("Directory " + path + " does not exist", LOG_ENDPOINT.FILE_SYSTEM);
        return false;
    }
}

export async function deleteFile(path: string): Promise<void>
{
    const logger = await createLogger();
    logger.info("Deleting File " + path, LOG_ENDPOINT.FILE_SYSTEM);
    if(await doesFileExist(path)) 
    {
        await fs.rm(path);
    } else {
        //logger.debug("File " + path + " does not exist", LOG_ENDPOINT.FILE_SYSTEM);
    }
}

export async function deleteDirectoryWithContent(path: string): Promise<void>
{
    const logger = await createLogger();
    if(!await doesDirectoryExist(path)) return;
    const files = await fs.readdir(path);
    let tasks: Promise<void>[] = [];
    for (const file of files) {
        logger.info("Deleting " + path + "/" + file, LOG_ENDPOINT.FILE_SYSTEM);
        tasks.push(fs.rm(path + '/' + file));
    }
    await Promise.all(tasks);
    fs.rmdir(path);
}

export async function changePermissionToRW(path: string): Promise<void>
{
    await fs.chmod(path, 777);
}

export async function getFileSize(path: string): Promise<number>
{
    if(!await doesFileExist(path)) return 0;
    let size: number = (await fs.stat(path)).size;
    //createLogger().then(logger => logger.debug("File " + path + " has size " + size, LOG_ENDPOINT.FILE_SYSTEM));
    return size;
}