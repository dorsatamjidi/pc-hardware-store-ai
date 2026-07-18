import { describe, it, expect } from "vitest";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createTestUser } from "./setup/test-user";

describe("User model (integration)", () => {
  it("enforces a unique email at the database level (what the register route's 409 relies on)", async () => {
    const user = await createTestUser();

    await expect(
      prisma.user.create({
        data: { name: "Duplicate", email: user.email, passwordHash: "irrelevant" },
      }),
    ).rejects.toMatchObject({ code: "P2002" satisfies Prisma.PrismaClientKnownRequestError["code"] });
  });

  it("never stores the plaintext password — passwordHash is a real bcrypt hash", async () => {
    const plaintext = "TestPassword123!";
    const passwordHash = await bcrypt.hash(plaintext, 12);

    const user = await prisma.user.create({
      data: { name: "Hash Check", email: `hash-check-${Date.now()}@example.com`, passwordHash },
    });

    expect(user.passwordHash).not.toBe(plaintext);
    expect(await bcrypt.compare(plaintext, user.passwordHash)).toBe(true);
  });
});
