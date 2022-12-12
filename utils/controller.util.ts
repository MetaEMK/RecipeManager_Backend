import { Request, Response } from "express";

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
 * @param res HTTP response object
 * @param resourceId Created resource id
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
 * Decodes URI characters %20 and + to a space character.
 * 
 * @param uriComponent URI component to decode
 * @returns Decoded URI component
 */
export function decodeURISpaces(uriComponent: string|undefined): string|undefined
{
    if (uriComponent) {
        uriComponent = uriComponent.replaceAll("%20", " ");
        uriComponent = uriComponent.replaceAll("+", " ");
    }

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