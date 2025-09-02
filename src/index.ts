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

app.listen(3001);
console.log("✅ Server is running on port 3001 successfully!");
