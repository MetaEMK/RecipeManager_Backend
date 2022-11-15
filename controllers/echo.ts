import express from 'express';
import {listEchos, saveEcho} from "../services/echo.js";

export const echoRouter = express.Router();

echoRouter.post('/', validateEcho, async (req, res) => {
    const message: string = req.body.message;

    try {
        const data = await saveEcho({message});
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

echoRouter.get('/', async (req, res) => {
    const messageContains = req.query.contains as string;

    try {
        const data = await listEchos(messageContains);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

function validateEcho(req, res, next: () => any): void {
    if (req.body.message) {
        next();
    } else {
        res.status(400);
        res.send('Body validation failed');
    }
}
