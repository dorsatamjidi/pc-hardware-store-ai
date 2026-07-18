import { NextResponse } from "next/server";
import { explainSchema } from "@/lib/validation/explain";
import { explainTerm } from "@/server/ai/explain";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = explainSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const explanation = await explainTerm(parsed.data);
  return NextResponse.json({ explanation });
}
