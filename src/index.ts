import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  TextContent,
} from "@modelcontextprotocol/sdk/types.js";

import express from "express";
import { randomUUID } from "node:crypto";

// 🛠️ Crear la instancia del servidor MCP
const server = new Server({
  name: "StreamableHTTPServer Files",
  version: "1.0.0",
});

// 🚀 Inicializar la app Express y los transports
const app = express();
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

/**
 * Endpoint para el streaming de datos.
 * Esta ruta simula el procesamiento de una lista de archivos y envía notificaciones en tiempo real.
 */
app.get("/stream", async (req, res) => {
  const message = req.query.message || "Hola";

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");
  res.flushHeaders();

  const files = [1, 2, 3];
  const totalFiles = files.length;

  try {
    // Enviar mensaje de bienvenida
    res.write("--- Streaming Progress ---\n");

    // Simular el procesamiento de cada archivo
    for (const fileIndex of files) {
      const notification = `Processing file ${fileIndex}/${totalFiles}...\n`;
      res.write(notification);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Enviar el contenido final
    res.write(`Here's the file content: ${message}\n`);
    res.write("--- Stream Ended ---\n");

    res.end();
  } catch (error) {
    console.error("Error durante el streaming:", error);
    if (!res.headersSent) {
      res.status(500).end();
    }
  }
});

/**
 * Endpoint principal MCP (POST).
 * Maneja la lógica de sesiones y peticiones.
 */
app.post("/mcp", async (req, res) => {
  try {
    let transport: StreamableHTTPServerTransport;
    const sessionId = req.headers["mcp-session-id"] as string;

    if (sessionId && transports[sessionId]) {
      transport = transports[sessionId];
    } else {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (newSessionId) => {
          transports[newSessionId] = transport;
        },
      });
      transport.onclose = () => {
        if (transport.sessionId) {
          delete transports[transport.sessionId];
        }
      };

      await server.connect(transport);
    }
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
      });
    }
  }
});

/**
 * Endpoint para conectar el cliente y recibir eventos en tiempo real.
 */
app.get("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string;
  if (!sessionId || !transports[sessionId]) {
    return res.status(400).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Bad Request: No valid session ID provided",
      },
    });
  }
  await transports[sessionId].handleRequest(req, res);
});

/**
 * Endpoint para terminar la sesión MCP.
 */
app.delete("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string;
  if (!sessionId || !transports[sessionId]) {
    return res.status(400).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Bad Request: No valid session ID provided",
      },
    });
  }
  await transports[sessionId].handleRequest(req, res);
});

// 🛠️ Configurar el manejador para la herramienta `process_files`
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "process_files",
        description:
          "A tool that simulates file processing and sends progress notifications",
        inputSchema: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "The message to be processed and returned",
            },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "process_files": {
      const message = String(request.params.arguments?.message || "hello");
      const ctx = (request as any).context;

      // Simular la lista de archivos
      const files = ["file_1.txt", "file_2.txt", "file_3.txt"];
      for (const [idx, file] of files.entries()) {
        await ctx.info(`Processing ${file} (${idx + 1}/${files.length})...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Enviar el mensaje final
      await ctx.info(`All files processed!`);

      return {
        content: {
          type: "text",
          text: `Processed files: ${files.join(", ")} | Message: ${message}`,
        } as TextContent,
      };
    }
    default:
      throw new Error("Unknown tool");
  }
});

// 🚦 Iniciar el servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(
    `✅ El servidor classic HTTP streaming se conecto correctamente en http://localhost:${PORT}/`
  );
});
