import { z } from "zod";

export const Base64EncodeOptions = z.object({
    data: z.string().describe("The data to encode in base64"),
    });

export const Base64EncodeSchema = Base64EncodeOptions;

export async function encodeBase64(
  params: z.infer<typeof Base64EncodeSchema>
) {
  return btoa(encodeURIComponent(params.data));
}
