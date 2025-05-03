import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { McpAgent } from "agents/mcp";
import * as operations from 'web-development-toolbox-mcp/operations';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export class MyMCP extends McpAgent {
    server = new Server({
        name: 'web-development-toolbox-mcp-remote',
        version: '0.1.0',
    }, {
        capabilities: {
            tools: {
                list: true,
                call: true,
            },
            logging: {}
        }
    });

    async init() {

        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: "encode_base64",
                        description: "Encode data to base64 format",
                        inputSchema: zodToJsonSchema(operations.base64.Base64EncodeSchema),
                    },
                ],
            };
        });

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            try {
                if (!request.params.arguments) {
                    throw new Error("Arguments are required");
                }
                switch (request.params.name) {
                    case "encode_base64": {
                        const args = operations.base64.Base64EncodeSchema.parse(request.params.arguments);
                        const response = await operations.base64.encodeBase64(args);
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
    }
}

export default {
    fetch(request: Request, env: Env, ctx: ExecutionContext) {
        const url = new URL(request.url);

        if (url.pathname === "/sse" || url.pathname === "/sse/message") {
            // @ts-ignore
            return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
        }

        if (url.pathname === "/mcp") {
            // @ts-ignore
            return MyMCP.serve("/mcp").fetch(request, env, ctx);
        }

        return new Response("Not found", { status: 404 });
    },
};
