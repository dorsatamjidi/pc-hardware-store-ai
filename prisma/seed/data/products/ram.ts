import type { BaseEntry } from "./types";

export interface RamEntry extends BaseEntry {
  ramType: "DDR4" | "DDR5";
  capacityGb: number;
  moduleCount: number;
  speedMhz: number;
  casLatency: number;
  rgb: boolean;
}

export const ramKits: RamEntry[] = [
  // DDR4
  { name: "Vengeance LPX 16GB DDR4-3200", brand: "Corsair", ramType: "DDR4", capacityGb: 16, moduleCount: 2, speedMhz: 3200, casLatency: 16, rgb: false, tier: "budget", price: 40, releaseYear: 2018 },
  { name: "Vengeance RGB Pro 32GB DDR4-3600", brand: "Corsair", ramType: "DDR4", capacityGb: 32, moduleCount: 2, speedMhz: 3600, casLatency: 18, rgb: true, tier: "mid", price: 85, releaseYear: 2019 },
  { name: "Ripjaws V 16GB DDR4-3600", brand: "G.Skill", ramType: "DDR4", capacityGb: 16, moduleCount: 2, speedMhz: 3600, casLatency: 16, rgb: false, tier: "budget", price: 45, releaseYear: 2019 },
  { name: "Trident Z RGB 32GB DDR4-3200", brand: "G.Skill", ramType: "DDR4", capacityGb: 32, moduleCount: 2, speedMhz: 3200, casLatency: 14, rgb: true, tier: "high", price: 110, releaseYear: 2018 },
  { name: "FURY Beast 16GB DDR4-3200", brand: "Kingston", ramType: "DDR4", capacityGb: 16, moduleCount: 2, speedMhz: 3200, casLatency: 16, rgb: false, tier: "budget", price: 38, releaseYear: 2020 },
  { name: "Ballistix 32GB DDR4-3600", brand: "Crucial", ramType: "DDR4", capacityGb: 32, moduleCount: 2, speedMhz: 3600, casLatency: 16, rgb: false, tier: "mid", price: 95, releaseYear: 2020 },
  { name: "Dominator Platinum 64GB DDR4-3600", brand: "Corsair", ramType: "DDR4", capacityGb: 64, moduleCount: 4, speedMhz: 3600, casLatency: 18, rgb: true, tier: "enthusiast", price: 220, releaseYear: 2019 },
  // DDR5
  { name: "Vengeance 32GB DDR5-5600", brand: "Corsair", ramType: "DDR5", capacityGb: 32, moduleCount: 2, speedMhz: 5600, casLatency: 36, rgb: false, tier: "mid", price: 95, releaseYear: 2022 },
  { name: "Dominator Titanium 32GB DDR5-6600", brand: "Corsair", ramType: "DDR5", capacityGb: 32, moduleCount: 2, speedMhz: 6600, casLatency: 32, rgb: true, tier: "enthusiast", price: 180, releaseYear: 2023 },
  { name: "Trident Z5 RGB 32GB DDR5-6000", brand: "G.Skill", ramType: "DDR5", capacityGb: 32, moduleCount: 2, speedMhz: 6000, casLatency: 30, rgb: true, tier: "high", price: 130, releaseYear: 2022 },
  { name: "Flare X5 32GB DDR5-5600", brand: "G.Skill", ramType: "DDR5", capacityGb: 32, moduleCount: 2, speedMhz: 5600, casLatency: 36, rgb: false, tier: "mid", price: 100, releaseYear: 2023 },
  { name: "FURY Beast 32GB DDR5-5200", brand: "Kingston", ramType: "DDR5", capacityGb: 32, moduleCount: 2, speedMhz: 5200, casLatency: 40, rgb: false, tier: "budget", price: 85, releaseYear: 2022 },
  { name: "FURY Renegade 32GB DDR5-7200", brand: "Kingston", ramType: "DDR5", capacityGb: 32, moduleCount: 2, speedMhz: 7200, casLatency: 38, rgb: true, tier: "enthusiast", price: 160, releaseYear: 2022 },
  { name: "Pro 32GB DDR5-5600", brand: "Crucial", ramType: "DDR5", capacityGb: 32, moduleCount: 2, speedMhz: 5600, casLatency: 46, rgb: false, tier: "budget", price: 88, releaseYear: 2023 },
  { name: "Trident Z5 RGB 64GB DDR5-6400", brand: "G.Skill", ramType: "DDR5", capacityGb: 64, moduleCount: 2, speedMhz: 6400, casLatency: 32, rgb: true, tier: "enthusiast", price: 230, releaseYear: 2022 },
  { name: "Vengeance 64GB DDR5-5200", brand: "Corsair", ramType: "DDR5", capacityGb: 64, moduleCount: 2, speedMhz: 5200, casLatency: 40, rgb: false, tier: "high", price: 190, releaseYear: 2022 },
  { name: "FURY Beast RGB 16GB DDR5-6000", brand: "Kingston", ramType: "DDR5", capacityGb: 16, moduleCount: 2, speedMhz: 6000, casLatency: 40, rgb: true, tier: "budget", price: 65, releaseYear: 2023 },
  { name: "Ripjaws S5 16GB DDR5-5600", brand: "G.Skill", ramType: "DDR5", capacityGb: 16, moduleCount: 2, speedMhz: 5600, casLatency: 36, rgb: false, tier: "budget", price: 60, releaseYear: 2023 },
];
