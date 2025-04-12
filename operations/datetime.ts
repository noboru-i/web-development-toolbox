import { z } from "zod";

export const UnixToISOOptions = z.object({
  datetime: z
    .number()
    .describe("The Unix timestamp to convert to ISO 8601 format"),
});

export const UnixToISOSchema = UnixToISOOptions;

export async function unixToISO(params: z.infer<typeof UnixToISOSchema>) {
  const date = new Date(params.datetime * 1000); // Convert seconds to milliseconds
  return date.toISOString();
}

export const ISOToUnixOptions = z.object({
  isoString: z
    .string()
    .describe("The ISO 8601 string to convert to Unix timestamp"),
});

export const ISOToUnixSchema = ISOToUnixOptions;

export async function isoToUnix(params: z.infer<typeof ISOToUnixSchema>) {
  const date = new Date(params.isoString);
  return Math.floor(date.getTime() / 1000); // Convert milliseconds to seconds
}
