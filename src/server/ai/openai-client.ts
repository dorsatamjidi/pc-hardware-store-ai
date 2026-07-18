import OpenAI from "openai";
import { env } from "@/lib/env";

/**
 * A plain OpenAI SDK client pointed at `OPENAI_BASE_URL` (defaults to a
 * gapgpt.app gateway; can be swapped for OpenAI itself or any other
 * OpenAI-compatible endpoint by changing env vars only — no code changes).
 */
export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  baseURL: env.OPENAI_BASE_URL,
});

export const CHAT_MODEL = env.OPENAI_MODEL;

export function isLlmConfigured(): boolean {
  return env.OPENAI_API_KEY.length > 0;
}
