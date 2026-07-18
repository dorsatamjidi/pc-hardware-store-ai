import { describe, it, expect } from "vitest";
import { checkStorageInterfaceAvailability } from "@/server/compatibility/rules/storage-interface-availability";
import { makeComponent } from "../../fixtures/products";
import type { Build } from "@/server/compatibility/types";

describe("checkStorageInterfaceAvailability", () => {
  it("passes when enough M.2 slots are available", () => {
    const build: Build = {
      STORAGE: makeComponent({ compatibility: { driveInterface: "NVME_PCIE4_X4" } }, 2),
      MOTHERBOARD: makeComponent({ specs: { m2Slots: 2, sataPorts: 4 } }),
    };
    expect(checkStorageInterfaceAvailability(build)?.passed).toBe(true);
  });

  it("warns when more NVMe drives are requested than M.2 slots exist", () => {
    const build: Build = {
      STORAGE: makeComponent({ compatibility: { driveInterface: "NVME_PCIE4_X4" } }, 3),
      MOTHERBOARD: makeComponent({ specs: { m2Slots: 2, sataPorts: 4 } }),
    };
    const result = checkStorageInterfaceAvailability(build);
    expect(result?.passed).toBe(false);
    expect(result?.severity).toBe("WARNING");
  });

  it("checks SATA ports separately from M.2 slots", () => {
    const build: Build = {
      STORAGE: makeComponent({ compatibility: { driveInterface: "SATA_3" } }, 5),
      MOTHERBOARD: makeComponent({ specs: { m2Slots: 1, sataPorts: 4 } }),
    };
    const result = checkStorageInterfaceAvailability(build);
    expect(result?.passed).toBe(false);
  });
});
