"use client";

import { motion } from "framer-motion";
import { Heart, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Database } from "@/lib/database.types";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { formatAgeRange, formatCurrency } from "@/lib/i18n";

type DbProduct = Database['public']['Tables']['products']['Row'] & {
    categories: { name: string; slug: string } | null;
};

interface ProductCardProps {
    product: DbProduct;
}

export function ProductCard({ product }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { t, locale } = useI18n();

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
        toast(isWishlisted ? t("productCard.removedWishlist") : t("productCard.addedWishlist"), {
            icon: isWishlisted ? <X className="w-4 h-4" /> : <Heart className="w-4 h-4 fill-red-500 text-red-500" />
        });
    };

    const price = product.price_cents / 100;
    const currency = product.currency || "GEL";
    const categoryName = product.categories?.name || t("product.toyFallback");
    const mainImage = product.image_urls?.[0];
    const ageRange = formatAgeRange(t, product.age_min, product.age_max);
    const formattedPrice = formatCurrency(isMounted ? locale : "en-US", price, currency);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <Link href={`/product/${product.slug}`} className="block h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
                {/* Badge (Stock logic) */}
                {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm text-white bg-red-500">
                            {t("productCard.lowStock")}
                        </span>
                    </div>
                )}
                {product.stock === 0 && (
                    <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm text-white bg-gray-500">
                            {t("productCard.outOfStock")}
                        </span>
                    </div>
                )}


                {/* Wishlist Button - Top Right */}
                <button
                    onClick={handleWishlist}
                    className={cn(
                        "absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 duration-300",
                        isWishlisted ? "text-red-500 opacity-100 translate-y-0" : "text-muted-foreground hover:text-red-500"
                    )}
                >
                    <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
                </button>

                {/* Image Area */}
                <div className="aspect-square w-full relative overflow-hidden flex items-center justify-center bg-secondary/30 p-2">
                    {mainImage ? (
                        <img
                            src={mainImage}
                            alt={product.title}
                            className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="text-4xl">Toy</div>
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{categoryName}</div>
                        {/* Mock Rating */}
                        <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                            <Star className="w-3 h-3 fill-yellow-500" />
                            4.9 <span className="text-muted-foreground font-normal">(12)</span>
                        </div>
                    </div>

                    <h3 className="font-bold text-lg mb-1 leading-tight group-hover:text-primary transition-colors line-clamp-1">{product.title}</h3>

                    <div className="flex items-center justify-between mt-auto pt-4">
                        <div className="text-xl font-bold bg-secondary/50 px-2 py-0.5 rounded-lg text-primary">
                            {formattedPrice}
                        </div>
                        <div className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-muted-foreground">
                            {ageRange}
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

