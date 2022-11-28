import { Logging } from "./logging.js";
import { checkConfigFile } from "./file.js";
import * as readline from "readline/promises";
import { setup_data } from "./setup_data.js";
import { exit } from "process";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

async function setup() {
    console.clear();
    Logging.info("Reading Configfile ...");
    await delay(400);
    await checkConfigFile();
    await delay(400);
    Logging.info("basic checks were successfull - caution config file could still have some issues");
    Logging.info("Starting setup process ...");
    await delay(600);
    await rl.question("to continue press any button");
    const data = new setup_data();
    console.clear();
    Logging.log("Welcome to the setup process of the Recipe Manager Rema");
    Logging.log("This process will guide you through the setup of the Recipe Manager");
    Logging.log("Lets start with the data ...");
    await delay(800);
    
    data.setup();
}
setup();

