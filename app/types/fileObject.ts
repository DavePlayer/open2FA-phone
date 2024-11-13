import { z } from "zod";
import { PlatformServicesSchema } from "./services";
import { SettingsSchema } from "./settings";

export const FileSchema = z.object({
  platforms: z.array(PlatformServicesSchema),
  settings: z.optional(SettingsSchema),
});

export type FileObject = z.infer<typeof FileSchema>;
