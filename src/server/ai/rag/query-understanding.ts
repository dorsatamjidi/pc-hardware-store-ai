import type { ProductType } from "@prisma/client";
import { openai, CHAT_MODEL } from "@/server/ai/openai-client";

export interface UnderstoodQuery {
  semanticQuery: string;
  type?: ProductType;
  priceMin?: number;
  priceMax?: number;
}

const PRODUCT_TYPES: ProductType[] = [
  "CPU", "MOTHERBOARD", "RAM", "GPU", "STORAGE", "PSU", "CASE", "COOLER", "FAN",
  "MONITOR", "KEYBOARD", "MOUSE", "HEADSET", "NETWORK_CARD", "CABLE", "THERMAL_PASTE",
];

const EXTRACT_FILTERS_TOOL = {
  type: "function" as const,
  function: {
    name: "extract_search_filters",
    description: "Extract structured filters for a hybrid semantic + SQL product search.",
    parameters: {
      type: "object",
      properties: {
        semanticQuery: {
          type: "string",
          description: "A short, cleaned-up description of what the user wants, for semantic similarity search.",
        },
        type: {
          type: "string",
          enum: PRODUCT_TYPES,
          description: "The single product category the user is asking about, if they clearly mean one specific category.",
        },
        priceMin: { type: "number", description: "Minimum price in USD, if mentioned." },
        priceMax: { type: "number", description: "Maximum price / budget in USD, if mentioned." },
      },
      required: ["semanticQuery"],
    },
  },
};

/**
 * A single tool-calling round-trip that turns a free-form chat message into
 * structured retrieval filters, so retrieval isn't just naive keyword
 * matching — the model does the work of understanding "a GPU under $500"
 * means {type: GPU, priceMax: 500}.
 */
export async function understandQuery(
  message: string,
  recentMessages: { role: "user" | "assistant"; content: string }[] = [],
): Promise<UnderstoodQuery> {
  try {
    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Extract structured search parameters from a PC-hardware shopping message. " +
            "Only set `type` when the user clearly means one specific component category. " +
            "Leave fields out entirely if they aren't mentioned or implied.",
        },
        ...recentMessages,
        { role: "user", content: message },
      ],
      tools: [EXTRACT_FILTERS_TOOL],
      tool_choice: { type: "function", function: { name: "extract_search_filters" } },
    });

    const toolCall = response.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.type !== "function") return { semanticQuery: message };

    const args = JSON.parse(toolCall.function.arguments) as Partial<UnderstoodQuery>;
    return {
      semanticQuery: args.semanticQuery || message,
      type: args.type && PRODUCT_TYPES.includes(args.type) ? args.type : undefined,
      priceMin: typeof args.priceMin === "number" ? args.priceMin : undefined,
      priceMax: typeof args.priceMax === "number" ? args.priceMax : undefined,
    };
  } catch {
    // If query understanding fails (bad key, network, malformed args), fall
    // back to plain semantic search on the raw message rather than erroring.
    return { semanticQuery: message };
  }
}
