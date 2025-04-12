#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import * as base64 from "./operations/base64.js";
import * as color from "./operations/color.js";

const server = new Server(
  {
    name: "web-development-toolbox-mcp-server",
    version: "0.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "encode_base64",
        description: "Encode data to base64 format",
        inputSchema: zodToJsonSchema(base64.Base64EncodeSchema),
      },
      {
        name: "decode_base64",
        description: "Decode base64 encoded data",
        inputSchema: zodToJsonSchema(base64.Base64DecodeSchema),
      },
      {
        name: "hex_to_rgb",
        description: "Convert a hex color code to RGB format",
        inputSchema: zodToJsonSchema(color.HexToRGBSchema),
      },
      {
        name: "rgb_to_hex",
        description: "Convert RGB values to a hex color code",
        inputSchema: zodToJsonSchema(color.RGBToHexSchema),
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error("Arguments are required");
    }

    switch (request.params.name) {
      case "encode_base64": {
        const args = base64.Base64EncodeSchema.parse(
          request.params.arguments
        );
        const response = await base64.encodeBase64(args);
        return {
          content: [{ type: "text", text: response }],
        };
      }
      case "decode_base64": {
        const args = base64.Base64DecodeSchema.parse(
          request.params.arguments
        );
        const response = await base64.decodeBase64(args);
        return {
          content: [{ type: "text", text: response }],
        };
      }
      case "hex_to_rgb": {
        const args = color.HexToRGBSchema.parse(request.params.arguments);
        const response = await color.hexToRGB(args);
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      }
      case "rgb_to_hex": {
        const args = color.RGBToHexSchema.parse(request.params.arguments);
        const response = await color.rgbToHex(args);
        return {
          content: [{ type: "text", text: response }],
        };
      }
      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    console.error("Error in request handler:", error);
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
    }
    throw error;
  }
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
