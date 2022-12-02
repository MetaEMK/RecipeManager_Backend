import { Request, Response, NextFunction } from "express";

/**
 * Sets Content-Type to application/json for all responses.
 * 
 * @param req HTTP request object
 * @param res HTTP response object
 * @param next Callback argument to the middlware function
 */
export function setJsonHeader (req: Request, res: Response, next: NextFunction) 
{
    res.setHeader("Content-Type", "application/json");
    next();
}