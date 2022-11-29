import { LOG_ENDPOINT, LOG_LEVEL, LOG_LEVEL_STRING } from './logger_enum.js';
import * as fs from 'fs/promises';
import dotenv from 'dotenv';
import { getFileSize } from './files.js';

class Logger
{
    private pwd = process.env.PWD!;
    private setup = false;
    private logLevel: LOG_LEVEL;
    private logPath: string = './log';
    private archivePath = this.logPath + '/archive';

    constructor()
    {
        dotenv.config({ path: '/config/logging.env' });
        this.logLevel = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL!) : LOG_LEVEL.LOG_LEVEL_INFO;
    }

    public async create(): Promise<void>
    {
        if (this.setup) return;
        const endpoints: string[] = Object.values(LOG_ENDPOINT);
        if (!await doesDirectoryExist(this.logPath)) await fs.mkdir(this.logPath);
        await deleteContent(this.archivePath);
        if(!await doesDirectoryExist(this.archivePath)) await fs.mkdir(this.archivePath);
        await delay(200);
        let files = await fs.readdir(this.logPath);
        files = files.filter(file => !file.includes('archive'));
        for (let index = 0; index < (files).length; index++) {
            
            await fs.copyFile(this.logPath + '/' + files[index], this.archivePath + '/' + files[index]);
            await fs.rm(this.logPath + '/' + files[index]);
        }
        for (const endpoint of endpoints) {
            await fs.appendFile(this.logPath + endpoint, '');
            await this.log("Created log file for " + endpoint, LOG_LEVEL.LOG_LEVEL_INFO, LOG_ENDPOINT.LOGGER);
        }
        this.setup = true;
    }

    private async log(message: string, level: LOG_LEVEL,endpoint: LOG_ENDPOINT)
    {
        await this.archiveLogFile(endpoint);
        let lev = LOG_LEVEL_STRING[level];
        let mes = `${new Date().toISOString()}\t [${lev}]\t ${message}\n`;
        try {fs.appendFile(this.logPath + endpoint, mes);}
        catch {console.log("Error while logging");}
    }


    private async archiveLogFile(endpoint: LOG_ENDPOINT): Promise<void> 
    {
        if(!await doesFileExist(this.logPath + endpoint))return;
        if(await getFileSize(this.logPath + endpoint) > 10000)
        {
            await fs.copyFile(this.logPath + endpoint, this.logPath + endpoint + new Date().toISOString());
            await fs.truncate(this.logPath + endpoint, 0);
            let files = await fs.readdir(this.logPath);
            files = files.filter(file => ("/" + file).startsWith(endpoint) == true);
            if (files.length > 3) {
;                await fs.rm(this.logPath + '/' + files[1]);
            }
            await this.info("Archived log file for " + endpoint, LOG_ENDPOINT.LOGGER);

        }
    }

    public async debug(message: string, endpoint: LOG_ENDPOINT): Promise<void>
    {
        if (this.logLevel < LOG_LEVEL.LOG_LEVEL_DEBUG) return;
        await this.log(message, LOG_LEVEL.LOG_LEVEL_DEBUG, endpoint);
    }
    public async info(message: string, endpoint: LOG_ENDPOINT)
    {
        if (this.logLevel < LOG_LEVEL.LOG_LEVEL_INFO) {
            return;
        }
        this.log(message, LOG_LEVEL.LOG_LEVEL_INFO, endpoint);
    }
    public async warn(message: string, endpoint: LOG_ENDPOINT): Promise<void>
    {
        if (this.logLevel > LOG_LEVEL.LOG_LEVEL_WARN) return;
        await this.log(message, LOG_LEVEL.LOG_LEVEL_WARN, endpoint);
    }
    public async error(message: string, endpoint: LOG_ENDPOINT): Promise<void>
    {
        if (this.logLevel > LOG_LEVEL.LOG_LEVEL_ERROR) return;
        await this.log(message, LOG_LEVEL.LOG_LEVEL_ERROR, endpoint);
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



async function doesFileExist(path: string): Promise<boolean>
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

async function doesDirectoryExist(path: string): Promise<boolean>
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

export async function deleteContent(path: string): Promise<void>
{
    if(!await doesDirectoryExist(path)) return;
    const files = await fs.readdir(path);
    let tasks: Promise<void>[] = [];
    for (const file of files) {
        tasks.push(fs.rm(path + '/' + file));
    }
    await Promise.all(tasks);
}
function delay(ms: number)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}