import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import { TEST_DATABASE_URL, TEST_DB_NAME } from "./constants";
import { seedFixtures } from "./seed-fixtures";

function ensureTestDatabaseExists() {
  try {
    execSync(`docker compose exec -T db psql -U pcstore -d pcstore -c "CREATE DATABASE ${TEST_DB_NAME}"`, {
      stdio: "pipe",
    });
  } catch (err) {
    const output = String((err as { stderr?: Buffer })?.stderr ?? err);
    if (!output.includes("already exists")) throw err;
  }
}

function runMigrations() {
  execSync("npx prisma migrate deploy", {
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
    stdio: "pipe",
  });
}

export default async function globalSetup() {
  ensureTestDatabaseExists();
  runMigrations();

  const prisma = new PrismaClient({ datasourceUrl: TEST_DATABASE_URL });
  try {
    await seedFixtures(prisma);
  } finally {
    await prisma.$disconnect();
  }
}
