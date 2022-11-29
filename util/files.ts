import * as fs from 'fs/promises';


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

export async function changePermissionToRW(path: string): Promise<void>
{
    await fs.chmod(path, 777);
}