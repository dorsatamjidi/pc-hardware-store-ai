import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCartSummary } from "@/server/cart/cart-service";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { OrderSummary } from "@/components/cart/order-summary";
import { EmptyState } from "@/components/ui/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Cart" };

export default async function CartPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/cart");

  const cart = await getCartSummary(session.user.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Your Cart</h1>

      {cart.items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Browse the shop to find components for your next build."
          action={
            <Link href="/products" className={buttonVariants()}>
              Browse products
            </Link>
          }
        />
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            {cart.items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
          <div>
            <OrderSummary {...cart.totals}>
              {cart.hasIssues ? (
                <p className="mb-3 text-xs text-destructive">
                  Resolve the issues above before checking out.
                </p>
              ) : null}
              {cart.hasIssues ? (
                <Button className="w-full" disabled>
                  Proceed to Checkout
                </Button>
              ) : (
                <Link href="/checkout" className={buttonVariants({ className: "w-full" })}>
                  Proceed to Checkout
                </Link>
              )}
            </OrderSummary>
          </div>
        </div>
      )}
    </div>
  );
}
