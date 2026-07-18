import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrCreateAnonymousToken } from "@/lib/anonymous-session";
import { getBuildState, serializeBuildResult, BuilderError } from "@/server/ai/builder/builder-service";

export async function GET(_request: Request, { params }: { params: Promise<{ buildId: string }> }) {
  const { buildId } = await params;
  const session = await auth();
  const identity = session?.user
    ? { userId: session.user.id }
    : { sessionToken: await getOrCreateAnonymousToken() };

  try {
    const result = await getBuildState(identity, buildId);
    return NextResponse.json(serializeBuildResult(result));
  } catch (err) {
    if (err instanceof BuilderError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
