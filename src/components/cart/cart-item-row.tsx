"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

/**
 * Quantity is intentionally NOT mirrored into local state — `item` always
 * comes fresh from the server via `router.refresh()` after each mutation, so
 * reading `item.quantity` directly avoids the prop/state desync that would
 * happen if the server clamps a value (e.g. to available stock) and a stale
 * local copy kept showing the pre-clamp number.
 */

export interface CartLineItem {
  id: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  isActive: boolean;
  availableStock: number;
  exceedsStock: boolean;
  product: {
    slug: string;
    name: string;
    brand: { name: string };
    images: { url: string; altText: string }[];
  };
}

export function CartItemRow({ item }: { item: CartLineItem }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isMutating, setIsMutating] = useState(false);
  const image = item.product.images[0];
  const quantity = item.quantity;
  const busy = isPending || isMutating;

  async function updateQuantity(next: number) {
    if (next < 0) return;
    setIsMutating(true);
    await fetch(`/api/cart/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: next }),
    });
    startTransition(() => router.refresh());
    setIsMutating(false);
  }

  async function handleRemove() {
    setIsMutating(true);
    await fetch(`/api/cart/items/${item.id}`, { method: "DELETE" });
    startTransition(() => router.refresh());
    setIsMutating(false);
  }

  return (
    <div className="flex gap-4 border-b border-border/60 py-4 last:border-none">
      <Link
        href={`/products/${item.product.slug}`}
        aria-hidden
        tabIndex={-1}
        className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted"
      >
        {image ? <Image src={image.url} alt="" fill sizes="80px" className="object-cover" /> : null}
      </Link>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground">{item.product.brand.name}</p>
            <Link href={`/products/${item.product.slug}`} className="font-medium hover:underline">
              {item.product.name}
            </Link>
          </div>
          <button
            onClick={handleRemove}
            disabled={busy}
            aria-label="Remove item"
            className="text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <X className="size-4" />
          </button>
        </div>

        {!item.isActive ? (
          <p className="text-xs text-destructive">This product is no longer available.</p>
        ) : item.exceedsStock ? (
          <p className="text-xs text-destructive">Only {item.availableStock} left — quantity adjusted.</p>
        ) : null}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-md border border-border/60">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={busy || quantity <= 1}
              onClick={() => updateQuantity(quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={busy || quantity >= item.availableStock}
              onClick={() => updateQuantity(quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="size-3" />
            </Button>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatPrice(item.unitPrice * quantity)}</p>
            {quantity > 1 ? <p className="text-xs text-muted-foreground">{formatPrice(item.unitPrice)} each</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
