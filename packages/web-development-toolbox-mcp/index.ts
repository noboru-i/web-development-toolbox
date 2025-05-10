#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { getAvailableTools, handleToolCall } from "./server-handlers.js";

const server = new Server(
  {
    name: "web-development-toolbox-mcp-server",
    version: "0.4.7",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Set request handler for listing tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = getAvailableTools();
  return { tools };
});

// Set request handler for calling tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  return await handleToolCall(request);
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Web Development Toolbox MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

export * as operations from "./operations/index.js";
