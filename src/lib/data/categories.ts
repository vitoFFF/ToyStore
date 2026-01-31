import { createClient } from "@/lib/supabase/server";

export async function listCategories() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }

    return data;
}
