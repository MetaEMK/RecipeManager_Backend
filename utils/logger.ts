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
    private logsize: number = 50000;
    private logcount: number = 3;

    private setup: boolean = false;
    private logLevel: LOG_LEVEL;
    private logPath: string = './log';
    private archivePath = this.logPath + '/archive';

    //creates logger and sets up some basic stuff (reads config)
    constructor()
    {
        console.log("Creating Logger");
        dotenv.config({ path: 'config/logging.env' });

        this.logLevel = process.env.LOG_LEVEL! ? parseInt(process.env.LOG_LEVEL!) : LOG_LEVEL.LOG_LEVEL_INFO;
        this.logsize = process.env.MAX_LOG_SIZE! ? parseInt(process.env.MAX_LOG_SIZE!) : 50000000;
        this.logcount = process.env.MAX_LOG_FILES! ? parseInt(process.env.MAX_LOG_FILES!) : 10;
        this.logPath = process.env.LOG_PATH! ? process.env.LOG_PATH! : 'log';
        this.archivePath = this.logPath + '/archive';

        
        this.create();
        
        
        if (!doesFileExist('config/logging.env')) this.warn("Logging config file not found! Using default values!", LOG_ENDPOINT.LOGGER);
        this.info("Log Level: " + LOG_LEVEL_STRING[this.logLevel], LOG_ENDPOINT.LOGGER);
        this.info("Log Size: " + this.logsize, LOG_ENDPOINT.LOGGER);
        this.info("Log Count: " + this.logcount, LOG_ENDPOINT.LOGGER);
        this.info("Log Path: " + this.logPath, LOG_ENDPOINT.LOGGER);
        this.info("Archive Path: " + this.archivePath, LOG_ENDPOINT.LOGGER);
        this.info("Logger created", LOG_ENDPOINT.LOGGER);
    }

    //setup the logger and prepares filesystem
    private create(): void
    {
        if (this.setup) return;

        const endpoints: string[] = Object.values(LOG_ENDPOINT);


        if (!doesDirectoryExist(this.logPath))
            fs.mkdirSync(this.logPath);

        deleteContent(this.archivePath);

        if(!doesDirectoryExist(this.archivePath))

            fs.mkdirSync(this.archivePath);

        let files = fs.readdirSync(this.logPath);
        files = files.filter(file => !file.includes('archive'));
        for (let index = 0; index < (files).length; index++) {
            fs.copyFileSync(this.logPath + '/' + files[index], this.archivePath + '/' + files[index]);
            fs.rmSync(this.logPath + '/' + files[index]);
        }
        for (const endpoint of endpoints) {
            fs.appendFileSync(this.logPath + endpoint, '');
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
const logger = new Logger();

//exports logger
export function createLogger(): Logger
{
    return logger;
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
export function deleteContent(path: string): void
{
    if(!doesDirectoryExist(path)) return;
    const files = fs.readdirSync(path);
    for (const file of files) {
        fs.rmSync(path + '/' + file);
    }
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
    return size;
}