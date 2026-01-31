import { cookies } from "next/headers";
import { createTranslator, DEFAULT_LANG, isSupportedLang } from "@/lib/i18n";

export async function getLangFromCookies() {
  const cookieStore = await cookies();
  const value = cookieStore.get("lang")?.value;
  if (value && isSupportedLang(value)) return value;
  return DEFAULT_LANG;
}

export async function getServerTranslator() {
  const lang = await getLangFromCookies();
  const t = createTranslator(lang);
  return { lang, t };
}
