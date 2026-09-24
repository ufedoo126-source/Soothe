import { supabase } from "./supabaseClient";

export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/®/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatPrice(amount) {
  return `₦${Number(amount).toLocaleString()}`;
}

export async function getAllCategories() {
  const { data: categories, error } = await supabase
    .from("service_categories")
    .select("*, services(count)")
    .order("name");

  if (error || !categories) {
    console.error("getAllCategories error:", error);
    return [];
  }

  return categories.map((cat) => ({
    ...cat,
    itemCount: cat.services?.[0]?.count ?? 0,
  }));
}

export async function getAllCategorySlugs() {
  const { data, error } = await supabase
    .from("service_categories")
    .select("slug");
  if (error || !data) return [];
  return data.map((c) => c.slug);
}

export async function getCategoryBySlug(slug) {
  const { data: category, error: catError } = await supabase
    .from("service_categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (catError || !category) return null;

  const { data: services, error: svcError } = await supabase
    .from("services")
    .select("*")
    .eq("category_id", category.id)
    .order("name");

  return { ...category, services: services || [] };
}

export async function getAllServiceSlugs() {
  const { data, error } = await supabase.from("services").select("slug");
  if (error || !data) return [];
  return data.map((s) => s.slug);
}

export async function getServiceBySlug(slug) {
  const { data: service, error } = await supabase
    .from("services")
    .select("*, service_categories(name, slug)")
    .eq("slug", slug)
    .single();

  if (error || !service) return null;

  return {
    ...service,
    categoryName: service.service_categories?.name,
    categorySlug: service.service_categories?.slug,
  };
}