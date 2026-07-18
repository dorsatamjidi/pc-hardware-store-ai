import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

const COOKIE_NAME = "forgepc_anon_id";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

/**
 * Shared anonymous-identity cookie for features that work for guests but
 * improve when logged in (chat assistant, PC Builder). Not used for auth —
 * just a stable key to scope guest data.
 */
export async function getOrCreateAnonymousToken(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const token = randomUUID();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });
  return token;
}
