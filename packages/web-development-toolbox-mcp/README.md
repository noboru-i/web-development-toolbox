# Web Development Toolbox MCP Server

[![npm version](https://badge.fury.io/js/web-development-toolbox-mcp.svg)](https://badge.fury.io/js/web-development-toolbox-mcp)

MCP (Model Context Protocol) server implementation providing various utility tools for web development.

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
        "command": "npx", // It might be necessary to specify the full path. In that case, use the result of `which npx`.
        "args": ["-y", "noboru-i/web-development-toolbox"],
        "env": {}
      }
    }
  }
}
```

## Available Tools

This server provides the following tools:

### Encoding & Decoding

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

3. **decode_jwt**

   - Decode a JWT token
   - Inputs:
     - `token` (string): JWT token string
   - Returns:
     - `header`: Decoded JWT header (object)
     - `payload`: Decoded JWT payload (object)
     - `signature`: JWT signature (string or null)

### Color Conversion

4. **hex_to_rgb**

   - Convert a hex color code to RGB format
   - Inputs:
     - `hex` (string): Hexadecimal color code
   - Returns: Object containing RGB values (`r`, `g`, `b`)

5. **rgb_to_hex**

   - Convert RGB values to a hex color code
   - Inputs:
     - `r` (number): Red value (0-255)
     - `g` (number): Green value (0-255)
     - `b` (number): Blue value (0-255)
   - Returns: Hexadecimal color code

6. **rgb_to_hsv**

   - Convert RGB values to HSV
   - Inputs:
     - `r` (number): Red value (0-255)
     - `g` (number): Green value (0-255)
     - `b` (number): Blue value (0-255)
   - Returns: Object containing HSV values (`h`, `s`, `v`)

7. **hsv_to_rgb**

   - Convert HSV values to RGB
   - Inputs:
     - `h` (number): Hue value (0-360)
     - `s` (number): Saturation value (0-100)
     - `v` (number): Value component (0-100)
   - Returns: Object containing RGB values (`r`, `g`, `b`)

### Date & Time

8. **unix_to_iso**

   - Convert a Unix timestamp to ISO 8601 format
   - Inputs:
     - `datetime` (number): Unix timestamp
   - Returns: ISO 8601 formatted string

9. **iso_to_unix**

   - Convert an ISO 8601 string to Unix timestamp
   - Inputs:
     - `isoString` (string): ISO 8601 formatted string
   - Returns: Unix timestamp

### Image & UUID Generation

10. **generate_qr_code**

    - Generate a QR code from a given string
    - Inputs:
      - `text` (string): Text to encode in the QR code
    - Returns: QR code image (data URL)

11. **generate_uuid**

    - Generate UUID v4 and v7
    - Inputs:
      - (no parameters required)
    - Returns: JSON object containing both v4 and v7 UUIDs
      - `v4`: UUID v4 string
      - `v7`: UUID v7 string

12. **generate_placeholder_image**

    - Generate a placeholder image with specified dimensions
    - Inputs:
      - `width` (number): Width of the image in pixels
      - `height` (number): Height of the image in pixels
    - Returns: Placeholder image (data URL)

## Example Usage

Check the [example-project/prompts](./example-project/prompts/) directory for example prompts for each tool.

## Development

### Building the Project

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
