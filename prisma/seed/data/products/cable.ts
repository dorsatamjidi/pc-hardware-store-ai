import type { BaseEntry } from "./types";

export interface CableEntry extends BaseEntry {
  cableType: string;
  lengthCm: number;
}

export const cables: CableEntry[] = [
  { name: "24-Pin ATX Extension", brand: "CableMod", cableType: "PSU Extension", lengthCm: 30, tier: "budget", price: 35, releaseYear: 2021 },
  { name: "Premium Sleeved I/O Extension Kit", brand: "Corsair", cableType: "Front Panel Extension", lengthCm: 45, tier: "budget", price: 30, releaseYear: 2020 },
  { name: "PCIe 4.0 Riser Cable", brand: "CableMod", cableType: "PCIe Riser", lengthCm: 20, tier: "mid", price: 50, releaseYear: 2022 },
  { name: "SATA 6Gbps Cable (2-Pack)", brand: "Corsair", cableType: "SATA Data Cable", lengthCm: 60, tier: "budget", price: 6, releaseYear: 2018 },
  { name: "12VHPWR Adapter Cable", brand: "CableMod", cableType: "12VHPWR to 2x8-Pin", lengthCm: 30, tier: "mid", price: 25, releaseYear: 2023 },
  { name: "RGB LED Lighting PRO Expansion Kit", brand: "Corsair", cableType: "RGB Fan Hub Cable", lengthCm: 100, tier: "budget", price: 35, releaseYear: 2019 },
  { name: "ModFlex Sleeved Extension Kit", brand: "CableMod", cableType: "PSU Cable Extension", lengthCm: 30, tier: "mid", price: 60, releaseYear: 2021 },
  { name: "iCUE LINK Connector Cable", brand: "Corsair", cableType: "iCUE LINK Cable", lengthCm: 20, tier: "budget", price: 10, releaseYear: 2023 },
  { name: "Angled 12VHPWR Adapter", brand: "CableMod", cableType: "12VHPWR 90-Degree", lengthCm: 15, tier: "mid", price: 30, releaseYear: 2023 },
  { name: "USB 2.0 Internal Header Extension", brand: "Corsair", cableType: "USB Internal Header Extension", lengthCm: 45, tier: "budget", price: 12, releaseYear: 2019 },
];
