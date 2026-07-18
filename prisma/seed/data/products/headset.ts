import type { BaseEntry } from "./types";

export interface HeadsetEntry extends BaseEntry {
  driverSizeMm: number;
  wireless: boolean;
  microphone: boolean;
  surroundSound: boolean;
}

export const headsets: HeadsetEntry[] = [
  { name: "H111", brand: "Logitech", driverSizeMm: 40, wireless: false, microphone: true, surroundSound: false, tier: "budget", price: 20, releaseYear: 2018 },
  { name: "Cloud Stinger", brand: "HyperX", driverSizeMm: 50, wireless: false, microphone: true, surroundSound: false, tier: "budget", price: 40, releaseYear: 2018 },
  { name: "Arctis 1", brand: "SteelSeries", driverSizeMm: 40, wireless: false, microphone: true, surroundSound: false, tier: "budget", price: 50, releaseYear: 2019 },
  { name: "HS55", brand: "Corsair", driverSizeMm: 50, wireless: false, microphone: true, surroundSound: false, tier: "budget", price: 50, releaseYear: 2022 },
  { name: "Kraken X", brand: "Razer", driverSizeMm: 50, wireless: false, microphone: true, surroundSound: false, tier: "mid", price: 50, releaseYear: 2019 },
  { name: "Cloud II", brand: "HyperX", driverSizeMm: 53, wireless: false, microphone: true, surroundSound: true, tier: "mid", price: 80, releaseYear: 2017 },
  { name: "G Pro X", brand: "Logitech", driverSizeMm: 50, wireless: false, microphone: true, surroundSound: true, tier: "mid", price: 100, releaseYear: 2019 },
  { name: "Arctis 7", brand: "SteelSeries", driverSizeMm: 40, wireless: true, microphone: true, surroundSound: true, tier: "high", price: 150, releaseYear: 2020 },
  { name: "BlackShark V2 Pro", brand: "Razer", driverSizeMm: 50, wireless: true, microphone: true, surroundSound: true, tier: "high", price: 180, releaseYear: 2021 },
  { name: "Virtuoso RGB Wireless", brand: "Corsair", driverSizeMm: 50, wireless: true, microphone: true, surroundSound: true, tier: "enthusiast", price: 200, releaseYear: 2020 },
];
