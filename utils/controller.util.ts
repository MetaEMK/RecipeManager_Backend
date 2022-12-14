import { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Sends a response for getting one or multiple resources.
 * 
 * @param data Response body
 * @param res HTTP response object
 */
export function getResponse(data: any, res: Response): void
{
    res.status(200);
    res.json({
        data: data
    });
}

/**
 * Sends a response for creating a resource.
 * 
 * @param data Response body 
 * @param req HTTP request object
 * @param res HTTP response object
 */
export function postResponse(data: any, req: Request, res: Response): void
{
    res.status(201);
    res.set({
        "Location": req.protocol + "://" + req.get("host") + req.originalUrl + "/" + data?.id
    });
    res.json({
        data: data
    });
}

/**
 * Sends a response for partially updating a resource.
 * 
 * @param data Response body
 * @param res HTTP response object
 */
export function patchResponse(data: any, res: Response): void
{
    res.status(200);
    res.json({
        data: data
    });
}

/**
 * Sends a response for replacing a resource.
 * 
 * @param data Response body
 * @param res HTTP response object
 */
export function putResponse(data: any, res: Response): void
{
    res.status(200);
    res.json({
        data: data
    });
}

/**
 * Sends a response for deleting a resource.
 * 
 * @param res HTTP response object
 */
export function deleteResponse(res: Response): void
{
    res.status(204);
    res.send();
}

/**
 * Prepares parameters to be used in a SQL IN clause.
 * 
 * @param params Parameters to be used in a SQL IN clause
 * @returns Prepared parameters for a SQL IN clause or undefined
 */
export function prepareForSqlInParams(params: string|string[]): string|string[] 
{        
    if(Array.isArray(params))
        return params;

    return [params];
}

/**
 * Decodes URI characters %20 and + to a space character.
 * 
 * @param uriComponent URI component to decode
 * @returns Decoded URI component
 */
export function decodeURISpaces(uriComponent: string): string
{
    uriComponent = uriComponent.replaceAll("%20", " ");
    uriComponent = uriComponent.replaceAll("+", " ");

    return uriComponent;
}

/**
 * Generates a slug for the given string.
 * 
 * Only allows a-z, ä, ö, ü, ß, - and space.
 * Replaces spaces, hyphens and german umlauts.
 * 
 * @param string String which should be turned into a slug 
 * @returns A slug conform string
 */
export function generateSlug(string: string): string
{
    return string
        .toLowerCase()
        .replaceAll(new RegExp("[^a-zäöüß_ \-]", "g"), "")
        .replaceAll(" ", "_")
        .replaceAll("-", "_")
        .replaceAll("\u00e4", "ae")
        .replaceAll("\u00f6", "oe")
        .replaceAll("\u00fc", "ue")
        .replaceAll("\u00df", "ss");
}

/**
 * Normlizes a given path component.
 * 
 * @param pathComponent Part of a path
 * @returns Normalized URI
 */
export function normalizeURI(pathComponent: string): string
{
    return path
        .normalize(pathComponent)
        .split(path.sep)
        .join("/");
}

/**
 * Generates file system path based on the root directory.
 * 
 * @param pathComponent Parth of a path
 * @returns File URI
 */
export function generateFileURI(pathComponent: string): string
{
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const __root = __dirname + "/../..";

    const test = normalizeURI(path.join(__root, pathComponent));

    return test;
}

/**
 * Generates a recipe image URI.
 * 
 * @param recipeId Id of the recipe entity
 * @param req HTTP request object
 * @returns Image URI of the given recipe id
 */
export function generateRecipeImageURI(recipeId: string|number, req: Request): string
{  
    const protocol = req.protocol + "://";
    const host = req.get("host");
    const recipeRoot = path
        .normalize(req.originalUrl)
        .split(path.sep)
        .slice(0,4)
        .join("/");

    const imageUri = protocol + host + recipeRoot + "/" + recipeId + "/image";

    return imageUri;
}