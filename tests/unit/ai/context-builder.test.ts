import { describe, it, expect } from "vitest";
import { buildChatMessages, buildProductContext } from "@/server/ai/rag/context-builder";
import type { RetrievedProduct } from "@/server/ai/rag/retrieval";

function makeRetrieved(overrides: Partial<RetrievedProduct> = {}): RetrievedProduct {
  return {
    id: "p1",
    slug: "test-gpu",
    name: "Test GPU 4070",
    type: "GPU",
    price: 599.99,
    stockQuantity: 5,
    brandName: "TestBrand",
    categoryName: "Graphics Cards",
    specs: { vramGb: 12, tdpWatts: 220 },
    description: "A test graphics card.",
    similarity: 0.9,
    ...overrides,
  };
}

describe("buildProductContext", () => {
  it("returns a fallback message when there are no retrieved products", () => {
    expect(buildProductContext([])).toContain("No matching products");
  });

  it("includes product name, price, and stock status", () => {
    const context = buildProductContext([makeRetrieved()]);
    expect(context).toContain("Test GPU 4070");
    expect(context).toContain("599.99");
    expect(context).toContain("5 in stock");
  });

  it("reports out-of-stock products as such", () => {
    const context = buildProductContext([makeRetrieved({ stockQuantity: 0 })]);
    expect(context).toContain("out of stock");
  });
});

describe("buildChatMessages", () => {
  it("puts the system prompt + product context first, then history, then the new message", () => {
    const messages = buildChatMessages({
      retrievedProducts: [makeRetrieved()],
      history: [
        { role: "user", content: "hi" },
        { role: "assistant", content: "hello" },
      ],
      userMessage: "what GPU should I get?",
    });

    expect(messages[0].role).toBe("system");
    expect(messages[0].content).toContain("Test GPU 4070");
    expect(messages.at(-1)).toEqual({ role: "user", content: "what GPU should I get?" });
  });

  it("truncates history to the last 6 messages (sliding window)", () => {
    const history: { role: "user" | "assistant"; content: string }[] = Array.from({ length: 20 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `message ${i}`,
    }));

    const messages = buildChatMessages({ retrievedProducts: [], history, userMessage: "latest" });

    // 1 system + 6 history + 1 new user message
    expect(messages).toHaveLength(8);
    expect(messages[1].content).toBe("message 14");
    expect(messages[messages.length - 2].content).toBe("message 19");
  });
});
