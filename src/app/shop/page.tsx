import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/ProductCard";
import { ChevronDown, Filter, LayoutGrid, List, Search, X } from "lucide-react";
import { listProducts } from "@/lib/data/products";
import { listCategories } from "@/lib/data/categories";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterToolbar } from "@/components/shop/FilterToolbar"; // We'll extract client interactive parts
import { CategorySidebar } from "@/components/shop/CategorySidebar"; // Extract sidebar
import { getServerTranslator } from "@/lib/i18n.server";

export const dynamic = 'force-dynamic';

export default async function ShopPage(props: { searchParams: Promise<{ q?: string; category?: string; sort?: string }> }) {
    const { t } = await getServerTranslator();
    const searchParams = await props.searchParams;
    const { q, category, sort } = searchParams;

    // Fetch data in parallel
    const [products, categories] = await Promise.all([
        listProducts({ q, category, sort }),
        listCategories()
    ]);

    const hasActiveFilters = q || category;
    const resultsText = `${t("shop.resultsCount", { count: products.length })}${q ? ` ${t("shop.resultsFor", { query: q })}` : ""}`;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("shop.title")}</h1>
                    <p className="text-muted-foreground mt-1">{resultsText}</p>
                </div>

                {/* Toolbar - Client Component for interactivity */}
                <FilterToolbar categories={categories} activeSort={sort || 'featured'} hasFilters={!!hasActiveFilters} />
            </div>

            <div className="flex gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 space-y-8 flex-shrink-0">
                    <CategorySidebar categories={categories} activeCategory={category} activeQuery={q} />
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold mb-2">{t("shop.noToys")}</h3>
                            <p className="text-muted-foreground mb-6">{t("shop.noToysDesc")}</p>
                            <Button asChild variant="secondary">
                                <Link href="/shop">{t("shop.clearFilters")}</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
