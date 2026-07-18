import { prisma } from "@/lib/prisma";
import { calculateTotals } from "@/server/cart/pricing";

export class CheckoutError extends Error {
  status: number;
  issues?: unknown;
  constructor(message: string, status = 400, issues?: unknown) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

function formatOrderNumber(sequenceToday: number): string {
  const now = new Date();
  const yyyymmdd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return `ORD-${yyyymmdd}-${String(sequenceToday).padStart(4, "0")}`;
}

export async function placeOrder(userId: string, addressId: string) {
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== userId) {
    throw new CheckoutError("Shipping address not found", 404);
  }

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new CheckoutError("Your cart is empty");

  const items = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: { product: true },
  });
  if (items.length === 0) throw new CheckoutError("Your cart is empty");

  const problems = items
    .filter((item) => !item.product.isActive || item.quantity > item.product.stockQuantity)
    .map((item) => ({
      productId: item.productId,
      name: item.product.name,
      reason: !item.product.isActive ? "no longer available" : "insufficient stock",
      availableStock: item.product.stockQuantity,
    }));
  if (problems.length > 0) {
    throw new CheckoutError("Some items in your cart are no longer available as listed", 409, problems);
  }

  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const totals = calculateTotals(subtotal);

  const order = await prisma.$transaction(async (tx) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const ordersToday = await tx.order.count({ where: { placedAt: { gte: startOfDay } } });
    const orderNumber = formatOrderNumber(ordersToday + 1);

    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        status: "CONFIRMED",
        subtotal: totals.subtotal,
        shippingCost: totals.shippingCost,
        tax: totals.tax,
        total: totals.total,
        shippingAddressSnapshot: {
          label: address.label,
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            productNameSnapshot: item.product.name,
            unitPrice: item.product.price,
            quantity: item.quantity,
            lineTotal: Math.round(Number(item.product.price) * item.quantity * 100) / 100,
          })),
        },
      },
      include: { items: true },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return createdOrder;
  });

  return order;
}

export async function listOrders(userId: string, page = 1, pageSize = 10) {
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { placedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { items: true },
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getOrderById(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: { select: { slug: true, images: { where: { isPrimary: true }, take: 1 } } } } } },
  });

  if (!order || order.userId !== userId) return null;
  return order;
}
