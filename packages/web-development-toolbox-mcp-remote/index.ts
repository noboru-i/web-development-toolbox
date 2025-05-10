import OAuthProvider from '@cloudflare/workers-oauth-provider';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { McpAgent } from "agents/mcp";
import { getAvailableTools, handleToolCall } from 'web-development-toolbox-mcp/server-handlers';
import { z } from "zod";
import { GitHubHandler } from './github-handler.js';
import { generatePlaceholderImage, PlaceholderImageOptions } from './operations/image.js';

// Context from the auth process, encrypted & stored in the auth token
// and provided to the DurableMCP as this.props
type Props = {
    login: string;
    name: string;
    email: string;
    accessToken: string;
};

export class MyMCP extends McpAgent<Props, Env> {
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
            {
                {
                    try {
                        if (!request.params.arguments) {
                            throw new Error("Arguments are required");
                        }

                        switch (request.params.name) {
                            // override for Cloudflare environment
                            case "generate_placeholder_image": {
                                const args = PlaceholderImageOptions.parse(request.params.arguments);
                                const response = await generatePlaceholderImage(args);
                                return {
                                    content: [{ type: "image", data: response, mimeType: "image/png" }],
                                };
                            }
                        }
                    } catch (error) {
                        console.error("Error in request handler:", error);
                        if (error instanceof z.ZodError) {
                            throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
                        }
                        throw error;
                    }
                }
                return await handleToolCall(request);
            }
        });
    }
}

// export default {
//     fetch(request: Request, env: Env, ctx: ExecutionContext) {
//         const url = new URL(request.url);

//         if (url.pathname === "/sse" || url.pathname === "/sse/message") {
//             return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
//         }

//         if (url.pathname === "/mcp") {
//             return MyMCP.serve("/mcp").fetch(request, env, ctx);
//         }

//         return new Response("Not found", { status: 404 });
//     },
// };

export default new OAuthProvider({
    // apiRoute: [
    //     "/sse",
    //     "/mcp",
    // ],
    // apiHandler: MyMCP.mount("/sse"),
    apiHandlers: {
        "/sse": MyMCP.mount("/sse") as any,
        "/mcp": MyMCP.mount("/mcp") as any,
    },
    defaultHandler: GitHubHandler as any,
    authorizeEndpoint: "/authorize",
    tokenEndpoint: "/token",
    clientRegistrationEndpoint: "/register",
});
