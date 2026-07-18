import { z } from "zod";

const COMPONENT_SLOT_VALUES = [
  "CPU",
  "MOTHERBOARD",
  "RAM",
  "GPU",
  "STORAGE",
  "PSU",
  "CASE",
  "COOLER",
] as const;

export const builderActionSchema = z.object({
  buildId: z.string().optional(),
  action: z.enum(["add", "remove", "reset", "suggest_next"]),
  componentType: z.enum(COMPONENT_SLOT_VALUES).optional(),
  productId: z.string().optional(),
  quantity: z.coerce.number().int().min(1).max(8).optional(),
});
