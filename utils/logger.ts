import * as fsAsync from 'fs/promises';
import * as fs from 'node:fs';
import dotenv from 'dotenv';

//enum is used to determine what log level to use
enum LOG_LEVEL
{
    LOG_LEVEL_DEBUG = 0,
    LOG_LEVEL_INFO = 1,
    LOG_LEVEL_WARN = 2,
    LOG_LEVEL_ERROR = 3
}

//enum is used to write the correct log level in log
enum LOG_LEVEL_STRING
{
    'DEBUG' = 0,
    'INFO' = 1,
    'WARN' = 2,
    'ERROR' = 3
}

//enum defines endpoints
export enum LOG_ENDPOINT {
    LOGGER = '/logger.log',
    DATABASE = '/database.log',
    FILE_SYSTEM = '/filesystem.log',
    MAIN = '/ReMa.log'
}

//class for logger
class Logger
{
    private pwd = process.env.PWD!;
    private logsize: number = 50000000;
    private logcount: number = 10;

    private setup: boolean = false;
    private logLevel: LOG_LEVEL;
    private logPath: string = './log';
    private archivePath = this.logPath + '/archive';

    //creates logger and sets up some basic stuff (reads config)
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

    //setup the logger and prepares filesystem
    public async create(): Promise<void>
    {
        if (this.setup) return;
        const endpoints: string[] = Object.values(LOG_ENDPOINT);
        if (!await doesDirectoryExist(this.logPath)) await fsAsync.mkdir(this.logPath);
        await deleteContent(this.archivePath);
        if(!await doesDirectoryExist(this.archivePath)) await fsAsync.mkdir(this.archivePath);
        await delay(200); //delay is needed to make sure the filesystem can updated itself before we try to access it
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

    //logs message to file specified by endpoint
    private log(message: string, level: LOG_LEVEL,endpoint: LOG_ENDPOINT): void
    {
        this.archiveLogFile(endpoint);
        let lev = LOG_LEVEL_STRING[level];
        let mes = `${new Date().toISOString()}\t [${lev}]\t\t ${message}\n`;
        try {fs.appendFileSync(this.logPath + endpoint, mes);}
        catch (error) {console.log("Error while logging");}
    }

    //archives the log file if it is too big and deletes older files if there are too many
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

    //logs debug message to file specified by endpoint (depending on log level)
    public debug(message: string, endpoint: LOG_ENDPOINT): void
    {
        if (this.logLevel > LOG_LEVEL.LOG_LEVEL_DEBUG) return;
        this.log(message, LOG_LEVEL.LOG_LEVEL_DEBUG, endpoint);
    }

    //logs info message to file specified by endpoint (depending on log level)
    public info(message: string, endpoint: LOG_ENDPOINT): void
    {
        if (this.logLevel > LOG_LEVEL.LOG_LEVEL_INFO) {
            return;
        }
        this.log(message, LOG_LEVEL.LOG_LEVEL_INFO, endpoint);
    }

    //logs warning message to file specified by endpoint (depends on log level)
    public warn(message: string, endpoint: LOG_ENDPOINT): void
    {
        if (this.logLevel > LOG_LEVEL.LOG_LEVEL_WARN) return;
         this.log(message, LOG_LEVEL.LOG_LEVEL_WARN, endpoint);
    }

    //logs error message to file specified by endpoint (no matter what the log level is)
    public error(message: string, endpoint: LOG_ENDPOINT): void
    {
        this.log(message, LOG_LEVEL.LOG_LEVEL_ERROR, endpoint);
    }
}

//creates logger and sets it up
const logger = async () => {
    let l = new Logger();
    await l.create();
    return l;
}

//exports logger
export async function createLogger(): Promise<Logger>
{
    return await logger();
}


//Helper functions for file handling

//checks if file exists
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

//checks if directory exists
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

//deletes all files in directory
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

//sleep timer
function delay(ms: number)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

//returns size of file in bytes
export function getFileSize(path: string): number
{
    if(!doesFileExist(path)) return 0;
    let size: number = (fs.statSync(path)).size;
    //createLogger().then(logger => logger.debug("File " + path + " has size " + size, LOG_ENDPOINT.FILE_SYSTEM));
    return size;
}