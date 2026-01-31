"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createTranslator, DEFAULT_LANG, Lang, languageMeta, Translator } from "@/lib/i18n";

type I18nContextValue = {
  lang: Lang;
  locale: string;
  t: Translator;
  setLang: (lang: Lang) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({
  initialLang = DEFAULT_LANG,
  children,
}: {
  initialLang?: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const router = useRouter();
  const hasMounted = useRef(false);

  const t = useMemo(() => createTranslator(lang), [lang]);
  const locale = languageMeta[lang]?.locale ?? languageMeta[DEFAULT_LANG].locale;

  const setLang = (nextLang: Lang) => {
    setLangState(nextLang);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.cookie = `lang=${lang}; path=/; max-age=31536000`;
    if (hasMounted.current) {
      router.refresh();
    } else {
      hasMounted.current = true;
    }
  }, [lang, router]);

  const value = useMemo(
    () => ({
      lang,
      locale,
      t,
      setLang,
    }),
    [lang, locale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return context;
}
