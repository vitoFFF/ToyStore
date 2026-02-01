"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { useCart, CartItemInput } from "@/components/cart/CartProvider";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
    product: CartItemInput;
    disabled?: boolean;
    className?: string;
};

export function AddToCartButton({ product, disabled, className }: AddToCartButtonProps) {
    const { addItem } = useCart();
    const { t } = useI18n();

    const handleAdd = () => {
        addItem(product);
        toast(t("productCard.addedToCart"), {
            description: t("productCard.inCartDesc", { title: product.title }),
        });
    };

    return (
        <Button
            size="lg"
            disabled={disabled}
            onClick={handleAdd}
            className={cn(
                "flex-1 h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-gradient-to-r from-primary to-purple-600",
                className
            )}
        >
            <ShoppingCart className="w-6 h-6 mr-2" />
            {t("product.addToCart")}
        </Button>
    );
}
