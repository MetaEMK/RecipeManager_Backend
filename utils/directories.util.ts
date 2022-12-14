import * as fs from "node:fs";

/**
 * Setup upload directory structure.
 */
export function setupUploadDir(): void
{
    const dir = process.env.DIR_RECIPES ?? "uploads/images/recipes";

    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    console.log("Successfully prepared all upload directories.");    
}