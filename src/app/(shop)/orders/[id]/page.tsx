import Image from "next/image";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrderById } from "@/server/orders/order-service";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderSummary } from "@/components/cart/order-summary";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Order Details" };

interface ShippingAddressSnapshot {
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ confirmed?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const { confirmed } = await searchParams;
  const order = await getOrderById(id, session.user.id);
  if (!order) notFound();

  const address = order.shippingAddressSnapshot as unknown as ShippingAddressSnapshot;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {confirmed ? (
        <div className="mb-6 rounded-lg border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          Thanks — your order has been placed!
        </div>
      ) : null}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on{" "}
            {new Date(order.placedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="mb-3 font-semibold">Items</h2>
          <div className="flex flex-col gap-4">
            {order.items.map((item) => {
              const image = item.product.images[0];
              return (
                <div key={item.id} className="flex gap-4 border-b border-border/60 pb-4 last:border-none">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    {image ? <Image src={image.url} alt={item.productNameSnapshot} fill sizes="64px" className="object-cover" /> : null}
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <Link href={`/products/${item.product.slug}`} className="font-medium hover:underline">
                        {item.productNameSnapshot}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.unitPrice)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">{formatPrice(item.lineTotal)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="mb-3 mt-8 font-semibold">Shipping Address</h2>
          <div className="rounded-lg border border-border/60 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{address.fullName}</p>
            <p>{address.line1}{address.line2 ? <>, {address.line2}</> : null}</p>
            <p>
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p>{address.country}</p>
            <p>{address.phone}</p>
          </div>
        </div>

        <div>
          <OrderSummary
            subtotal={Number(order.subtotal)}
            shippingCost={Number(order.shippingCost)}
            tax={Number(order.tax)}
            total={Number(order.total)}
          />
        </div>
      </div>
    </div>
  );
}
