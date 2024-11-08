import { z } from "zod";

export const SettingsSchema = z.object({
  test: z.string(),
});

export type Settings = z.infer<typeof SettingsSchema>;
