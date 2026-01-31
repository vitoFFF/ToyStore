"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Database } from "@/lib/database.types";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export async function listProducts(options?: { q?: string; category?: string; sort?: string }) {
    const supabase = await createClient();

    let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true);

    if (options?.q) {
        query = query.ilike("title", `%${options.q}%`);
    }

    if (options?.category) {
        // We need to join with categories to filter by slug
        // But Supabase postgrest filter on related table is easier if we fetched categories first or used !inner
        // Let's rely on flattened search or subquery if possible. 
        // Actually, simplest is to fetch category_id for the slug first, then filter.
        // Or, use the join syntax: products!inner(..., categories!inner(slug))
        // Let's try the relation filter syntax
        const { data: category } = await supabase.from('categories').select('id').eq('slug', options.category).single();
        if (category) {
            query = query.eq('category_id', category.id);
        } else {
            // If category slug not found, technically should return empty or ignore.
            // Let's return empty if category was requested but invalid.
            return [];
        }
    }

    // Sort
    if (options?.sort) {
        switch (options.sort) {
            case 'newest':
                query = query.order('created_at', { ascending: false });
                break;
            case 'price_asc':
                query = query.order('price_cents', { ascending: true });
                break;
            case 'price_desc':
                query = query.order('price_cents', { ascending: false });
                break;
            default:
                query = query.order('created_at', { ascending: false });
        }
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error listing products:", error);
        return [];
    }

    return data;
}

export async function getProductBySlug(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .eq("slug", slug)
        .single();

    if (error) return null;
    return data;
}

export async function getProductById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (error) return null;
    return data;
}

export async function adminListProducts(includeInactive = true) {
    const supabase = await createClient();
    let query = supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false });

    // RLS policies for admin allow seeing all, but we can double check logic if we want specific filters
    const { data, error } = await query;
    if (error) {
        console.error("Admin list error:", error);
        return [];
    }
    return data;
}

export async function createProduct(formData: FormData) {
    const supabase = await createClient();

    // Parse form data
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const price_cents = parseInt(formData.get('price_cents') as string);
    const category_id = formData.get('category_id') as string;
    const stock = parseInt(formData.get('stock') as string);
    const is_active = formData.get('is_active') === 'on';
    const age_min = formData.get('age_min') ? parseInt(formData.get('age_min') as string) : null;
    const age_max = formData.get('age_max') ? parseInt(formData.get('age_max') as string) : null;
    const image_url = formData.get('image_url') as string;

    const urls = image_url ? [image_url] : [];

    const product: ProductInsert = {
        title,
        slug,
        description,
        price_cents,
        category_id,
        stock,
        is_active,
        age_min,
        age_max,
        image_urls: urls
    };

    const { error } = await supabase.from('products').insert(product);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/shop');
    revalidatePath('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
    const supabase = await createClient();

    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const price_cents = parseInt(formData.get('price_cents') as string);
    const category_id = formData.get('category_id') as string;
    const stock = parseInt(formData.get('stock') as string);
    // Determine is_active: if checkbox is unchecked, it won't be in formData usually, handle carefully
    // Usually in edit forms we might submit a hidden field or parse 'on'.
    // If using controlled component, we send boolean.
    // For raw FormData from native submit:
    const is_active = formData.get('is_active') === 'true' || formData.get('is_active') === 'on';

    const age_min = formData.get('age_min') ? parseInt(formData.get('age_min') as string) : null;
    const age_max = formData.get('age_max') ? parseInt(formData.get('age_max') as string) : null;

    // Image handling: If new image uploaded, it might be passed as url string from client or handled separately.
    // Let's assume the form passes the final image URL string (upload handled by client or separate action).
    // Or we handle upload here? "8) IMAGE UPLOAD FROM LOCAL DRIVE (ADMIN)... On submit... path pattern..."
    // If we handle upload in client component and just pass URL here, it's easier.
    // We will stick to: Form submits the URL string (hidden input).
    const image_url = formData.get('image_url') as string;

    const updates: ProductUpdate = {
        title,
        slug,
        description,
        price_cents,
        category_id,
        stock,
        is_active,
        age_min,
        age_max,
    };

    if (image_url) {
        updates.image_urls = [image_url];
    }

    const { error } = await supabase.from('products').update(updates).eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/shop');
    revalidatePath(`/product/${slug}`);
    revalidatePath('/admin/products');
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/shop');
    revalidatePath('/admin/products');
}
