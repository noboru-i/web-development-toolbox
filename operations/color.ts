import { z } from "zod";

export const HexToRGBOptions = z.object({
  hex: z
    .string()
    .regex(/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)
    .describe("The hex color code to convert to RGB"),
});

export const HexToRGBSchema = HexToRGBOptions;

export async function hexToRGB(
  params: z.infer<typeof HexToRGBSchema>
): Promise<{ r: number; g: number; b: number }> {
  // remove the hash at the start if it's there
  const hex = params.hex.startsWith("#") ? params.hex.slice(1) : params.hex;
  const bigint = parseInt(expandShorthandHex(hex), 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function expandShorthandHex(hex: string): string {
  return hex.length === 3
    ? hex
        .split("")
        .map((c) => c + c)
        .join("")
    : hex;
}

export const RGBToHexOptions = z.object({
  r: z.number().min(0).max(255).describe("The red component (0-255)"),
  g: z.number().min(0).max(255).describe("The green component (0-255)"),
  b: z.number().min(0).max(255).describe("The blue component (0-255)"),
});

export const RGBToHexSchema = RGBToHexOptions;

export async function rgbToHex(
  params: z.infer<typeof RGBToHexSchema>
): Promise<string> {
  const { r, g, b } = params;
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
