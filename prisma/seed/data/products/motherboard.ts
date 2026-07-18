import type { BaseEntry } from "./types";

export interface MotherboardEntry extends BaseEntry {
  socket: "AM4" | "AM5" | "LGA1200" | "LGA1700" | "LGA1851";
  chipset: string;
  formFactor: "E_ATX" | "ATX" | "MICRO_ATX" | "MINI_ITX";
  ramType: "DDR4" | "DDR5";
  maxRamSpeedMhz: number;
  maxMemoryGb: number;
  memorySlots: number;
  m2Slots: number;
  sataPorts: number;
  wifiIncluded: boolean;
  rearUsbPorts: number;
  pcieVersion: "PCIE_3_0" | "PCIE_4_0" | "PCIE_5_0";
}

export const motherboards: MotherboardEntry[] = [
  { name: "B450M Pro4", brand: "ASRock", socket: "AM4", chipset: "B450", formFactor: "MICRO_ATX", ramType: "DDR4", maxRamSpeedMhz: 3200, maxMemoryGb: 64, memorySlots: 4, m2Slots: 1, sataPorts: 4, wifiIncluded: false, rearUsbPorts: 6, pcieVersion: "PCIE_3_0", tier: "budget", price: 75, releaseYear: 2018 },
  { name: "Prime A520M-K", brand: "ASUS", socket: "AM4", chipset: "A520", formFactor: "MICRO_ATX", ramType: "DDR4", maxRamSpeedMhz: 3200, maxMemoryGb: 64, memorySlots: 2, m2Slots: 1, sataPorts: 4, wifiIncluded: false, rearUsbPorts: 4, pcieVersion: "PCIE_3_0", tier: "budget", price: 60, releaseYear: 2020 },
  { name: "B550-A PRO", brand: "MSI", socket: "AM4", chipset: "B550", formFactor: "ATX", ramType: "DDR4", maxRamSpeedMhz: 4400, maxMemoryGb: 128, memorySlots: 4, m2Slots: 2, sataPorts: 6, wifiIncluded: false, rearUsbPorts: 8, pcieVersion: "PCIE_4_0", tier: "mid", price: 120, releaseYear: 2020 },
  { name: "X570 AORUS ELITE", brand: "Gigabyte", socket: "AM4", chipset: "X570", formFactor: "ATX", ramType: "DDR4", maxRamSpeedMhz: 4400, maxMemoryGb: 128, memorySlots: 4, m2Slots: 2, sataPorts: 6, wifiIncluded: false, rearUsbPorts: 8, pcieVersion: "PCIE_4_0", tier: "high", price: 180, releaseYear: 2019 },
  { name: "ROG Strix B550-F Gaming", brand: "ASUS", socket: "AM4", chipset: "B550", formFactor: "ATX", ramType: "DDR4", maxRamSpeedMhz: 4600, maxMemoryGb: 128, memorySlots: 4, m2Slots: 2, sataPorts: 6, wifiIncluded: false, rearUsbPorts: 8, pcieVersion: "PCIE_4_0", tier: "high", price: 190, releaseYear: 2020 },
  { name: "A620M-HDV", brand: "ASRock", socket: "AM5", chipset: "A620", formFactor: "MICRO_ATX", ramType: "DDR5", maxRamSpeedMhz: 5600, maxMemoryGb: 96, memorySlots: 2, m2Slots: 1, sataPorts: 4, wifiIncluded: false, rearUsbPorts: 4, pcieVersion: "PCIE_4_0", tier: "budget", price: 85, releaseYear: 2023 },
  { name: "PRO B650M-A", brand: "MSI", socket: "AM5", chipset: "B650", formFactor: "MICRO_ATX", ramType: "DDR5", maxRamSpeedMhz: 6000, maxMemoryGb: 128, memorySlots: 4, m2Slots: 2, sataPorts: 4, wifiIncluded: false, rearUsbPorts: 6, pcieVersion: "PCIE_4_0", tier: "mid", price: 140, releaseYear: 2022 },
  { name: "TUF Gaming B650-PLUS", brand: "ASUS", socket: "AM5", chipset: "B650", formFactor: "ATX", ramType: "DDR5", maxRamSpeedMhz: 6400, maxMemoryGb: 128, memorySlots: 4, m2Slots: 2, sataPorts: 4, wifiIncluded: true, rearUsbPorts: 8, pcieVersion: "PCIE_4_0", tier: "mid", price: 190, releaseYear: 2022 },
  { name: "X670E AORUS Master", brand: "Gigabyte", socket: "AM5", chipset: "X670E", formFactor: "ATX", ramType: "DDR5", maxRamSpeedMhz: 7200, maxMemoryGb: 128, memorySlots: 4, m2Slots: 4, sataPorts: 6, wifiIncluded: true, rearUsbPorts: 10, pcieVersion: "PCIE_5_0", tier: "enthusiast", price: 420, releaseYear: 2022 },
  { name: "X670E Taichi", brand: "ASRock", socket: "AM5", chipset: "X670E", formFactor: "E_ATX", ramType: "DDR5", maxRamSpeedMhz: 6800, maxMemoryGb: 128, memorySlots: 4, m2Slots: 4, sataPorts: 8, wifiIncluded: true, rearUsbPorts: 12, pcieVersion: "PCIE_5_0", tier: "enthusiast", price: 450, releaseYear: 2022 },
  { name: "Prime H610M-E", brand: "ASUS", socket: "LGA1700", chipset: "H610", formFactor: "MICRO_ATX", ramType: "DDR4", maxRamSpeedMhz: 3200, maxMemoryGb: 64, memorySlots: 2, m2Slots: 1, sataPorts: 4, wifiIncluded: false, rearUsbPorts: 4, pcieVersion: "PCIE_4_0", tier: "budget", price: 70, releaseYear: 2022 },
  { name: "PRO B660M-A", brand: "MSI", socket: "LGA1700", chipset: "B660", formFactor: "MICRO_ATX", ramType: "DDR4", maxRamSpeedMhz: 3200, maxMemoryGb: 128, memorySlots: 4, m2Slots: 2, sataPorts: 4, wifiIncluded: false, rearUsbPorts: 6, pcieVersion: "PCIE_4_0", tier: "budget", price: 110, releaseYear: 2021 },
  { name: "B760 AORUS ELITE AX", brand: "Gigabyte", socket: "LGA1700", chipset: "B760", formFactor: "ATX", ramType: "DDR5", maxRamSpeedMhz: 6600, maxMemoryGb: 128, memorySlots: 4, m2Slots: 2, sataPorts: 6, wifiIncluded: true, rearUsbPorts: 8, pcieVersion: "PCIE_4_0", tier: "mid", price: 170, releaseYear: 2023 },
  { name: "ROG Strix Z690-A Gaming WIFI", brand: "ASUS", socket: "LGA1700", chipset: "Z690", formFactor: "ATX", ramType: "DDR5", maxRamSpeedMhz: 6400, maxMemoryGb: 128, memorySlots: 4, m2Slots: 4, sataPorts: 6, wifiIncluded: true, rearUsbPorts: 10, pcieVersion: "PCIE_5_0", tier: "high", price: 290, releaseYear: 2021 },
  { name: "MPG Z790 Carbon WIFI", brand: "MSI", socket: "LGA1700", chipset: "Z790", formFactor: "ATX", ramType: "DDR5", maxRamSpeedMhz: 7200, maxMemoryGb: 128, memorySlots: 4, m2Slots: 4, sataPorts: 6, wifiIncluded: true, rearUsbPorts: 10, pcieVersion: "PCIE_5_0", tier: "enthusiast", price: 360, releaseYear: 2022 },
  { name: "Z790 Taichi", brand: "ASRock", socket: "LGA1700", chipset: "Z790", formFactor: "E_ATX", ramType: "DDR5", maxRamSpeedMhz: 7600, maxMemoryGb: 128, memorySlots: 4, m2Slots: 5, sataPorts: 8, wifiIncluded: true, rearUsbPorts: 12, pcieVersion: "PCIE_5_0", tier: "enthusiast", price: 420, releaseYear: 2022 },
  { name: "B860M Gaming X", brand: "Gigabyte", socket: "LGA1851", chipset: "B860", formFactor: "MICRO_ATX", ramType: "DDR5", maxRamSpeedMhz: 7200, maxMemoryGb: 128, memorySlots: 4, m2Slots: 2, sataPorts: 4, wifiIncluded: true, rearUsbPorts: 8, pcieVersion: "PCIE_5_0", tier: "mid", price: 180, releaseYear: 2024 },
  { name: "ROG Strix Z890-E Gaming", brand: "ASUS", socket: "LGA1851", chipset: "Z890", formFactor: "ATX", ramType: "DDR5", maxRamSpeedMhz: 8000, maxMemoryGb: 192, memorySlots: 4, m2Slots: 4, sataPorts: 6, wifiIncluded: true, rearUsbPorts: 12, pcieVersion: "PCIE_5_0", tier: "enthusiast", price: 470, releaseYear: 2024 },
  { name: "MAG Z890 Tomahawk", brand: "MSI", socket: "LGA1851", chipset: "Z890", formFactor: "ATX", ramType: "DDR5", maxRamSpeedMhz: 7800, maxMemoryGb: 192, memorySlots: 4, m2Slots: 4, sataPorts: 6, wifiIncluded: true, rearUsbPorts: 10, pcieVersion: "PCIE_5_0", tier: "high", price: 310, releaseYear: 2024 },
  { name: "Prime B460M-A", brand: "ASUS", socket: "LGA1200", chipset: "B460", formFactor: "MICRO_ATX", ramType: "DDR4", maxRamSpeedMhz: 2933, maxMemoryGb: 64, memorySlots: 2, m2Slots: 1, sataPorts: 4, wifiIncluded: false, rearUsbPorts: 4, pcieVersion: "PCIE_3_0", tier: "budget", price: 65, releaseYear: 2020 },
];
