/**
 * Defaults below are the fallback only. Once the shop settings load from
 * the database (see lib/catalog.ts → fetchShopSettings), the runtime
 * overrides here take over, so the WhatsApp number can be changed from the
 * admin area without a code change.
 */
const DEFAULT_WHATSAPP_DISPLAY = "0774312456";
const DEFAULT_WHATSAPP_NUMBER = "94774312456";

export const WHATSAPP_DISPLAY = DEFAULT_WHATSAPP_DISPLAY;
export const WHATSAPP_NUMBER = DEFAULT_WHATSAPP_NUMBER;

let runtime: { number: string; display: string; settings: Record<string, unknown> } = {
  number: DEFAULT_WHATSAPP_NUMBER,
  display: DEFAULT_WHATSAPP_DISPLAY,
  settings: {},
};

/** Digits only — no `+`, spaces or punctuation. */
function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function setShopSettings(settings: Record<string, unknown>) {
  const number = typeof settings["whatsapp_number"] === "string" ? settings["whatsapp_number"] : "";
  const display =
    typeof settings["whatsapp_display"] === "string" ? settings["whatsapp_display"] : "";
  runtime = {
    number: digitsOnly(number) || DEFAULT_WHATSAPP_NUMBER,
    display: display || DEFAULT_WHATSAPP_DISPLAY,
    settings,
  };
}

export function getShopSettings() {
  return runtime.settings;
}

export function whatsappNumber() {
  return runtime.number;
}

export function whatsappDisplay() {
  return runtime.display;
}

export function waLink(message: string) {
  return `https://wa.me/${runtime.number}?text=${encodeURIComponent(message)}`;
}

export const CATEGORIES = [
  { slug: "smartphones", name: "Smartphones", blurb: "Flagship and everyday phones" },
  { slug: "tablets", name: "Tablets", blurb: "Create, read and play" },
  { slug: "smart-devices", name: "Smart Devices", blurb: "Connected home essentials" },
  { slug: "laptops", name: "Laptop & MacBook", blurb: "Power for work and studio" },
  { slug: "watches", name: "Watches", blurb: "Health and fitness on wrist" },
  { slug: "audio", name: "Audio", blurb: "Headphones, buds and speakers" },
  { slug: "accessories", name: "Accessories", blurb: "Cases, cables and chargers" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const BRANDS = [
  { slug: "apple", name: "Apple" },
  { slug: "samsung", name: "Samsung" },
  { slug: "sony", name: "Sony" },
  { slug: "vivo", name: "Vivo" },
  { slug: "redmi", name: "Redmi" },
  { slug: "joyroom", name: "Joyroom" },
] as const;
