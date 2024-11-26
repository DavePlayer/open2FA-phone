import { z } from "zod";

export const SettingsSchema = z.object({
  fileName: z.optional(z.string()),
});

export type Settings = z.infer<typeof SettingsSchema>;
