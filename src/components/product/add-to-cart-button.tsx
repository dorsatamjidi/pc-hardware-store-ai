"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AddToCartButton({
  productId,
  isLoggedIn,
  outOfStock,
  className,
}: {
  productId: string;
  isLoggedIn: boolean;
  outOfStock: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setIsSubmitting(true);
    const response = await fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    setIsSubmitting(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error || "Couldn't add this to your cart.");
      return;
    }

    toast.success("Added to cart");
    router.refresh();
  }

  if (outOfStock) {
    return (
      <Button size="lg" disabled className={className}>
        Out of Stock
      </Button>
    );
  }

  return (
    <Button size="lg" onClick={handleClick} disabled={isSubmitting} className={className}>
      {isSubmitting ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
