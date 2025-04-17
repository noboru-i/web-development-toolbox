import { z } from "zod";
import { createCanvas } from "canvas";

const PlaceholderImageOptions = z.object({
  width: z.number().min(1).describe("The width of the placeholder image in pixels"),
  height: z.number().min(1).describe("The height of the placeholder image in pixels"),
});

async function generatePlaceholderImage({
  width,
  height,
}: z.infer<typeof PlaceholderImageOptions>): Promise<string> {
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  // Fill the background with light gray color
  context.fillStyle = "#D3D3D3";
  context.fillRect(0, 0, width, height);

  // Set the text properties
  context.fillStyle = "#000000";
  context.font = "bold 20px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Draw the text in the center of the image
  const text = `${width} x ${height}`;
  context.fillText(text, width / 2, height / 2);

  // Convert the canvas to a PNG data URL
  return canvas.toDataURL("image/png");
}

export { PlaceholderImageOptions, generatePlaceholderImage };
