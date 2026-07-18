import { describe, it, expect } from "vitest";
import { runCompatibilityEngine } from "@/server/compatibility/engine";
import { makeComponent } from "../../fixtures/products";
import type { Build } from "@/server/compatibility/types";

describe("runCompatibilityEngine", () => {
  it("reports COMPATIBLE for an empty build (no applicable rules)", () => {
    const report = runCompatibilityEngine({});
    expect(report.status).toBe("COMPATIBLE");
    expect(report.results).toHaveLength(0);
    expect(report.estimatedWattage).toBeNull();
  });

  it("reports COMPATIBLE when a matching CPU+motherboard pair is selected", () => {
    const build: Build = {
      CPU: makeComponent({ price: 300, compatibility: { socketType: "AM5", tdpWatts: 105 } }),
      MOTHERBOARD: makeComponent({ price: 200, compatibility: { socketType: "AM5" } }),
    };
    const report = runCompatibilityEngine(build);
    expect(report.status).toBe("COMPATIBLE");
    expect(report.totalPrice).toBe(500);
  });

  it("reports INCOMPATIBLE when any ERROR-severity rule fails, even alongside passing rules", () => {
    const build: Build = {
      CPU: makeComponent({ compatibility: { socketType: "AM5", tdpWatts: 105 } }),
      MOTHERBOARD: makeComponent({ compatibility: { socketType: "LGA1700" } }),
      COOLER: makeComponent({ compatibility: { tdpWatts: 200 } }), // headroom is fine
    };
    const report = runCompatibilityEngine(build);
    expect(report.status).toBe("INCOMPATIBLE");
  });

  it("reports COMPATIBLE_WITH_WARNINGS when only WARNING-severity rules fail", () => {
    const build: Build = {
      CPU: makeComponent({ compatibility: { socketType: "AM5", tdpWatts: 170 } }),
      COOLER: makeComponent({ compatibility: { coolerSupportedSockets: ["AM5"], tdpWatts: 125 } }),
    };
    const report = runCompatibilityEngine(build);
    expect(report.status).toBe("COMPATIBLE_WITH_WARNINGS");
  });

  it("estimates wattage from CPU TDP + GPU draw + baseline", () => {
    const build: Build = {
      CPU: makeComponent({ compatibility: { tdpWatts: 105 } }),
      GPU: makeComponent({ compatibility: { powerDrawWatts: 250 } }),
    };
    const report = runCompatibilityEngine(build);
    expect(report.estimatedWattage).toBe(105 + 250 + 100);
  });
});
