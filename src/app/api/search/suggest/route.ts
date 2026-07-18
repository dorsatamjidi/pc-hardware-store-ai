import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface SuggestRow {
  slug: string;
  name: string;
  type: string;
  price: string;
  imageUrl: string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ suggestions: [] });

  // Uses the pg_trgm GIN index on Product.name for fast fuzzy/substring matching,
  // ranked by similarity() rather than a plain ILIKE scan.
  const rows = await prisma.$queryRaw<SuggestRow[]>`
    SELECT p.slug, p.name, p.type, p.price::text as price, pi.url as "imageUrl"
    FROM "Product" p
    LEFT JOIN "ProductImage" pi ON pi."productId" = p.id AND pi."isPrimary" = true
    WHERE p."isActive" = true AND (p.name ILIKE ${"%" + q + "%"} OR similarity(p.name, ${q}) > 0.2)
    ORDER BY similarity(p.name, ${q}) DESC, p."reviewCount" DESC
    LIMIT 8
  `;

  return NextResponse.json({
    suggestions: rows.map((r) => ({ ...r, price: Number(r.price) })),
  });
}
