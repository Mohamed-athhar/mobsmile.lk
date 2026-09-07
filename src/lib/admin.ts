/**
 * Admin data helpers. Every call goes through the signed-in browser client,
 * so the database access rules (staff only) are what actually protect the
 * data — the admin screens are just the convenient way in.
 */

import { supabase } from "@/integrations/supabase/client";
import { PRODUCTS, type Product } from "./products";

export type Role = "admin" | "staff" | "customer";

export async function fetchMyRoles(userId: string): Promise<Role[]> {
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (error || !data) return [];
  return data.map((r) => r.role as Role);
}

export type AdminProduct = {
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
  price: number | string | null;
  original_price: number | string | null;
  discount_badge: string | null;
  availability: string;
  os: string;
  screen: string;
  tagline: string;
  specs: Record<string, string>;
  features: string[];
  box: string[];
  faqs: { q: string; a: string }[];
  reviews: unknown[];
  featured: boolean;
  popularity: number;
  sort_order: number;
  is_active: boolean;
  updated_at?: string;
};

export async function adminListProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as AdminProduct[];
}

export async function adminGetProduct(id: string): Promise<AdminProduct | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as unknown as AdminProduct) ?? null;
}

/** Never resets popularity/featured: only fields explicitly passed are written. */
export async function adminSaveProduct(
  id: string | null,
  patch: Partial<AdminProduct>,
): Promise<AdminProduct> {
  if (id) {
    const { data, error } = await supabase
      .from("products")
      .update(patch as never)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data as unknown as AdminProduct;
  }
  const { data, error } = await supabase
    .from("products")
    .insert(patch as never)
    .select("*")
    .single();
  if (error) throw error;
  return data as unknown as AdminProduct;
}

export async function adminSetProductActive(id: string, isActive: boolean) {
  const { error } = await supabase.from("products").update({ is_active: isActive }).eq("id", id);
  if (error) throw error;
}

export async function adminDuplicateProduct(id: string) {
  const existing = await adminGetProduct(id);
  if (!existing) throw new Error("Product not found");
  const { id: _id, updated_at: _u, ...rest } = existing;
  const copy = {
    ...rest,
    slug: `${existing.slug}-copy-${Math.random().toString(36).slice(2, 6)}`,
    model: `${existing.model} (copy)`,
    is_active: false,
  };
  return adminSaveProduct(null, copy as Partial<AdminProduct>);
}

export async function adminDeleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

/** Copies the built-in showcase catalogue into the database, once. */
export async function importStaticCatalogue(): Promise<{ inserted: number }> {
  const existing = await adminListProducts();
  const have = new Set(existing.map((p) => p.slug));
  const rows = PRODUCTS.filter((p: Product) => !have.has(p.id)).map((p: Product, i: number) => ({
    slug: p.id,
    brand: p.brand,
    model: p.model,
    category_slug: p.category,
    storage: p.storage,
    ram: p.ram,
    colors: p.colors,
    condition: p.condition,
    warranty: p.warranty,
    price: p.price ?? null,
    original_price: p.originalPrice ?? null,
    discount_badge: p.discountBadge ?? null,
    availability: p.availability,
    os: p.os,
    screen: p.screen,
    tagline: p.tagline,
    specs: p.specs,
    features: p.features,
    box: p.box,
    faqs: p.faqs,
    reviews: p.reviews,
    featured: Boolean(p.discountBadge),
    popularity: PRODUCTS.length - i,
    sort_order: existing.length + i,
  }));
  if (rows.length === 0) return { inserted: 0 };
  const { error } = await supabase.from("products").insert(rows as never);
  if (error) throw error;
  return { inserted: rows.length };
}

// ---------------- categories / brands / banners ----------------

export async function adminListCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function adminSaveCategory(id: string | null, patch: Record<string, unknown>) {
  const q = id
    ? supabase
        .from("categories")
        .update(patch as never)
        .eq("id", id)
    : supabase.from("categories").insert(patch as never);
  const { error } = await q;
  if (error) throw error;
}

export async function adminDeleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function adminListBrands() {
  const { data, error } = await supabase.from("brands").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function adminSaveBrand(id: string | null, patch: Record<string, unknown>) {
  const q = id
    ? supabase
        .from("brands")
        .update(patch as never)
        .eq("id", id)
    : supabase.from("brands").insert(patch as never);
  const { error } = await q;
  if (error) throw error;
}

export async function adminDeleteBrand(id: string) {
  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) throw error;
}

export async function adminListBanners() {
  const { data, error } = await supabase.from("banners").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function adminSaveBanner(id: string | null, patch: Record<string, unknown>) {
  const q = id
    ? supabase
        .from("banners")
        .update(patch as never)
        .eq("id", id)
    : supabase.from("banners").insert(patch as never);
  const { error } = await q;
  if (error) throw error;
}

export async function adminDeleteBanner(id: string) {
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw error;
}

// ---------------- leads / inquiries ----------------

export async function adminListLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminUpdateLead(id: string, patch: { status?: string; notes?: string }) {
  const { error } = await supabase.from("leads").update(patch).eq("id", id);
  if (error) throw error;
}

export async function adminDeleteLead(id: string) {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}

export async function adminListInquiries() {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminUpdateInquiry(id: string, status: string) {
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throw error;
}

export function leadsToCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const cols = ["created_at", "name", "phone", "email", "message", "product_slug", "status"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

// ---------------- settings / plans ----------------

export async function adminListSettings() {
  const { data, error } = await supabase.from("settings").select("key, value").order("key");
  if (error) throw error;
  return data ?? [];
}

export async function adminSaveSetting(key: string, value: unknown) {
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value: value as never }, { onConflict: "key" });
  if (error) throw error;
}

export async function adminListPlans() {
  const { data, error } = await supabase.from("installment_plans").select("*").order("months");
  if (error) throw error;
  return data ?? [];
}

export async function adminSavePlan(id: string | null, patch: Record<string, unknown>) {
  const q = id
    ? supabase
        .from("installment_plans")
        .update(patch as never)
        .eq("id", id)
    : supabase.from("installment_plans").insert(patch as never);
  const { error } = await q;
  if (error) throw error;
}

export async function adminDeletePlan(id: string) {
  const { error } = await supabase.from("installment_plans").delete().eq("id", id);
  if (error) throw error;
}
