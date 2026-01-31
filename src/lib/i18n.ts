import { en } from "@/lib/i18n-data/en";
import { ka } from "@/lib/i18n-data/ka";
import { ru } from "@/lib/i18n-data/ru";

export const SUPPORTED_LANGS = ["en", "ka", "ru"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: Lang = "en";

export const languageMeta: Record<Lang, { label: string; locale: string; flag: "us" | "ge" | "ru" }> = {
  en: { label: "English", locale: "en-US", flag: "us" },
  ka: { label: "ქართული", locale: "ka-GE", flag: "ge" },
  ru: { label: "Русский", locale: "ru-RU", flag: "ru" },
};

const translations = { en, ka, ru } as const;

export type TranslationKey = string;

export type Translator = (key: TranslationKey, vars?: Record<string, string | number>) => string;

export function isSupportedLang(value: string): value is Lang {
  return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

function resolvePath(obj: unknown, path: string): unknown {
  return path.split(".").reduce((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj as Record<string, unknown>);
}

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (vars[key] === undefined || vars[key] === null) return match;
    return String(vars[key]);
  });
}

export function createTranslator(lang: Lang): Translator {
  return (key, vars) => {
    const current = resolvePath(translations[lang], key);
    const fallback = resolvePath(translations[DEFAULT_LANG], key);
    const value = (typeof current === "string" ? current : typeof fallback === "string" ? fallback : key) as string;
    return interpolate(value, vars);
  };
}

export function getLocale(lang: Lang) {
  return languageMeta[lang]?.locale ?? languageMeta[DEFAULT_LANG].locale;
}

export function formatCurrency(locale: string, amount: number, currency: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}

export function formatAgeRange(t: Translator, min?: number | null, max?: number | null) {
  if (min === null || min === undefined) return t("productCard.allAges");
  if (max) return t("productCard.ageRange", { min, max });
  return t("productCard.ageRangePlus", { min });
}
