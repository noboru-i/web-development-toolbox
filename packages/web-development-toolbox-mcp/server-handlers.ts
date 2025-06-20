/**
 * Common server request handlers for MCP server
 * This file contains reusable request handlers for both direct and remote MCP servers
 */
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import * as base64 from "./operations/base64.js";
import * as color from "./operations/color.js";
import * as datetime from "./operations/datetime.js";
import * as qr from "./operations/qr.js";
import { JWTDecodeOptions, decodeJWT } from "./operations/jwt.js";
import { UUIDGenerateSchema, generateUUID } from "./operations/uuid.js";
import {
    PlaceholderImageOptions,
    generatePlaceholderImage,
} from "./operations/image.js";

/**
 * Get available tools list for the MCP server
 * @returns List of tools based on options
 */
export function getAvailableTools() {
    const allTools = [
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
        {
            name: "rgb_to_hsv",
            description: "Convert RGB values to HSV",
            inputSchema: zodToJsonSchema(color.RGBToHSVSchema),
        },
        {
            name: "hsv_to_rgb",
            description: "Convert HSV values to RGB",
            inputSchema: zodToJsonSchema(color.HSVToRGBSchema),
        },
        {
            name: "unix_to_iso",
            description: "Convert a Unix timestamp to ISO 8601 format",
            inputSchema: zodToJsonSchema(datetime.UnixToISOSchema),
        },
        {
            name: "iso_to_unix",
            description: "Convert an ISO 8601 string to Unix timestamp",
            inputSchema: zodToJsonSchema(datetime.ISOToUnixSchema),
        },
        {
            name: "generate_qr_code",
            description: "Generate a QR code from a given string",
            inputSchema: zodToJsonSchema(qr.QRCodeGenerateSchema),
        },
        {
            name: "decode_jwt",
            description: "Decode a JWT token",
            inputSchema: zodToJsonSchema(JWTDecodeOptions),
        },
        {
            name: "generate_uuid",
            description: "Generate UUID v4 and v7",
            inputSchema: zodToJsonSchema(UUIDGenerateSchema),
        },
        {
            name: "generate_placeholder_image",
            description: "Generate a placeholder image with specified dimensions",
            inputSchema: zodToJsonSchema(PlaceholderImageOptions),
        },
    ];

    return allTools;
}

/**
 * Handle tool call request for the MCP server
 * @param request - Tool call request
 * @returns Response for the tool call
 */
export async function handleToolCall(request: any) {
    try {
        if (!request.params.arguments) {
            throw new Error("Arguments are required");
        }

        switch (request.params.name) {
            case "encode_base64": {
                const args = base64.Base64EncodeSchema.parse(request.params.arguments);
                const response = await base64.encodeBase64(args);
                return {
                    content: [{ type: "text", text: response }],
                };
            }
            case "decode_base64": {
                const args = base64.Base64DecodeSchema.parse(request.params.arguments);
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
            case "rgb_to_hsv": {
                const args = color.RGBToHSVSchema.parse(request.params.arguments);
                const response = await color.rgbToHSV(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
                };
            }
            case "hsv_to_rgb": {
                const args = color.HSVToRGBSchema.parse(request.params.arguments);
                const response = await color.hsvToRGB(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
                };
            }
            case "unix_to_iso": {
                const args = datetime.UnixToISOSchema.parse(request.params.arguments);
                const response = await datetime.unixToISO(args);
                return {
                    content: [{ type: "text", text: response }],
                };
            }
            case "iso_to_unix": {
                const args = datetime.ISOToUnixSchema.parse(request.params.arguments);
                const response = await datetime.isoToUnix(args);
                return {
                    content: [{ type: "text", text: response.toString() }],
                };
            }
            case "generate_qr_code": {
                const args = qr.QRCodeGenerateSchema.parse(request.params.arguments);
                const response = await qr.generateQRCode(args);
                return {
                    content: [{ type: "image", data: response, mimeType: "image/png" }],
                };
            }
            case "decode_jwt": {
                const args = JWTDecodeOptions.parse(request.params.arguments);
                const response = await decodeJWT(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
                };
            }
            case "generate_uuid": {
                const args = UUIDGenerateSchema.parse(request.params.arguments);
                const response = await generateUUID(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
                };
            }
            case "generate_placeholder_image": {
                const args = PlaceholderImageOptions.parse(request.params.arguments);
                const response = await generatePlaceholderImage(args);
                return {
                    content: [{ type: "image", data: response, mimeType: "image/png" }],
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
}
