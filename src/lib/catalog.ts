/**
 * Database-backed catalogue + shop settings.
 *
 * The static catalogue in lib/products.ts stays as the baseline so the
 * site never renders empty. Anything stored in the `products` table takes
 * precedence (matched by slug) and any extra database product is appended.
 * Reads go through the public (anon) policies, so no sign-in is required.
 */

import { supabase } from "@/integrations/supabase/client";
import type { Product, Review } from "./products";
import type { CategorySlug } from "./site";
import { setShopSettings } from "./site";
import phoneImg from "@/assets/p-phone.jpg";
import laptopImg from "@/assets/p-laptop.jpg";
import tabletImg from "@/assets/p-tablet.jpg";
import watchImg from "@/assets/p-watch.jpg";
import audioImg from "@/assets/p-audio.jpg";
import accessoryImg from "@/assets/p-accessory.jpg";

const FALLBACK_IMAGE: Record<string, string> = {
  smartphones: phoneImg,
  tablets: tabletImg,
  "smart-devices": accessoryImg,
  laptops: laptopImg,
  watches: watchImg,
  audio: audioImg,
  accessories: accessoryImg,
};

/** PostgREST returns `numeric` as a string — always pass prices through this. */
export function num(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/** Rejects SVG, placeholder services and anything that isn't an http(s)/asset URL. */
export function isUsableImage(url?: string | null): boolean {
  if (!url) return false;
  const u = url.trim().toLowerCase();
  if (!u) return false;
  if (u.endsWith(".svg") || u.startsWith("data:image/svg")) return false;
  if (u.includes("placehold.co") || u.includes("placeholder.com")) return false;
  return u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/");
}

export type ProductRow = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  category_slug: string;
  image_url: string | null;
  storage: string;
  ram: string;
  colors: string[];
  condition: string;
  warranty: string;
  price: string | number | null;
  original_price: string | number | null;
  discount_badge: string | null;
  availability: string;
  os: string;
  screen: string;
  tagline: string;
  specs: unknown;
  features: string[];
  box: string[];
  faqs: unknown;
  reviews: unknown;
  featured: boolean;
  popularity: number;
  sort_order: number;
  is_active: boolean;
};

export function rowToProduct(row: ProductRow): Product {
  const image = isUsableImage(row.image_url)
    ? (row.image_url as string)
    : (FALLBACK_IMAGE[row.category_slug] ?? phoneImg);

  return {
    id: row.slug,
    brand: row.brand,
    model: row.model,
    category: row.category_slug as CategorySlug,
    image,
    storage: row.storage ?? "",
    ram: row.ram ?? "",
    colors: row.colors ?? [],
    condition: (row.condition as Product["condition"]) ?? "Brand New",
    warranty: row.warranty ?? "",
    price: num(row.price) ?? 0,
    originalPrice: num(row.original_price),
    discountBadge: row.discount_badge ?? undefined,
    availability: (row.availability as Product["availability"]) ?? "In Stock",
    os: row.os ?? "",
    screen: row.screen ?? "",
    tagline: row.tagline ?? "",
    specs: (row.specs as Record<string, string>) ?? {},
    features: row.features ?? [],
    box: row.box ?? [],
    faqs: (row.faqs as { q: string; a: string }[]) ?? [],
    reviews: (row.reviews as Review[]) ?? [],
  };
}

/** All active products from the database. Resolves to [] on any failure. */
export async function fetchDbProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return (data as unknown as ProductRow[]).map(rowToProduct);
  } catch {
    return [];
  }
}

export async function fetchDbProduct(slug: string): Promise<Product | undefined> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error || !data) return undefined;
    return rowToProduct(data as unknown as ProductRow);
  } catch {
    return undefined;
  }
}

export type ShopCategory = {
  slug: string;
  name: string;
  blurb: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export async function fetchDbCategories(): Promise<ShopCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("slug, name, blurb, image_url, sort_order, is_active")
    .eq("is_active", true)
    .order("sort_order");
  if (error || !data) return [];
  return data as ShopCategory[];
}

export async function fetchDbBrands() {
  const { data, error } = await supabase
    .from("brands")
    .select("slug, name, logo_url, sort_order, is_active")
    .eq("is_active", true)
    .order("sort_order");
  if (error || !data) return [];
  return data;
}

export async function fetchDbBanners(categorySlug?: string | null) {
  const query = supabase
    .from("banners")
    .select("id, title, subtitle, image_url, link_url, category_slug, sort_order")
    .eq("is_active", true)
    .order("sort_order");
  const { data, error } = categorySlug
    ? await query.eq("category_slug", categorySlug)
    : await query.is("category_slug", null);
  if (error || !data) return [];
  return data;
}

export type ShopSettings = Record<string, unknown>;

/** Loads key/value shop settings and pushes them into the runtime overrides. */
export async function fetchShopSettings(): Promise<ShopSettings> {
  try {
    const { data, error } = await supabase.from("settings").select("key, value");
    if (error || !data) return {};
    const map: ShopSettings = {};
    for (const row of data as { key: string; value: unknown }[]) map[row.key] = row.value;
    setShopSettings(map);
    return map;
  } catch {
    return {};
  }
}

export type InstallmentPlan = {
  id: string;
  bank: string;
  months: number;
  interest_rate: string | number;
  min_amount: string | number;
  is_active: boolean;
};

/** Monthly payment for a plan, flat-rate interest over the term. */
export function monthlyInstalment(amount: number, plan: InstallmentPlan): number {
  const rate = num(plan.interest_rate) ?? 0;
  const total = amount * (1 + rate / 100);
  return Math.round(total / plan.months);
}

export async function fetchInstallmentPlans(amount?: number): Promise<InstallmentPlan[]> {
  const { data, error } = await supabase
    .from("installment_plans")
    .select("id, bank, months, interest_rate, min_amount, is_active")
    .eq("is_active", true)
    .order("months");
  if (error || !data) return [];
  const plans = data as InstallmentPlan[];
  if (amount === undefined) return plans;
  return plans.filter((p) => amount >= (num(p.min_amount) ?? 0));
}

/** Callback request (lead). Anyone may submit; only staff can read them back. */
export async function submitLead(input: {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  productSlug?: string;
  website?: string; // honeypot — must stay empty
}) {
  if (input.website) return { ok: true as const };
  const { error } = await supabase.from("leads").insert({
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || null,
    message: input.message?.trim() || null,
    product_slug: input.productSlug ?? null,
    source: "website",
  });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
