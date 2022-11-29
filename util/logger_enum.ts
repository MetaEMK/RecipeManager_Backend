export enum LOG_LEVEL
{
    LOG_LEVEL_DEBUG = 0,
    LOG_LEVEL_INFO = 1,
    LOG_LEVEL_WARN = 2,
    LOG_LEVEL_ERROR = 3
}

export enum LOG_LEVEL_STRING
{
    'DEBUG' = 0,
    'INFO' = 1,
    'WARN' = 2,
    'ERROR' = 3
}

export enum LOG_ENDPOINT {
    LOGGER = '/logger.log',
    DATABASE = '/database.log',
    FILE_SYSTEM = '/filesystem.log',
    MAIN = '/ReMa.log'
}