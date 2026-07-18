import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
  body: z.string().trim().min(10, "Review must be at least 10 characters").max(2000),
});

export const updateReviewSchema = createReviewSchema.partial();
