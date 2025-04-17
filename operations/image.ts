import { z } from "zod";
import { createCanvas } from "canvas";

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

async function generatePlaceholderImage({
  width,
  height,
}: z.infer<typeof PlaceholderImageOptions>): Promise<string> {
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  // Fill the background with light gray color
  context.fillStyle = "#D3D3D3";
  context.fillRect(0, 0, width, height);

  // Draw the text in the center of the image
  const fontSize = calculateFontSize(width, height);
  context.fillStyle = "#222222";
  context.font = `bold ${fontSize}px Arial`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  const text = `${width} x ${height}`;
  context.fillText(text, width / 2, height / 2);

  // Convert the canvas to a PNG data URL
  return canvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, "");
}

export { PlaceholderImageOptions, generatePlaceholderImage };
