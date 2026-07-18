export type Tier = "budget" | "mid" | "high" | "enthusiast";

/** Shared shape every per-category product entry extends. */
export interface BaseEntry {
  name: string;
  brand: string;
  tier: Tier;
  price: number;
  releaseYear: number;
}
