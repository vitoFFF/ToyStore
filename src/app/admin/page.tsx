import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { getServerTranslator } from "@/lib/i18n.server";

export default async function AdminDashboardPage() {
    const { t } = await getServerTranslator();
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight">{t("admin.dashboardTitle")}</h1>
                <p className="text-muted-foreground">{t("admin.dashboardSubtitle")}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard title={t("admin.totalRevenue")} value="$45,231.89" icon={DollarSign} trend={t("admin.trendLastMonth")} />
                <StatsCard title={t("admin.activeOrders")} value="+573" icon={ShoppingCart} trend={t("admin.trendLastHour")} />
                <StatsCard title={t("admin.products")} value="12" icon={Package} trend={t("admin.trendNewProducts")} />
                <StatsCard title={t("admin.activeNow")} value="+573" icon={TrendingUp} trend={t("admin.trendSinceLastHour")} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 rounded-3xl shadow-sm border-border/50">
                    <CardHeader>
                        <CardTitle>{t("admin.overview")}</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                            {t("admin.chartPlaceholder")}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 rounded-3xl shadow-sm border-border/50">
                    <CardHeader>
                        <CardTitle>{t("admin.recentSales")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">{t("admin.noRecentSales")}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend: string }) {
    return (
        <Card className="rounded-3xl shadow-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    {trend}
                </p>
            </CardContent>
        </Card>
    )
}
