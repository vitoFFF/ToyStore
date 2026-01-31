"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter, LayoutGrid, List, Search, X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useI18n } from "@/components/i18n/LanguageProvider";

interface FilterToolbarProps {
    categories: any[];
    activeSort: string;
    hasFilters: boolean;
}

export function FilterToolbar({ categories, activeSort, hasFilters }: FilterToolbarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useI18n();

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/shop?${params.toString()}`);
    };

    const toggleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.get(key) === value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`/shop?${params.toString()}`);
    }

    return (
        <div className="flex items-center gap-2">
            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={() => router.push("/shop")} className="text-red-500 hover:text-red-600 hover:bg-red-50 hidden sm:flex">
                    <X className="w-4 h-4 mr-1" /> {t("filters.clearFilters")}
                </Button>
            )}

            <div className="hidden md:flex items-center gap-2 mr-2 border-r border-border pr-4">
                <Button variant="ghost" size="icon" className="text-primary bg-primary/10"><LayoutGrid className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground"><List className="w-4 h-4" /></Button>
            </div>

            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 rounded-xl hidden sm:flex">
                            {t("filters.sortLabel")}: {activeSort === 'featured' ? t("filters.featured") : activeSort === 'price_asc' ? t("filters.lowToHigh") : t("filters.highToLow")}
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => updateFilter("sort", "featured")}>{t("filters.featured")}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateFilter("sort", "price_asc")}>{t("filters.priceLowToHigh")}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateFilter("sort", "price_desc")}>{t("filters.priceHighToLow")}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Filter Trigger */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden gap-2 rounded-xl">
                            <Filter className="w-4 h-4" /> {t("filters.filters")}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                            <SheetTitle>{t("filters.filters")}</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6 space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-bold text-sm tracking-wide uppercase text-foreground">{t("filters.categories")}</h3>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <div
                                            key={cat.id}
                                            onClick={() => toggleFilter("category", cat.slug)}
                                            className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg transition-colors ${searchParams.get("category") === cat.slug ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-slate-50'}`}
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${searchParams.get("category") === cat.slug ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                                {searchParams.get("category") === cat.slug && <Search className="w-3 h-3 text-white" />}
                                            </div>
                                            {cat.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
