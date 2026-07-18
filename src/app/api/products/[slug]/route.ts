import { NextResponse } from "next/server";
import { getProductBySlug, getRatingBreakdown, getRecentReviews } from "@/server/catalog/product-detail";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const [ratingBreakdown, recentReviews] = await Promise.all([
    getRatingBreakdown(product.id),
    getRecentReviews(product.id),
  ]);

  return NextResponse.json({ product, ratingBreakdown, recentReviews });
}
