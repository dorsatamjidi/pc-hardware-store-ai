import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

export async function createTestUser() {
  const id = randomUUID();
  return prisma.user.create({
    data: {
      name: "Integration Test User",
      email: `test-${id}@example.com`,
      passwordHash: "not-a-real-hash",
    },
  });
}
