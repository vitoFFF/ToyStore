import Link from "next/link";
import { Facebook, Instagram, Twitter, Gamepad2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/constants";
import { getServerTranslator } from "@/lib/i18n.server";

export async function Footer() {
    const { t } = await getServerTranslator();
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="bg-primary/10 p-2 rounded-xl text-primary">
                                <Gamepad2 className="w-6 h-6" />
                            </span>
                            <span className="text-xl font-bold">{BRAND.name}</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {t("footer.description")}
                        </p>
                        <div className="flex items-center gap-3">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-white transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Column */}
                    <div>
                        <h4 className="font-bold mb-4">{t("footer.shop")}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/shop" className="hover:text-primary transition-colors">{t("footer.allToys")}</Link></li>
                            <li><Link href="/shop?filter=new" className="hover:text-primary transition-colors">{t("footer.newArrivals")}</Link></li>
                            <li><Link href="/shop?filter=sale" className="hover:text-primary transition-colors">{t("footer.onSale")}</Link></li>
                            <li><Link href="/gift-cards" className="hover:text-primary transition-colors">{t("footer.giftCards")}</Link></li>
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h4 className="font-bold mb-4">{t("footer.support")}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/help" className="hover:text-primary transition-colors">{t("footer.helpCenter")}</Link></li>
                            <li><Link href="/returns" className="hover:text-primary transition-colors">{t("footer.returns")}</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary transition-colors">{t("footer.shippingInfo")}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">{t("footer.contactUs")}</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h4 className="font-bold mb-4">{t("footer.joinFun")}</h4>
                        <p className="text-muted-foreground text-sm mb-4">
                            {t("footer.newsletterDesc")}
                        </p>
                        <div className="flex flex-col gap-2">
                            <Input placeholder={t("footer.emailPlaceholder")} className="rounded-xl bg-secondary border-none" />
                            <Button className="rounded-xl w-full font-bold">{t("footer.subscribe")}</Button>
                        </div>
                    </div>

                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} {BRAND.name}. {t("footer.rights")}</p>
                    <div className="flex items-center gap-1">
                        {t("footer.madeWith")} <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {t("footer.forKids")}
                    </div>
                </div>
            </div>
        </footer>
    );
}
