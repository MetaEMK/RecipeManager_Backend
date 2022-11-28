import { Logging } from "./logging.js";
import * as fs from 'fs/promises';
import { exit } from "process";
import dotenv from 'dotenv';

export const pwdPath = process.env.PWD!;
export const defaultpath = pwdPath + "/config/app.env";

export async function checkConfigFile(){
    if(await doesFileExist(defaultpath))
    {
        dotenv.config({ path: defaultpath });
        checkIfUndefinedAndExist("NODE_PORT", process.env.NODE_PORT!);
        checkIfUndefinedAndExist("FRONTEND_DIST_PATH", process.env.FRONTEND_DIST_PATH!);
        checkIfUndefinedAndExist("USE_RELATIV_PATHS", process.env.USE_RELATIV_PATHS!);
        checkIfUndefinedAndExist("DATA_PATH", process.env.DATA_PATH!);
        checkIfUndefinedAndExist("DATABASE_FILE", process.env.DATABASE_FILE!);
        checkIfUndefinedAndExist("DATA_IMAGE_PATH", process.env.DATA_IMAGE_PATH!);

        if(process.env.USE_RELATIV_PATHS!.toLocaleLowerCase() === "false") 
        {
            Logging.error("static paths are currently not supported! exiting ...");
            exit(0);
        }
    } else {
        Logging.error(`Configfile at ${defaultpath} was not found! exiting setup ...`);
        exit(0);
    }
}

function checkIfUndefinedAndExist(key: string, thing?: string)
{
    if(thing === undefined || thing === null) 
    {
        Logging.error(`Configkey ${key} was not found! Exiting...`);
        exit(0);
    }
}

export async function doesFileExist(path: string): Promise<boolean>
{
    try 
    {
        return (await fs.stat(path)).isFile();
    }
    catch 
    {
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
        return false;
    }
}