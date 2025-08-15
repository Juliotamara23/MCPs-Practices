import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function runClient() {
  console.log("🚀 Starting MCP TypeScript Client...");

  try {
    // Create stdio transport to connect to the MCP server
    const transport = new StdioClientTransport({
      command: "node",
      args: ["E:/DEV/Proyects/MCPs/0.2-calculator-server/build/index.js"],
    });

    // Create client instance
    const client = new Client({
      name: "calculator-client",
      version: "1.0.0",
    });

    console.log("📡 Connecting to MCP server...");

    // Connect to the server
    await client.connect(transport);

    console.log("✅ Connected to MCP server successfully!");

    // List available tools
    console.log("\n📋 Listing available tools:");
    const tools = await client.listTools();
    tools.tools.forEach((tool) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });

    // Test calculator operations
    console.log("\n🧮 Testing Calculator Operations:");

    // Addition
    const addResult = await client.callTool({
      name: "add",
      arguments: {
        a: 5,
        b: 3,
      },
    });
    console.log(`Add 5 + 3 = ${extractTextResult(addResult)}`);

    // Subtraction
    const subtractResult = await client.callTool({
      name: "subtract",
      arguments: {
        a: 10,
        b: 4,
      },
    });
    console.log(`Subtract 10 - 4 = ${extractTextResult(subtractResult)}`);

    // Multiplication
    const multiplyResult = await client.callTool({
      name: "multiply",
      arguments: {
        a: 6,
        b: 7,
      },
    });
    console.log(`Multiply 6 × 7 = ${extractTextResult(multiplyResult)}`);

    // Division
    const divideResult = await client.callTool({
      name: "divide",
      arguments: {
        a: 20,
        b: 4,
      },
    });
    console.log(`Divide 20 ÷ 4 = ${extractTextResult(divideResult)}`);

    // Help
    const helpResult = await client.callTool({
      name: "help",
      arguments: {},
    });
    console.log(`\n📖 Help Information:`);
    console.log(extractTextResult(helpResult));

    // List available resources
    try {
      console.log("\n📄 Listing available resources:");
      const resources = await client.listResources();
      resources.resources.forEach((resource) => {
        console.log(`  - ${resource.name}: ${resource.description}`);
      });

      // Test reading a resource if available
      if (resources.resources.length > 0) {
        const firstResource = resources.resources[0];
        console.log(`\n📖 Reading resource: ${firstResource.name}`);
        const resourceContent = await client.readResource({
          uri: firstResource.uri,
        });
        console.log(
          `Resource content: ${JSON.stringify(resourceContent, null, 2)}`
        );
      }
    } catch (error: any) {
      console.log(
        "  No resources available or error listing resources:",
        error.message
      );
    }

    // List available prompts
    try {
      console.log("\n💬 Listing available prompts:");
      const prompts = await client.listPrompts();
      prompts.prompts.forEach((prompt) => {
        console.log(`  - ${prompt.name}: ${prompt.description}`);
      });

      // Test getting a prompt if available
      if (prompts.prompts.length > 0) {
        const firstPrompt = prompts.prompts[0];
        console.log(`\n💬 Getting prompt: ${firstPrompt.name}`);
        const promptResult = await client.getPrompt({
          name: firstPrompt.name,
          arguments: {
            code: "console.log('Hello, MCP!');",
          },
        });
        console.log(`Prompt result: ${JSON.stringify(promptResult, null, 2)}`);
      }
    } catch (error: any) {
      console.log(
        "  No prompts available or error listing prompts:",
        error.message
      );
    }

    console.log("\n✨ Client operations completed successfully!");
  } catch (error) {
    console.error("❌ Error running MCP client:", error);
    process.exit(1);
  }
}

/**
 * Extract the text result from a tool call response
 */
function extractTextResult(result: any): string {
  try {
    if (result && result.content && Array.isArray(result.content)) {
      const textContent = result.content.find((c: any) => c.type === "text");
      if (textContent && textContent.text) {
        return textContent.text;
      }
    }

    // Fallback: stringify the entire result
    return JSON.stringify(result, null, 2);
  } catch {
    return result?.toString() || "No result";
  }
}

// Error handling wrapper
async function main() {
  try {
    await runClient();
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

// Run the client
main();
