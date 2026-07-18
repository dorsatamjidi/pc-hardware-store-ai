import { prisma } from "@/lib/prisma";
import { openai, CHAT_MODEL, isLlmConfigured } from "@/server/ai/openai-client";
import { EXPLAIN_SYSTEM_PROMPT } from "@/server/ai/prompts/explain";
import type { ExplainInput } from "@/lib/validation/explain";
import { humanizeKey } from "@/lib/format";

export async function explainTerm(input: ExplainInput): Promise<string> {
  if (!isLlmConfigured()) {
    return "AI explanations aren't available right now (the assistant isn't configured).";
  }

  let userContent: string;

  if ("term" in input) {
    userContent = `Explain this PC hardware term for a shopper: "${input.term}"`;
  } else {
    const product = await prisma.product.findUnique({ where: { id: input.productId } });
    if (!product) return "That product couldn't be found.";

    const specs = product.specs as Record<string, unknown>;
    const value = specs[input.field];
    userContent =
      `Explain the "${humanizeKey(input.field)}" spec for this product: ${product.name} (${product.type}). ` +
      `Its value is: ${JSON.stringify(value)}. Product description: ${product.description}`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: EXPLAIN_SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      max_tokens: 250,
    });
    return response.choices[0]?.message?.content || "Sorry, I couldn't generate an explanation right now.";
  } catch {
    return "Sorry, I couldn't generate an explanation right now. Please try again.";
  }
}
