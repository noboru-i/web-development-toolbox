import { z } from "zod";
import qr from "qr-image";
import { Readable } from "stream";

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

    return Buffer.concat(chunks).toString("base64");
  } catch (error) {
    throw new Error(`Failed to generate QR Code: ${(error as Error).message}`);
  }
}
