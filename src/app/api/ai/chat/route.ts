import { auth } from "@/lib/auth";
import { getOrCreateAnonymousToken } from "@/lib/anonymous-session";
import { chatRequestSchema } from "@/lib/validation/chat";
import {
  getOrCreateSession,
  getRecentHistory,
  appendMessage,
  ChatSessionError,
} from "@/server/ai/chat/session-service";
import { understandQuery } from "@/server/ai/rag/query-understanding";
import { retrieveRelevantProducts } from "@/server/ai/rag/retrieval";
import { buildChatMessages } from "@/server/ai/rag/context-builder";
import { openai, CHAT_MODEL, isLlmConfigured } from "@/server/ai/openai-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  if (!isLlmConfigured()) {
    return Response.json({ error: "The AI assistant is not configured (missing API key)." }, { status: 503 });
  }

  const session = await auth();
  const identity = session?.user
    ? { userId: session.user.id }
    : { sessionToken: await getOrCreateAnonymousToken() };

  let chatSession;
  try {
    chatSession = await getOrCreateSession(identity, parsed.data.sessionId);
  } catch (err) {
    if (err instanceof ChatSessionError) return Response.json({ error: err.message }, { status: err.status });
    throw err;
  }

  const history = await getRecentHistory(chatSession.id);
  await appendMessage(chatSession.id, "USER", parsed.data.message);

  const historyForContext = history
    .filter((m) => m.role !== "SYSTEM")
    .map((m) => ({ role: m.role === "USER" ? ("user" as const) : ("assistant" as const), content: m.content }));

  const understood = await understandQuery(parsed.data.message, historyForContext.slice(-4));
  const retrieved = await retrieveRelevantProducts(understood.semanticQuery, {
    type: understood.type,
    priceMin: understood.priceMin,
    priceMax: understood.priceMax,
  });

  const messages = buildChatMessages({
    retrievedProducts: retrieved,
    history: historyForContext,
    userMessage: parsed.data.message,
  });

  let stream;
  try {
    stream = await openai.chat.completions.create({ model: CHAT_MODEL, messages, stream: true });
  } catch {
    return Response.json({ error: "The assistant is temporarily unavailable. Please try again." }, { status: 502 });
  }

  const encoder = new TextEncoder();
  let fullText = "";

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          if (delta) {
            fullText += delta;
            controller.enqueue(encoder.encode(delta));
          }
        }
      } catch {
        // Swallow mid-stream errors — whatever text arrived is still persisted below.
      } finally {
        controller.close();
        await appendMessage(chatSession.id, "ASSISTANT", fullText || "(no response)", {
          productIds: retrieved.map((p) => p.id),
        });
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Session-Id": chatSession.id,
    },
  });
}
