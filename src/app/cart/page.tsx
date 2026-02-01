"use client";

import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/CartProvider";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { formatCurrency } from "@/lib/i18n";

export default function CartPage() {
    const { items, itemCount, subtotalCents, removeItem } = useCart();
    const { t, locale } = useI18n();

    const currency = items[0]?.currency || "GEL";
    const subtotal = formatCurrency(locale, subtotalCents / 100, currency);

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-center gap-3">
                    <span className="bg-primary/10 text-primary p-3 rounded-2xl">
                        <ShoppingBag className="w-6 h-6" />
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                        {t("cart.title")}
                    </h1>
                </div>
                <p className="text-muted-foreground">
                    {t("cart.subtitle")}
                </p>
            </div>

            {items.length === 0 ? (
                <div className="rounded-3xl border border-border bg-secondary/20 p-10 text-center">
                    <h2 className="text-2xl font-bold mb-2">{t("cart.emptyTitle")}</h2>
                    <p className="text-muted-foreground mb-6">{t("cart.emptyDesc")}</p>
                    <Button asChild size="lg" className="rounded-2xl">
                        <Link href="/shop">{t("cart.continueShopping")}</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-8">
                    <div className="rounded-3xl border border-border bg-white/80 dark:bg-slate-900/70 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                {t("cart.itemsCount", { count: itemCount })}
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-border/70 p-4 bg-background"
                                >
                                    <div className="w-24 h-24 rounded-2xl bg-secondary/40 overflow-hidden flex items-center justify-center shrink-0">
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                {t("product.toyFallback")}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <Link href={`/product/${item.slug}`} className="font-bold text-lg hover:text-primary transition-colors">
                                            {item.title}
                                        </Link>
                                        <div className="text-muted-foreground text-sm mt-1">
                                            {formatCurrency(locale, item.price_cents / 100, item.currency)}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-2">
                                            {t("cart.quantityLabel", { count: item.quantity })}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full hover:bg-red-50 hover:text-red-600"
                                        onClick={() => removeItem(item.id)}
                                        aria-label={t("cart.removeItem")}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border bg-secondary/30 p-6 h-fit">
                        <h3 className="text-xl font-bold mb-4">{t("cart.summaryTitle")}</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                            <span>{t("cart.subtotal")}</span>
                            <span className="font-semibold text-foreground">{subtotal}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-6">
                            {t("cart.checkoutNote")}
                        </div>
                        <Button size="lg" className="w-full rounded-2xl" disabled>
                            {t("cart.checkoutSoon")}
                        </Button>
                        <Button variant="outline" size="lg" className="w-full rounded-2xl mt-3" asChild>
                            <Link href="/shop">{t("cart.continueShopping")}</Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
