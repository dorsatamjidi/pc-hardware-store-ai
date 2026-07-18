import type {
  CpuSocket,
  RamType,
  FormFactor,
  PcieVersion,
  DriveInterface,
  PsuEfficiency,
  ProductType,
} from "@prisma/client";
import { slugify } from "./rng";
import type { Tier } from "../data/products/types";
import { cpus } from "../data/products/cpu";
import { motherboards } from "../data/products/motherboard";
import { ramKits } from "../data/products/ram";
import { gpus } from "../data/products/gpu";
import { storageDrives } from "../data/products/storage";
import { psus } from "../data/products/psu";
import { cases } from "../data/products/case";
import { coolers } from "../data/products/cooler";
import { fans } from "../data/products/fan";
import { monitors } from "../data/products/monitor";
import { keyboards } from "../data/products/keyboard";
import { mice } from "../data/products/mouse";
import { headsets } from "../data/products/headset";
import { networkCards } from "../data/products/network";
import { cables } from "../data/products/cable";
import { thermalPastes } from "../data/products/thermalPaste";

export interface CompatibilityFields {
  socketType?: CpuSocket;
  chipset?: string;
  ramType?: RamType;
  ramSpeedMhz?: number;
  maxRamCapacityGb?: number;
  maxRamSlots?: number;
  formFactor?: FormFactor;
  pcieVersion?: PcieVersion;
  pcieLanes?: number;
  tdpWatts?: number;
  powerDrawWatts?: number;
  wattageCapacity?: number;
  efficiencyRating?: PsuEfficiency;
  coolerSupportedSockets?: CpuSocket[];
  driveInterface?: DriveInterface;
  caseMaxGpuLengthMm?: number;
  caseMaxCoolerHeightMm?: number;
  caseSupportedFormFactors?: FormFactor[];
  gpuLengthMm?: number;
}

export interface ProductSeedInput {
  type: ProductType;
  brand: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  tier: Tier;
  releaseYear: number;
  specs: Record<string, unknown>;
  compatibility: CompatibilityFields;
}

function makeSlug(brand: string, name: string): string {
  return slugify(`${brand} ${name}`);
}

function buildCpus(): ProductSeedInput[] {
  return cpus.map((c) => ({
    type: "CPU",
    brand: c.brand,
    name: `${c.brand} ${c.name}`,
    slug: makeSlug(c.brand, c.name),
    price: c.price,
    tier: c.tier,
    releaseYear: c.releaseYear,
    shortDescription: `${c.cores}-core / ${c.threads}-thread ${c.socket} processor, boosts to ${c.boostClockGhz}GHz.`,
    description:
      `The ${c.brand} ${c.name} is a ${c.cores}-core, ${c.threads}-thread desktop processor built on the ${c.architecture} architecture ` +
      `for the ${c.socket} socket. It runs at a ${c.baseClockGhz}GHz base clock and boosts up to ${c.boostClockGhz}GHz, backed by ` +
      `${c.cacheMb}MB of cache, within a ${c.tdpWatts}W thermal envelope. ` +
      (c.integratedGraphics
        ? `Integrated ${c.integratedGraphics} graphics are included, so a discrete GPU isn't required to get a display working. `
        : `It does not include integrated graphics, so a discrete GPU is required. `) +
      (c.unlocked
        ? `The multiplier is unlocked, making it suitable for manual overclocking on a compatible motherboard.`
        : `The multiplier is locked, so clock speeds run at rated boost out of the box.`),
    specs: {
      cores: c.cores,
      threads: c.threads,
      baseClockGhz: c.baseClockGhz,
      boostClockGhz: c.boostClockGhz,
      cacheMb: c.cacheMb,
      architecture: c.architecture,
      integratedGraphics: c.integratedGraphics,
      unlocked: c.unlocked,
    },
    compatibility: {
      socketType: c.socket,
      tdpWatts: c.tdpWatts,
    },
  }));
}

function buildMotherboards(): ProductSeedInput[] {
  return motherboards.map((m) => ({
    type: "MOTHERBOARD",
    brand: m.brand,
    name: `${m.brand} ${m.name}`,
    slug: makeSlug(m.brand, m.name),
    price: m.price,
    tier: m.tier,
    releaseYear: m.releaseYear,
    shortDescription: `${m.socket} ${m.chipset} chipset, ${m.formFactor.replace("_", "-")}, ${m.ramType} up to ${m.maxRamSpeedMhz}MHz.`,
    description:
      `The ${m.brand} ${m.name} is a ${m.formFactor.replace("_", "-")} motherboard built around the ${m.chipset} chipset for ${m.socket} processors. ` +
      `It has ${m.memorySlots} ${m.ramType} slots supporting up to ${m.maxMemoryGb}GB at speeds up to ${m.maxRamSpeedMhz}MHz, ` +
      `${m.m2Slots} M.2 slot(s), and ${m.sataPorts} SATA ports for expansion. ` +
      (m.wifiIncluded ? "Wi-Fi and Bluetooth are built in. " : "Wi-Fi is not included, so use a wired connection or an add-in card. ") +
      `${m.rearUsbPorts} rear USB ports and a ${m.pcieVersion.replace("_", " ").replace("PCIE", "PCIe")} primary expansion slot round out the connectivity.`,
    specs: {
      chipset: m.chipset,
      memorySlots: m.memorySlots,
      maxMemoryGb: m.maxMemoryGb,
      sataPorts: m.sataPorts,
      m2Slots: m.m2Slots,
      wifiIncluded: m.wifiIncluded,
      rearUsbPorts: m.rearUsbPorts,
    },
    compatibility: {
      socketType: m.socket,
      chipset: m.chipset,
      ramType: m.ramType,
      ramSpeedMhz: m.maxRamSpeedMhz,
      maxRamCapacityGb: m.maxMemoryGb,
      maxRamSlots: m.memorySlots,
      formFactor: m.formFactor,
      pcieVersion: m.pcieVersion,
      pcieLanes: 16,
    },
  }));
}

function buildRam(): ProductSeedInput[] {
  return ramKits.map((r) => {
    const kit = `${r.moduleCount}x${r.capacityGb / r.moduleCount}GB`;
    return {
      type: "RAM" as const,
      brand: r.brand,
      name: `${r.brand} ${r.name}`,
      slug: makeSlug(r.brand, r.name),
      price: r.price,
      tier: r.tier,
      releaseYear: r.releaseYear,
      shortDescription: `${r.capacityGb}GB (${kit}) ${r.ramType}-${r.speedMhz} CL${r.casLatency}.`,
      description:
        `The ${r.brand} ${r.name} is a ${r.capacityGb}GB ${r.ramType} memory kit (${kit}) running at ${r.speedMhz}MHz with a CAS latency of ${r.casLatency}. ` +
        (r.rgb
          ? "Addressable RGB lighting is built into each module for cases with a side window."
          : "The modules use a low-profile heatspreader with no RGB lighting, prioritizing clearance and value."),
      specs: {
        capacityGb: r.capacityGb,
        kit,
        speedMhz: r.speedMhz,
        casLatency: r.casLatency,
        rgb: r.rgb,
      },
      compatibility: {
        ramType: r.ramType,
        ramSpeedMhz: r.speedMhz,
      },
    };
  });
}

function buildGpus(): ProductSeedInput[] {
  return gpus.map((g) => ({
    type: "GPU",
    brand: g.brand,
    name: `${g.brand} ${g.name}`,
    slug: makeSlug(g.brand, g.name),
    price: g.price,
    tier: g.tier,
    releaseYear: g.releaseYear,
    shortDescription: `${g.vramGb}GB ${g.memoryType}, ${g.tdpWatts}W TDP, ${g.lengthMm}mm length.`,
    description:
      `The ${g.brand} ${g.name} is a ${g.chipVendor} graphics card with ${g.vramGb}GB of ${g.memoryType} memory and a ${g.boostClockMhz}MHz boost clock. ` +
      `It draws up to ${g.tdpWatts}W and is ${g.lengthMm}mm long, so double-check case GPU clearance before buying. ` +
      `Connects via a ${g.pcieVersion.replace("_", " ").replace("PCIE", "PCIe")} slot.`,
    specs: {
      vramGb: g.vramGb,
      memoryType: g.memoryType,
      boostClockMhz: g.boostClockMhz,
      tdpWatts: g.tdpWatts,
      outputs: ["3x DisplayPort 1.4a", "1x HDMI 2.1"],
      lengthMm: g.lengthMm,
    },
    compatibility: {
      pcieVersion: g.pcieVersion,
      powerDrawWatts: g.tdpWatts,
      gpuLengthMm: g.lengthMm,
    },
  }));
}

function buildStorage(): ProductSeedInput[] {
  return storageDrives.map((s) => {
    const capacityLabel = s.capacityGb >= 1000 ? `${s.capacityGb / 1000}TB` : `${s.capacityGb}GB`;
    const isHdd = s.nandType === "N/A";
    return {
      type: "STORAGE" as const,
      brand: s.brand,
      name: `${s.brand} ${s.name}`,
      slug: makeSlug(s.brand, s.name),
      price: s.price,
      tier: s.tier,
      releaseYear: s.releaseYear,
      shortDescription: `${capacityLabel} ${s.formFactor.replace("_", " ")}, up to ${s.readSpeedMbps}MB/s read.`,
      description: isHdd
        ? `The ${s.brand} ${s.name} is a ${capacityLabel} 3.5" hard drive for bulk, low-cost storage at roughly ${s.readSpeedMbps}MB/s sequential throughput. Best suited for backups, media libraries, and archives rather than your OS drive.`
        : `The ${s.brand} ${s.name} is a ${capacityLabel} ${s.formFactor === "M2_2280" ? "M.2 NVMe" : "2.5\" SATA"} SSD using ${s.nandType} NAND, rated for up to ${s.readSpeedMbps}MB/s read and ${s.writeSpeedMbps}MB/s write speeds.`,
      specs: {
        capacityGb: s.capacityGb,
        formFactor: s.formFactor,
        readSpeedMbps: s.readSpeedMbps,
        writeSpeedMbps: s.writeSpeedMbps,
        nandType: s.nandType,
      },
      compatibility: {
        driveInterface: s.driveInterface,
      },
    };
  });
}

function buildPsus(): ProductSeedInput[] {
  return psus.map((p) => ({
    type: "PSU",
    brand: p.brand,
    name: `${p.brand} ${p.name}`,
    slug: makeSlug(p.brand, p.name),
    price: p.price,
    tier: p.tier,
    releaseYear: p.releaseYear,
    shortDescription: `${p.wattage}W, 80+ ${p.efficiency.charAt(0) + p.efficiency.slice(1).toLowerCase()}, ${p.modular} modular.`,
    description:
      `The ${p.brand} ${p.name} is an ${p.wattage}W ATX power supply with 80+ ${p.efficiency.charAt(0) + p.efficiency.slice(1).toLowerCase()} efficiency certification and ${p.modular.toLowerCase()} modular cabling. ` +
      `A ${p.fanSizeMm}mm fan handles cooling, typically running silent below 40% load thanks to a fanless/semi-passive mode on most models in this line.`,
    specs: {
      wattage: p.wattage,
      efficiency: p.efficiency,
      modular: p.modular,
      fanSizeMm: p.fanSizeMm,
    },
    compatibility: {
      wattageCapacity: p.wattage,
      efficiencyRating: p.efficiency,
    },
  }));
}

function buildCases(): ProductSeedInput[] {
  return cases.map((c) => ({
    type: "CASE",
    brand: c.brand,
    name: `${c.brand} ${c.name}`,
    slug: makeSlug(c.brand, c.name),
    price: c.price,
    tier: c.tier,
    releaseYear: c.releaseYear,
    shortDescription: `Supports ${c.supportedFormFactors.join("/").replace(/_/g, "-")}, fits GPUs up to ${c.maxGpuLengthMm}mm.`,
    description:
      `The ${c.brand} ${c.name} supports ${c.supportedFormFactors.join(", ").replace(/_/g, "-")} motherboards and ships with ${c.includedFans} fan(s) pre-installed behind a ${c.sidePanel.toLowerCase()} side panel. ` +
      `It has room for graphics cards up to ${c.maxGpuLengthMm}mm long and CPU coolers up to ${c.maxCoolerHeightMm}mm tall, with ${c.driveBays} drive bay(s) for additional storage.`,
    specs: {
      supportedFormFactors: c.supportedFormFactors,
      includedFans: c.includedFans,
      sidePanel: c.sidePanel,
      driveBays: c.driveBays,
    },
    compatibility: {
      caseSupportedFormFactors: c.supportedFormFactors,
      caseMaxGpuLengthMm: c.maxGpuLengthMm,
      caseMaxCoolerHeightMm: c.maxCoolerHeightMm,
    },
  }));
}

function buildCoolers(): ProductSeedInput[] {
  return coolers.map((c) => ({
    type: "COOLER",
    brand: c.brand,
    name: `${c.brand} ${c.name}`,
    slug: makeSlug(c.brand, c.name),
    price: c.price,
    tier: c.tier,
    releaseYear: c.releaseYear,
    shortDescription:
      c.coolerType === "AIO"
        ? `${c.radiatorSizeMm}mm AIO liquid cooler, rated for up to ${c.tdpRatingWatts}W.`
        : `Air cooler with ${c.heatpipes} heatpipes, rated for up to ${c.tdpRatingWatts}W.`,
    description:
      (c.coolerType === "AIO"
        ? `The ${c.brand} ${c.name} is a ${c.radiatorSizeMm}mm all-in-one liquid cooler with ${c.fanCount} radiator fans, `
        : `The ${c.brand} ${c.name} is an air cooler with ${c.heatpipes} copper heatpipes and ${c.fanCount} fan(s), `) +
      `rated to dissipate up to ${c.tdpRatingWatts}W. It supports ${c.supportedSockets.join(", ")} sockets — confirm your CPU's socket matches before ordering.`,
    specs: {
      coolerType: c.coolerType,
      radiatorSizeMm: c.radiatorSizeMm,
      fanCount: c.fanCount,
      heatpipes: c.heatpipes,
    },
    compatibility: {
      coolerSupportedSockets: c.supportedSockets,
      tdpWatts: c.tdpRatingWatts,
    },
  }));
}

function buildFans(): ProductSeedInput[] {
  return fans.map((f) => ({
    type: "FAN",
    brand: f.brand,
    name: `${f.brand} ${f.name}`,
    slug: makeSlug(f.brand, f.name),
    price: f.price,
    tier: f.tier,
    releaseYear: f.releaseYear,
    shortDescription: `${f.sizeMm}mm case fan, ${f.airflowCfm} CFM at ${f.noiseLevelDb}dBA.`,
    description:
      `The ${f.brand} ${f.name} is a ${f.sizeMm}mm case fan delivering ${f.airflowCfm} CFM of airflow at ${f.noiseLevelDb}dBA. ` +
      (f.rgb ? "Addressable RGB lighting is built in and syncs with most major RGB ecosystems." : "It's a non-RGB model focused on airflow-per-decibel rather than lighting."),
    specs: {
      sizeMm: f.sizeMm,
      rgb: f.rgb,
      airflowCfm: f.airflowCfm,
      noiseLevelDb: f.noiseLevelDb,
    },
    compatibility: {},
  }));
}

function buildMonitors(): ProductSeedInput[] {
  return monitors.map((m) => ({
    type: "MONITOR",
    brand: m.brand,
    name: `${m.brand} ${m.name}`,
    slug: makeSlug(m.brand, m.name),
    price: m.price,
    tier: m.tier,
    releaseYear: m.releaseYear,
    shortDescription: `${m.sizeInches}" ${m.resolution} ${m.panelType}, ${m.refreshRateHz}Hz.`,
    description:
      `The ${m.brand} ${m.name} is a ${m.sizeInches}-inch ${m.panelType} monitor running at ${m.resolution} and up to ${m.refreshRateHz}Hz refresh rate, ` +
      `with a ${m.responseTimeMs}ms response time.`,
    specs: {
      sizeInches: m.sizeInches,
      resolution: m.resolution,
      refreshRateHz: m.refreshRateHz,
      panelType: m.panelType,
      responseTimeMs: m.responseTimeMs,
    },
    compatibility: {},
  }));
}

function buildKeyboards(): ProductSeedInput[] {
  return keyboards.map((k) => ({
    type: "KEYBOARD",
    brand: k.brand,
    name: `${k.brand} ${k.name}`,
    slug: makeSlug(k.brand, k.name),
    price: k.price,
    tier: k.tier,
    releaseYear: k.releaseYear,
    shortDescription: `${k.layout} ${k.switchType}, ${k.backlight.toLowerCase()} backlight${k.wireless ? ", wireless" : ""}.`,
    description:
      `The ${k.brand} ${k.name} is a ${k.layout} keyboard with ${k.switchType.toLowerCase()} switches and ${k.backlight.toLowerCase()} backlighting. ` +
      (k.wireless ? "It connects wirelessly via 2.4GHz and/or Bluetooth." : "It connects over a wired USB connection."),
    specs: {
      switchType: k.switchType,
      layout: k.layout,
      backlight: k.backlight,
      wireless: k.wireless,
    },
    compatibility: {},
  }));
}

function buildMice(): ProductSeedInput[] {
  return mice.map((m) => ({
    type: "MOUSE",
    brand: m.brand,
    name: `${m.brand} ${m.name}`,
    slug: makeSlug(m.brand, m.name),
    price: m.price,
    tier: m.tier,
    releaseYear: m.releaseYear,
    shortDescription: `${m.dpi.toLocaleString()} DPI, ${m.buttons} buttons, ${m.weightG}g${m.wireless ? ", wireless" : ""}.`,
    description:
      `The ${m.brand} ${m.name} is a ${m.wireless ? "wireless" : "wired"} gaming mouse with a ${m.dpi.toLocaleString()} DPI sensor, ${m.buttons} programmable buttons, and a weight of ${m.weightG}g.`,
    specs: {
      dpi: m.dpi,
      buttons: m.buttons,
      wireless: m.wireless,
      weightG: m.weightG,
    },
    compatibility: {},
  }));
}

function buildHeadsets(): ProductSeedInput[] {
  return headsets.map((h) => ({
    type: "HEADSET",
    brand: h.brand,
    name: `${h.brand} ${h.name}`,
    slug: makeSlug(h.brand, h.name),
    price: h.price,
    tier: h.tier,
    releaseYear: h.releaseYear,
    shortDescription: `${h.driverSizeMm}mm drivers${h.wireless ? ", wireless" : ""}${h.surroundSound ? ", surround sound" : ""}.`,
    description:
      `The ${h.brand} ${h.name} is a ${h.wireless ? "wireless" : "wired"} headset with ${h.driverSizeMm}mm drivers` +
      (h.microphone ? " and a detachable/boom microphone" : "") +
      (h.surroundSound ? ", supporting virtual surround sound." : "."),
    specs: {
      driverSizeMm: h.driverSizeMm,
      wireless: h.wireless,
      microphone: h.microphone,
      surroundSound: h.surroundSound,
    },
    compatibility: {},
  }));
}

function buildNetworkCards(): ProductSeedInput[] {
  return networkCards.map((n) => ({
    type: "NETWORK_CARD",
    brand: n.brand,
    name: `${n.brand} ${n.name}`,
    slug: makeSlug(n.brand, n.name),
    price: n.price,
    tier: n.tier,
    releaseYear: n.releaseYear,
    shortDescription: `${n.interfaceType} adapter, ${n.speedMbps >= 1000 ? `${n.speedMbps / 1000}Gbps` : `${n.speedMbps}Mbps`}${n.wifiStandard ? `, ${n.wifiStandard}` : ""}.`,
    description:
      `The ${n.brand} ${n.name} is a ${n.interfaceType} network adapter rated for up to ${n.speedMbps >= 1000 ? `${n.speedMbps / 1000}Gbps` : `${n.speedMbps}Mbps`}` +
      (n.wifiStandard ? `, supporting ${n.wifiStandard} wireless.` : ", for wired connections."),
    specs: {
      interfaceType: n.interfaceType,
      speedMbps: n.speedMbps,
      wifiStandard: n.wifiStandard,
    },
    compatibility: {},
  }));
}

function buildCables(): ProductSeedInput[] {
  return cables.map((c) => ({
    type: "CABLE",
    brand: c.brand,
    name: `${c.brand} ${c.name}`,
    slug: makeSlug(c.brand, c.name),
    price: c.price,
    tier: c.tier,
    releaseYear: c.releaseYear,
    shortDescription: `${c.cableType}, ${c.lengthCm}cm.`,
    description: `The ${c.brand} ${c.name} is a ${c.lengthCm}cm ${c.cableType.toLowerCase()}, useful for cable management and tidy builds.`,
    specs: {
      cableType: c.cableType,
      lengthCm: c.lengthCm,
    },
    compatibility: {},
  }));
}

function buildThermalPastes(): ProductSeedInput[] {
  return thermalPastes.map((t) => ({
    type: "THERMAL_PASTE",
    brand: t.brand,
    name: `${t.brand} ${t.name}`,
    slug: makeSlug(t.brand, t.name),
    price: t.price,
    tier: t.tier,
    releaseYear: t.releaseYear,
    shortDescription: `${t.volumeGrams}g, ${t.thermalConductivityWmK} W/mK.`,
    description: `The ${t.brand} ${t.name} is a ${t.volumeGrams}g thermal compound rated at ${t.thermalConductivityWmK} W/mK, suitable for CPU and GPU cooler reseating.`,
    specs: {
      volumeGrams: t.volumeGrams,
      thermalConductivityWmK: t.thermalConductivityWmK,
    },
    compatibility: {},
  }));
}

export function buildAllProducts(): ProductSeedInput[] {
  return [
    ...buildCpus(),
    ...buildMotherboards(),
    ...buildRam(),
    ...buildGpus(),
    ...buildStorage(),
    ...buildPsus(),
    ...buildCases(),
    ...buildCoolers(),
    ...buildFans(),
    ...buildMonitors(),
    ...buildKeyboards(),
    ...buildMice(),
    ...buildHeadsets(),
    ...buildNetworkCards(),
    ...buildCables(),
    ...buildThermalPastes(),
  ];
}
