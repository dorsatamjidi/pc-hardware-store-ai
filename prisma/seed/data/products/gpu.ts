import type { BaseEntry } from "./types";

export interface GpuEntry extends BaseEntry {
  chipVendor: "NVIDIA" | "AMD";
  vramGb: number;
  memoryType: "GDDR6" | "GDDR6X";
  boostClockMhz: number;
  tdpWatts: number;
  lengthMm: number;
  pcieVersion: "PCIE_3_0" | "PCIE_4_0" | "PCIE_5_0";
}

export const gpus: GpuEntry[] = [
  { name: "GAMING GeForce RTX 3050 8GB", brand: "Zotac", chipVendor: "NVIDIA", vramGb: 8, memoryType: "GDDR6", boostClockMhz: 1777, tdpWatts: 130, lengthMm: 200, pcieVersion: "PCIE_4_0", tier: "budget", price: 230, releaseYear: 2022 },
  { name: "GAMING GeForce RTX 3050 6GB", brand: "Zotac", chipVendor: "NVIDIA", vramGb: 6, memoryType: "GDDR6", boostClockMhz: 1777, tdpWatts: 70, lengthMm: 173, pcieVersion: "PCIE_4_0", tier: "budget", price: 180, releaseYear: 2023 },
  { name: "Dual GeForce RTX 3060", brand: "ASUS", chipVendor: "NVIDIA", vramGb: 12, memoryType: "GDDR6", boostClockMhz: 1777, tdpWatts: 170, lengthMm: 242, pcieVersion: "PCIE_4_0", tier: "mid", price: 330, releaseYear: 2021 },
  { name: "Ventus GeForce RTX 4060", brand: "MSI", chipVendor: "NVIDIA", vramGb: 8, memoryType: "GDDR6", boostClockMhz: 2460, tdpWatts: 115, lengthMm: 220, pcieVersion: "PCIE_4_0", tier: "mid", price: 300, releaseYear: 2023 },
  { name: "Ventus GeForce RTX 4060 Ti", brand: "MSI", chipVendor: "NVIDIA", vramGb: 8, memoryType: "GDDR6", boostClockMhz: 2535, tdpWatts: 160, lengthMm: 245, pcieVersion: "PCIE_4_0", tier: "mid", price: 400, releaseYear: 2023 },
  { name: "WINDFORCE GeForce RTX 4060 Ti 16G", brand: "Gigabyte", chipVendor: "NVIDIA", vramGb: 16, memoryType: "GDDR6", boostClockMhz: 2535, tdpWatts: 165, lengthMm: 260, pcieVersion: "PCIE_4_0", tier: "mid", price: 450, releaseYear: 2023 },
  { name: "TUF Gaming GeForce RTX 4070", brand: "ASUS", chipVendor: "NVIDIA", vramGb: 12, memoryType: "GDDR6X", boostClockMhz: 2475, tdpWatts: 200, lengthMm: 300, pcieVersion: "PCIE_4_0", tier: "high", price: 600, releaseYear: 2023 },
  { name: "Twin Edge GeForce RTX 4070", brand: "Zotac", chipVendor: "NVIDIA", vramGb: 12, memoryType: "GDDR6X", boostClockMhz: 2475, tdpWatts: 200, lengthMm: 224, pcieVersion: "PCIE_4_0", tier: "high", price: 580, releaseYear: 2023 },
  { name: "GAMING OC GeForce RTX 4070 SUPER", brand: "Gigabyte", chipVendor: "NVIDIA", vramGb: 12, memoryType: "GDDR6X", boostClockMhz: 2550, tdpWatts: 220, lengthMm: 320, pcieVersion: "PCIE_4_0", tier: "high", price: 650, releaseYear: 2024 },
  { name: "Gaming X Trio GeForce RTX 4070 Ti SUPER", brand: "MSI", chipVendor: "NVIDIA", vramGb: 16, memoryType: "GDDR6X", boostClockMhz: 2610, tdpWatts: 285, lengthMm: 336, pcieVersion: "PCIE_4_0", tier: "high", price: 800, releaseYear: 2024 },
  { name: "FTW3 GeForce RTX 3080", brand: "EVGA", chipVendor: "NVIDIA", vramGb: 10, memoryType: "GDDR6X", boostClockMhz: 1785, tdpWatts: 320, lengthMm: 285, pcieVersion: "PCIE_4_0", tier: "high", price: 620, releaseYear: 2020 },
  { name: "Eagle GeForce RTX 4080", brand: "Gigabyte", chipVendor: "NVIDIA", vramGb: 16, memoryType: "GDDR6X", boostClockMhz: 2505, tdpWatts: 320, lengthMm: 336, pcieVersion: "PCIE_4_0", tier: "enthusiast", price: 999, releaseYear: 2022 },
  { name: "AORUS GeForce RTX 4080 SUPER", brand: "Gigabyte", chipVendor: "NVIDIA", vramGb: 16, memoryType: "GDDR6X", boostClockMhz: 2550, tdpWatts: 320, lengthMm: 348, pcieVersion: "PCIE_4_0", tier: "enthusiast", price: 1000, releaseYear: 2024 },
  { name: "ROG Strix GeForce RTX 4090", brand: "ASUS", chipVendor: "NVIDIA", vramGb: 24, memoryType: "GDDR6X", boostClockMhz: 2520, tdpWatts: 450, lengthMm: 357, pcieVersion: "PCIE_4_0", tier: "enthusiast", price: 1800, releaseYear: 2022 },
  { name: "Pulse Radeon RX 6600", brand: "Sapphire", chipVendor: "AMD", vramGb: 8, memoryType: "GDDR6", boostClockMhz: 2491, tdpWatts: 132, lengthMm: 220, pcieVersion: "PCIE_4_0", tier: "budget", price: 220, releaseYear: 2021 },
  { name: "Fighter Radeon RX 6650 XT", brand: "PowerColor", chipVendor: "AMD", vramGb: 8, memoryType: "GDDR6", boostClockMhz: 2635, tdpWatts: 180, lengthMm: 244, pcieVersion: "PCIE_4_0", tier: "mid", price: 260, releaseYear: 2022 },
  { name: "Nitro+ Radeon RX 7600", brand: "Sapphire", chipVendor: "AMD", vramGb: 8, memoryType: "GDDR6", boostClockMhz: 2655, tdpWatts: 165, lengthMm: 240, pcieVersion: "PCIE_4_0", tier: "mid", price: 270, releaseYear: 2023 },
  { name: "Dual Radeon RX 7700 XT", brand: "ASUS", chipVendor: "AMD", vramGb: 12, memoryType: "GDDR6", boostClockMhz: 2584, tdpWatts: 245, lengthMm: 280, pcieVersion: "PCIE_4_0", tier: "high", price: 450, releaseYear: 2023 },
  { name: "Pulse Radeon RX 7800 XT", brand: "Sapphire", chipVendor: "AMD", vramGb: 16, memoryType: "GDDR6", boostClockMhz: 2430, tdpWatts: 263, lengthMm: 300, pcieVersion: "PCIE_4_0", tier: "high", price: 500, releaseYear: 2023 },
  { name: "Pulse Radeon RX 7900 GRE", brand: "Sapphire", chipVendor: "AMD", vramGb: 16, memoryType: "GDDR6", boostClockMhz: 2245, tdpWatts: 260, lengthMm: 267, pcieVersion: "PCIE_4_0", tier: "high", price: 550, releaseYear: 2024 },
  { name: "Red Devil Radeon RX 7900 XTX", brand: "PowerColor", chipVendor: "AMD", vramGb: 24, memoryType: "GDDR6", boostClockMhz: 2500, tdpWatts: 355, lengthMm: 344, pcieVersion: "PCIE_4_0", tier: "enthusiast", price: 950, releaseYear: 2022 },
  { name: "ROG Strix Radeon RX 7900 XTX", brand: "ASUS", chipVendor: "AMD", vramGb: 24, memoryType: "GDDR6", boostClockMhz: 2500, tdpWatts: 355, lengthMm: 348, pcieVersion: "PCIE_4_0", tier: "enthusiast", price: 1050, releaseYear: 2022 },
];
