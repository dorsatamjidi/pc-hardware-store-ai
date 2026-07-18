import { NextResponse } from "next/server";
import { recommendRequestSchema } from "@/lib/validation/recommend";
import { selectBuildForUseCase } from "@/server/ai/recommend/product-selector";
import { generateRecommendationRationale } from "@/server/ai/recommend/rationale";
import { runCompatibilityEngine } from "@/server/compatibility/engine";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = recommendRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const { useCase, budget, preferences } = parsed.data;
  const build = await selectBuildForUseCase(useCase, budget);

  if (Object.keys(build).length === 0) {
    return NextResponse.json(
      { error: "No suitable products were found for this budget. Try a higher amount." },
      { status: 404 },
    );
  }

  const report = runCompatibilityEngine(build);
  const rationale = await generateRecommendationRationale(useCase, budget, build, report, preferences);

  const components = Object.entries(build).map(([slot, component]) => ({
    slot,
    product: component!.product,
    quantity: component!.quantity,
  }));

  return NextResponse.json({ useCase, budget, components, report, rationale });
}
