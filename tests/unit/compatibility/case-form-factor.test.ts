import { describe, it, expect } from "vitest";
import { checkCaseMotherboardFormFactor } from "@/server/compatibility/rules/case-motherboard-form-factor";
import { checkGpuCaseClearance } from "@/server/compatibility/rules/gpu-case-clearance";
import { makeComponent } from "../../fixtures/products";
import type { Build } from "@/server/compatibility/types";

describe("checkCaseMotherboardFormFactor", () => {
  it("passes when the case supports the board's form factor", () => {
    const build: Build = {
      MOTHERBOARD: makeComponent({ compatibility: { formFactor: "MICRO_ATX" } }),
      CASE: makeComponent({ compatibility: { caseSupportedFormFactors: ["ATX", "MICRO_ATX", "MINI_ITX"] } }),
    };
    expect(checkCaseMotherboardFormFactor(build)?.passed).toBe(true);
  });

  it("fails when an ATX board is placed in a case that only supports Mini-ITX", () => {
    const build: Build = {
      MOTHERBOARD: makeComponent({ compatibility: { formFactor: "ATX" } }),
      CASE: makeComponent({ compatibility: { caseSupportedFormFactors: ["MINI_ITX"] } }),
    };
    const result = checkCaseMotherboardFormFactor(build);
    expect(result?.passed).toBe(false);
    expect(result?.severity).toBe("ERROR");
  });
});

describe("checkGpuCaseClearance", () => {
  it("passes when the GPU fits exactly at the case's max length", () => {
    const build: Build = {
      GPU: makeComponent({ compatibility: { gpuLengthMm: 320 } }),
      CASE: makeComponent({ compatibility: { caseMaxGpuLengthMm: 320 } }),
    };
    expect(checkGpuCaseClearance(build)?.passed).toBe(true);
  });

  it("fails when the GPU is longer than the case allows", () => {
    const build: Build = {
      GPU: makeComponent({ compatibility: { gpuLengthMm: 340 } }),
      CASE: makeComponent({ compatibility: { caseMaxGpuLengthMm: 320 } }),
    };
    const result = checkGpuCaseClearance(build);
    expect(result?.passed).toBe(false);
    expect(result?.severity).toBe("ERROR");
  });
});
