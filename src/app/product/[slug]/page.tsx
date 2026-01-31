import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/data/products";
import { ShoppingCart, Star, ArrowLeft, Truck, ShieldCheck, RefreshCcw, Heart, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getServerTranslator } from "@/lib/i18n.server";
import { formatCurrency, getLocale } from "@/lib/i18n";

async function AdminEditButton({ productId }: { productId: string }) {
    const { t } = await getServerTranslator();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== 'admin') return null;

    return (
        <div className="mb-6">
            <Button asChild variant="outline" className="gap-2 border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800">
                <Link href={`/admin/products/${productId}/edit`}>
                    <Pencil className="w-4 h-4" />
                    {t("product.editProduct")}
                </Link>
            </Button>
        </div>
    );
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
    const { t, lang } = await getServerTranslator();
    const locale = getLocale(lang);
    const params = await props.params;
    const product = await getProductBySlug(params.slug);

    if (!product) {
        notFound();
    }

    // Default image if none
    const mainImage = product.image_urls?.[0] || "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=1000";

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-primary" asChild>
                <Link href="/shop" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    {t("product.backToShop")}
                </Link>
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Section */}
                <div className="space-y-4">
                    <div className="aspect-square bg-secondary/30 rounded-[2.5rem] overflow-hidden shadow-sm flex items-center justify-center relative group">
                        {/* We use img tag for external URLs or simpler handling */}
                        <img
                            src={mainImage}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </div>
                </div>

                {/* Details Section */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            {product.categories && (
                                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider">
                                    {(product.categories as any).name || t("product.toyFallback")}
                                </span>
                            )}
                            <div className="flex items-center gap-1 text-amber-400">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="font-bold text-foreground">4.9</span>
                                <span className="text-muted-foreground ml-1 text-sm">(128 {t("product.reviews")})</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4 leading-tight">
                            {product.title}
                        </h1>

                        {/* Admin Action */}
                        <AdminEditButton productId={product.id} />

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex items-end gap-4 p-6 bg-secondary/30 rounded-3xl border border-white/50 backdrop-blur-sm">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground font-medium mb-1">{t("product.price")}</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-primary">
                                    {formatCurrency(locale, product.price_cents / 100, product.currency || "GEL")}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            {product.stock > 0 ? (
                                <span className="inline-flex items-center gap-1.5 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-bold">
                                    <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                                    {t("product.inStock")}
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm font-bold">
                                    {t("product.outOfStock")}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button size="lg" className="flex-1 h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-gradient-to-r from-primary to-purple-600">
                            <ShoppingCart className="w-6 h-6 mr-2" />
                            {t("product.addToCart")}
                        </Button>
                        <Button size="icon" variant="outline" className="h-16 w-16 rounded-2xl border-2 hover:bg-secondary transition-colors">
                            <Heart className="w-6 h-6 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

