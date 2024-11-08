import { z } from "zod";

export const PlatformServicesSchema = z.object({
  name: z.string(),
  icon: z.object({
    name: z.string(),
    color: z.string().optional(),
  }),
  hash: z.string(),
});

export type PlatformServices = z.infer<typeof PlatformServicesSchema>;
