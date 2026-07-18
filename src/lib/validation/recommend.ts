import { z } from "zod";

export const recommendRequestSchema = z.object({
  useCase: z.enum(["gaming", "office", "ai_workstation", "video_editing", "programming", "home_server"]),
  budget: z.coerce.number().min(200, "Budget must be at least $200").max(20000),
  preferences: z.string().max(300).optional(),
});
