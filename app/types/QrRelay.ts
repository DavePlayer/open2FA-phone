import { z } from "zod";
import { PlatformServiceSchema } from "./services";
import { SettingsSchema } from "./settings";

export const QrRelaySchema = z.object({
  relayUrl: z.string(),
  publicKey: z.string(),
  websocketId: z.string(),
  issuer: z.string(),
  label: z.string(),
});

export type QrRelayData = z.infer<typeof QrRelaySchema>;
