import { Logging } from "./logging.js";
import { pwdPath, defaultpath, doesFileExist, doesDirectoryExist } from "./file.js";
import { rl } from "./setup.js";
import * as fs from 'fs/promises';
import { exit } from "process";

//Used for configfile
import dotenv from 'dotenv';



export class setup_data
{
    datapath: string | undefined;
    database_path : string | undefined;
    image_path: string | undefined;

    constructor(path?: string)
    {
        if (path == undefined) path = defaultpath;
        dotenv.config({ path: path});

        this.datapath = pwdPath + process.env.DATA_PATH!;
        if(process.env.USE_RELATIV_PATHS!.toLocaleLowerCase() === "true")
        {
            this.database_path = this.datapath + "/" + process.env.DATABASE_FILE!;
            this.image_path = this.datapath + "/" + process.env.DATA_IMAGE_PATH!;
        } else {
            this.database_path = process.env.DATA_PATH!;
            this.image_path = process.env.DATA_IMAGE_PATH!;
        }
    }

    public async setup() 
    {
        let status = false;
        while(!status){
            const configureDbInput = await rl.question("Do you want to delete the current database and create a new one? (y/n): ");
            switch (configureDbInput.toLocaleLowerCase())
            {
                case "y":
                case "yes":
                    Logging.warn(`Do you really want to delete all data. This deletes the whole database file and all data saved in the ${this.datapath} folder`);
                    if((await rl.question("Do you still want to continue? Type accept to continue (accept): ")).toLocaleLowerCase() == "accept") 
                    {
                        Logging.log("deleting all data ...");
                        await this.deleteAll();
                        status = true;
                    } else Logging.log("Invalid input - try again");
                    break;
    
                case "n":
                case "no":
                case "":
                    Logging.log("Continuing with current database. Please make sure that the database is valid. Currently there are no checks for the database");
                    status = true;
                    break;
                default:
                    Logging.error("Invalid input, try again :"+ configureDbInput + ":");
            }
        }
    }

    private async deleteAll() 
    {
        await this.deleteDatabase();
        await this.deleteImages();
    }
    private async deleteDatabase() 
    {
        Logging.info("Deleting database ...");
        if(this.image_path != undefined) 
        {
            let database_path: string = this.database_path as string;
            if(await doesFileExist(database_path))
            {
                try {
                    await fs.unlink(database_path);
                    Logging.info("... successful");
                }
                catch (error)
                {
                    Logging.error(`Something went wrong!\n ${error} \n\n... skipping`);
                }
            } else {
                Logging.warn("Database was not found! - skipping");
            }
        } else {
            Logging.warn("Database path is undefined - skipping");
        }
    }

    private async deleteImages()
    {
        Logging.info("Deleting all Images ...");
        if(this.image_path!= undefined)
        {
            if(await doesDirectoryExist(this.image_path))
            {
                let dir = await fs.readdir(this.image_path);
                dir = dir.filter(img => img.charAt(0) !== '.');
                Logging.info(`deleting ${dir.length} images`);
                for (let index = 0; index < dir.length; index++) {
                    fs.unlink(this.image_path + "/" + dir[index]);
                    
                }
            } else {
                Logging.warn("Imagepath was not found! - skipping");
            } 
        }
        else {
            Logging.warn("Imagepath was not found! - skipping");
        }
    }

}