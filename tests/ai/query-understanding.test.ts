import { describe, it, expect, vi, beforeEach } from "vitest";

const createMock = vi.fn();

vi.mock("@/server/ai/openai-client", () => ({
  openai: { chat: { completions: { create: (...args: unknown[]) => createMock(...args) } } },
  CHAT_MODEL: "test-model",
  isLlmConfigured: () => true,
}));

import { understandQuery } from "@/server/ai/rag/query-understanding";

function toolCallResponse(args: Record<string, unknown>) {
  return {
    choices: [
      {
        message: {
          tool_calls: [
            { type: "function", function: { name: "extract_search_filters", arguments: JSON.stringify(args) } },
          ],
        },
      },
    ],
  };
}

describe("understandQuery", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it("extracts type and price filters from the tool call response", async () => {
    createMock.mockResolvedValue(
      toolCallResponse({ semanticQuery: "budget graphics card", type: "GPU", priceMax: 500 }),
    );

    const result = await understandQuery("suggest a GPU for under $500");

    expect(result).toEqual({ semanticQuery: "budget graphics card", type: "GPU", priceMax: 500, priceMin: undefined });
  });

  it("ignores a type value outside the known enum rather than passing it through", async () => {
    createMock.mockResolvedValue(toolCallResponse({ semanticQuery: "some query", type: "NOT_A_REAL_TYPE" }));

    const result = await understandQuery("some query");

    expect(result.type).toBeUndefined();
  });

  it("falls back to plain semantic search on the raw message when the LLM call fails", async () => {
    createMock.mockRejectedValue(new Error("network error"));

    const result = await understandQuery("I need RAM for my PC");

    expect(result).toEqual({ semanticQuery: "I need RAM for my PC" });
  });

  it("falls back gracefully when no tool call is returned", async () => {
    createMock.mockResolvedValue({ choices: [{ message: {} }] });

    const result = await understandQuery("hello");

    expect(result).toEqual({ semanticQuery: "hello" });
  });
});
