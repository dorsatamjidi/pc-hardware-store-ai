import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  NEXTAUTH_URL: z.url().default("http://localhost:3000"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  OPENAI_API_KEY: z.string().optional().default(""),
  OPENAI_BASE_URL: z.url().default("https://api.gapgpt.app/v1"),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  EMBEDDING_MODEL: z.string().default("Xenova/all-MiniLM-L6-v2"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    z.treeifyError(parsed.error),
  );
  throw new Error("Invalid environment variables. Check your .env file against .env.example.");
}

export const env = parsed.data;
