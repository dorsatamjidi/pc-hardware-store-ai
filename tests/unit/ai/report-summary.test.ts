import { describe, it, expect } from "vitest";
import { summarizeReportForLlm } from "@/server/ai/report-summary";
import type { CompatibilityReport } from "@/server/compatibility/types";

describe("summarizeReportForLlm", () => {
  it("excludes passing rules from issues regardless of their severity label", () => {
    const report: CompatibilityReport = {
      status: "COMPATIBLE",
      results: [
        { rule: "a", severity: "ERROR", passed: true, message: "fine", componentsInvolved: ["CPU"] },
        { rule: "b", severity: "WARNING", passed: true, message: "also fine", componentsInvolved: ["RAM"] },
      ],
      estimatedWattage: 100,
      totalPrice: 200,
    };

    expect(summarizeReportForLlm(report).issues).toEqual([]);
  });

  it("includes only failing rules, with their severity and message", () => {
    const report: CompatibilityReport = {
      status: "INCOMPATIBLE",
      results: [
        { rule: "a", severity: "ERROR", passed: false, message: "broken", componentsInvolved: ["CPU"] },
        { rule: "b", severity: "WARNING", passed: true, message: "fine", componentsInvolved: ["RAM"] },
      ],
      estimatedWattage: 100,
      totalPrice: 200,
    };

    expect(summarizeReportForLlm(report).issues).toEqual([{ severity: "ERROR", message: "broken" }]);
  });

  it("carries through status, estimatedWattage, and totalPrice unchanged", () => {
    const report: CompatibilityReport = {
      status: "COMPATIBLE_WITH_WARNINGS",
      results: [],
      estimatedWattage: 350,
      totalPrice: 999.5,
    };

    const summary = summarizeReportForLlm(report);
    expect(summary.status).toBe("COMPATIBLE_WITH_WARNINGS");
    expect(summary.estimatedWattage).toBe(350);
    expect(summary.totalPrice).toBe(999.5);
  });
});
