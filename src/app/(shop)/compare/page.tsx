import Link from "next/link";
import { getProductsForCompare } from "@/server/catalog/compare";
import { CompareTable } from "@/components/product/compare-table";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Compare" };

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  const slugs = ids ? ids.split(",") : [];
  const { products, specKeys } = slugs.length > 0 ? await getProductsForCompare(slugs) : { products: [], specKeys: [] };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Compare</h1>

      {products.length === 0 ? (
        <EmptyState
          title="Nothing to compare yet"
          description="Browse the shop and check the “Compare” box on a couple of products in the same category to see them side by side here."
          action={
            <Link href="/products" className={buttonVariants()}>
              Browse products
            </Link>
          }
        />
      ) : products.length === 1 ? (
        <EmptyState
          title="Add one more product to compare"
          description="You need at least two products of the same category to see a comparison."
          action={
            <Link href="/products" className={buttonVariants()}>
              Browse products
            </Link>
          }
        />
      ) : (
        <CompareTable
          products={products.map((p) => ({ ...p, specs: p.specs as Record<string, unknown> }))}
          specKeys={specKeys}
        />
      )}
    </div>
  );
}
