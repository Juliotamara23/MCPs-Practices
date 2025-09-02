import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

export const server = new McpServer({
  name: "Example Server",
  version: "1.0.0",
});

server.tool("random-joke", )

const app = express();
export const transports: { [sessinId: string]: SSEServerTransport } = {};

app.listen(3001);