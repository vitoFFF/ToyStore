import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { createClient } from "@/lib/supabase/server";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { createTranslator } from "@/lib/i18n";
import { getLangFromCookies } from "@/lib/i18n.server";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  const lang = await getLangFromCookies();
  const t = createTranslator(lang);
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLangFromCookies();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // If profile doesn't exist (e.g. user created via dashboard before trigger), create it
    if (!profile) {
      await supabase.from("profiles").insert({ id: user.id, role: 'customer' });
    }

    isAdmin = profile?.role === "admin";
  }

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased`}>
        <LanguageProvider initialLang={lang}>
          <Header user={user} isAdmin={isAdmin} />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
          <Toaster position="top-center" richColors />
        </LanguageProvider>
      </body>
    </html>
  );
}
