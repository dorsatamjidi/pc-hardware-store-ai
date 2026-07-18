import Link from "next/link";
import Image from "next/image";
import type { Prisma } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/product/rating-stars";
import { CompareToggle } from "@/components/product/compare-toggle";
import { formatPrice } from "@/lib/format";

type Decimalish = Prisma.Decimal | number | string;

export interface ProductCardData {
  slug: string;
  name: string;
  type: string;
  price: Decimalish;
  compareAtPrice: Decimalish | null;
  avgRating: Decimalish;
  reviewCount: number;
  stockQuantity: number;
  brand: { name: string };
  images: { url: string; altText: string }[];
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0];
  const price = Number(product.price);
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const outOfStock = product.stockQuantity <= 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText}
              fill
              sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : null}
          {outOfStock ? (
            <Badge variant="secondary" className="absolute left-2 top-2">
              Out of stock
            </Badge>
          ) : null}
          {compareAtPrice ? (
            <Badge variant="destructive" className="absolute right-2 top-2">
              Sale
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <p className="text-xs font-medium text-muted-foreground">{product.brand.name}</p>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</h3>
          <div className="flex items-center gap-1.5">
            <RatingStars rating={Number(product.avgRating)} size={13} />
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
          <div className="mt-auto flex items-baseline gap-2 pt-1">
            <span className="font-semibold">{formatPrice(price)}</span>
            {compareAtPrice ? (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(compareAtPrice)}</span>
            ) : null}
          </div>
        </div>
      </Link>
      <div className="border-t border-border/60 px-3 py-2">
        <CompareToggle slug={product.slug} name={product.name} type={product.type} />
      </div>
    </div>
  );
}
