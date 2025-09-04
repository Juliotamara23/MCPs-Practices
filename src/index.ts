import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Request, Response } from "express";
const express = require("express");

const server = new McpServer({
  name: "Example Server",
  version: "1.0.0",
});

const app = express();
const transports: { [sessionId: string]: SSEServerTransport } = {};

// Endpoint para establecer la conexión SSE y recibir mensajes.
app.get("/sse", async (_: Request, res: Response) => {
  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;
  res.on("close", () => {
    delete transports[transport.sessionId];
  });
  await server.connect(transport);
});

app.post("/messages", async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send("No se encontró transporte para la sessionId");
  }
});

// Herramientas: Chistes aleatorios y por categoría
server.tool(
  "joke-category",
  "Categoria de chiste devuelto por la API de Chuck Norris",
  {},
  async () => {
    const response = await fetch("https://api.chucknorris.io/jokes/categories");
    const data = await response.json();

    if (Array.isArray(data)) {
      return {
        content: [
          {
            type: "text",
            text: data.map((category) => `• ${category}`).join("\n"),
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: data,
          },
        ],
      };
    }
  }
);

server.tool(
  "random-joke",
  "Un chiste devuelto por la API de Chuck Norris",
  {},
  async () => {
    const response = await fetch("https://api.chucknorris.io/jokes/random");
    const data = await response.json();

    return {
      content: [
        {
          type: "text",
          text: data.value,
        },
      ],
    };
  }
);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ El servidor se levanto correctamente en el puerto ${PORT}`);
}),
  (error: string) => {
    console.error(`❌ Error al iniciar el servidor: ${error}`);
  };
