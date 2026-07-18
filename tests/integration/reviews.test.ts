import { randomUUID } from "node:crypto";
import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";
import { createReview, updateReview, deleteReview, ReviewError } from "@/server/reviews/review-service";
import { createTestUser } from "./setup/test-user";
import { FIXTURE } from "./setup/constants";

/** A fresh product per test, so rating-aggregate assertions never see another test's reviews. */
async function createReviewableProduct() {
  const id = randomUUID();
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: FIXTURE.categorySlugs.cpu } });
  const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: FIXTURE.brandSlug } });

  return prisma.product.create({
    data: {
      slug: `test-reviewable-${id}`,
      sku: `TEST-REVIEWABLE-${id}`.toUpperCase(),
      name: "Reviewable Test Product",
      type: "CPU",
      categoryId: category.id,
      brandId: brand.id,
      description: "Fixture product for review tests.",
      shortDescription: "Fixture product.",
      price: 100,
      stockQuantity: 10,
      specs: {},
    },
  });
}

describe("review-service (integration)", () => {
  it("creates a review and recomputes the product's avgRating/reviewCount", async () => {
    const product = await createReviewableProduct();
    const user = await createTestUser();

    await createReview(user.id, product.id, { rating: 4, title: "Good", body: "Solid product, works as expected." });

    const updated = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    expect(Number(updated.avgRating)).toBe(4);
    expect(updated.reviewCount).toBe(1);
  });

  it("rejects a second review from the same user on the same product", async () => {
    const product = await createReviewableProduct();
    const user = await createTestUser();

    await createReview(user.id, product.id, { rating: 5, title: "First", body: "First review body text." });

    await expect(
      createReview(user.id, product.id, { rating: 1, title: "Second", body: "Trying again should fail." }),
    ).rejects.toThrow(ReviewError);
  });

  it("recomputes the average correctly across multiple reviewers", async () => {
    const product = await createReviewableProduct();
    const userA = await createTestUser();
    const userB = await createTestUser();

    await createReview(userA.id, product.id, { rating: 5, title: "A", body: "Review body from user A." });
    await createReview(userB.id, product.id, { rating: 3, title: "B", body: "Review body from user B." });

    const updated = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    expect(Number(updated.avgRating)).toBe(4); // (5+3)/2
    expect(updated.reviewCount).toBe(2);
  });

  it("updates a review and recomputes the aggregate", async () => {
    const product = await createReviewableProduct();
    const user = await createTestUser();
    const review = await createReview(user.id, product.id, { rating: 2, title: "Meh", body: "Wasn't great honestly." });

    await updateReview(user.id, review.id, { rating: 5 });

    const updated = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    expect(Number(updated.avgRating)).toBe(5);
  });

  it("rejects updating another user's review", async () => {
    const product = await createReviewableProduct();
    const owner = await createTestUser();
    const intruder = await createTestUser();
    const review = await createReview(owner.id, product.id, { rating: 3, title: "Mine", body: "This is my review." });

    await expect(updateReview(intruder.id, review.id, { rating: 1 })).rejects.toThrow(ReviewError);
  });

  it("deletes a review and reverts the aggregate", async () => {
    const product = await createReviewableProduct();
    const user = await createTestUser();
    const review = await createReview(user.id, product.id, { rating: 1, title: "Bad", body: "Did not work at all." });

    await deleteReview(user.id, review.id);

    const updated = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    expect(Number(updated.avgRating)).toBe(0);
    expect(updated.reviewCount).toBe(0);
  });

  it("rejects deleting another user's review unless admin", async () => {
    const product = await createReviewableProduct();
    const owner = await createTestUser();
    const intruder = await createTestUser();
    const review = await createReview(owner.id, product.id, { rating: 4, title: "Mine", body: "Another review body." });

    await expect(deleteReview(intruder.id, review.id, false)).rejects.toThrow(ReviewError);
  });
});
