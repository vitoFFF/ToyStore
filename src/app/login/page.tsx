"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gamepad2, Loader2 } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const { t } = useI18n();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error(error.message);
            setLoading(false);
            return;
        }

        toast.success(t("auth.welcomeToast"));
        router.refresh();
        router.push("/");
    };

    return (
        <div className="min-h-[calc(100svh-5rem)] flex items-center justify-center py-10 -mt-20 px-4">
            <div className="w-full max-w-md mx-auto space-y-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-border text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

                <div className="flex flex-col items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-3xl text-primary mb-2 ring-8 ring-primary/5">
                        <Gamepad2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight">{t("auth.welcomeBack")}</h1>
                        <p className="text-muted-foreground">{t("auth.signInSubtitle", { brand: BRAND.name })}</p>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 text-left">
                    <Input
                        name="email"
                        type="email"
                        placeholder={t("auth.email")}
                        required
                        className="rounded-xl h-12 bg-secondary/30 border-transparent focus:bg-background transition-all"
                    />
                    <Input
                        name="password"
                        type="password"
                        placeholder={t("auth.password")}
                        required
                        className="rounded-xl h-12 bg-secondary/30 border-transparent focus:bg-background transition-all"
                    />
                    <Button
                        disabled={loading}
                        className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        type="submit"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : t("auth.signIn")}
                    </Button>
                </form>

                <div className="text-sm text-muted-foreground pt-2">
                    {t("auth.noAccount")} <Link href="/register" className="text-primary font-bold hover:underline">{t("auth.register")}</Link>
                </div>
            </div>
        </div>
    );
}
