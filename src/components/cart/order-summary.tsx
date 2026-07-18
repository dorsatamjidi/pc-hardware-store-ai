import { formatPrice } from "@/lib/format";

export function OrderSummary({
  subtotal,
  shippingCost,
  tax,
  total,
  children,
}: {
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border/60 p-4">
      <h2 className="mb-3 font-semibold">Order Summary</h2>
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Tax</dt>
          <dd>{formatPrice(tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-border/60 pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
