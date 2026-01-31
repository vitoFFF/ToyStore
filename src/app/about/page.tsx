import { BRAND } from "@/lib/constants";
import { ShieldCheck, Truck, Star, Heart } from "lucide-react";
import { getServerTranslator } from "@/lib/i18n.server";

export default async function AboutPage() {
    const { t } = await getServerTranslator();
    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-3xl mx-auto space-y-12">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t("about.title", { brand: BRAND.name })}</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {t("about.mission")}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 text-center bg-secondary/30 p-8 rounded-[2rem]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-white rounded-full shadow-sm text-yellow-500">
                            <Star className="w-8 h-8 fill-yellow-500" />
                        </div>
                        <h3 className="font-bold text-lg">{t("about.topRated")}</h3>
                        <p className="text-sm text-muted-foreground">{t("about.topRatedDesc")}</p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-white rounded-full shadow-sm text-green-500">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg">{t("about.safetyFirst")}</h3>
                        <p className="text-sm text-muted-foreground">{t("about.safetyDesc")}</p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-white rounded-full shadow-sm text-blue-500">
                            <Truck className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg">{t("about.fastShipping")}</h3>
                        <p className="text-sm text-muted-foreground">{t("about.fastShippingDesc")}</p>
                    </div>
                </div>

                <div className="text-center">
                    <div className="p-8 border-2 border-dashed border-primary/20 rounded-3xl">
                        <Heart className="w-12 h-12 text-red-500 mx-auto mb-4 fill-red-500 animate-pulse" />
                        <h2 className="text-2xl font-bold mb-2">{t("about.promiseTitle")}</h2>
                        <p className="text-muted-foreground">{t("about.promiseDesc")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
