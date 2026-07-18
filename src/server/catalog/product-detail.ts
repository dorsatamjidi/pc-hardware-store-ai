import { prisma } from "@/lib/prisma";

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      compatibility: true,
    },
  });

  if (!product || !product.isActive) return null;
  return product;
}

export async function getRecentReviews(productId: string, limit = 5) {
  return prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { name: true } } },
  });
}

export async function getRatingBreakdown(productId: string) {
  const grouped = await prisma.review.groupBy({
    by: ["rating"],
    where: { productId },
    _count: { rating: true },
  });

  const breakdown = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: grouped.find((g) => g.rating === rating)?._count.rating ?? 0,
  }));

  const total = breakdown.reduce((sum, b) => sum + b.count, 0);
  return { breakdown, total };
}

export async function getRelatedProducts(categoryId: string, excludeProductId: string, limit = 4) {
  return prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: excludeProductId } },
    orderBy: [{ avgRating: "desc" }, { reviewCount: "desc" }],
    take: limit,
    include: {
      brand: { select: { name: true, slug: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
  });
}
