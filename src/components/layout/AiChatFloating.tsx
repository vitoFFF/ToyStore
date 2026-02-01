"use client";

import { Bot, Sparkles } from "lucide-react";

import { useI18n } from "@/components/i18n/LanguageProvider";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function AiChatFloating() {
  const { t } = useI18n();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            className="group relative inline-flex items-center rounded-full p-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-foreground shadow-[0_12px_30px_-18px_rgba(99,102,241,0.7)] ring-1 ring-black/5 backdrop-blur dark:bg-slate-950/80">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-300">
                <Bot className="h-4 w-4" />
              </span>
              <span className="hidden sm:inline">{t("header.aiChat")}</span>
            </span>
          </button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[360px] sm:w-[460px] p-0 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_50%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.12),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.2),_transparent_50%)]"
        >
          <div className="flex h-full flex-col bg-gradient-to-b from-white/95 via-white/95 to-slate-50/90 dark:from-slate-950/95 dark:via-slate-950/95 dark:to-slate-900/90">
            <div className="relative border-b border-border/60 px-6 pb-5 pt-6">
              <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-sky-500/15 blur-3xl" />
              <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl" />
              <div className="relative flex items-start gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-sky-400 to-fuchsia-500 opacity-50 blur-sm" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-fuchsia-500 text-white shadow-lg">
                    <Bot className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <SheetTitle className="text-xl font-bold">{t("header.aiChatTitle")}</SheetTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{t("header.aiChatSubtitle")}</p>
                </div>
                <span className="rounded-full border border-indigo-200/70 bg-indigo-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
                  {t("header.aiChatSoon")}
                </span>
              </div>
              <div className="relative mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-border/60 bg-white/80 px-3 py-1 text-xs font-semibold text-foreground shadow-sm dark:bg-slate-900/70">
                  {t("header.aiChatTag1")}
                </span>
                <span className="rounded-full border border-border/60 bg-white/80 px-3 py-1 text-xs font-semibold text-foreground shadow-sm dark:bg-slate-900/70">
                  {t("header.aiChatTag2")}
                </span>
                <span className="rounded-full border border-border/60 bg-white/80 px-3 py-1 text-xs font-semibold text-foreground shadow-sm dark:bg-slate-900/70">
                  {t("header.aiChatTag3")}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
              <div className="rounded-3xl border border-border/60 bg-white/80 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.5)] backdrop-blur dark:bg-slate-900/70">
                <p className="text-sm font-semibold text-foreground">{t("header.aiChatPanelTitle")}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t("header.aiChatPanelDesc")}</p>
                <div className="mt-4 space-y-3 text-xs text-muted-foreground">
                  <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white p-3 shadow-sm dark:from-slate-900 dark:to-slate-950">
                    {t("header.aiChatPreview1")}
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white p-3 shadow-sm dark:from-slate-900 dark:to-slate-950">
                    {t("header.aiChatPreview2")}
                  </div>
                </div>
              </div>

              <form
                onSubmit={(event) => event.preventDefault()}
                className="mt-5 rounded-3xl border border-border/60 bg-white/80 p-4 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.6)] dark:bg-slate-900/70"
              >
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {t("header.aiChatPanelTitle")}
                </label>
                <div className="mt-3 rounded-2xl border border-border/60 bg-white/80 px-4 py-3 shadow-inner dark:bg-slate-950/70">
                  <input
                    name="message"
                    placeholder={t("header.aiChatInputPlaceholder")}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 outline-none"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{t("header.aiChatSoon")}</p>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_30px_-18px_rgba(99,102,241,0.7)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <Sparkles className="h-4 w-4" />
                    {t("header.aiChat")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
