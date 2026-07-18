import { Prisma, type ProductType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { embedText, toVectorLiteral } from "@/server/ai/embeddings/embedding-client";

export interface RetrievalFilters {
  type?: ProductType;
  priceMin?: number;
  priceMax?: number;
}

export interface RetrievedProduct {
  id: string;
  slug: string;
  name: string;
  type: ProductType;
  price: number;
  stockQuantity: number;
  brandName: string;
  categoryName: string;
  specs: Record<string, unknown>;
  description: string;
  similarity: number;
}

interface RetrievalRow {
  id: string;
  slug: string;
  name: string;
  type: ProductType;
  price: string;
  stockQuantity: number;
  brandName: string;
  categoryName: string;
  specs: unknown;
  description: string;
  distance: number;
}

/**
 * Hybrid search: embeds the query locally, then combines a pgvector cosine
 * ANN search (HNSW index on ProductEmbedding) with structured SQL filters in
 * a single query — e.g. "GPU under $500" narrows by type/price *and* ranks
 * by semantic similarity within that slice, rather than filtering after the
 * fact in application code.
 */
export async function retrieveRelevantProducts(
  semanticQuery: string,
  filters: RetrievalFilters = {},
  limit = 8,
): Promise<RetrievedProduct[]> {
  const vector = await embedText(semanticQuery);
  const vectorLiteral = toVectorLiteral(vector);

  const conditions: Prisma.Sql[] = [Prisma.sql`p."isActive" = true`];
  if (filters.type) conditions.push(Prisma.sql`p."type" = ${filters.type}::"ProductType"`);
  if (filters.priceMin !== undefined) conditions.push(Prisma.sql`p."price" >= ${filters.priceMin}`);
  if (filters.priceMax !== undefined) conditions.push(Prisma.sql`p."price" <= ${filters.priceMax}`);

  const whereClause = Prisma.join(conditions, " AND ");

  const rows = await prisma.$queryRaw<RetrievalRow[]>(Prisma.sql`
    SELECT p.id, p.slug, p.name, p.type, p.price::text as price, p."stockQuantity",
           b.name as "brandName", c.name as "categoryName", p.specs, p.description,
           (pe.embedding <=> ${vectorLiteral}::vector) as distance
    FROM "ProductEmbedding" pe
    JOIN "Product" p ON p.id = pe."productId"
    JOIN "Brand" b ON b.id = p."brandId"
    JOIN "Category" c ON c.id = p."categoryId"
    WHERE ${whereClause}
    ORDER BY distance ASC
    LIMIT ${limit}
  `);

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    type: r.type,
    price: Number(r.price),
    stockQuantity: r.stockQuantity,
    brandName: r.brandName,
    categoryName: r.categoryName,
    specs: r.specs as Record<string, unknown>,
    description: r.description,
    similarity: 1 - r.distance,
  }));
}
