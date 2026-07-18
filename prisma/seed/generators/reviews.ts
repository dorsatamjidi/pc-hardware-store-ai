import type { Rng } from "./rng";
import { reviewTemplates } from "../data/reviews";

export interface GeneratedReview {
  userId: string;
  rating: number;
  title: string;
  body: string;
  isVerifiedPurchase: boolean;
  createdAt: Date;
}

const RATING_WEIGHTS: Array<{ rating: number; weight: number }> = [
  { rating: 5, weight: 0.45 },
  { rating: 4, weight: 0.33 },
  { rating: 3, weight: 0.13 },
  { rating: 2, weight: 0.06 },
  { rating: 1, weight: 0.03 },
];

function pickRating(rng: Rng): number {
  const roll = rng.next();
  let cumulative = 0;
  for (const { rating, weight } of RATING_WEIGHTS) {
    cumulative += weight;
    if (roll <= cumulative) return rating;
  }
  return RATING_WEIGHTS[0].rating;
}

export function generateReviews(
  rng: Rng,
  productName: string,
  reviewerUserIds: string[],
  count: number,
  releaseYear: number,
): GeneratedReview[] {
  const reviewerPool = rng.pickMultiple(reviewerUserIds, Math.min(count, reviewerUserIds.length));
  const yearsOld = Math.max(1, new Date().getFullYear() - releaseYear + 1);
  const maxAgeDays = Math.min(yearsOld * 365, 540);

  return reviewerPool.map((userId) => {
    const rating = pickRating(rng);
    const template = reviewTemplates.find((t) => rating >= t.minRating && rating <= t.maxRating)!;
    const title = rng.pick(template.titles);
    const body = rng.pick(template.bodies).replaceAll("{name}", productName);
    return {
      userId,
      rating,
      title,
      body,
      isVerifiedPurchase: rng.bool(0.7),
      createdAt: rng.daysAgo(maxAgeDays),
    };
  });
}
