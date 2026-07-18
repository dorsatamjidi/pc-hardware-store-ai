import Image from "next/image";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { RatingStars } from "@/components/product/rating-stars";
import { humanizeKey, humanizeValue, formatPrice } from "@/lib/format";

type Decimalish = Prisma.Decimal | number | string;

export interface CompareProduct {
  id: string;
  slug: string;
  name: string;
  price: Decimalish;
  avgRating: Decimalish;
  reviewCount: number;
  specs: Record<string, unknown>;
  brand: { name: string };
  images: { url: string; altText: string }[];
}

export function CompareTable({ products, specKeys }: { products: CompareProduct[]; specKeys: string[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-40 p-3 text-left align-bottom text-muted-foreground"></th>
            {products.map((p) => {
              const image = p.images[0];
              return (
                <th key={p.id} className="p-3 text-left align-bottom">
                  <Link href={`/products/${p.slug}`} className="flex flex-col gap-2">
                    <div className="relative aspect-square w-full max-w-32 overflow-hidden rounded-md bg-muted">
                      {image ? <Image src={image.url} alt={image.altText} fill sizes="128px" className="object-cover" /> : null}
                    </div>
                    <div>
                      <p className="text-xs font-normal text-muted-foreground">{p.brand.name}</p>
                      <p className="font-medium leading-snug">{p.name}</p>
                    </div>
                  </Link>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-border/60">
            <td className="p-3 font-medium text-muted-foreground">Price</td>
            {products.map((p) => (
              <td key={p.id} className="p-3 font-semibold">
                {formatPrice(p.price)}
              </td>
            ))}
          </tr>
          <tr className="border-t border-border/60">
            <td className="p-3 font-medium text-muted-foreground">Rating</td>
            {products.map((p) => (
              <td key={p.id}>
                <div className="flex items-center gap-1.5 p-3">
                  <RatingStars rating={Number(p.avgRating)} size={13} />
                  <span className="text-xs text-muted-foreground">({p.reviewCount})</span>
                </div>
              </td>
            ))}
          </tr>
          {specKeys.map((key) => {
            const values = products.map((p) => JSON.stringify(p.specs[key] ?? null));
            const differs = new Set(values).size > 1;
            return (
              <tr key={key} className="border-t border-border/60">
                <td className="p-3 font-medium text-muted-foreground">{humanizeKey(key)}</td>
                {products.map((p) => (
                  <td key={p.id} className={differs ? "bg-amber-500/10 p-3 font-medium" : "p-3"}>
                    {humanizeValue(p.specs[key])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
