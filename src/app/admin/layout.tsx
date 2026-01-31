import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerTranslator } from "@/lib/i18n.server";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { t } = await getServerTranslator();
    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-border fixed inset-y-0 left-0 pt-20 pb-4 flex flex-col z-40">
                <div className="p-6">
                    <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">{t("admin.management")}</h2>
                    <nav className="space-y-2">
                        <NavItem href="/admin" icon={LayoutDashboard} label={t("nav.dashboard")} />
                        <NavItem href="/admin/products" icon={Package} label={t("nav.products")} />
                        <NavItem href="/admin/orders" icon={ShoppingCart} label={t("admin.orders")} badge="0" />
                        <NavItem href="/admin/customers" icon={Users} label={t("admin.customers")} />
                    </nav>

                    <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-8 mb-4">{t("admin.settings")}</h2>
                    <nav className="space-y-2">
                        <NavItem href="/admin/settings" icon={Settings} label={t("admin.storeSettings")} />
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 pt-24">
                {children}
            </main>
        </div>
    );
}

function NavItem({ href, icon: Icon, label, badge }: { href: string, icon: any, label: string, badge?: string }) {
    return (
        <Link href={href}>
            <span className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors group">
                <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                    {label}
                </span>
                {badge && (
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                        {badge}
                    </span>
                )}
            </span>
        </Link>
    )
}
