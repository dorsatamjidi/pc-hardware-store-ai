import type { Build, CompatibilityReport } from "@/server/compatibility/types";
import { COMPONENT_SLOTS } from "@/server/compatibility/types";
import { openai, CHAT_MODEL, isLlmConfigured } from "@/server/ai/openai-client";
import { BUILDER_SUGGEST_SYSTEM_PROMPT } from "@/server/ai/prompts/builder-suggest";
import { summarizeReportForLlm } from "@/server/ai/report-summary";

/**
 * Called only when explicitly requested by the user (cost control) — the
 * builder otherwise operates purely on the deterministic engine with no LLM
 * calls at all.
 */
export async function suggestNextComponent(build: Build, report: CompatibilityReport): Promise<string | null> {
  const filledSlots = Object.keys(build);
  const missingSlots = COMPONENT_SLOTS.filter((slot) => !filledSlots.includes(slot));

  if (missingSlots.length === 0) {
    return "Your build has something in every core slot — review the compatibility summary above before checking out.";
  }

  if (!isLlmConfigured()) {
    return `Consider adding a ${missingSlots[0].toLowerCase()} next.`;
  }

  try {
    const components = Object.entries(build).map(([slot, component]) => ({
      slot,
      name: component!.product.name,
      price: Number(component!.product.price),
    }));

    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: BUILDER_SUGGEST_SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify({ currentComponents: components, missingSlots, compatibility: summarizeReportForLlm(report) }),
        },
      ],
      max_tokens: 200,
    });
    return response.choices[0]?.message?.content || `Consider adding a ${missingSlots[0].toLowerCase()} next.`;
  } catch {
    return `Consider adding a ${missingSlots[0].toLowerCase()} next.`;
  }
}
