import { notFound } from "next/navigation";
import { listCategories } from "@/lib/data/categories";
import { getProductById } from "@/lib/data/products";
import { ProductForm } from "@/components/admin/ProductForm";
import { getServerTranslator } from "@/lib/i18n.server";

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const { t } = await getServerTranslator();
    const params = await props.params;
    const [product, categories] = await Promise.all([
        getProductById(params.id),
        listCategories()
    ]);

    if (!product) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight">{t("adminProductForm.editTitle")}</h1>
                <p className="text-muted-foreground">{t("adminProductForm.editSubtitle")}</p>
            </div>

            <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-border/50 shadow-sm">
                {/* @ts-ignore */}
                <ProductForm product={product} categories={categories} />
            </div>
        </div>
    );
}
