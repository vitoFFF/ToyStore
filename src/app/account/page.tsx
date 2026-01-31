import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, Package, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getServerTranslator } from "@/lib/i18n.server";
import { getLocale } from "@/lib/i18n";

export default async function AccountPage() {
    const { t, lang } = await getServerTranslator();
    const locale = getLocale(lang);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t("account.title")}</h1>
                        <p className="text-muted-foreground">{t("account.welcome", { name: profile?.full_name || user.email })}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-border shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            {t("account.profileDetails")}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("account.fullName")}</label>
                                <div className="font-medium text-lg">{profile?.full_name || t("account.notSet")}</div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("account.email")}</label>
                                <div className="font-medium text-lg">{user.email}</div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("account.memberSince")}</label>
                                <div className="font-medium text-lg">
                                    {new Date(user.created_at).toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats / Actions */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-border shadow-sm flex flex-col justify-center gap-4">
                        <div className="bg-secondary/30 p-4 rounded-2xl flex items-center gap-4">
                            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-black">0</div>
                                <div className="text-sm text-muted-foreground font-medium">{t("account.ordersPlaced")}</div>
                            </div>
                        </div>
                        <div className="bg-secondary/30 p-4 rounded-2xl flex items-center gap-4">
                            <div className="bg-pink-100 text-pink-600 p-3 rounded-xl">
                                <Heart className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-black">0</div>
                                <div className="text-sm text-muted-foreground font-medium">{t("account.wishlistItems")}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Section (Placeholder) */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border shadow-sm">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        {t("account.orderHistory")}
                    </h2>

                    <div className="text-center py-12 flex flex-col items-center gap-4 bg-secondary/20 rounded-2xl border-dashed border-2 border-border/50">
                        <div className="bg-white p-4 rounded-full shadow-sm">
                            <Package className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-foreground">{t("account.noOrdersTitle")}</p>
                            <p className="text-muted-foreground">{t("account.noOrdersDesc")}</p>
                        </div>
                        <Button asChild className="mt-2 rounded-xl font-bold">
                            <Link href="/shop">{t("account.startShopping")}</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
