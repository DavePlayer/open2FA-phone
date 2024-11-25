import { z } from "zod";
import { PlatformServiceSchema } from "./services";
import { SettingsSchema } from "./settings";

export const FileSchema = z.object({
  platforms: z.array(PlatformServiceSchema),
  settings: z.optional(SettingsSchema),
});

export type FileObject = z.infer<typeof FileSchema>;
