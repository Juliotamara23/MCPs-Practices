import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

export const server = new McpServer({
  name: "Example Server",
  version: "1.0.0",
});

server.tool(
  "random-joke",
  "Un chiste devuuelto por la API de Chuck Norris",
  {},
  async () => {
    const response = await fetch("https://api.chucknorris.io/jokes/random");
    const data = await response.json();
    
    return {
        content: [{
            type: "text",
            text: data.value
        }]
    }
  }
);

const app = express();
export const transports: { [sessinId: string]: SSEServerTransport } = {};

app.listen(3001);
