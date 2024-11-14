import { z } from "zod";

// example code
// otpauth://totp/OmegaLoveIssac:1?secret=AYPWCSJSIFLVYMD7&period=30&digits=6&algorithm=SHA1&issuer=OmegaLoveIssac

export const PlatformServicesSchema = z.object({
  issuer: z.string(),
  icon: z.optional(
    z.object({
      name: z.string(),
      color: z.string().optional(),
    })
  ),
  secret: z.string(),
  period: z.number(),
  digits: z.number(),
  algorithm: z.string(),
  otpType: z.string(),
  label: z.string(),
});

export type PlatformServices = z.infer<typeof PlatformServicesSchema>;
