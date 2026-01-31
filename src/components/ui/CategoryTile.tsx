
import Link from "next/link";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryTileProps {
    category: {
        id: string;
        label: string;
        gradient: string;
        icon: any;
        slug: string;
    };
    ctaLabel: string;
}

export function CategoryTile({ category, ctaLabel }: CategoryTileProps) {
    const IconComponent = category.icon;

    return (
        <Link href={`/shop?category=${category.slug}`}>
            <div
                className={cn(
                    "relative h-48 sm:h-56 rounded-3xl overflow-hidden p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 group",
                    "bg-gradient-to-br",
                    category.gradient
                )}
            >
                <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <div className="relative z-10">
                    <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-sm group-hover:scale-110 transition-transform duration-500">
                        <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white drop-shadow-sm leading-tight max-w-[80%]">
                        {category.label}
                    </h3>
                </div>

                <div className="relative z-10 flex items-center gap-2 text-white/90 font-medium text-sm group-hover:text-white transition-colors">
                    <span>{ctaLabel}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
}
