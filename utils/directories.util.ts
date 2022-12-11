import * as fs from "node:fs";

/**
 * Setups public directory structure.
 */
export function setupPublicDir(): void
{
    if(!fs.existsSync("public/recipes")) {
        fs.mkdirSync("public/recipes", { recursive: true });
    }

    console.log("Successfully prepared all public directories.");    
}