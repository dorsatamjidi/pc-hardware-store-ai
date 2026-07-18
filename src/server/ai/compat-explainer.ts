import type { CompatibilityReport } from "@/server/compatibility/types";
import { openai, CHAT_MODEL, isLlmConfigured } from "@/server/ai/openai-client";
import { COMPAT_EXPLAIN_SYSTEM_PROMPT } from "@/server/ai/prompts/compat-explain";
import { summarizeReportForLlm } from "@/server/ai/report-summary";

/**
 * Narrates an already-decided CompatibilityReport in plain language. Never
 * re-evaluates compatibility itself — if this call fails for any reason
 * (missing key, network, rate limit), callers still have the deterministic
 * `report` to show; this only ever adds supplementary text.
 */
export async function explainCompatibilityReport(report: CompatibilityReport): Promise<string | null> {
  if (!isLlmConfigured()) return null;

  try {
    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: COMPAT_EXPLAIN_SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(summarizeReportForLlm(report)) },
      ],
      max_tokens: 300,
    });
    return response.choices[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}
