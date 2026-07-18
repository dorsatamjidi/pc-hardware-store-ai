import type { RetrievedProduct } from "@/server/ai/rag/retrieval";
import { ASSISTANT_SYSTEM_PROMPT } from "@/server/ai/prompts/assistant";

export type ChatRole = "user" | "assistant";

export interface ChatHistoryMessage {
  role: ChatRole;
  content: string;
}

const SLIDING_WINDOW_SIZE = 6;

export function buildProductContext(products: RetrievedProduct[]): string {
  if (products.length === 0) {
    return "No matching products were found in the catalog for this query.";
  }

  return products
    .map((p, i) => {
      const stock = p.stockQuantity > 0 ? `${p.stockQuantity} in stock` : "out of stock";
      const specLines = Object.entries(p.specs)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
        .join("; ");
      return (
        `${i + 1}. ${p.name} — ${p.brandName}, $${p.price.toFixed(2)}, ${stock}\n` +
        `   Category: ${p.categoryName}\n` +
        `   ${p.description}\n` +
        `   Specs: ${specLines}`
      );
    })
    .join("\n\n");
}

/**
 * Assembles system prompt + retrieved product context + a sliding window of
 * recent turns + the new user message. No summarization of older history —
 * a deliberate scope simplification (see docs/future-improvements.md).
 */
export function buildChatMessages(params: {
  retrievedProducts: RetrievedProduct[];
  history: ChatHistoryMessage[];
  userMessage: string;
}): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  const context = buildProductContext(params.retrievedProducts);
  const recentHistory = params.history.slice(-SLIDING_WINDOW_SIZE);

  return [
    {
      role: "system",
      content: `${ASSISTANT_SYSTEM_PROMPT}\n\nRelevant products from the catalog:\n${context}`,
    },
    ...recentHistory,
    { role: "user", content: params.userMessage },
  ];
}
