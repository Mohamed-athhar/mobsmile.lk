import { supabase } from "@/integrations/supabase/client";
import type { Product } from "./products";

export type SavedProduct = {
  id: string;
  product_id: string;
  brand: string;
  model: string;
  image: string | null;
  created_at: string;
};

export type Inquiry = {
  id: string;
  product_id: string | null;
  product_name: string;
  message: string;
  status: string;
  created_at: string;
};

export async function fetchSaved(): Promise<SavedProduct[]> {
  const { data, error } = await supabase
    .from("saved_products")
    .select("id, product_id, brand, model, image, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from("inquiries")
    .select("id, product_id, product_name, message, status, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function toggleSaved(userId: string, product: Product, isSaved: boolean) {
  if (isSaved) {
    const { error } = await supabase
      .from("saved_products")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", product.id);
    if (error) throw error;
    return false;
  }
  const { error } = await supabase.from("saved_products").insert({
    user_id: userId,
    product_id: product.id,
    brand: product.brand,
    model: product.model,
    image: product.image,
  });
  if (error) throw error;
  return true;
}

export async function logInquiry(userId: string, product: Product, message: string) {
  await supabase.from("inquiries").insert({
    user_id: userId,
    product_id: product.id,
    product_name: `${product.brand} ${product.model}`,
    message,
  });
}

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, city")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertProfile(
  userId: string,
  values: { full_name: string; phone: string; city: string },
) {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...values, updated_at: new Date().toISOString() });
  if (error) throw error;
}
