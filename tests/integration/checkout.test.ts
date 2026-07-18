import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";
import { addItem } from "@/server/cart/cart-service";
import { placeOrder, CheckoutError } from "@/server/orders/order-service";
import { createTestUser } from "./setup/test-user";
import { FIXTURE } from "./setup/constants";

async function getFixtureProductId(slug: string) {
  const product = await prisma.product.findUniqueOrThrow({ where: { slug } });
  return product.id;
}

async function createAddress(userId: string) {
  return prisma.address.create({
    data: {
      userId,
      label: "Home",
      fullName: "Test User",
      phone: "555-0100",
      line1: "1 Test Way",
      city: "Austin",
      state: "TX",
      postalCode: "73301",
      country: "USA",
      isDefault: true,
    },
  });
}

describe("placeOrder (integration)", () => {
  it("creates an order, decrements stock, and clears the cart on the happy path", async () => {
    const user = await createTestUser();
    const address = await createAddress(user.id);
    const productId = await getFixtureProductId(FIXTURE.products.cpuAm5);
    const productBefore = await prisma.product.findUniqueOrThrow({ where: { id: productId } });

    await addItem(user.id, productId, 2);
    const order = await placeOrder(user.id, address.id);

    expect(order.items).toHaveLength(1);
    expect(order.items[0].quantity).toBe(2);
    expect(Number(order.subtotal)).toBe(600);
    expect(order.orderNumber).toMatch(/^ORD-\d{8}-\d{4}$/);

    const productAfter = await prisma.product.findUniqueOrThrow({ where: { id: productId } });
    expect(productAfter.stockQuantity).toBe(productBefore.stockQuantity - 2);

    const cart = await prisma.cart.findUnique({ where: { userId: user.id }, include: { items: true } });
    expect(cart?.items).toHaveLength(0);

    // Restore fixture stock for other tests.
    await prisma.product.update({ where: { id: productId }, data: { stockQuantity: productBefore.stockQuantity } });
  });

  it("rejects checkout with an empty cart", async () => {
    const user = await createTestUser();
    const address = await createAddress(user.id);

    await expect(placeOrder(user.id, address.id)).rejects.toThrow(CheckoutError);
  });

  it("rejects checkout when stock became insufficient after the item was added to the cart", async () => {
    const user = await createTestUser();
    const address = await createAddress(user.id);
    const productId = await getFixtureProductId(FIXTURE.products.ramDdr5);

    await addItem(user.id, productId, 3);
    await prisma.product.update({ where: { id: productId }, data: { stockQuantity: 1 } });

    await expect(placeOrder(user.id, address.id)).rejects.toThrow(CheckoutError);

    await prisma.product.update({ where: { id: productId }, data: { stockQuantity: 20 } });
  });

  it("rejects checkout with an address that doesn't belong to the user", async () => {
    const userA = await createTestUser();
    const userB = await createTestUser();
    const addressB = await createAddress(userB.id);
    const productId = await getFixtureProductId(FIXTURE.products.cpuAm4);

    await addItem(userA.id, productId, 1);

    await expect(placeOrder(userA.id, addressB.id)).rejects.toThrow(CheckoutError);
  });
});
