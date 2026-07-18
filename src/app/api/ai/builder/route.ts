import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrCreateAnonymousToken } from "@/lib/anonymous-session";
import { builderActionSchema } from "@/lib/validation/builder";
import {
  addComponent,
  removeComponent,
  resetBuild,
  getBuildState,
  serializeBuildResult,
  BuilderError,
} from "@/server/ai/builder/builder-service";
import { suggestNextComponent } from "@/server/ai/builder/suggest-next";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = builderActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const session = await auth();
  const identity = session?.user
    ? { userId: session.user.id }
    : { sessionToken: await getOrCreateAnonymousToken() };

  const { buildId, action, componentType, productId, quantity } = parsed.data;

  try {
    if (action === "add") {
      if (!componentType || !productId) {
        return NextResponse.json({ error: "componentType and productId are required to add a component" }, { status: 400 });
      }
      const result = await addComponent(identity, buildId, componentType, productId, quantity ?? 1);
      return NextResponse.json(serializeBuildResult(result));
    }

    if (!buildId) {
      return NextResponse.json({ error: "buildId is required for this action" }, { status: 400 });
    }

    if (action === "remove") {
      if (!componentType) {
        return NextResponse.json({ error: "componentType is required to remove a component" }, { status: 400 });
      }
      const result = await removeComponent(identity, buildId, componentType);
      return NextResponse.json(serializeBuildResult(result));
    }

    if (action === "reset") {
      const result = await resetBuild(identity, buildId);
      return NextResponse.json(serializeBuildResult(result));
    }

    // action === "suggest_next"
    const result = await getBuildState(identity, buildId);
    const suggestion = await suggestNextComponent(result.build, result.report);
    return NextResponse.json(serializeBuildResult(result, suggestion));
  } catch (err) {
    if (err instanceof BuilderError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
