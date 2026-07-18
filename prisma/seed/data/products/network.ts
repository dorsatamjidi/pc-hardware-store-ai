import type { BaseEntry } from "./types";

export interface NetworkCardEntry extends BaseEntry {
  interfaceType: "PCIe" | "USB";
  speedMbps: number;
  wifiStandard: string | null;
}

export const networkCards: NetworkCardEntry[] = [
  { name: "I225-V 2.5GbE", brand: "Intel", interfaceType: "PCIe", speedMbps: 2500, wifiStandard: null, tier: "budget", price: 25, releaseYear: 2020 },
  { name: "Archer TX3000E", brand: "TP-Link", interfaceType: "PCIe", speedMbps: 2402, wifiStandard: "Wi-Fi 6", tier: "budget", price: 40, releaseYear: 2021 },
  { name: "USB-AC68", brand: "ASUS", interfaceType: "USB", speedMbps: 1300, wifiStandard: "Wi-Fi 5", tier: "budget", price: 50, releaseYear: 2016 },
  { name: "A8000", brand: "Netgear", interfaceType: "USB", speedMbps: 2400, wifiStandard: "Wi-Fi 6", tier: "budget", price: 70, releaseYear: 2020 },
  { name: "AX210", brand: "Intel", interfaceType: "PCIe", speedMbps: 2400, wifiStandard: "Wi-Fi 6E", tier: "mid", price: 35, releaseYear: 2021 },
  { name: "PCE-AX58BT", brand: "ASUS", interfaceType: "PCIe", speedMbps: 2402, wifiStandard: "Wi-Fi 6", tier: "mid", price: 70, releaseYear: 2020 },
  { name: "TX401 10GbE", brand: "TP-Link", interfaceType: "PCIe", speedMbps: 10000, wifiStandard: null, tier: "mid", price: 60, releaseYear: 2021 },
  { name: "Archer TXE75E", brand: "TP-Link", interfaceType: "PCIe", speedMbps: 5764, wifiStandard: "Wi-Fi 6E", tier: "high", price: 90, releaseYear: 2022 },
];
