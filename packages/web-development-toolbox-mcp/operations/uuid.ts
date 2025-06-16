import { z } from "zod";
import { v4, v7 } from "uuid";

const UUIDGenerateOptions = z.object({});

export const UUIDGenerateSchema = UUIDGenerateOptions;

export async function generateUUID(params: z.infer<typeof UUIDGenerateSchema>) {
  return {
    v4: v4(),
    v7: v7(),
  };
}
