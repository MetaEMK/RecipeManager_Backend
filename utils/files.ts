import { createLogger, LOG_ENDPOINT } from "./logger.js";
import * as fs from 'fs';
import * as fsAsync from 'fs/promises';

const logger = createLogger();

/**
 * @param path Path to file
 * @returns true if file exists, false if not
 */
export function doesFileExist(path: string): boolean
{
    try 
    {
        return (fs.statSync(path)).isFile();
    }
    catch
    {
        logger.debug(`File ${path} does not exist!`, LOG_ENDPOINT.FILE_SYSTEM);
        return false;
    }
}

/**
 * @param path path to directory
 * @returns true if directory exists, false if not
 */
export function doesDirectoryExist(path: string): boolean
{
    try 
    {
        return (fs.statSync(path)).isDirectory();
    }
    catch
    {
        logger.debug(`Directory ${path} does not exist!`, LOG_ENDPOINT.FILE_SYSTEM);
        return false;
    }
}

/**
 * @param path Path to file
 * @returns true if file was deleted, false if not
 */
export async function deleteFileAsync(path: string): Promise<boolean>
{
    if(!doesFileExist(path)) 
    {
        logger.debug("Deleting File: File does not exist", LOG_ENDPOINT.FILE_SYSTEM);
        return false;
    }

    try 
    {
        await fsAsync.rm(path);
        logger.debug("Deleting File: File deleted: " + path, LOG_ENDPOINT.FILE_SYSTEM);
        return true;
    }
    catch (error: any)
    {
        logger.debug("Deleting File: Error: " + error, LOG_ENDPOINT.FILE_SYSTEM);
        return false;
    }
}

/**
 * @param path Path to file
 * @returns content of file. If file does not exist, returns null. If file is empty, returns empty string
 */
export async function readFileAsync(path: string)
{
    if(!doesFileExist(path)) 
    {
        logger.debug("Reading file: File does not exist", LOG_ENDPOINT.FILE_SYSTEM);
        return null;
    }

    try 
    {
        logger.debug("Reading file: File read correctly: " + path, LOG_ENDPOINT.FILE_SYSTEM);
        return await fsAsync.readFile(path, 'utf8');
    }
    catch (error: any)
    {
        logger.error("Reading file: Error: " + error, LOG_ENDPOINT.FILE_SYSTEM);
        return null;
    }
}

/**
 * @param path 
 * @param content 
 * @returns true if file was created, false if not
 * @description creates file with given content. If file already exists, returns false.
 */
export async function createFileAsync(path: string, content?: string): Promise<boolean>
{
    if(doesFileExist(path))
    {
        logger.warn("Creating File: File already exists: " + path, LOG_ENDPOINT.FILE_SYSTEM);
        return false;
    }

    try 
    {
        content = content ? content : "";
        await fsAsync.writeFile(path, content);
        logger.debug("Creating File: File created: " + path, LOG_ENDPOINT.FILE_SYSTEM);
        return true;
    } catch (error: any) 
    {
        logger.error("Creating File: Error: " + error, LOG_ENDPOINT.FILE_SYSTEM);
        return false;
    }
}

/** 
    * @param path Path to file
    * @param content Content to write to file. If content is not specified, new line will be added
    * @returns true if file was written to, false if not
    * @description writes content to file. If file does not exist, it will be created. If content is not specified, new line will be added
 */
export function appendFile(path: string, content?: string): boolean
{
    try 
    {
        content = content ? content : "\n";
        fs.appendFileSync(path, content);
        logger.debug("Appending to File: File written to: " + path, LOG_ENDPOINT.FILE_SYSTEM);
        return true;
    } catch (error: any) 
    {
        logger.error("Appending to File: Error: " + error, LOG_ENDPOINT.FILE_SYSTEM);
        return false;
    }
}

/**
 * 
 * @param path Path to directory
 * @returns true if directory was cleared, false if not
 */
export async function deleteAllContentInDirectoryAsync(path: string): Promise<boolean>
{
    if(!doesDirectoryExist(path)) 
    {
        logger.debug("Deleting all content in directory: Directory does not exist", LOG_ENDPOINT.FILE_SYSTEM);
        return false;
    }

    try
    {
        const files = await fsAsync.readdir(path);
        let tasks = [];
        for (const file of files)
        {
            tasks.push(deleteFileAsync(path + "/" + file));
        }

        let status = true;
        for (const task of tasks)
        {
            if(!await task) status = false;
        }
        return status;
    }
    catch (error: any)
    {
        logger.error("Deleting all content in directory: Error: " + error, LOG_ENDPOINT.FILE_SYSTEM);
        return false;
    }
}