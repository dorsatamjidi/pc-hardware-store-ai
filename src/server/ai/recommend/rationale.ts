import type { Build, CompatibilityReport } from "@/server/compatibility/types";
import type { UseCase } from "@/server/ai/recommend/budget-allocator";
import { USE_CASE_LABELS } from "@/server/ai/recommend/budget-allocator";
import { openai, CHAT_MODEL, isLlmConfigured } from "@/server/ai/openai-client";
import { RECOMMEND_SYSTEM_PROMPT } from "@/server/ai/prompts/recommend";
import { summarizeReportForLlm } from "@/server/ai/report-summary";

function summarizeBuild(build: Build) {
  return Object.entries(build).map(([slot, component]) => ({
    slot,
    name: component!.product.name,
    price: Number(component!.product.price),
    quantity: component!.quantity,
  }));
}

function templatedFallback(useCase: UseCase, budget: number, build: Build, report: CompatibilityReport): string {
  const items = summarizeBuild(build);
  const lines = items.map((i) => `${i.quantity > 1 ? `${i.quantity}x ` : ""}${i.name}`);
  const label = USE_CASE_LABELS[useCase];
  const budgetLine =
    report.totalPrice <= budget
      ? `comes in at $${report.totalPrice.toFixed(2)}, within your $${budget.toFixed(2)} budget`
      : `comes in at $${report.totalPrice.toFixed(2)}, slightly over your $${budget.toFixed(2)} budget since nothing suitable was available lower`;
  const warningNote =
    report.status === "INCOMPATIBLE"
      ? " Note: this combination has unresolved compatibility issues — see the details below."
      : report.status === "COMPATIBLE_WITH_WARNINGS"
        ? " It will work, though check the warnings below."
        : "";
  return `Here's a ${label} build: ${lines.join(", ")}. It ${budgetLine}.${warningNote}`;
}

export async function generateRecommendationRationale(
  useCase: UseCase,
  budget: number,
  build: Build,
  report: CompatibilityReport,
  preferences?: string,
): Promise<string> {
  if (!isLlmConfigured()) return templatedFallback(useCase, budget, build, report);

  try {
    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: RECOMMEND_SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify({
            useCase: USE_CASE_LABELS[useCase],
            budget,
            components: summarizeBuild(build),
            compatibility: summarizeReportForLlm(report),
            // Not used for product selection (see docs/future-improvements.md) — surfaced
            // here so the rationale can at least acknowledge it.
            statedPreferences: preferences || undefined,
          }),
        },
      ],
      max_tokens: 400,
    });
    return response.choices[0]?.message?.content || templatedFallback(useCase, budget, build, report);
  } catch {
    return templatedFallback(useCase, budget, build, report);
  }
}
