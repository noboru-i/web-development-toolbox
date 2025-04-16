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

export const RGBToHSVOptions = z.object({
  r: z.number().min(0).max(255).describe("The red component (0-255)"),
  g: z.number().min(0).max(255).describe("The green component (0-255)"),
  b: z.number().min(0).max(255).describe("The blue component (0-255)"),
});

export const RGBToHSVSchema = RGBToHSVOptions;

export async function rgbToHSV(
  params: z.infer<typeof RGBToHSVSchema>
): Promise<{ h: number; s: number; v: number }> {
  const { r, g, b } = params;
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  let v = max;

  if (delta !== 0) {
    s = delta / max;

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

  return { h: h * 360, s: s * 100, v: v * 100 };
}

export const HSVToRGBOptions = z.object({
  h: z.number().min(0).max(360).describe("The hue component (0-360)"),
  s: z.number().min(0).max(100).describe("The saturation component (0-100)"),
  v: z.number().min(0).max(100).describe("The value component (0-100)"),
});

export const HSVToRGBSchema = HSVToRGBOptions;

export async function hsvToRGB(
  params: z.infer<typeof HSVToRGBSchema>
): Promise<{ r: number; g: number; b: number }> {
  const { h, s, v } = params;
  const sNorm = s / 100;
  const vNorm = v / 100;
  const hNorm = h / 60;

  const i = Math.floor(hNorm);
  const f = hNorm - i;
  const p = vNorm * (1 - sNorm);
  const q = vNorm * (1 - sNorm * f);
  const t = vNorm * (1 - sNorm * (1 - f));

  let rNorm = 0;
  let gNorm = 0;
  let bNorm = 0;

  switch (i % 6) {
    case 0:
      rNorm = vNorm;
      gNorm = t;
      bNorm = p;
      break;
    case 1:
      rNorm = q;
      gNorm = vNorm;
      bNorm = p;
      break;
    case 2:
      rNorm = p;
      gNorm = vNorm;
      bNorm = t;
      break;
    case 3:
      rNorm = p;
      gNorm = q;
      bNorm = vNorm;
      break;
    case 4:
      rNorm = t;
      gNorm = p;
      bNorm = vNorm;
      break;
    case 5:
      rNorm = vNorm;
      gNorm = p;
      bNorm = q;
      break;
  }

  return {
    r: Math.round(rNorm * 255),
    g: Math.round(gNorm * 255),
    b: Math.round(bNorm * 255),
  };
}
