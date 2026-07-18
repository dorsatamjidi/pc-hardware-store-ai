import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCartSummary } from "@/server/cart/cart-service";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/checkout");

  const cart = await getCartSummary(session.user.id);

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState
          title="Your cart is empty"
          description="Add something to your cart before checking out."
          action={
            <Link href="/products" className={buttonVariants()}>
              Browse products
            </Link>
          }
        />
      </div>
    );
  }

  if (cart.hasIssues) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState
          title="Your cart needs attention"
          description="Some items in your cart are out of stock or no longer available. Go back to your cart to resolve this before checking out."
          action={
            <Link href="/cart" className={buttonVariants()}>
              Go to cart
            </Link>
          }
        />
      </div>
    );
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Checkout</h1>
      <CheckoutForm addresses={addresses} totals={cart.totals} />
    </div>
  );
}
