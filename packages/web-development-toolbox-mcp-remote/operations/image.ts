import { z } from "zod";
import { ImageResponse } from "workers-og";

const PlaceholderImageOptions = z.object({
  width: z
    .number()
    .min(1)
    .describe("The width of the placeholder image in pixels"),
  height: z
    .number()
    .min(1)
    .describe("The height of the placeholder image in pixels"),
});

async function generatePlaceholderImage({
  width,
  height,
}: z.infer<typeof PlaceholderImageOptions>): Promise<string> {
  const title = `${width} x ${height}`;
  const fontSize = calculateFontSize(width, height);

  const html = `
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; width: 100vw; background: #D3D3D3;">
      <span style="font-size: ${fontSize}px; font-weight: 600; font-family: 'Arial'; color: #222222;">${title}</span>
    </div>
   `;

  const image = new ImageResponse(html, {
    format: "png",
    width: width,
    height: height,
  }).arrayBuffer();
  return base64Encode(await image);
}

/**
 * Calculate the appropriate font size based on the image resolution
 * @param width Image width
 * @param height Image height
 * @returns Calculated font size
 */
function calculateFontSize(width: number, height: number): number {
  const minFontSize = 8;
  const maxFontSize = 36;

  // Calculate font size based on the smaller dimension
  const smallerDimension = Math.min(width, height);
  const calculatedFontSize = Math.max(
    minFontSize,
    Math.min(maxFontSize, Math.floor(smallerDimension / 2))
  );

  return calculatedFontSize;
}

/**
 * Encode an ArrayBuffer to a base64 string
 * @param buf The ArrayBuffer to encode
 * @returns The base64 encoded string
 */
function base64Encode(buf: any) {
  let string = '';
  (new Uint8Array(buf)).forEach(
    (byte) => { string += String.fromCharCode(byte) }
  )
  return btoa(string)
}

export { PlaceholderImageOptions, generatePlaceholderImage };
