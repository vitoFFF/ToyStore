import { Hero } from "@/components/home/Hero";
import { CategoryTile } from "@/components/ui/CategoryTile";
import { ProductCard } from "@/components/ui/ProductCard";
import { CATEGORIES } from "@/lib/constants";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { listProducts } from "@/lib/data/products";
import { getServerTranslator } from "@/lib/i18n.server";

export default async function Home() {
  const { t } = await getServerTranslator();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Check admin status
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  const featuredCategories = CATEGORIES.slice(0, 4);
  // Fetch real products for the homepage
  const products = await listProducts();
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Show Simplified Admin Welcome or Public Hero */}
      {isAdmin ? (
        <section className="container mx-auto px-4 py-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-border shadow-sm flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-primary" />
                {t("home.adminOverview")}
              </h1>
              <p className="text-muted-foreground">{t("home.adminWelcome")}</p>
            </div>
            <Button asChild size="lg" className="rounded-xl font-bold">
              <Link href="/admin">{t("home.goToDashboard")}</Link>
            </Button>
          </div>
        </section>
      ) : (
        <Hero />
      )}

      {/* Featured Categories Section */}
      <section id="categories" className="container mx-auto px-4 scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">{t("home.shopByCategory")}</h2>
          <Button variant="ghost" className="hidden sm:flex text-primary hover:text-primary/80" asChild>
            <Link href="/shop">{t("common.viewAll")} <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredCategories.map((cat) => (
            <CategoryTile
              key={cat.id}
              category={{
                ...cat,
                label: t(cat.nameKey),
              }}
              ctaLabel={t("common.shopNow")}
            />
          ))}
        </div>
        <div className="mt-6 sm:hidden text-center">
          <Button variant="link" className="text-primary" asChild>
            <Link href="/shop">{t("common.viewAllCategories")} <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Featured Toys Section */}
      <section className="container mx-auto px-4 py-12 bg-secondary/30 rounded-[3rem]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          {!isAdmin && (
            <div className="inline-block px-3 py-1 bg-white rounded-full text-xs font-bold uppercase tracking-wider text-purple-600 mb-3 shadow-sm">
              {t("home.trendingNow")}
            </div>
          )}
          <h2 className="text-4xl font-bold tracking-tight mb-4">{t("home.featuredToys")}</h2>
          <p className="text-muted-foreground">
            {isAdmin ? t("home.featuredAdmin") : t("home.featuredPublic")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              {t("home.noProducts")} {isAdmin && t("home.addFromDashboard")}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="rounded-2xl px-8 h-12 shadow-lg hover:shadow-xl transition-all" asChild>
            <Link href="/shop">{t("home.exploreAllToys")}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
