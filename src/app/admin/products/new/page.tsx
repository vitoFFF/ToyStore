import { listCategories } from "@/lib/data/categories";
import { ProductForm } from "@/components/admin/ProductForm";
import { getServerTranslator } from "@/lib/i18n.server";

export default async function NewProductPage() {
    const { t } = await getServerTranslator();
    const categories = await listCategories();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight">{t("adminProductForm.addTitle")}</h1>
                <p className="text-muted-foreground">{t("adminProductForm.addSubtitle")}</p>
            </div>

            <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-border/50 shadow-sm">
                // @ts-ignore - Supabase types mismatch with raw JSON sometimes, ignoring strict match for MVP
                <ProductForm categories={categories} />
            </div>
        </div>
    );
}
