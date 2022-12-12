import * as fs from "node:fs";

/**
 * Setups public directory structure.
 */
export function setupPublicDir(): void
{
    const dir = process.env.DIR_RECIPES ?? "public/recipes";

    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    console.log("Successfully prepared all public directories.");    
}