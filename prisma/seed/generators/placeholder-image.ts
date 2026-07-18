import type { ProductType } from "@prisma/client";

const CATEGORY_STYLE: Record<ProductType, { color: string; label: string }> = {
  CPU: { color: "#2563eb", label: "CPU" },
  MOTHERBOARD: { color: "#7c3aed", label: "Motherboard" },
  RAM: { color: "#db2777", label: "RAM" },
  GPU: { color: "#16a34a", label: "GPU" },
  STORAGE: { color: "#ea580c", label: "Storage" },
  PSU: { color: "#ca8a04", label: "Power Supply" },
  CASE: { color: "#0891b2", label: "Case" },
  COOLER: { color: "#0284c7", label: "Cooler" },
  FAN: { color: "#4f46e5", label: "Fan" },
  MONITOR: { color: "#059669", label: "Monitor" },
  KEYBOARD: { color: "#9333ea", label: "Keyboard" },
  MOUSE: { color: "#e11d48", label: "Mouse" },
  HEADSET: { color: "#d97706", label: "Headset" },
  NETWORK_CARD: { color: "#65a30d", label: "Network Card" },
  CABLE: { color: "#475569", label: "Cable" },
  THERMAL_PASTE: { color: "#78716c", label: "Thermal Paste" },
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Renders a category-labeled SVG card as a data URI, standing in for a real product photo in seed data. */
export function buildPlaceholderImageUrl(type: ProductType, name: string): string {
  const style = CATEGORY_STYLE[type];
  const nameLines = wrapText(name, 22).slice(0, 3);
  const lineHeight = 30;
  const startY = 250 - ((nameLines.length - 1) * lineHeight) / 2;

  const nameText = nameLines
    .map(
      (line, i) =>
        `<text x="320" y="${startY + i * lineHeight}" font-size="24" font-family="Arial, sans-serif" font-weight="600" fill="#ffffff" text-anchor="middle">${escapeXml(line)}</text>`,
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
  <rect width="640" height="480" fill="${style.color}" />
  <rect width="640" height="480" fill="#000000" opacity="0.08" />
  <text x="320" y="150" font-size="20" font-family="Arial, sans-serif" font-weight="700" letter-spacing="3" fill="#ffffff" opacity="0.85" text-anchor="middle">${escapeXml(style.label.toUpperCase())}</text>
  ${nameText}
</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
