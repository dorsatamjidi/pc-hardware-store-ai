import { prisma } from "@/lib/prisma";

export const MAX_COMPARE = 4;

export async function getProductsForCompare(slugs: string[]) {
  const trimmed = slugs.map((s) => s.trim()).filter(Boolean).slice(0, MAX_COMPARE);
  if (trimmed.length === 0) return { products: [], specKeys: [] };

  const products = await prisma.product.findMany({
    where: { slug: { in: trimmed }, isActive: true },
    include: {
      brand: { select: { name: true, slug: true } },
      category: { select: { name: true, slug: true } },
      images: { where: { isPrimary: true }, take: 1 },
      compatibility: true,
    },
  });

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const ordered = trimmed.map((slug) => bySlug.get(slug)).filter((p): p is NonNullable<typeof p> => p !== undefined);

  const specKeys = Array.from(
    new Set(ordered.flatMap((p) => Object.keys(p.specs as Record<string, unknown>))),
  );

  return { products: ordered, specKeys };
}
