import { z } from "zod";

export const compatibilityCheckSchema = z.object({
  cpu: z.string().optional(),
  motherboard: z.string().optional(),
  ram: z.string().optional(),
  ramQuantity: z.coerce.number().int().min(1).max(8).optional(),
  gpu: z.string().optional(),
  psu: z.string().optional(),
  case: z.string().optional(),
  cooler: z.string().optional(),
  storage: z.string().optional(),
  storageQuantity: z.coerce.number().int().min(1).max(8).optional(),
});

export type CompatibilityCheckInput = z.infer<typeof compatibilityCheckSchema>;
