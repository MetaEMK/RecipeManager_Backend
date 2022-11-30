import { LOG_ENDPOINT, LOG_LEVEL, LOG_LEVEL_STRING } from './logger_enum.js';
import * as fsAsync from 'fs/promises';
import * as fs from 'node:fs';
import dotenv from 'dotenv';

class Logger
{
    private pwd = process.env.PWD!;
    private logsize: number = 50000000;
    private logcount: number = 10;

    private setup: boolean = false;
    private logLevel: LOG_LEVEL;
    private logPath: string = './log';
    private archivePath = this.logPath + '/archive';

    constructor()
    {
        console.log("Creating Logger");

        dotenv.config({ path: this.pwd + '/config/logging.env' });

        this.logLevel = process.env.LOG_LEVEL! ? parseInt(process.env.LOG_LEVEL!) : LOG_LEVEL.LOG_LEVEL_INFO;
        this.logsize = process.env.MAX_LOG_SIZE! ? parseInt(process.env.MAX_LOG_SIZE!) : 50000000;
        this.logcount = process.env.MAX_LOG_FILES! ? parseInt(process.env.MAX_LOG_FILES!) : 10;
        this.logPath = process.env.LOG_PATH! ? this.pwd + process.env.LOG_PATH! : this.pwd + '/log';
        this.archivePath = this.logPath + '/archive';

        console.log("Log Level: " + this.logLevel);
        console.log("Log Size: " + this.logsize);
        console.log("Log Count: " + this.logcount);
        console.log("Log Path: " + this.logPath);
        console.log("Archive Path: " + this.archivePath);
    }

    public async create(): Promise<void>
    {
        if (this.setup) return;
        const endpoints: string[] = Object.values(LOG_ENDPOINT);
        if (!await doesDirectoryExist(this.logPath)) await fsAsync.mkdir(this.logPath);
        await deleteContent(this.archivePath);
        if(!await doesDirectoryExist(this.archivePath)) await fsAsync.mkdir(this.archivePath);
        await delay(200);
        let files = await fsAsync.readdir(this.logPath);
        files = files.filter(file => !file.includes('archive'));
        for (let index = 0; index < (files).length; index++) {
            
            await fsAsync.copyFile(this.logPath + '/' + files[index], this.archivePath + '/' + files[index]);
            await fsAsync.rm(this.logPath + '/' + files[index]);
        }
        for (const endpoint of endpoints) {
            await fsAsync.appendFile(this.logPath + endpoint, '');
            this.log("Created log file for " + endpoint, LOG_LEVEL.LOG_LEVEL_INFO, LOG_ENDPOINT.LOGGER);
        }
        this.setup = true;
    }

    private log(message: string, level: LOG_LEVEL,endpoint: LOG_ENDPOINT): void
    {
        this.archiveLogFile(endpoint);
        let lev = LOG_LEVEL_STRING[level];
        let mes = `${new Date().toISOString()}\t [${lev}]\t\t ${message}\n`;
        try {fs.appendFileSync(this.logPath + endpoint, mes);}
        catch (error) {console.log("Error while logging");}
    }


    private archiveLogFile(endpoint: LOG_ENDPOINT): void
    {
        if(!doesFileExist(this.logPath + endpoint))return;
        if(getFileSize(this.logPath + endpoint) > this.logsize)
        {
            fs.copyFileSync(this.logPath + endpoint, this.logPath + endpoint + new Date().toISOString());
            fs.truncateSync(this.logPath + endpoint, 0);
            let files = fs.readdirSync(this.logPath);
            files = files.filter(file => ("/" + file).startsWith(endpoint) == true);
            if (files.length-1 > this.logcount) {
;                fs.rmSync(this.logPath + '/' + files[1]);
            }
            this.info("Archived log file for " + endpoint, LOG_ENDPOINT.LOGGER);
        }
    }

    public debug(message: string, endpoint: LOG_ENDPOINT): void
    {
        if (this.logLevel > LOG_LEVEL.LOG_LEVEL_DEBUG) return;
        this.log(message, LOG_LEVEL.LOG_LEVEL_DEBUG, endpoint);
    }
    public info(message: string, endpoint: LOG_ENDPOINT): void
    {
        if (this.logLevel > LOG_LEVEL.LOG_LEVEL_INFO) {
            return;
        }
        this.log(message, LOG_LEVEL.LOG_LEVEL_INFO, endpoint);
    }
    public warn(message: string, endpoint: LOG_ENDPOINT): void
    {
        if (this.logLevel > LOG_LEVEL.LOG_LEVEL_WARN) return;
         this.log(message, LOG_LEVEL.LOG_LEVEL_WARN, endpoint);
    }
    public error(message: string, endpoint: LOG_ENDPOINT): void
    {
        this.log(message, LOG_LEVEL.LOG_LEVEL_ERROR, endpoint);
    }
}
const logger = async () => {
    let l = new Logger();
    await l.create();
    return l;
}
export async function createLogger(): Promise<Logger>
{
    return await logger();
}



function doesFileExist(path: string): boolean
{
    try 
    {
        return (fs.statSync(path)).isFile();
    }
    catch
    {
        return false;
    }
}

function doesDirectoryExist(path: string): boolean
{
    try 
    {
        return (fs.statSync(path)).isDirectory();
    }
    catch
    {
        return false;
    }
}

export async function deleteContent(path: string): Promise<void>
{
    if(!await doesDirectoryExist(path)) return;
    const files = await fsAsync.readdir(path);
    let tasks: Promise<void>[] = [];
    for (const file of files) {
        tasks.push(fsAsync.rm(path + '/' + file));
    }
    await Promise.all(tasks);
}
function delay(ms: number)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function getFileSize(path: string): number
{
    if(!doesFileExist(path)) return 0;
    let size: number = (fs.statSync(path)).size;
    //createLogger().then(logger => logger.debug("File " + path + " has size " + size, LOG_ENDPOINT.FILE_SYSTEM));
    return size;
}