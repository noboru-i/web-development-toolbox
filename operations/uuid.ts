import { z } from "zod";
import { v4, v7 } from "uuid";

const UUIDGenerateOptions = z.object({
  version: z.enum(["v4", "v7"]).describe("The version of UUID to generate"),
});

const UUIDGenerateSchema = UUIDGenerateOptions;

export async function generateUUID(params: z.infer<typeof UUIDGenerateSchema>) {
  switch (params.version) {
    case "v4":
      return v4();
    case "v7":
      return v7();
    default:
      throw new Error(`Unsupported UUID version: ${params.version}`);
  }
}
