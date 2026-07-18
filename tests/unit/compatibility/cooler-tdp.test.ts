import { describe, it, expect } from "vitest";
import { checkCoolerCpuSocketSupport } from "@/server/compatibility/rules/cooler-cpu-socket-support";
import { checkCoolerTdpHeadroom } from "@/server/compatibility/rules/cooler-tdp-headroom";
import { makeComponent } from "../../fixtures/products";
import type { Build } from "@/server/compatibility/types";

describe("checkCoolerCpuSocketSupport", () => {
  it("passes when the cooler lists the CPU's socket", () => {
    const build: Build = {
      CPU: makeComponent({ compatibility: { socketType: "LGA1700" } }),
      COOLER: makeComponent({ compatibility: { coolerSupportedSockets: ["AM5", "LGA1700", "LGA1200"] } }),
    };
    expect(checkCoolerCpuSocketSupport(build)?.passed).toBe(true);
  });

  it("fails when the cooler doesn't support the CPU's socket", () => {
    const build: Build = {
      CPU: makeComponent({ compatibility: { socketType: "AM4" } }),
      COOLER: makeComponent({ compatibility: { coolerSupportedSockets: ["AM5", "LGA1700"] } }),
    };
    const result = checkCoolerCpuSocketSupport(build);
    expect(result?.passed).toBe(false);
    expect(result?.severity).toBe("ERROR");
  });
});

describe("checkCoolerTdpHeadroom", () => {
  it("passes when the cooler's rating meets the CPU's TDP exactly", () => {
    const build: Build = {
      CPU: makeComponent({ compatibility: { tdpWatts: 105 } }),
      COOLER: makeComponent({ compatibility: { tdpWatts: 105 } }),
    };
    expect(checkCoolerTdpHeadroom(build)?.passed).toBe(true);
  });

  it("warns (not errors) when the cooler is under-rated for the CPU", () => {
    const build: Build = {
      CPU: makeComponent({ compatibility: { tdpWatts: 170 } }),
      COOLER: makeComponent({ compatibility: { tdpWatts: 125 } }),
    };
    const result = checkCoolerTdpHeadroom(build);
    expect(result?.passed).toBe(false);
    expect(result?.severity).toBe("WARNING");
  });
});
