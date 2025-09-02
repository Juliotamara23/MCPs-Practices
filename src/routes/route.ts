import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { Request, Response } from "express";
import { server, transports} from "../index";
const express = require("express");
const app = express();

app.get("/sse", async (_: Request, res: Response) => {
    const transport = new SSEServerTransport('/menssages', res);
    transports[transport.sessionId] = transport;
    res.on('close', () => {
        delete transports[transport.sessionId];
    })
    await server.connect(transport);
});

app.post("/messages", async (req: Request, res: Response) => {
    const sessionId = req.body.sessinonId as string;
    const transport = transports[sessionId];
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send("No se encontró transporte para la sessionId");
    }
});