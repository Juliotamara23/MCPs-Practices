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

// Definiendo la herramienta del servidor
server.tool(
  "process_file",
  {
    description:
      "Una herramienta que simula el procesamiento de archivos y envia notificicaciones",
    inputSchema: {
      message: z.string().describe("El mensaje para procesar con los archivos"),
    },
  },

  // Revisar el tipo de ctx
  async (args, ctx: any) => {
    try {
      const { message } = args;
      const files = ["file_1.txt", "file_2.txt", "file_3.txt"];
      for (const [idx, file] of files.entries()) {
        await ctx.info(`Processing ${file} (${idx + 1}/${files.length})...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      await ctx.info("Todos los archivos procesados.");
      return {
        content: [
          {
            type: "text",
            text: `Archivos procesados: ${files.join(
              ", "
            )} | Mensaje: ${message}`,
          },
        ],
      };
    } catch (error) {
      console.error("Error en la herramienta 'process_files':", error);
      return {
        content: [
          {
            type: "text",
            text: "Ocurrió un error al procesar los archivos. Por favor, inténtelo de nuevo.",
          },
        ],
      };
    }
  }
);

// Inicializando el servidor
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`✅ El servidor se levanto correctamente en el puerto ${PORT}`);
}),
  (error: string) => {
    console.error(`❌ El servidor no pudo iniciar: ${error}`);
  };
