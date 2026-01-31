"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Search, Menu, User, ChevronDown, Gamepad2, LogIn, LogOut, Shield } from "lucide-react";
import { toast } from "sonner";
import { User as SupabaseUser } from "@supabase/supabase-js";

import { cn } from "@/lib/utils";
import { NAV_LINKS, CATEGORIES, BRAND } from "@/lib/constants";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
    user?: SupabaseUser | null;
    isAdmin?: boolean;
}

export function Header({ user, isAdmin }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const { t } = useI18n();
    const luxuryHover =
        "relative transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-primary hover:shadow-[0_18px_40px_-24px_rgba(90,60,255,0.65)] after:content-[''] after:absolute after:left-4 after:right-4 after:bottom-1 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-primary/80 after:to-transparent after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get("q") as string;
        if (query) {
            router.push(`/shop?q=${encodeURIComponent(query)}`);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success(t("header.loggedOut"));
        router.refresh();
        router.push("/");
    };

    const showToast = (message: string) => {
        toast(message, {
            description: t("header.demoFeature"),
            action: {
                label: t("header.dismiss"),
                onClick: () => console.log("Undo"),
            },
            duration: 2000,
        });
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg border-b border-border/50 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all duration-500" />
                        <Gamepad2 className="w-8 h-8 text-primary relative z-10 interact-icon group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                        {BRAND.name}
                        {isAdmin && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 align-middle">{t("common.admin")}</span>}
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {isAdmin ? (
                        <>
                            <Link href="/admin" className={`font-medium text-foreground/80 hover:text-primary px-4 py-2 rounded-full hover:bg-primary/5 flex items-center gap-2 ${luxuryHover}`}>
                                {t("nav.dashboard")}
                            </Link>
                            <Link href="/admin/products" className={`font-medium text-foreground/80 hover:text-primary px-4 py-2 rounded-full hover:bg-primary/5 flex items-center gap-2 ${luxuryHover}`}>
                                {t("nav.products")}
                            </Link>
                            <Link href="/admin/products/new" className={`font-medium text-foreground/80 hover:text-primary px-4 py-2 rounded-full hover:bg-primary/5 flex items-center gap-2 ${luxuryHover}`}>
                                {t("nav.addNew")}
                            </Link>
                        </>
                    ) : (
                        NAV_LINKS.map((link) => {
                            if (link.labelKey === "nav.categories") {
                                return (
                                    <DropdownMenu key={link.labelKey}>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                suppressHydrationWarning
                                                className={`flex items-center gap-1 font-medium text-foreground/80 hover:text-primary px-4 py-2 rounded-full hover:bg-primary/5 focus:outline-none data-[state=open]:bg-primary/10 data-[state=open]:text-primary [&[data-state=open]>svg]:rotate-180 ${luxuryHover}`}
                                            >
                                                {t(link.labelKey)}
                                                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-[340px] p-2 grid grid-cols-1 gap-1 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border-border/60" align="center" sideOffset={8}>
                                            {CATEGORIES.slice(0, 6).map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={`/shop?category=${cat.id}`}
                                                    className={cn(
                                                        "flex items-center gap-4 p-3 rounded-2xl transition-all hover:bg-secondary/50 group",
                                                        cat.color
                                                    )}
                                                >
                                                    <span className={cn("p-2 rounded-xl bg-white shadow-sm ring-1 ring-black/5 group-hover:scale-110 transition-transform")}>
                                                        {/* Icon rendering handled by Lucide in separate component now or simplify here */}
                                                        {/* Assuming simple icon for dropdown or keeping complexity */}
                                                        <cat.icon className="w-5 h-5" />
                                                    </span>
                                                    <div>
                                                        <span className="text-sm font-bold text-foreground block">{t(cat.nameKey)}</span>
                                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t("common.explore")}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                            <div className="p-2 border-t border-dashed border-border mt-1">
                                                <Link href="/shop" className="flex items-center justify-center w-full py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors">
                                                    {t("common.viewAllCategories")}
                                                </Link>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )
                            }
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`font-medium text-foreground/80 hover:text-primary px-4 py-2 rounded-full hover:bg-primary/5 ${luxuryHover}`}
                                >
                                    {t(link.labelKey)}
                                </Link>
                            )
                        })
                    )}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2 md:gap-3">
                    {!isAdmin && (
                        <>
                            <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-secondary/50 rounded-full pl-4 pr-2 py-1.5 border border-transparent focus-within:border-primary/30 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:shadow-md transition-all duration-300 w-48 focus-within:w-64">
                                <Search className="w-4 h-4 text-muted-foreground mr-2" />
                                <input
                                    name="q"
                                    type="text"
                                    placeholder={t("header.searchPlaceholder")}
                                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/50 h-full"
                                />
                            </form>

                            {/* Mobile Search Trigger */}
                            <Button variant="ghost" size="icon" className="lg:hidden rounded-full hover:bg-secondary" onClick={() => router.push("/shop")}>
                                <Search className="w-5 h-5" />
                            </Button>

                            <div className="hidden sm:flex items-center gap-1 border-l border-border/50 pl-3 ml-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`rounded-full hover:bg-pink-50 hover:text-pink-500 ${luxuryHover}`}
                                    onClick={() => showToast(t("header.wishlistSoon"))}
                                >
                                    <Heart className="w-5 h-5" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`relative rounded-full hover:bg-blue-50 hover:text-blue-600 ${luxuryHover}`}
                                    onClick={() => showToast(t("header.cartSoon"))}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-900 animate-in zoom-in">
                                        0
                                    </span>
                                </Button>
                            </div>
                        </>
                    )}

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    suppressHydrationWarning
                                    variant="ghost"
                                    size="icon"
                                    className={`rounded-full hover:bg-purple-50 hover:text-purple-600 flex ${luxuryHover}`}
                                >
                                    <User className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-white dark:bg-slate-900 shadow-xl border-border/60">
                                <DropdownMenuItem className="p-3 rounded-xl hover:bg-secondary/50 cursor-pointer" asChild>
                                    <Link href="/account">{t("header.myAccount")}</Link>
                                </DropdownMenuItem>
                                {isAdmin && (
                                    <DropdownMenuItem className="p-3 rounded-xl hover:bg-secondary/50 cursor-pointer text-indigo-600 font-bold" asChild>
                                        <Link href="/admin">
                                            <Shield className="w-4 h-4 mr-2" />
                                            {t("header.adminDashboard")}
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="p-3 rounded-xl hover:bg-red-50 text-red-500 cursor-pointer" onClick={handleLogout}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    {t("header.logout")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="ghost" size="icon" className={`rounded-full hover:bg-purple-50 hover:text-purple-600 hidden md:flex ${luxuryHover}`} asChild>
                            <Link href="/login">
                                <User className="w-5 h-5" />
                            </Link>
                        </Button>
                    )}

                    <div className="hidden md:flex">
                        <LanguageSwitcher />
                    </div>

                    <ThemeToggle />

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                suppressHydrationWarning
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                            >
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] rounded-l-3xl border-l border-border/50 flex flex-col h-full p-0">
                            <div className="p-6 border-b border-border/50">
                                <SheetTitle className="flex items-center gap-2">
                                    <span className="bg-primary/10 p-2 rounded-xl text-primary">
                                        <Gamepad2 className="w-6 h-6" />
                                    </span>
                                    {BRAND.name}
                                </SheetTitle>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {!isAdmin && (
                                    <form onSubmit={(e) => { handleSearch(e); }} className="bg-secondary/50 p-2 rounded-2xl flex items-center mb-8 focus-within:ring-2 ring-primary/20 transition-all">
                                        <Search className="w-5 h-5 text-muted-foreground ml-2" />
                                        <input
                                            name="q"
                                            type="text"
                                            placeholder={t("header.searchMobilePlaceholder")}
                                            className="bg-transparent w-full border-none outline-none text-base ml-2 p-2 placeholder:text-muted-foreground/50"
                                        />
                                    </form>
                                )}

                                <nav className="flex flex-col gap-2 mb-8">
                                    {isAdmin ? (
                                        <>
                                            <SheetClose asChild>
                                                <Link href="/admin" className="px-4 py-4 rounded-2xl hover:bg-secondary font-bold text-lg transition-colors flex items-center justify-between">
                                                    {t("nav.dashboard")}
                                                </Link>
                                            </SheetClose>
                                            <SheetClose asChild>
                                                <Link href="/admin/products" className="px-4 py-4 rounded-2xl hover:bg-secondary font-bold text-lg transition-colors flex items-center justify-between">
                                                    {t("nav.products")}
                                                </Link>
                                            </SheetClose>
                                        </>
                                    ) : (
                                        NAV_LINKS.map(link => (
                                            <SheetClose key={link.href} asChild>
                                                <Link
                                                    href={link.href}
                                                    className="px-4 py-4 rounded-2xl hover:bg-secondary font-bold text-lg transition-colors flex items-center justify-between group"
                                                >
                                                    {t(link.labelKey)}
                                                    <ChevronDown className="w-4 h-4 opacity-50 -rotate-90" />
                                                </Link>
                                            </SheetClose>
                                        ))
                                    )}

                                    <div className="h-px bg-border/50 my-2" />

                                    {user ? (
                                        <>
                                            <SheetClose asChild>
                                                <button onClick={handleLogout} className="w-full px-4 py-4 rounded-2xl hover:bg-red-50 text-red-500 font-medium transition-colors flex items-center justify-between group text-left">
                                                    {t("header.logout")}
                                                    <LogOut className="w-4 h-4" />
                                                </button>
                                            </SheetClose>
                                        </>
                                    ) : (
                                        <>
                                            <SheetClose asChild>
                                                <Link href="/login" className="px-4 py-4 rounded-2xl hover:bg-secondary font-medium transition-colors flex items-center justify-between group">
                                                    {t("header.login")}
                                                    <LogIn className="w-4 h-4 text-muted-foreground" />
                                                </Link>
                                            </SheetClose>
                                            <SheetClose asChild>
                                                <Link href="/register" className="px-4 py-4 rounded-2xl hover:bg-secondary font-medium transition-colors flex items-center justify-between group">
                                                    {t("header.register")}
                                                </Link>
                                            </SheetClose>
                                        </>
                                    )}
                                </nav>

                                {!isAdmin && (
                                    <div>
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">{t("header.popularCategories")}</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {CATEGORIES.slice(0, 6).map((cat) => (
                                                <SheetClose key={cat.id} asChild>
                                                    <Link
                                                        href={`/shop?category=${cat.id}`}
                                                        className="flex flex-col items-center justify-center gap-3 p-4 rounded-3xl bg-secondary/30 hover:bg-secondary transition-colors text-center"
                                                    >
                                                        <span className={cn("p-2.5 rounded-full shadow-sm bg-white", cat.color)}>
                                                            <cat.icon className="w-5 h-5" />
                                                        </span>
                                                        <span className="text-xs font-bold">{t(cat.nameKey)}</span>
                                                    </Link>
                                                </SheetClose>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8">
                                    <LanguageSwitcher />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
