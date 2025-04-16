# Web Development Toolbox MCP Server

[![npm version](https://badge.fury.io/js/web-development-toolbox-mcp-server.svg)](https://badge.fury.io/js/web-development-toolbox-mcp-server)

MCP Server for various web development utilities.

## Overview

This is an MCP server designed to provide various tools for web development, such as encoding, color conversion, date-time manipulation, and QR code generation. It uses the Model Context Protocol SDK to handle requests and responses.

## Setup

### Usage with VS Code

Add the following configuration to your User Settings (JSON) file. Open the settings by pressing `Cmd + Shift + P` and selecting `Preferences: Open User Settings (JSON)`.

Alternatively, you can create a `.vscode/mcp.json` file in your workspace to share the configuration with others. Note that the `mcp` key is not needed in the `.vscode/mcp.json` file.

> Note that the `mcp` key is not needed in the `.vscode/mcp.json` file.

```json
{
  "mcp": {
    "servers": {
      "web-development-toolbox": {
        "command": "npx",
        "args": ["-y", "noboru-i/web-development-toolbox"],
        "env": {}
      }
    }
  }
}
```

## Tools

This server provides the following tools:

1. **encode_base64**

   - Encode data to base64 format
   - Inputs:
     - `data` (string): Input string to encode
   - Returns: Base64 encoded string

2. **decode_base64**

   - Decode base64 encoded data
   - Inputs:
     - `data` (string): Base64 encoded string to decode
   - Returns: Decoded string

3. **hex_to_rgb**

   - Convert a hex color code to RGB format
   - Inputs:
     - `hex` (string): Hexadecimal color code
   - Returns: Object containing RGB values (`r`, `g`, `b`)

4. **rgb_to_hex**

   - Convert RGB values to a hex color code
   - Inputs:
     - `r` (number): Red value (0-255)
     - `g` (number): Green value (0-255)
     - `b` (number): Blue value (0-255)
   - Returns: Hexadecimal color code

5. **unix_to_iso**

   - Convert a Unix timestamp to ISO 8601 format
   - Inputs:
     - `datetime` (number): Unix timestamp
   - Returns: ISO 8601 formatted string

6. **iso_to_unix**

   - Convert an ISO 8601 string to Unix timestamp
   - Inputs:
     - `isoString` (string): ISO 8601 formatted string
   - Returns: Unix timestamp

7. **generate_qr_code**

   - Generate a QR code from a given string
   - Inputs:
     - `text` (string): Text to encode in the QR code
   - Returns: QR code image (data URL)

8. **decode_jwt**

   - Decode a JWT token
   - Inputs:
     - `token` (string): JWT token string
   - Returns:
     - `header`: Decoded JWT header (object)
     - `payload`: Decoded JWT payload (object)
     - `signature`: JWT signature (string or null)

9. **generate_uuid**

   - Generate UUID v4 and v7
   - Inputs:
     - (no parameters required)
   - Returns: JSON object containing both v4 and v7 UUIDs
     - `v4`: UUID v4 string
     - `v7`: UUID v7 string

## License

This project is licensed under the terms of the MIT open source license. Please refer to [MIT](./LICENSE) for the full terms.
