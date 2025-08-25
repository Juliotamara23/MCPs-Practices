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

  // MCPClient tool adapter for OpenAI tools.
  openAiToolAdapter(tool: {
    name: string;
    description?: string;
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
      },
    };
  }

  // LLM calling method
  async callTools(
    tool_calls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[],
    toolResults: any[]
  ) {
    for (const tool_call of tool_calls) {
      const toolName = tool_call.function.name;
      const args = tool_call.function.arguments;

      console.log(`Calling tool ${toolName} with args ${JSON.stringify(args)}`);

      // 2. Call the server's tool
      const toolResult = await this.client.callTool({
        name: toolName,
        arguments: JSON.parse(args),
      });

      console.log("Tool result: ", toolResult);

      // 3. Do something with the result
      // TODO
    }
  }

  // Run method to start the client
  async run() {
    console.log("Asking server for available tools");
    const toolsResult = await this.client.listTools();
    const tools = toolsResult.tools.map((tool) => {
      return this.openAiToolAdapter({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
      });
    });

    const prompt = "What is the sum of 2 and 3?";
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "user",
        content: prompt,
      },
    ];

    console.log("Querying LLM: ", messages[0].content);

    // 2. Calling the LLM
    let response = this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1000,
      messages,
      tools: tools,
    });

    let results: any[] = [];

    // 3. Go through the LLM response, for each choice, check if it has tool calls
    (await response).choices.map(async (choice: { message: any }) => {
      const message = choice.message;
      if (message.tools_calls) {
        console.log("Making tool call");
        await this.callTools(message.tool_call, results);
      }
    });
  }
}
