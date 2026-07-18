import "dotenv/config";
import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TEST_DATABASE_URL } from "./tests/integration/setup/constants";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
    globalSetup: ["tests/integration/setup/global-setup.ts"],
    env: {
      DATABASE_URL: TEST_DATABASE_URL,
    },
    // Integration tests hit a real Postgres instance; avoid parallel workers
    // stepping on shared fixture rows.
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
});
