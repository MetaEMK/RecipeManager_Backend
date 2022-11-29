import { doesDirectoryExist, doesFileExist, changePermissionToRW } from './files.js';
import * as fs from 'fs/promises';
import dotenv from 'dotenv';


enum LOG_LEVEL
{
    LOG_LEVEL_DEBUG = 0,
    LOG_LEVEL_INFO = 1,
    LOG_LEVEL_WARN = 2,
    LOG_LEVEL_ERROR = 3
}

enum LOG_LEVEL_STRING
{
    'DEBUG' = 0,
    'INFO' = 1,
    'WARN' = 2,
    'ERROR' = 3
}
class Logger
{
    private pwd = process.env.PWD!;
    private setup = false;
    private logLevel: LOG_LEVEL;
    private logPath = this.pwd + '/log';
    constructor()
    {
        dotenv.config({ path: '/config/logging.env' });
        this.logLevel = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL!) : LOG_LEVEL.LOG_LEVEL_INFO;
    }

    public async create(): Promise<void>
    {
        if (this.setup) return;
        if (!await doesDirectoryExist(this.logPath)) await fs.mkdir(this.logPath);
        if(!await doesFileExist(this.logPath + '/ReMa.log')) {await fs.appendFile(this.logPath + '/ReMa.log', ''); console.log('File created');}
        await this.info('Logger created with LogLevel: ' + LOG_LEVEL_STRING[this.logLevel]);
        this.setup = true;
    }

    private async log(message: string, level: LOG_LEVEL): Promise<void>
    {
        console.log("test");
        let lev = LOG_LEVEL_STRING[level];
        let mes = `${new Date().toISOString()}\t [${lev}]\t ${message}\n`;
        console.log(mes);
        await fs.appendFile(this.logPath + '/ReMa.log', mes);
    }

    public async debug(message: string): Promise<void>
    {
        if (this.logLevel >= LOG_LEVEL.LOG_LEVEL_DEBUG) return;
        await this.log(message, LOG_LEVEL.LOG_LEVEL_DEBUG);
    }
    public async info(message: string): Promise<void>
    {
        if (this.logLevel >= LOG_LEVEL.LOG_LEVEL_INFO) return;
        await this.log(message, LOG_LEVEL.LOG_LEVEL_INFO);
    }
    public async warn(message: string): Promise<void>
    {
        if (this.logLevel >= LOG_LEVEL.LOG_LEVEL_WARN) return;
        await this.log(message, LOG_LEVEL.LOG_LEVEL_WARN);
    }
    public async error(message: string): Promise<void>
    {
        if (this.logLevel >= LOG_LEVEL.LOG_LEVEL_ERROR) return;
        await this.log(message, LOG_LEVEL.LOG_LEVEL_ERROR);
    }
}
const logger = new Logger();
{
    let log = new Logger();
    log.create();
}
export async function createLogger(): Promise<Logger>
{
    return await logger;
}
