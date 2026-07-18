import type { ChatRole, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface ChatIdentity {
  userId?: string;
  sessionToken?: string;
}

export class ChatSessionError extends Error {
  status: number;
  constructor(message: string, status = 404) {
    super(message);
    this.status = status;
  }
}

function ownsSession(session: { userId: string | null; sessionToken: string | null }, identity: ChatIdentity) {
  if (identity.userId) return session.userId === identity.userId;
  if (identity.sessionToken) return session.sessionToken === identity.sessionToken;
  return false;
}

export async function getOrCreateSession(identity: ChatIdentity, sessionId?: string) {
  if (sessionId) {
    const existing = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    if (!existing) throw new ChatSessionError("Chat session not found");
    if (!ownsSession(existing, identity)) throw new ChatSessionError("Chat session not found");
    return existing;
  }

  return prisma.chatSession.create({
    data: {
      userId: identity.userId ?? null,
      sessionToken: identity.userId ? null : identity.sessionToken ?? null,
    },
  });
}

export async function getSessionWithMessages(sessionId: string, identity: ChatIdentity) {
  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!session || !ownsSession(session, identity)) return null;
  return session;
}

export async function appendMessage(
  sessionId: string,
  role: ChatRole,
  content: string,
  metadata?: Prisma.InputJsonValue,
) {
  return prisma.chatMessage.create({ data: { sessionId, role, content, metadata } });
}

export async function getRecentHistory(sessionId: string, limit = 20) {
  const messages = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return messages.reverse();
}
