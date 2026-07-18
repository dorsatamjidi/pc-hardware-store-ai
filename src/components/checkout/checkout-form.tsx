"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { OrderSummary } from "@/components/cart/order-summary";

export interface CheckoutAddress {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export function CheckoutForm({
  addresses,
  totals,
}: {
  addresses: CheckoutAddress[];
  totals: { subtotal: number; shippingCost: number; tax: number; total: number };
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handlePlaceOrder() {
    if (!selectedId) {
      setError("Select a shipping address.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addressId: selectedId }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(data?.error || "Checkout failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    router.push(`/orders/${data.order.id}?confirmed=1`);
    router.refresh();
  }

  if (addresses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-6 text-center">
        <p className="mb-3 text-sm text-muted-foreground">
          You don&apos;t have a shipping address saved yet.
        </p>
        <Link href="/account/addresses" className={buttonVariants()}>
          Add an address
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="flex flex-col gap-3 md:col-span-2">
        <h2 className="font-semibold">Shipping Address</h2>
        {addresses.map((address) => (
          <label
            key={address.id}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 p-4 has-checked:border-primary"
          >
            <input
              type="radio"
              name="address"
              className="mt-1"
              checked={selectedId === address.id}
              onChange={() => setSelectedId(address.id)}
            />
            <div className="text-sm">
              <p className="font-medium">{address.label}</p>
              <p className="text-muted-foreground">
                {address.fullName}
                <br />
                {address.line1}
                {address.line2 ? <>, {address.line2}</> : null}
                <br />
                {address.city}, {address.state} {address.postalCode}
                <br />
                {address.country}
              </p>
            </div>
          </label>
        ))}
        <Link href="/account/addresses" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          Manage addresses
        </Link>
      </div>
      <div>
        <OrderSummary {...totals}>
          {error ? <p className="mb-3 text-sm text-destructive">{error}</p> : null}
          <Button className="w-full" onClick={handlePlaceOrder} disabled={isSubmitting}>
            {isSubmitting ? "Placing order..." : "Place Order"}
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Simulated checkout — no real payment is processed.
          </p>
        </OrderSummary>
      </div>
    </div>
  );
}
