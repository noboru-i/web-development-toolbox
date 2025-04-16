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

export const RGBToHUEOptions = z.object({
  r: z.number().min(0).max(255).describe("The red component (0-255)"),
  g: z.number().min(0).max(255).describe("The green component (0-255)"),
  b: z.number().min(0).max(255).describe("The blue component (0-255)"),
});

export const RGBToHUESchema = RGBToHUEOptions;

export async function rgbToHUE(
  params: z.infer<typeof RGBToHUESchema>
): Promise<{ h: number; s: number; l: number }> {
  const { r, g, b } = params;
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }

    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export const HUEToRGBOptions = z.object({
  h: z.number().min(0).max(360).describe("The hue component (0-360)"),
  s: z.number().min(0).max(100).describe("The saturation component (0-100)"),
  l: z.number().min(0).max(100).describe("The lightness component (0-100)"),
});

export const HUEToRGBSchema = HUEToRGBOptions;

export async function hueToRGB(
  params: z.infer<typeof HUEToRGBSchema>
): Promise<{ r: number; g: number; b: number }> {
  const { h, s, l } = params;
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = lNorm - c / 2;

  let rNorm = 0;
  let gNorm = 0;
  let bNorm = 0;

  if (0 <= h && h < 60) {
    rNorm = c;
    gNorm = x;
  } else if (60 <= h && h < 120) {
    rNorm = x;
    gNorm = c;
  } else if (120 <= h && h < 180) {
    gNorm = c;
    bNorm = x;
  } else if (180 <= h && h < 240) {
    gNorm = x;
    bNorm = c;
  } else if (240 <= h && h < 300) {
    rNorm = x;
    bNorm = c;
  } else if (300 <= h && h < 360) {
    rNorm = c;
    bNorm = x;
  }

  return {
    r: Math.round((rNorm + m) * 255),
    g: Math.round((gNorm + m) * 255),
    b: Math.round((bNorm + m) * 255),
  };
}
