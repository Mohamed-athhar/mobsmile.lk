export const WHATSAPP_DISPLAY = "0774312456";
export const WHATSAPP_NUMBER = "94774312456";

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
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
