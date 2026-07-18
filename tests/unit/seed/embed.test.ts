import { describe, it, expect } from "vitest";
import { buildEmbeddingSourceText } from "../../../prisma/seed/embed";

describe("buildEmbeddingSourceText", () => {
  const product = {
    name: "Ryzen 7 7700X",
    brandName: "AMD",
    categoryName: "Processors",
    type: "CPU",
    description: "An 8-core, 16-thread desktop processor for the AM5 socket.",
    price: 300,
    specs: { cores: 8, threads: 16, boostClockGhz: 5.4, unlocked: true },
  };

  it("includes the product name and brand for semantic phrasing", () => {
    const text = buildEmbeddingSourceText(product);
    expect(text).toContain("Ryzen 7 7700X");
    expect(text).toContain("AMD");
  });

  it("includes the category and type", () => {
    const text = buildEmbeddingSourceText(product);
    expect(text).toContain("Processors");
    expect(text).toContain("CPU");
  });

  it("includes the price so budget-scoped queries can match on it", () => {
    const text = buildEmbeddingSourceText(product);
    expect(text).toContain("300");
  });

  it("flattens every spec key/value into literal text for exact-term matching", () => {
    const text = buildEmbeddingSourceText(product);
    expect(text).toContain("cores: 8");
    expect(text).toContain("threads: 16");
    expect(text).toContain("boostClockGhz: 5.4");
    expect(text).toContain("unlocked: true");
  });

  it("joins array-valued specs with commas rather than printing '[object Object]'", () => {
    const text = buildEmbeddingSourceText({
      ...product,
      specs: { supportedFormFactors: ["ATX", "MICRO_ATX"] },
    });
    expect(text).toContain("supportedFormFactors: ATX, MICRO_ATX");
  });

  it("includes the free-text description", () => {
    const text = buildEmbeddingSourceText(product);
    expect(text).toContain("AM5 socket");
  });
});
