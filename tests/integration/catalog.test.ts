import { describe, it, expect } from "vitest";
import { searchProducts } from "@/server/catalog/search";
import { getProductsForCompare } from "@/server/catalog/compare";
import { FIXTURE } from "./setup/constants";

describe("searchProducts (integration)", () => {
  it("filters by category", async () => {
    const result = await searchProducts({ category: FIXTURE.categorySlugs.motherboard, pageSize: 50 });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((p) => p.category.slug === FIXTURE.categorySlugs.motherboard)).toBe(true);
  });

  it("filters by compatibility field (socketType)", async () => {
    const result = await searchProducts({
      category: FIXTURE.categorySlugs.motherboard,
      socketType: "AM5",
      pageSize: 50,
    });
    const slugs = result.items.map((p) => p.slug);
    expect(slugs).toContain(FIXTURE.products.moboAm5Ddr5);
    expect(slugs).not.toContain(FIXTURE.products.moboAm4Ddr4);
  });

  it("filters by price range", async () => {
    const result = await searchProducts({ category: FIXTURE.categorySlugs.cpu, minPrice: 200, maxPrice: 400, pageSize: 50 });
    const slugs = result.items.map((p) => p.slug);
    expect(slugs).toContain(FIXTURE.products.cpuAm5); // $300
    expect(slugs).not.toContain(FIXTURE.products.cpuAm4); // $150, below range
  });

  it("excludes out-of-stock products when inStockOnly is set", async () => {
    const result = await searchProducts({ category: FIXTURE.categorySlugs.cpu, inStockOnly: true, pageSize: 50 });
    const slugs = result.items.map((p) => p.slug);
    expect(slugs).not.toContain(FIXTURE.products.outOfStock);
  });

  it("sorts by price ascending and descending", async () => {
    const asc = await searchProducts({ category: FIXTURE.categorySlugs.cpu, sort: "price_asc", pageSize: 50 });
    const prices = asc.items.map((p) => Number(p.price));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));

    const desc = await searchProducts({ category: FIXTURE.categorySlugs.cpu, sort: "price_desc", pageSize: 50 });
    const pricesDesc = desc.items.map((p) => Number(p.price));
    expect(pricesDesc).toEqual([...pricesDesc].sort((a, b) => b - a));
  });

  it("computes pagination math correctly", async () => {
    const result = await searchProducts({ category: FIXTURE.categorySlugs.cpu, pageSize: 1, page: 1 });
    expect(result.items).toHaveLength(1);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(1);
    expect(result.totalPages).toBe(result.total);
  });
});

describe("getProductsForCompare (integration)", () => {
  it("returns products in the requested order with a spec-key union", async () => {
    const { products, specKeys } = await getProductsForCompare([
      FIXTURE.products.cpuAm5,
      FIXTURE.products.cpuAm4,
    ]);

    expect(products.map((p) => p.slug)).toEqual([FIXTURE.products.cpuAm5, FIXTURE.products.cpuAm4]);
    expect(specKeys).toEqual(expect.any(Array));
  });

  it("silently drops slugs that don't exist rather than erroring", async () => {
    const { products } = await getProductsForCompare([FIXTURE.products.cpuAm5, "does-not-exist"]);
    expect(products).toHaveLength(1);
  });
});
