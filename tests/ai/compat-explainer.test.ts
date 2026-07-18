import { describe, it, expect, vi, beforeEach } from "vitest";

const createMock = vi.fn();

vi.mock("@/server/ai/openai-client", () => ({
  openai: { chat: { completions: { create: (...args: unknown[]) => createMock(...args) } } },
  CHAT_MODEL: "test-model",
  isLlmConfigured: () => true,
}));

import { explainCompatibilityReport } from "@/server/ai/compat-explainer";
import type { CompatibilityReport } from "@/server/compatibility/types";

const sampleReport: CompatibilityReport = {
  status: "INCOMPATIBLE",
  results: [
    {
      rule: "cpu-socket-motherboard",
      severity: "ERROR",
      passed: false,
      message: "Socket mismatch.",
      componentsInvolved: ["CPU", "MOTHERBOARD"],
    },
  ],
  estimatedWattage: 300,
  totalPrice: 500,
};

describe("explainCompatibilityReport (resilience)", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it("passes the deterministic status and only the failing rule as an issue, never re-deciding it", async () => {
    createMock.mockResolvedValue({ choices: [{ message: { content: "Friendly explanation." } }] });

    const explanation = await explainCompatibilityReport(sampleReport);

    expect(explanation).toBe("Friendly explanation.");
    const callArgs = createMock.mock.calls[0][0];
    const userMessage = callArgs.messages.find((m: { role: string }) => m.role === "user");
    expect(JSON.parse(userMessage.content)).toEqual({
      status: "INCOMPATIBLE",
      issues: [{ severity: "ERROR", message: "Socket mismatch." }],
      estimatedWattage: 300,
      totalPrice: 500,
    });
  });

  it("excludes passing rules from 'issues' even when their severity is WARNING (regression: models otherwise hallucinate warnings from the severity label alone)", async () => {
    createMock.mockResolvedValue({ choices: [{ message: { content: "All good." } }] });

    const allPassingReport: CompatibilityReport = {
      status: "COMPATIBLE",
      results: [
        {
          rule: "ram-speed-support",
          severity: "WARNING",
          passed: true,
          message: "This kit runs within the board's supported speed.",
          componentsInvolved: ["RAM", "MOTHERBOARD"],
        },
      ],
      estimatedWattage: 200,
      totalPrice: 400,
    };

    await explainCompatibilityReport(allPassingReport);

    const callArgs = createMock.mock.calls[0][0];
    const userMessage = callArgs.messages.find((m: { role: string }) => m.role === "user");
    expect(JSON.parse(userMessage.content).issues).toEqual([]);
  });

  it("returns null (not throw) when the LLM call fails, so the deterministic report still stands alone", async () => {
    createMock.mockRejectedValue(new Error("network error"));

    const explanation = await explainCompatibilityReport(sampleReport);

    expect(explanation).toBeNull();
  });

  it("returns null (not throw) on a timeout-like rejection", async () => {
    createMock.mockImplementation(() => new Promise((_resolve, reject) => reject(new Error("timeout"))));

    await expect(explainCompatibilityReport(sampleReport)).resolves.toBeNull();
  });
});
