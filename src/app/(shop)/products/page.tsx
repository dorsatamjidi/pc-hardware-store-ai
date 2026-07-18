import Link from "next/link";
import { searchProducts } from "@/server/catalog/search";
import { parseProductListParams } from "@/lib/validation/product";
import { prisma } from "@/lib/prisma";
import { FilterSidebar } from "@/components/product/filter-sidebar";
import { SortSelect } from "@/components/product/sort-select";
import { Pagination } from "@/components/product/pagination";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Shop" };

type SearchParamsInput = Record<string, string | string[] | undefined>;

function flattenParams(raw: SearchParamsInput): Record<string, string | undefined> {
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const rawParams = flattenParams(await searchParams);
  const params = parseProductListParams(rawParams);

  const [result, categories, brands] = await Promise.all([
    searchProducts(params),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { slug: true, name: true, _count: { select: { products: { where: { isActive: true } } } } },
    }),
    prisma.brand.findMany({
      where: params.category
        ? { products: { some: { isActive: true, category: { slug: params.category } } } }
        : { products: { some: { isActive: true } } },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar
          categories={categories.map((c) => ({ slug: c.slug, name: c.name, productCount: c._count.products }))}
          brands={brands}
        />
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {result.total} {result.total === 1 ? "result" : "results"}
              {params.q ? <> for &ldquo;{params.q}&rdquo;</> : null}
            </p>
            <SortSelect />
          </div>

          {result.items.length === 0 ? (
            <EmptyState
              title="No products match your filters"
              description="Try widening your price range or clearing a filter."
              action={
                <Link href="/products" className={buttonVariants({ variant: "outline", size: "sm" })}>
                  Clear all filters
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {result.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination
            pathname="/products"
            searchParams={rawParams}
            page={result.page}
            totalPages={result.totalPages}
          />
        </div>
      </div>
    </div>
  );
}
