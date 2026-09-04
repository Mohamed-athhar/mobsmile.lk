/**
 * Thin client for the mobsmile-backend API (a separate deployed Next.js
 * project — see the backend's own README for setup/deploy). Everything
 * here is written to fail soft: if VITE_MOBSMILE_API_URL isn't set, or
 * the backend is unreachable, every function below resolves to an empty
 * result instead of throwing — the site keeps working off the existing
 * static catalogue in lib/products.ts either way. Nothing here changes
 * how the static catalogue behaves; it only adds live data on top.
 */

import type { Product } from "./products";
import type { CategorySlug } from "./site";
import phoneImg from "@/assets/p-phone.jpg";
import laptopImg from "@/assets/p-laptop.jpg";
import tabletImg from "@/assets/p-tablet.jpg";
import watchImg from "@/assets/p-watch.jpg";
import audioImg from "@/assets/p-audio.jpg";
import accessoryImg from "@/assets/p-accessory.jpg";

const API_URL = (import.meta.env["VITE_MOBSMILE_API_URL"] as string | undefined)?.replace(
  /\/+$/,
  "",
);

const FALLBACK_IMAGE_BY_CATEGORY: Record<string, string> = {
  smartphones: phoneImg,
  tablets: tabletImg,
  "smart-devices": accessoryImg,
  laptops: laptopImg,
  watches: watchImg,
  audio: audioImg,
  accessories: accessoryImg,
};

/** Shape of GET /api/products list items (mobsmile-backend's "ProductCard" view). */
interface ApiProductCard {
  id: string;
  slug: string;
  name: string;
  shortDesc: string | null;
  brandName: string;
  brandSlug: string;
  categorySlug: string;
  condition: "NEW" | "USED" | "REFURBISHED";
  badge: "NEW_ARRIVAL" | "BEST_SELLER" | "SALE" | "LIMITED" | null;
  fromPrice: number;
  fromOriginalPrice: number;
  hasDiscount: boolean;
  anyInStock: boolean;
  variantCount: number;
  primaryImage: string | null;
  isFeatured: boolean;
}

/** Shape of GET /api/products/:slug (full detail, with variants/images). */
interface ApiProductDetail {
  id: string;
  slug: string;
  name: string;
  shortDesc: string | null;
  description: string | null;
  brand: { id: string; name: string; slug: string; logo: string | null; tagline: string | null };
  category: { id: string; name: string; slug: string; icon: string | null };
  condition: "NEW" | "USED" | "REFURBISHED";
  warrantyType: string | null;
  badge: "NEW_ARRIVAL" | "BEST_SELLER" | "SALE" | "LIMITED" | null;
  specs: Record<string, string> | null;
  images: { id: string; url: string; alt: string | null; sortOrder: number }[];
  variants: {
    id: string;
    storage: string | null;
    ram: string | null;
    color: string | null;
    price: number;
    salePrice: number | null;
    stockStatus: "IN_STOCK" | "PRE_ORDER" | "SOLD_OUT";
  }[];
}

const BADGE_TEXT: Record<string, string> = {
  NEW_ARRIVAL: "New Arrival",
  BEST_SELLER: "Best Seller",
  SALE: "Sale",
  LIMITED: "Limited Stock",
};

const CONDITION: Record<string, Product["condition"]> = {
  NEW: "Brand New",
  USED: "Pre-Owned",
  REFURBISHED: "Pre-Owned",
};

function fallbackImage(categorySlug: string) {
  return FALLBACK_IMAGE_BY_CATEGORY[categorySlug] ?? accessoryImg;
}

/** id is prefixed so a live product can never collide with a static demo id. */
const liveId = (slug: string) => `live-${slug}`;

function mapCard(card: ApiProductCard): Product {
  return {
    id: liveId(card.slug),
    brand: card.brandName,
    model: card.name,
    category: card.categorySlug as CategorySlug,
    // The listing endpoint doesn't include a real photo URL fallback,
    // so this only ever gets used if a product truly has no image.
    image: card.primaryImage ?? fallbackImage(card.categorySlug),
    storage: "—",
    ram: "—",
    colors: [],
    condition: CONDITION[card.condition] ?? "Brand New",
    warranty: "Warranty as listed",
    price: card.fromPrice || 0,
    originalPrice: card.hasDiscount ? card.fromOriginalPrice : undefined,
    discountBadge: card.badge ? BADGE_TEXT[card.badge] : undefined,
    availability: card.anyInStock ? "In Stock" : "Pre-Order",
    os: "",
    screen: "",
    tagline: card.shortDesc ?? "",
    specs: {},
    features: [],
    box: [],
    faqs: [],
    reviews: [],
  };
}

function mapDetail(p: ApiProductDetail): Product {
  const inStock = p.variants.filter((v) => v.stockStatus !== "SOLD_OUT");
  const cheapest = [...p.variants].sort(
    (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
  )[0];
  const colors = Array.from(new Set(p.variants.map((v) => v.color).filter((c): c is string => !!c)));
  const anyPreOrder = p.variants.some((v) => v.stockStatus === "PRE_ORDER");

  return {
    id: liveId(p.slug),
    brand: p.brand.name,
    model: p.name,
    category: p.category.slug as CategorySlug,
    image: p.images[0]?.url ?? fallbackImage(p.category.slug),
    storage: cheapest?.storage ?? "—",
    ram: cheapest?.ram ?? "—",
    colors,
    condition: CONDITION[p.condition] ?? "Brand New",
    warranty: p.warrantyType ?? "Warranty as listed",
    price: cheapest ? (cheapest.salePrice ?? cheapest.price) : 0,
    originalPrice: cheapest?.salePrice ? cheapest.price : undefined,
    discountBadge: p.badge ? BADGE_TEXT[p.badge] : undefined,
    availability: inStock.length > 0 ? "In Stock" : anyPreOrder ? "Pre-Order" : "Low Stock",
    os: "",
    screen: "",
    tagline: p.shortDesc ?? "",
    specs: p.specs ?? {},
    // The backend doesn't store rich content (features/box/FAQs/reviews)
    // yet — a real product page for a live item will simply show fewer
    // sections than the static demo ones do, rather than fake content.
    features: [],
    box: [],
    faqs: [],
    reviews: [],
  };
}

async function safeJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    // Backend not deployed yet, unreachable, or CORS not configured —
    // the site should never break because of this.
    return null;
  }
}

let cardsPromise: Promise<Product[]> | null = null;

/** Cached per page-load: several components may call this independently. */
export function fetchLiveProducts(): Promise<Product[]> {
  if (!API_URL) return Promise.resolve([]);
  if (!cardsPromise) {
    cardsPromise = safeJson<ApiProductCard[]>(`${API_URL}/api/products?limit=100`).then((cards) =>
      (cards ?? []).map(mapCard),
    );
  }
  return cardsPromise;
}

/**
 * Looks up a single product by id. Live ids are prefixed with "live-"
 * (see mapCard/mapDetail above) — anything else is assumed to be a
 * static demo product and this returns null immediately without a
 * network call.
 */
export async function fetchLiveProduct(id: string): Promise<Product | null> {
  if (!API_URL || !id.startsWith("live-")) return null;
  const slug = id.slice("live-".length);
  const detail = await safeJson<ApiProductDetail>(`${API_URL}/api/products/${slug}`);
  return detail ? mapDetail(detail) : null;
}

/** Fire-and-forget WhatsApp-click logging. Never blocks or throws. */
export async function logLiveInquiry(
  productId: string,
  source: "product_page" | "card" | "floating",
) {
  if (!API_URL || !productId.startsWith("live-")) return;
  const slug = productId.slice("live-".length);
  try {
    const detail = await safeJson<ApiProductDetail>(`${API_URL}/api/products/${slug}`);
    const variant =
      detail?.variants && detail.variants.length > 0
        ? [...detail.variants].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))[0]
        : null;
    if (!detail || !variant) return;

    await fetch(`${API_URL}/api/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: detail.id, variantId: variant.id, source }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    /* best-effort only — a failed click log should never block the user */
  }
}
