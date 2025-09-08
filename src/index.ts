import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Request, Response } from "express";
import z from "zod";
import path from "path";

const express = require("express");

const server = new McpServer({
  name: "StreamableHTTPServer",
  version: "1.0.0",
});

const app = express();

// Esquema de validación para el mensaje enviado por el cliente.
const messageSchema = z.string().min(1, "El mensaje no puede estar vacío.");

// Endpoint para establecer la conexión StreamableHTTPServer.
app.get("/", async (_: Request, res: Response) => {
  const htmlPath = path.join(__dirname, "index.html");
  res.sendFile(htmlPath);
});

async function* eventStream(message: string) {
  for (let i = 1; i <= 3; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    yield `Procesando el mensaje ${i}/3...\n`;
  }
  yield `El mensaje "${message}" ha sido procesado con éxito.\n`;
}

app.get("/stream", async (req: Request, res: Response) => {
  const message = req.query.message || "Hola!";
  if (!messageSchema.safeParse(message).success) {
    return res.status(400).send("El mensaje no es válido.");
  }
  res.setHeader("Content-Type", "text/plain");
  for await (const chunk of eventStream(String(message))) {
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
