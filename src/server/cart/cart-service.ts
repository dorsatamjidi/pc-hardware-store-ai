import { prisma } from "@/lib/prisma";
import { calculateTotals } from "@/server/cart/pricing";

class CartError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export { CartError };

async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.cart.create({ data: { userId } });
}

const cartItemInclude = {
  product: {
    include: {
      brand: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
  },
} as const;

export async function getCartSummary(userId: string) {
  const cart = await getOrCreateCart(userId);
  const items = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: cartItemInclude,
    orderBy: { createdAt: "asc" },
  });

  let subtotal = 0;
  const lines = items.map((item) => {
    const unitPrice = Number(item.product.price);
    const lineTotal = Math.round(unitPrice * item.quantity * 100) / 100;
    subtotal += lineTotal;
    const availableStock = item.product.stockQuantity;
    return {
      id: item.id,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
      isActive: item.product.isActive,
      availableStock,
      exceedsStock: item.quantity > availableStock,
      product: {
        slug: item.product.slug,
        name: item.product.name,
        brand: item.product.brand,
        images: item.product.images,
      },
    };
  });

  const totals = calculateTotals(subtotal);
  const hasIssues = lines.some((l) => !l.isActive || l.exceedsStock);

  return { cartId: cart.id, items: lines, totals, hasIssues };
}

export async function addItem(userId: string, productId: string, quantity: number) {
  if (quantity <= 0) throw new CartError("Quantity must be at least 1");

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) throw new CartError("Product not found", 404);
  if (product.stockQuantity <= 0) throw new CartError("This product is out of stock");

  const cart = await getOrCreateCart(userId);
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  const desiredQuantity = (existing?.quantity ?? 0) + quantity;
  const clampedQuantity = Math.min(desiredQuantity, product.stockQuantity);

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: clampedQuantity, unitPriceSnapshot: product.price },
    create: { cartId: cart.id, productId, quantity: clampedQuantity, unitPriceSnapshot: product.price },
  });

  return getCartSummary(userId);
}

export async function updateItemQuantity(userId: string, itemId: string, quantity: number) {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true, product: true } });
  if (!item || item.cart.userId !== userId) throw new CartError("Cart item not found", 404);

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return getCartSummary(userId);
  }

  const clampedQuantity = Math.min(quantity, item.product.stockQuantity);
  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: clampedQuantity, unitPriceSnapshot: item.product.price },
  });

  return getCartSummary(userId);
}

export async function removeItem(userId: string, itemId: string) {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } });
  if (!item || item.cart.userId !== userId) throw new CartError("Cart item not found", 404);

  await prisma.cartItem.delete({ where: { id: itemId } });
  return getCartSummary(userId);
}

export async function clearCart(userId: string) {
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return getCartSummary(userId);
}

export async function getCartItemCount(userId: string): Promise<number> {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return 0;
  const result = await prisma.cartItem.aggregate({ where: { cartId: cart.id }, _sum: { quantity: true } });
  return result._sum.quantity ?? 0;
}
