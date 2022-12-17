import * as readline from "readline";
import { AppDataSource } from "../../config/datasource.js";
import { seedConversion } from "./conversion.seeder.js";

/**
 * Seed Handler
 */
export function seedHandler()
{
    confirmSeeding();
}

/**
 * Confirmation to seed master data.
 */
function confirmSeeding() {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Seed master data - This drops the database and recreates it with seeded  master data. Are you sure? [y/n]\n",
        function(answer) {
            switch(answer.toLocaleLowerCase()) {
                case "y":
                    seed();
                    break;
                default:
                    console.log("Seeding canceled.");
                    console.log("Returning to express.");
            }

            rl.close();
        });
}

/**
 * Seeds the database.
 * 
 * CAUTION - Drops and recreates the database.
 */
async function seed() {
    console.log("Dropping database...");
    await AppDataSource.dropDatabase();

    console.log("Creating database...");
    await AppDataSource.synchronize();

    // Seeder
    seedConversion().finally(() => {
        console.log("Returning to express.");
    });
}
