import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProductBySlug, getRatingBreakdown, getRelatedProducts } from "@/server/catalog/product-detail";
import { listReviews, getUserReviewForProduct } from "@/server/reviews/review-service";
import { RatingStars } from "@/components/product/rating-stars";
import { SpecTable } from "@/components/product/spec-table";
import { ProductCard } from "@/components/product/product-card";
import { CompareToggle } from "@/components/product/compare-toggle";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ReviewForm } from "@/components/reviews/review-form";
import { Pagination } from "@/components/product/pagination";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product not found" };
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ reviewPage?: string }>;
}) {
  const { slug } = await params;
  const { reviewPage } = await searchParams;
  const [product, session] = await Promise.all([getProductBySlug(slug), auth()]);
  if (!product) notFound();

  const page = Number(reviewPage) || 1;

  const [ratingBreakdown, reviewsResult, relatedProducts, userReview] = await Promise.all([
    getRatingBreakdown(product.id),
    listReviews(product.id, page, 5),
    getRelatedProducts(product.categoryId, product.id),
    session?.user ? getUserReviewForProduct(session.user.id, product.id) : Promise.resolve(null),
  ]);

  const otherReviews = session?.user
    ? reviewsResult.items.filter((r) => r.userId !== session.user.id)
    : reviewsResult.items;

  const price = Number(product.price);
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const outOfStock = product.stockQuantity <= 0;
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];

  const compatibilityEntries = product.compatibility
    ? Object.entries(product.compatibility).filter(
        ([key, value]) =>
          !["id", "productId"].includes(key) && value !== null && !(Array.isArray(value) && value.length === 0),
      )
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/products" className="hover:text-foreground">
          Shop
        </Link>
        {" / "}
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-foreground">
          {product.category.name}
        </Link>
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
          {primaryImage ? (
            <Image src={primaryImage.url} alt={primaryImage.altText} fill sizes="(min-width: 768px) 480px, 100vw" className="object-cover" />
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{product.brand.name}</p>
            <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
          </div>

          <div className="flex items-center gap-2">
            <RatingStars rating={Number(product.avgRating)} />
            <span className="text-sm text-muted-foreground">
              {Number(product.avgRating).toFixed(1)} ({product.reviewCount} review{product.reviewCount === 1 ? "" : "s"})
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatPrice(price)}</span>
            {compareAtPrice ? (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(compareAtPrice)}</span>
            ) : null}
          </div>

          <div>
            {outOfStock ? (
              <Badge variant="secondary">Out of stock</Badge>
            ) : product.stockQuantity <= 5 ? (
              <Badge variant="destructive">Only {product.stockQuantity} left</Badge>
            ) : (
              <Badge variant="outline">In stock</Badge>
            )}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <AddToCartButton
              productId={product.id}
              isLoggedIn={!!session?.user}
              outOfStock={outOfStock}
              className="flex-1"
            />
            <div className="flex items-center justify-center rounded-md border border-border/60 px-4">
              <CompareToggle slug={product.slug} name={product.name} type={product.type} />
            </div>
          </div>

          {compatibilityEntries.length > 0 ? (
            <div>
              <h2 className="mb-2 text-sm font-semibold">Compatibility</h2>
              <SpecTable specs={Object.fromEntries(compatibilityEntries)} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold">Specifications</h2>
          <SpecTable specs={product.specs as Record<string, unknown>} productId={product.id} />
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
          <div className="mb-4 flex flex-col gap-1.5">
            {ratingBreakdown.breakdown.map((b) => (
              <div key={b.rating} className="flex items-center gap-2 text-xs">
                <span className="w-10 text-muted-foreground">{b.rating} star</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: ratingBreakdown.total > 0 ? `${(b.count / ratingBreakdown.total) * 100}%` : "0%" }}
                  />
                </div>
                <span className="w-6 text-right text-muted-foreground">{b.count}</span>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <ReviewForm
              productSlug={product.slug}
              existingReview={userReview}
              canReview={!!session?.user}
            />
            {!session?.user ? (
              <p className="text-sm text-muted-foreground">
                <Link href={`/login?callbackUrl=/products/${product.slug}`} className="underline-offset-4 hover:underline">
                  Log in
                </Link>{" "}
                to write a review.
              </p>
            ) : null}
          </div>

          {otherReviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No other reviews yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {otherReviews.map((review) => (
                <div key={review.id} className="border-b border-border/60 pb-4 last:border-none">
                  <div className="mb-1 flex items-center gap-2">
                    <RatingStars rating={review.rating} size={13} />
                    <span className="text-sm font-medium">{review.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {review.user.name} · {review.isVerifiedPurchase ? "Verified purchase" : "Unverified"}
                  </p>
                </div>
              ))}
            </div>
          )}

          <Pagination
            pathname={`/products/${product.slug}`}
            searchParams={{}}
            paramName="reviewPage"
            page={reviewsResult.page}
            totalPages={reviewsResult.totalPages}
          />
        </div>
      </div>

      {relatedProducts.length > 0 ? (
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-semibold">You might also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
