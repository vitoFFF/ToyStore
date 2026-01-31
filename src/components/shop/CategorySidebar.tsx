"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useI18n } from "@/components/i18n/LanguageProvider";

interface CategorySidebarProps {
    categories: any[];
    activeCategory?: string;
    activeQuery?: string;
}

export function CategorySidebar({ categories, activeCategory, activeQuery }: CategorySidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useI18n();

    const toggleCategory = (slug: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.get("category") === slug) {
            params.delete("category");
        } else {
            params.set("category", slug);
        }
        router.push(`/shop?${params.toString()}`);
    };

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <>
            {/* Search in sidebar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    className="w-full bg-secondary/50 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder={t("sidebar.searchPlaceholder")}
                    defaultValue={activeQuery || ""}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch(e.currentTarget.value);
                        }
                    }}
                />
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-sm tracking-wide uppercase text-foreground">{t("sidebar.categories")}</h3>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <div
                            key={cat.id}
                            onClick={() => toggleCategory(cat.slug)}
                            className={`flex items-center gap-2 text-sm cursor-pointer py-1 group ${activeCategory === cat.slug ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${activeCategory === cat.slug ? 'bg-primary border-primary' : 'border-input group-hover:border-primary'}`}>
                                {activeCategory === cat.slug && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            {cat.name}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-sm tracking-wide uppercase text-foreground">{t("sidebar.age")}</h3>
                <div className="space-y-2">
                    {[t("sidebar.age_0_12"), t("sidebar.age_1_3"), t("sidebar.age_3_5"), t("sidebar.age_5_8"), t("sidebar.age_8_plus")].map((age) => (
                        <div key={age} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer opacity-50 pointer-events-none">
                            <div className="w-4 h-4 rounded border border-gray-300" />
                            {age}
                        </div>
                    ))}
                    <p className="text-xs text-muted-foreground italic mt-2">{t("sidebar.moreFilters")}</p>
                </div>
            </div>
        </>
    );
}
