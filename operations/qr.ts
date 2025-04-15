import { z } from "zod";
import qr from "qr-image";
import { Readable } from "stream";
import jsQR from "jsqr";
import { PNG } from "pngjs";

export const QRCodeGenerateSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

export async function generateQRCode({
  text,
}: z.infer<typeof QRCodeGenerateSchema>): Promise<string> {
  try {
    const qrSvgStream = qr.image(text, { type: "png" });
    const chunks: Buffer[] = [];

    for await (const chunk of qrSvgStream as Readable) {
      chunks.push(Buffer.from(chunk));
    }

    const base64String = Buffer.concat(chunks).toString("base64");
    console.error("base64String is ${base64String}");
    return base64String;
  } catch (error) {
    throw new Error(`Failed to generate QR Code: ${(error as Error).message}`);
  }
}

export const QRCodeDecodeSchema = z.object({
  base64image: z.string().min(1, "Base64 image is required"),
});

export async function decodeQRCode({
  base64image,
}: z.infer<typeof QRCodeDecodeSchema>): Promise<string> {
  try {
    const buffer = Buffer.from(base64image, "base64");
    const png = PNG.sync.read(buffer);
    const code = jsQR.default(
      Uint8ClampedArray.from(png.data),
      png.width,
      png.height
    );

    if (code) {
      return code.data;
    } else {
      throw new Error("Failed to decode QR Code");
    }
  } catch (error) {
    throw new Error(`Failed to decode QR Code: ${(error as Error).message}`);
  }
}
