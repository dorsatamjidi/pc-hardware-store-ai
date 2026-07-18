import { describe, it, expect } from "vitest";
import { checkCpuSocketMotherboard } from "@/server/compatibility/rules/cpu-socket-motherboard";
import { makeComponent } from "../../fixtures/products";
import type { Build } from "@/server/compatibility/types";

describe("checkCpuSocketMotherboard", () => {
  it("returns null when CPU or motherboard is missing", () => {
    expect(checkCpuSocketMotherboard({})).toBeNull();
    expect(checkCpuSocketMotherboard({ CPU: makeComponent({ compatibility: { socketType: "AM5" } }) })).toBeNull();
  });

  it("passes when sockets match", () => {
    const build: Build = {
      CPU: makeComponent({ name: "Ryzen 7", compatibility: { socketType: "AM5" } }),
      MOTHERBOARD: makeComponent({ name: "B650 Board", compatibility: { socketType: "AM5" } }),
    };
    const result = checkCpuSocketMotherboard(build);
    expect(result?.passed).toBe(true);
    expect(result?.severity).toBe("ERROR");
  });

  it("fails when sockets differ", () => {
    const build: Build = {
      CPU: makeComponent({ name: "Ryzen 7", compatibility: { socketType: "AM5" } }),
      MOTHERBOARD: makeComponent({ name: "Z790 Board", compatibility: { socketType: "LGA1700" } }),
    };
    const result = checkCpuSocketMotherboard(build);
    expect(result?.passed).toBe(false);
    expect(result?.message).toContain("AM5");
    expect(result?.message).toContain("LGA1700");
  });
});
