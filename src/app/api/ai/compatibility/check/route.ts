import { NextResponse } from "next/server";
import { compatibilityCheckSchema } from "@/lib/validation/compatibility";
import { extractBuildRefs, loadBuild } from "@/server/compatibility/build-loader";
import { runCompatibilityEngine } from "@/server/compatibility/engine";
import { explainCompatibilityReport } from "@/server/ai/compat-explainer";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = compatibilityCheckSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const refs = extractBuildRefs(parsed.data);
  const build = await loadBuild(refs);
  const report = runCompatibilityEngine(build);

  // The deterministic report is the source of truth and is always returned,
  // even if the narration call below fails or is unconfigured.
  const explanation = await explainCompatibilityReport(report);

  return NextResponse.json({ report, explanation });
}
