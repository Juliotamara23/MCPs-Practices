import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Request, Response } from "express";
import z from "zod";
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

// Herramientas: Lista las categorías disponibles de los chistes de Chuck Norris
server.tool(
  "joke-category",
  "Lista las categorias disponibles de los chiste devuelto por la API de Chuck Norris",
  { categories: z.string().describe("Categoría de chiste") },
  async (categories) => {
    try {
      const response = await fetch(
        `https://api.chucknorris.io/jokes/${categories}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        return {
          content: [
            {
              type: "text",
              text:
                "Categorías disponibles:\n" +
                data.map((category) => `• ${category}`).join("\n"),
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: "No se pudieron obtener las categorías.",
            },
          ],
        };
      }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      return {
        content: [
          {
            type: "text",
            text: "Ocurrió un error al intentar obtener las categorías.",
          },
        ],
      };
    }
  }
);

server.tool(
  "random-joke",
  {
    category: z
      .string()
      .describe("Un chiste devuelto por la API de Chuck Norris."),
  },
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

server.tool(
  "random-joke-by-category",
  { category: z.string().describe("La categoría del chiste de Chuck Norris.") },
  async ({ category }) => {
    try {
      const response = await fetch(
        `https://api.chucknorris.io/jokes/random?category=${category}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.value) {
        return {
          content: [
            {
              type: "text",
              text: data.value,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: "No se encontró un chiste en la categoría especificada.",
            },
          ],
        };
      }
    } catch (error) {
      console.log("Error al obtener el chiste:", error);
      return {
        content: [
          {
            type: "text",
            text: "Error al obtener el chiste.",
          },
        ],
      };
    }
  }
);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ El servidor se levanto correctamente en el puerto ${PORT}`);
}),
  (error: string) => {
    console.error(`❌ Error al iniciar el servidor: ${error}`);
  };
