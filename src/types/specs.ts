import type { ProductType } from "@prisma/client";

/**
 * Display-only specs stored in `Product.specs` (JSON). These are shown on the
 * spec sheet UI and folded into the RAG embedding source text. Fields the
 * compatibility engine or structured filters need to query live in
 * `ProductCompatibility` instead (typed columns), not here.
 */

export interface CpuSpecs {
  cores: number;
  threads: number;
  baseClockGhz: number;
  boostClockGhz: number;
  cacheMb: number;
  architecture: string;
  integratedGraphics: string | null;
  unlocked: boolean;
}

export interface MotherboardSpecs {
  chipset: string;
  memorySlots: number;
  maxMemoryGb: number;
  sataPorts: number;
  m2Slots: number;
  wifiIncluded: boolean;
  rearUsbPorts: number;
}

export interface RamSpecs {
  capacityGb: number;
  kit: string;
  speedMhz: number;
  casLatency: number;
  rgb: boolean;
}

export interface GpuSpecs {
  vramGb: number;
  memoryType: string;
  boostClockMhz: number;
  tdpWatts: number;
  outputs: string[];
  lengthMm: number;
}

export interface StorageSpecs {
  capacityGb: number;
  formFactor: string;
  readSpeedMbps: number;
  writeSpeedMbps: number;
  nandType: string;
}

export interface PsuSpecs {
  wattage: number;
  efficiency: string;
  modular: string;
  fanSizeMm: number;
}

export interface CaseSpecs {
  supportedFormFactors: string[];
  includedFans: number;
  sidePanel: string;
  driveBays: number;
}

export interface CoolerSpecs {
  coolerType: "AIR" | "AIO";
  radiatorSizeMm: number | null;
  fanCount: number;
  heatpipes: number | null;
}

export interface FanSpecs {
  sizeMm: number;
  rgb: boolean;
  airflowCfm: number;
  noiseLevelDb: number;
}

export interface MonitorSpecs {
  sizeInches: number;
  resolution: string;
  refreshRateHz: number;
  panelType: string;
  responseTimeMs: number;
}

export interface KeyboardSpecs {
  switchType: string;
  layout: string;
  backlight: string;
  wireless: boolean;
}

export interface MouseSpecs {
  dpi: number;
  buttons: number;
  wireless: boolean;
  weightG: number;
}

export interface HeadsetSpecs {
  driverSizeMm: number;
  wireless: boolean;
  microphone: boolean;
  surroundSound: boolean;
}

export interface NetworkCardSpecs {
  interfaceType: string;
  speedMbps: number;
  wifiStandard: string | null;
}

export interface CableSpecs {
  cableType: string;
  lengthCm: number;
}

export interface ThermalPasteSpecs {
  volumeGrams: number;
  thermalConductivityWmK: number;
}

export interface SpecsByType {
  CPU: CpuSpecs;
  MOTHERBOARD: MotherboardSpecs;
  RAM: RamSpecs;
  GPU: GpuSpecs;
  STORAGE: StorageSpecs;
  PSU: PsuSpecs;
  CASE: CaseSpecs;
  COOLER: CoolerSpecs;
  FAN: FanSpecs;
  MONITOR: MonitorSpecs;
  KEYBOARD: KeyboardSpecs;
  MOUSE: MouseSpecs;
  HEADSET: HeadsetSpecs;
  NETWORK_CARD: NetworkCardSpecs;
  CABLE: CableSpecs;
  THERMAL_PASTE: ThermalPasteSpecs;
}

export type ProductSpecs = SpecsByType[keyof SpecsByType];

export type SpecsFor<T extends ProductType> = SpecsByType[T];
