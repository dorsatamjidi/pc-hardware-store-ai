import { describe, it, expect } from "vitest";
import { checkPsuWattageHeadroom } from "@/server/compatibility/rules/psu-wattage-headroom";
import { makeComponent } from "../../fixtures/products";
import type { Build } from "@/server/compatibility/types";

describe("checkPsuWattageHeadroom", () => {
  it("errors when the PSU can't cover estimated draw at all", () => {
    // 100W CPU + 300W GPU + 100W baseline = 500W estimated draw
    const build: Build = {
      CPU: makeComponent({ compatibility: { tdpWatts: 100 } }),
      GPU: makeComponent({ compatibility: { powerDrawWatts: 300 } }),
      PSU: makeComponent({ compatibility: { wattageCapacity: 450 } }),
    };
    const result = checkPsuWattageHeadroom(build);
    expect(result?.passed).toBe(false);
    expect(result?.severity).toBe("ERROR");
  });

  it("warns when the PSU covers draw but with less than 20% headroom", () => {
    // Estimated draw 500W, recommended capacity ~600W; 550W PSU covers draw but not full headroom
    const build: Build = {
      CPU: makeComponent({ compatibility: { tdpWatts: 100 } }),
      GPU: makeComponent({ compatibility: { powerDrawWatts: 300 } }),
      PSU: makeComponent({ compatibility: { wattageCapacity: 550 } }),
    };
    const result = checkPsuWattageHeadroom(build);
    expect(result?.passed).toBe(false);
    expect(result?.severity).toBe("WARNING");
  });

  it("passes when the PSU comfortably exceeds recommended headroom", () => {
    const build: Build = {
      CPU: makeComponent({ compatibility: { tdpWatts: 100 } }),
      GPU: makeComponent({ compatibility: { powerDrawWatts: 300 } }),
      PSU: makeComponent({ compatibility: { wattageCapacity: 750 } }),
    };
    expect(checkPsuWattageHeadroom(build)?.passed).toBe(true);
  });

  it("returns null when neither CPU nor GPU is selected yet", () => {
    const build: Build = {
      PSU: makeComponent({ compatibility: { wattageCapacity: 750 } }),
    };
    expect(checkPsuWattageHeadroom(build)).toBeNull();
  });
});
