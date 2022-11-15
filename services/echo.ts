import {createEchoLog, Echo, EchoInput, queryEchos} from "../models/echo.js";

export function saveEcho(echo: EchoInput): Promise<Echo> {
    return createEchoLog(echo);
}

export function listEchos(messageContains?: string): Promise<Echo[]> {
    return queryEchos(messageContains);
}
