import { z } from "zod";
import qr from "qr-image";
import { Readable } from "stream";
import jsQR from "jsqr";

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
  imageData: z.string().min(1, "Image data is required"),
});

export async function decodeQRCode({
  imageData,
}: z.infer<typeof QRCodeDecodeSchema>): Promise<string> {
  try {
    const buffer = Buffer.from(imageData, "base64");
    const uint8Array = new Uint8Array(buffer);
    const image = jsQR(uint8Array, 256, 256); // Assuming the image is 256x256

    if (image) {
      return image.data;
    } else {
      throw new Error("Failed to decode QR Code");
    }
  } catch (error) {
    throw new Error(`Failed to decode QR Code: ${(error as Error).message}`);
  }
}
