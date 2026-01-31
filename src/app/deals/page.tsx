import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Tag } from "lucide-react";
import { getServerTranslator } from "@/lib/i18n.server";

export default async function DealsPage() {
    const { t } = await getServerTranslator();
    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="inline-block p-4 bg-red-100 rounded-full text-red-600 mb-4 animate-bounce">
                    <Tag className="w-12 h-12" />
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight">{t("deals.title")}</h1>
                <p className="text-xl text-muted-foreground">
                    {t("deals.subtitle")}
                </p>
                <Button size="lg" className="rounded-2xl h-14 px-8 text-lg font-bold" asChild>
                    <Link href="/shop?badge=Sale">
                        {t("deals.shopSale")} <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
