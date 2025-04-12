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

export const Base64DecodeOptions = z.object({
    data: z.string().describe("The base64 encoded data to decode"),
});

export const Base64DecodeSchema = Base64DecodeOptions;

export async function decodeBase64(
  params: z.infer<typeof Base64DecodeSchema>
) {
  return decodeURIComponent(atob(params.data));
}
