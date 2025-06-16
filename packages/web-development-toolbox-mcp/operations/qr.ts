import { z } from "zod";
import qr from "qr-image";
import { Readable } from "stream";
import * as jsQR from "jsqr";
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

    return Buffer.concat(chunks).toString("base64");
  } catch (error) {
    throw new Error(`Failed to generate QR Code: ${(error as Error).message}`);
  }
}

export const QRCodeDecodeSchema = z.object({
  mimeType: z
    .string()
    .min(1)
    .describe("Image MIME type (e.g., image/jpeg, image/png)"),
  base64image: z.string().min(1).describe("Base64 encoded image data"),
});

export async function decodeQRCode({
  base64image,
  mimeType,
}: z.infer<typeof QRCodeDecodeSchema>): Promise<string> {
  try {
    // Process Base64 data (remove prefix if present)
    let base64Data = base64image;
    if (base64Data.includes(",")) {
      base64Data = base64Data.split(",")[1];
    }

    console.error(
      `デコード処理開始: MIMEタイプ=${mimeType}, Base64長=${base64Data.length}`
    );

    // return `デコード処理開始: MIMEタイプ=${mimeType}, Base64長=${base64Data.length}`;

    try {
      const buffer = Buffer.from(base64Data, "base64");

      // PNGファイル形式の確認
      if (!buffer || buffer.length < 8) {
        throw new Error("無効な画像データです。データ長が不十分です。");
      }

      console.error(`バッファ作成成功: サイズ=${buffer.length}バイト`);

      let png;
      try {
        png = PNG.sync.read(buffer);
        console.error(`PNG読み込み成功: 幅=${png.width}, 高さ=${png.height}`);
      } catch (pngError) {
        console.error(`PNG読み込みエラー: ${(pngError as Error).message}`);
        throw new Error(
          `PNG画像の解析に失敗しました: ${(pngError as Error).message}`
        );
      }

      const code = jsQR.default.default(
        Uint8ClampedArray.from(png.data),
        png.width,
        png.height
      );

      if (code) {
        console.error(
          `QRコードデコード成功: データ=${code.data.substring(0, 20)}...`
        );
        return code.data;
      } else {
        console.error(
          "QRコードが検出されませんでした。画像にQRコードが含まれていない可能性があります。"
        );
        throw new Error("QRコードが検出されませんでした");
      }
    } catch (innerError) {
      console.error(`内部処理エラー: ${(innerError as Error).message}`);
      throw innerError;
    }
  } catch (error) {
    console.error(`QRコードデコードエラー: ${(error as Error).message}`);
    throw new Error(`Failed to decode QR Code: ${(error as Error).message}`);
  }
}
