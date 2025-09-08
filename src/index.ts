import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Request, Response } from "express";
import z from "zod";
import { error } from "console";
import { success } from "zod/v4";
const express = require("express");

const server = new McpServer({
    name: "StreamableHTTPServer",
    version: "1.0.0",
});

const app = express();
const transport: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Esquema de validación para el mensaje enviado por el cliente.
const messageSchema = z.string().min(1, "El mensaje no puede estar vacío.");

// Endpoint para establecer la conexión StreamableHTTPServer.
app.get("/", async (req: Request, res: Response) => {
    res.send("Bienvenido al servidor StreamableHTTPServer");
});

async function* eventStream(message: string) {
    for (let i = 1; i <= 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Enviando mensaje ${i}: ${message}`);
        yield `Mensaje ${i}: ${message}\n`;
    }
}

app.get("/stream", async (req: Request, res: Response) =>{
    const message = req.query.message as string;
    if (!messageSchema.safeParse(message).success) {
        return res.status(400).send("El mensaje no es válido.");
    }
    res.setHeader("Content-Type", "text/plain");
    for await (const chunk of eventStream(message)) {
        res.write(chunk);
    }
    res.end();
});

// Inicializando el servidor
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`✅ El servidor se levanto correctamente en el puerto ${PORT}`);
}),
    (error: string) => {
        console.error(`❌ El servidor no pudo iniciar: ${error}`);
    };