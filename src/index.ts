import express from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Request, Response } from "express";
import {
  CallToolRequestSchema,
  isInitializeRequest,
  ListToolsRequestSchema,
  TextContent,
} from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "node:crypto";

// 🛠️ Crear la instancia del servidor MCP
const server = new Server(
  {
    name: "StreamableHTTPServerTransport",
    version: "1.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 🚀 Inicializar la app Express y los transports
const app = express();
app.use(express.json()); // Middleware para parsear JSON
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

/**
 * Endpoint de prueba.
 * Verificar que el servidor esté funcionando.
 */
app.get("/", async (_: Request, res: Response) => {
  res.send("Bienvenido al servidor de streaming HTTP");
});

/**
 * 📢 Endpoint para classic HTTP streaming
 * Simula el procesamiento de archivos y envía notificaciones de progreso.
 */
app.get("/stream", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/plain");

  const message = req.query.message || "Hola";

  res.write(
    `Conectado en http://localhost:3001/stream con el mensaje: ${message}\n`
  );
  res.write("--- Streaming Progress ---\n");

  const totalFiles = 3;
  for (let i = 1; i <= totalFiles; i++) {
    res.write(`Processing file ${i}/${totalFiles}...\n`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  res.write(`Here's the file content: ${message}\n`);
  res.write("--- Stream Ended ---\n");
  res.end();
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

/**
 * Endpoint principal MCP (POST).
 */
app.post("/mcp", async (req, res) => {
  console.log("📨 Recibida petición MCP POST");

  try {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId) => {
          transports[sessionId] = transport;
        },
      });
      transport.onclose = () => {
        if (transport.sessionId) {
          delete transports[transport.sessionId];
        }
      };

      await server.connect(transport);
    } else {
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No valid session ID provided",
        },
        id: req?.body?.id,
      });
      return;
    }

    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("❌ Error manejando petición MCP:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: req?.body?.id,
      });
      return;
    }
  }
});

/**
 * Endpoint GET para SSE streams (usado por MCP para eventos).
 */
app.get("/mcp", async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Bad Request: No valid session ID provided",
      },
      id: req?.body?.id,
    });
    return;
  }

  const transport = transports[sessionId];
  await transport!.handleRequest(req, res);
});

/**
 * Endpoint DELETE para terminar sesión MCP.
 */
app.delete("/mcp", async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Bad Request: No valid session ID provided",
      },
      id: req?.body?.id,
    });
    return;
  }

  try {
    const transport = transports[sessionId];
    await transport!.handleRequest(req, res);
  } catch (error) {
    console.error("❌ Error al terminar sesión:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Error handling session termination",
        },
        id: req?.body?.id,
      });
      return;
    }
  }
});

/**
 * 🚀 Iniciar el servidor
 */
const PORT = 3001;
app.listen(PORT, () => {
  console.log(
    `✅ El servidor classic HTTP streaming se conecto correctamente en http://localhost:${PORT}`
  );
});
