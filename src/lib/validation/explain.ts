import { z } from "zod";

export const explainSchema = z.union([
  z.object({ term: z.string().trim().min(1).max(200) }),
  z.object({ productId: z.string().min(1), field: z.string().min(1).max(100) }),
]);

export type ExplainInput = z.infer<typeof explainSchema>;
