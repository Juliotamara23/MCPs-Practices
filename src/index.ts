import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "calculator-mcp",
  version: "1.0.0",
});

// Define add tool
server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
  content: [{ type: "text", text: String(a + b) }],
}));

// Define subtract tool
server.tool("subtract", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
  content: [{ type: "text", text: String(a - b) }],
}));

// Define multiply tool
server.tool("multiply", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
  content: [{ type: "text", text: String(a * b) }],
}));

// Define divide tool
server.tool("divide", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
  content: [{ type: "text", text: String(a / b) }],
}));

// Define help tool
server.tool("help", {}, async () => ({
  content: [
    {
      type: "text",
      text: `The available tools are:
      - add: Takes two numbers and returns their sum. Arguments: { a: number, b: number }
      - subtract: Takes two numbers and returns the result of subtracting the second from the first. Arguments: { a: number, b: number }
      - multiply: Takes two numbers and returns their product. Arguments: { a: number, b: number }
      - divide: Takes two numbers and returns the result of dividing the first by the second. Arguments: { a: number, b: number }`,
    },
  ],
}));

// Add a dynamic greeting resource
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [{ uri: uri.href, text: `Hello, ${name}!` }],
  })
);

// Start receiving messages on stdin and sending messages on stdout
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("🚀 MCPServer started on stdin/stdout");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
