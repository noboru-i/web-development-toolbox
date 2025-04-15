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

- **encode_base64** - Encode data to base64 format.

  - Input Schema:
    - `data`: Input string to encode (string, required)

- **decode_base64** - Decode base64 encoded data.

  - Input Schema:
    - `data`: Base64 encoded string to decode (string, required)

- **hex_to_rgb** - Convert a hex color code to RGB format.

  - Input Schema:
    - `hex`: Hexadecimal color code (string, required)

- **rgb_to_hex** - Convert RGB values to a hex color code.

  - Input Schema:
    - `r`: Red value (number, required)
    - `g`: Green value (number, required)
    - `b`: Blue value (number, required)

- **unix_to_iso** - Convert a Unix timestamp to ISO 8601 format.

  - Input Schema:
    - `timestamp`: Unix timestamp (number, required)

- **iso_to_unix** - Convert an ISO 8601 string to Unix timestamp.

  - Input Schema:
    - `iso`: ISO 8601 formatted string (string, required)

- **generate_qr_code** - Generate a QR code from a given string.
  - Input Schema:
    - `text`: Text to encode in the QR code (string, required)

- **decode_jwt** - Decode a JWT token.
  - Input Schema:
    - `token`: JWT token string (string, required)
  - Output Format:
    - `header`: Decoded JWT header (object)
    - `payload`: Decoded JWT payload (object)
    - `signature`: JWT signature (string or null)

## License

This project is licensed under the terms of the MIT open source license. Please refer to [MIT](./LICENSE) for the full terms.
