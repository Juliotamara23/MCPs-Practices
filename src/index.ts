import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import OpenAI from "openai";
import { z } from "zod"; // Import zod for schema validation

class MCPClient {
  private openai: OpenAI;
  private client: Client;

  constructor() {
    this.openai = new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: process.env.GITHUB_TOKEN,
    });

    this.client = new Client(
      {
        name: "example-client",
        version: "1.0.0",
      },
      {
        capabilities: {
          prompts: {},
          resource: {},
          tools: {},
        },
      }
    );
  }

  async connectToServer(transport: Transport) {
    await this.client.connect(transport);
    this.run();
    console.error("MCPClient started on stdin/stdout");
  }

  async run() {
    console.log("Asking server for available tools");

    //listing tools
    const toolsResult = await this.client.listTools();
  }
}
