import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class ReviewError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

interface ReviewInput {
  rating: number;
  title: string;
  body: string;
}

async function recomputeProductRating(tx: Prisma.TransactionClient, productId: string) {
  const agg = await tx.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await tx.product.update({
    where: { id: productId },
    data: {
      avgRating: agg._avg.rating ?? 0,
      reviewCount: agg._count.rating,
    },
  });
}

async function hasPurchased(userId: string, productId: string) {
  const count = await prisma.orderItem.count({
    where: { productId, order: { userId, status: { not: "CANCELLED" } } },
  });
  return count > 0;
}

export async function listReviews(productId: string, page = 1, pageSize = 5) {
  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { user: { select: { id: true, name: true } } },
    }),
    prisma.review.count({ where: { productId } }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getUserReviewForProduct(userId: string, productId: string) {
  return prisma.review.findUnique({ where: { productId_userId: { productId, userId } } });
}

export async function createReview(userId: string, productId: string, data: ReviewInput) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) throw new ReviewError("Product not found", 404);

  const existing = await getUserReviewForProduct(userId, productId);
  if (existing) throw new ReviewError("You've already reviewed this product", 409);

  const isVerifiedPurchase = await hasPurchased(userId, productId);

  return prisma.$transaction(async (tx) => {
    const created = await tx.review.create({
      data: { productId, userId, rating: data.rating, title: data.title, body: data.body, isVerifiedPurchase },
    });
    await recomputeProductRating(tx, productId);
    return created;
  });
}

export async function updateReview(userId: string, reviewId: string, data: Partial<ReviewInput>) {
  const existing = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!existing || existing.userId !== userId) throw new ReviewError("Review not found", 404);

  return prisma.$transaction(async (tx) => {
    const updated = await tx.review.update({ where: { id: reviewId }, data });
    await recomputeProductRating(tx, existing.productId);
    return updated;
  });
}

export async function deleteReview(userId: string, reviewId: string, isAdmin = false) {
  const existing = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!existing || (existing.userId !== userId && !isAdmin)) throw new ReviewError("Review not found", 404);

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id: reviewId } });
    await recomputeProductRating(tx, existing.productId);
  });
}
