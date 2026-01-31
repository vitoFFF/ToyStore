"use client";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { languageMeta, SUPPORTED_LANGS, Lang } from "@/lib/i18n";
import { useI18n } from "@/components/i18n/LanguageProvider";

const FLAG_ICON: Record<Lang, string> = {
  en: "/flags/us.svg",
  ka: "/flags/ge.svg",
  ru: "/flags/ru.svg",
};

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const current = languageMeta[lang];

  return (
    <Select value={lang} onValueChange={(value) => setLang(value as Lang)}>
      <SelectTrigger
        aria-label={current.label}
        className="h-10 w-10 rounded-full border border-white/60 bg-background/70 text-xs font-semibold shadow-sm ring-1 ring-black/5 backdrop-blur-md transition hover:bg-background/90 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/40 [&>svg]:hidden"
      >
        <img
          src={FLAG_ICON[lang]}
          alt=""
          aria-hidden="true"
          className="h-5 w-5 rounded-sm"
        />
      </SelectTrigger>
      <SelectContent
        align="end"
        className="rounded-2xl border border-white/70 bg-background/95 p-1 shadow-xl backdrop-blur-xl"
      >
        {SUPPORTED_LANGS.map((code) => (
          <SelectItem
            key={code}
            value={code}
            textValue={languageMeta[code].label}
            className="rounded-lg px-2.5 py-2 text-[13px] font-medium focus:bg-accent/70 data-[state=checked]:bg-accent/60"
          >
            <span className="flex items-center gap-2.5">
              <img
                src={FLAG_ICON[code]}
                alt=""
                aria-hidden="true"
                className="h-4 w-4 rounded-sm"
              />
              <span className="tracking-tight">{languageMeta[code].label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
