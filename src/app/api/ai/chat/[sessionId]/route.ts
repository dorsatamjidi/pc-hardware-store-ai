import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrCreateAnonymousToken } from "@/lib/anonymous-session";
import { getSessionWithMessages } from "@/server/ai/chat/session-service";

export async function GET(_request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const session = await auth();
  const identity = session?.user
    ? { userId: session.user.id }
    : { sessionToken: await getOrCreateAnonymousToken() };

  const chatSession = await getSessionWithMessages(sessionId, identity);
  if (!chatSession) return NextResponse.json({ error: "Chat session not found" }, { status: 404 });

  return NextResponse.json({ session: chatSession });
}
