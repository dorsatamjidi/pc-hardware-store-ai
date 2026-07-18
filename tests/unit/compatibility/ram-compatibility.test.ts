import { describe, it, expect } from "vitest";
import { checkRamTypeMotherboard } from "@/server/compatibility/rules/ram-type-motherboard";
import { checkRamSpeedSupport } from "@/server/compatibility/rules/ram-speed-support";
import { checkRamCapacityVsMax } from "@/server/compatibility/rules/ram-capacity-vs-max";
import { checkRamModuleCountVsSlots } from "@/server/compatibility/rules/ram-module-count-vs-slots";
import { makeComponent } from "../../fixtures/products";
import type { Build } from "@/server/compatibility/types";

describe("checkRamTypeMotherboard", () => {
  it("passes for matching DDR type", () => {
    const build: Build = {
      RAM: makeComponent({ compatibility: { ramType: "DDR5" } }),
      MOTHERBOARD: makeComponent({ compatibility: { ramType: "DDR5" } }),
    };
    expect(checkRamTypeMotherboard(build)?.passed).toBe(true);
  });

  it("fails for DDR4 kit on a DDR5 board", () => {
    const build: Build = {
      RAM: makeComponent({ compatibility: { ramType: "DDR4" } }),
      MOTHERBOARD: makeComponent({ compatibility: { ramType: "DDR5" } }),
    };
    const result = checkRamTypeMotherboard(build);
    expect(result?.passed).toBe(false);
    expect(result?.severity).toBe("ERROR");
  });
});

describe("checkRamSpeedSupport", () => {
  it("warns (not errors) when RAM speed exceeds board max", () => {
    const build: Build = {
      RAM: makeComponent({ compatibility: { ramSpeedMhz: 6400 } }),
      MOTHERBOARD: makeComponent({ compatibility: { ramSpeedMhz: 5600 } }),
    };
    const result = checkRamSpeedSupport(build);
    expect(result?.passed).toBe(false);
    expect(result?.severity).toBe("WARNING");
  });

  it("passes at the exact boundary speed", () => {
    const build: Build = {
      RAM: makeComponent({ compatibility: { ramSpeedMhz: 5600 } }),
      MOTHERBOARD: makeComponent({ compatibility: { ramSpeedMhz: 5600 } }),
    };
    expect(checkRamSpeedSupport(build)?.passed).toBe(true);
  });
});

describe("checkRamCapacityVsMax", () => {
  it("passes at the exact boundary (2x 64GB kits = 128GB max)", () => {
    const build: Build = {
      RAM: makeComponent({ specs: { capacityGb: 64 } }, 2),
      MOTHERBOARD: makeComponent({ compatibility: { maxRamCapacityGb: 128 } }),
    };
    expect(checkRamCapacityVsMax(build)?.passed).toBe(true);
  });

  it("fails when total exceeds the boundary", () => {
    const build: Build = {
      RAM: makeComponent({ specs: { capacityGb: 64 } }, 3),
      MOTHERBOARD: makeComponent({ compatibility: { maxRamCapacityGb: 128 } }),
    };
    const result = checkRamCapacityVsMax(build);
    expect(result?.passed).toBe(false);
    expect(result?.severity).toBe("ERROR");
  });
});

describe("checkRamModuleCountVsSlots", () => {
  it("passes when module count fits available slots", () => {
    const build: Build = {
      RAM: makeComponent({ specs: { kit: "2x8GB" } }, 1),
      MOTHERBOARD: makeComponent({ compatibility: { maxRamSlots: 4 } }),
    };
    expect(checkRamModuleCountVsSlots(build)?.passed).toBe(true);
  });

  it("fails when quantity of multi-module kits exceeds slots", () => {
    const build: Build = {
      RAM: makeComponent({ specs: { kit: "2x16GB" } }, 3), // 6 modules
      MOTHERBOARD: makeComponent({ compatibility: { maxRamSlots: 4 } }),
    };
    const result = checkRamModuleCountVsSlots(build);
    expect(result?.passed).toBe(false);
  });

  it("returns null when kit spec can't be parsed", () => {
    const build: Build = {
      RAM: makeComponent({ specs: { kit: "unknown" } }, 1),
      MOTHERBOARD: makeComponent({ compatibility: { maxRamSlots: 4 } }),
    };
    expect(checkRamModuleCountVsSlots(build)).toBeNull();
  });
});
