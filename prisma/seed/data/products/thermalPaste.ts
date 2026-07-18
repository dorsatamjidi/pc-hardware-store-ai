import type { BaseEntry } from "./types";

export interface ThermalPasteEntry extends BaseEntry {
  volumeGrams: number;
  thermalConductivityWmK: number;
}

export const thermalPastes: ThermalPasteEntry[] = [
  { name: "MX-4", brand: "Arctic", volumeGrams: 4, thermalConductivityWmK: 8.5, tier: "budget", price: 8, releaseYear: 2019 },
  { name: "MX-6", brand: "Arctic", volumeGrams: 4, thermalConductivityWmK: 9.0, tier: "mid", price: 10, releaseYear: 2022 },
  { name: "NT-H1", brand: "Noctua", volumeGrams: 3.5, thermalConductivityWmK: 8.9, tier: "budget", price: 9, releaseYear: 2016 },
  { name: "NT-H2", brand: "Noctua", volumeGrams: 3.5, thermalConductivityWmK: 8.9, tier: "mid", price: 13, releaseYear: 2020 },
  { name: "Kryonaut", brand: "Thermal Grizzly", volumeGrams: 1, thermalConductivityWmK: 12.5, tier: "high", price: 12, releaseYear: 2018 },
  { name: "MasterGel Maker Nano", brand: "Cooler Master", volumeGrams: 4, thermalConductivityWmK: 11.0, tier: "high", price: 10, releaseYear: 2019 },
];
