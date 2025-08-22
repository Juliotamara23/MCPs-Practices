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

    openAIToolAdapter(tool: {
        name: string;
        description: string;
        input_schema: any;
    }) {
        // Create a zod schema based on the input_schema
        const schema = z.object(tool.input_schema);

        return {
            type: "function" as const, // Explicitly set type to "function"
            function: {
                name: tool.name,
                description: tool.description,
                parameters: {
                    type: "object",
                    properties: tool.input_schema.properties,
                    required: tool.input_schema.required,
                },
            }
        }

  async run() {
            console.log("Asking server for available tools");

            //listing tools
            const toolsResult = await this.client.listTools();
        }
    }
}