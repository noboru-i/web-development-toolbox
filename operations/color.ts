import { z } from "zod";

export const HexToRGBOptions = z.object({
    hex: z.string().regex(/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/).describe("The hex color code to convert to RGB"),
});

export const HexToRGBSchema = HexToRGBOptions;

export async function hexToRGB(
  params: z.infer<typeof HexToRGBSchema>
): Promise<{ r: number; g: number; b: number }> {
  const hex = params.hex.startsWith("#") ? params.hex.slice(1) : params.hex;
  const bigint = parseInt(hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}