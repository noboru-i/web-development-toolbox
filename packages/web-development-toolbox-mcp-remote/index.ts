import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { McpAgent } from "agents/mcp";
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getAvailableTools, handleToolCall } from 'web-development-toolbox-mcp/server-handlers';

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
            const tools = getAvailableTools();
            return { tools };
        });

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            return await handleToolCall(request);
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
