import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";
import { addItem, updateItemQuantity, removeItem, getCartSummary, CartError } from "@/server/cart/cart-service";
import { createTestUser } from "./setup/test-user";
import { FIXTURE } from "./setup/constants";

async function getFixtureProductId(slug: string) {
  const product = await prisma.product.findUniqueOrThrow({ where: { slug } });
  return product.id;
}

describe("cart-service (integration)", () => {
  it("adds an item and computes line totals from the live product price", async () => {
    const user = await createTestUser();
    const productId = await getFixtureProductId(FIXTURE.products.cpuAm5);

    const cart = await addItem(user.id, productId, 2);

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.items[0].unitPrice).toBe(300);
    expect(cart.items[0].lineTotal).toBe(600);
    expect(cart.totals.subtotal).toBe(600);
  });

  it("clamps quantity to available stock rather than overselling", async () => {
    const user = await createTestUser();
    const productId = await getFixtureProductId(FIXTURE.products.lowStock); // stock = 2

    const cart = await addItem(user.id, productId, 5);

    expect(cart.items[0].quantity).toBe(2);
  });

  it("accumulates quantity across repeated adds, still clamped to stock", async () => {
    const user = await createTestUser();
    const productId = await getFixtureProductId(FIXTURE.products.lowStock); // stock = 2

    await addItem(user.id, productId, 1);
    const cart = await addItem(user.id, productId, 1);

    expect(cart.items[0].quantity).toBe(2);
  });

  it("rejects adding a product with zero stock", async () => {
    const user = await createTestUser();
    const productId = await getFixtureProductId(FIXTURE.products.outOfStock);

    await expect(addItem(user.id, productId, 1)).rejects.toThrow(CartError);
  });

  it("removes an item when quantity is updated to 0", async () => {
    const user = await createTestUser();
    const productId = await getFixtureProductId(FIXTURE.products.cpuAm5);
    const added = await addItem(user.id, productId, 1);

    const cart = await updateItemQuantity(user.id, added.items[0].id, 0);

    expect(cart.items).toHaveLength(0);
  });

  it("flags hasIssues when a cart item's product goes out of stock after being added", async () => {
    const user = await createTestUser();
    const productId = await getFixtureProductId(FIXTURE.products.ramDdr5);
    await addItem(user.id, productId, 3);

    // Simulate the product selling out elsewhere after it was added to this cart.
    await prisma.product.update({ where: { id: productId }, data: { stockQuantity: 1 } });

    const summary = await getCartSummary(user.id);
    expect(summary.hasIssues).toBe(true);
    expect(summary.items[0].exceedsStock).toBe(true);

    // Restore fixture state for other tests.
    await prisma.product.update({ where: { id: productId }, data: { stockQuantity: 20 } });
  });

  it("removes an item entirely via removeItem", async () => {
    const user = await createTestUser();
    const productId = await getFixtureProductId(FIXTURE.products.cpuAm4);
    const added = await addItem(user.id, productId, 1);

    const cart = await removeItem(user.id, added.items[0].id);

    expect(cart.items).toHaveLength(0);
  });

  it("throws CartError (not a generic error) when removing another user's item", async () => {
    const userA = await createTestUser();
    const userB = await createTestUser();
    const productId = await getFixtureProductId(FIXTURE.products.cpuAm5);
    const added = await addItem(userA.id, productId, 1);

    await expect(removeItem(userB.id, added.items[0].id)).rejects.toThrow(CartError);
  });
});
