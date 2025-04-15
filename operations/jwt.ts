import { z } from "zod";

export const JWTDecodeOptions = z.object({
  token: z.string().describe("The JWT token to decode"),
});

export async function decodeJWT(params: z.infer<typeof JWTDecodeOptions>) {
  const [header, payload, signature] = params.token.split(".");

  const decodedHeader = JSON.parse(Buffer.from(header, "base64").toString());
  const decodedPayload = JSON.parse(Buffer.from(payload, "base64").toString());

  return {
    header: decodedHeader,
    payload: decodedPayload,
    signature: signature ? signature : null,
  };
}

export { JWTDecodeOptions };
