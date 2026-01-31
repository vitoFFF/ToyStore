"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, useTime } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function Hero() {
    const { t } = useI18n();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    // Mouse Parallax Logic
    const targetX = useMotionValue(0);
    const targetY = useMotionValue(0);

    // Smooth spring config - softer response for buttery movement
    const springConfig = { damping: 22, stiffness: 70, mass: 0.9 };
    const springX = useSpring(targetX, springConfig);
    const springY = useSpring(targetY, springConfig);

    const moveX1 = useTransform(springX, [-0.5, 0.5], [-25, 25]);
    const moveY1 = useTransform(springY, [-0.5, 0.5], [-25, 25]);

    const moveX2 = useTransform(springX, [-0.5, 0.5], [15, -15]);
    const moveY2 = useTransform(springY, [-0.5, 0.5], [15, -15]);

    const time = useTime();
    const floatMain = useTransform(time, (t) => Math.sin(t / 1200) * 18);
    const floatTop = useTransform(time, (t) => Math.sin(t / 1400 + 1.2) * 12);
    const floatBottom = useTransform(time, (t) => Math.sin(t / 1600 + 2.1) * -14);

    const parallaxMainY = useTransform([moveY1, floatMain], ([parallax, float]) => parallax + float);
    const parallaxTopY = useTransform([moveY2, floatTop], ([parallax, float]) => parallax + float);
    const parallaxBottomY = useTransform([moveY2, floatBottom], ([parallax, float]) => parallax + float);

    const frameRef = useRef<number | null>(null);
    const latestRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const updateTargets = () => {
            frameRef.current = null;
            targetX.set(latestRef.current.x);
            targetY.set(latestRef.current.y);
        };

        const handlePointerMove = (e: PointerEvent) => {
            const { innerWidth, innerHeight } = window;
            latestRef.current.x = (e.clientX / innerWidth) - 0.5;
            latestRef.current.y = (e.clientY / innerHeight) - 0.5;
            if (frameRef.current === null) {
                frameRef.current = window.requestAnimationFrame(updateTargets);
            }
        };

        const handlePointerLeave = () => {
            latestRef.current.x = 0;
            latestRef.current.y = 0;
            if (frameRef.current === null) {
                frameRef.current = window.requestAnimationFrame(updateTargets);
            }
        };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerleave", handlePointerLeave);
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerleave", handlePointerLeave);
            if (frameRef.current !== null) {
                window.cancelAnimationFrame(frameRef.current);
            }
        };
    }, [targetX, targetY]);

    return (
        <section className="relative overflow-hidden pt-16 pb-10 sm:pt-28 sm:pb-20 md:pt-40 md:pb-52">
            {/* Background Gradients */}
            <motion.div style={{ y: y1 }} className="absolute top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none opacity-60 dark:opacity-45">
                <div className="absolute top-[-12%] right-[-15%] w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] md:w-[700px] md:h-[700px] bg-purple-300/30 rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute bottom-[-12%] left-[-18%] w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] bg-blue-200/30 rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute top-[18%] left-[22%] w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] bg-pink-200/30 rounded-full blur-[70px] mix-blend-multiply dark:mix-blend-screen" />
            </motion.div>

            <div className="container mx-auto px-4 relative">
                <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12 lg:gap-24">

                    {/* Text Content */}
                    <div className="flex-1 text-center md:text-left space-y-7 sm:space-y-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full text-sm font-bold text-primary mb-6 border border-white/50 shadow-sm"
                            >
                                <Zap className="w-4 h-4 fill-primary text-primary animate-pulse" />
                                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                    {t("hero.badge")}
                                </span>
                            </motion.div>

                            <h1 className="text-[2.6rem] sm:text-5xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.08] sm:leading-[1.1] mb-5 sm:mb-6 drop-shadow-sm">
                                {t("hero.titleLine1")} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-gradient-x">
                                    {t("hero.titleLine2")}
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
                                {t("hero.subtitle")}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4"
                        >
                            <Button size="lg" className="rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-primary to-purple-600" asChild>
                                <Link href="/shop">
                                    {t("hero.startExploring")} <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="secondary" className="rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-bold hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all border border-transparent hover:border-border/50" asChild>
                                <Link href="#categories">
                                    {t("hero.browseCategories")}
                                </Link>
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="pt-6 sm:pt-8 flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-muted-foreground/80"
                        >
                            <div className="flex items-center gap-2">
                                <div className="bg-yellow-100 p-1.5 rounded-full"><Star className="w-4 h-4 fill-yellow-500 text-yellow-600" /></div>
                                {t("hero.rating")}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="bg-green-100 p-1.5 rounded-full"><ShieldCheck className="w-4 h-4 text-green-600" /></div>
                                {t("hero.safeMaterials")}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-100 p-1.5 rounded-full"><Truck className="w-4 h-4 text-blue-600" /></div>
                                {t("hero.fastDelivery")}
                            </div>
                        </motion.div>
                    </div>

                    {/* Visuals - Interactive 3D Parallax */}
                    <div className="flex-1 relative w-full h-[280px] sm:h-[420px] md:h-[500px] flex items-center justify-center perspective-1000">
                        <div className="relative w-[92vw] h-full max-w-[320px] sm:w-full sm:max-w-[420px] md:max-w-[500px] max-h-[280px] sm:max-h-[420px] md:max-h-[500px]">

                            {/* Main Card - Floating */}
                            <motion.div
                                style={{ x: moveX1, y: parallaxMainY }}
                                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    rotate: 0
                                }}
                                transition={{
                                    duration: 1,
                                    type: "spring"
                                }}
                                className="absolute inset-2 sm:inset-6 lg:inset-8 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-900/80 dark:to-slate-800/40 backdrop-blur-xl rounded-[1.75rem] sm:rounded-[2.5rem] lg:rounded-[3rem] border border-white/50 dark:border-white/10 shadow-2xl flex items-center justify-center overflow-hidden z-10 transform-gpu [will-change:transform] [backface-visibility:hidden]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-pink-500/10 opacity-50" />
                                <motion.div
                                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="text-[84px] sm:text-[120px] md:text-[140px] filter drop-shadow-2xl relative z-20 transform-gpu [will-change:transform]"
                                >
                                    🚀
                                </motion.div>
                            </motion.div>

                            {/* Floating Element 1 - Top Right */}
                            <motion.div
                                style={{ x: moveX2, y: parallaxTopY }}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{
                                    opacity: 1,
                                    x: 0
                                }}
                                transition={{
                                    opacity: { delay: 0.5 }
                                }}
                                className="absolute top-1 right-1 sm:top-0 sm:right-0 z-20 transform-gpu [will-change:transform] [backface-visibility:hidden]"
                            >
                                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 dark:border-white/10 flex flex-col items-center gap-1.5 sm:gap-2 w-20 sm:w-28 md:w-32 rotate-3 sm:rotate-6 hover:rotate-0 transition-transform duration-300">
                                    <span className="text-2xl sm:text-4xl">🧸</span>
                                    <span className="text-[10px] sm:text-xs font-bold">{t("hero.softCuddly")}</span>
                                </div>
                            </motion.div>

                            {/* Floating Element 2 - Bottom Left */}
                            <motion.div
                                style={{ x: moveX2, y: parallaxBottomY }}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{
                                    opacity: 1,
                                    x: 0
                                }}
                                transition={{
                                    opacity: { delay: 0.7 }
                                }}
                                className="absolute bottom-2 left-1 sm:bottom-10 sm:left-0 z-20 transform-gpu [will-change:transform] [backface-visibility:hidden]"
                            >
                                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 dark:border-white/10 flex items-center gap-2.5 sm:gap-4 w-32 sm:w-44 md:w-48 -rotate-2 sm:-rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-[9px] sm:text-xs">-20%</div>
                                    <div>
                                        <div className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-wide font-bold">{t("common.todayOnly")}</div>
                                        <div className="font-bold text-[11px] sm:text-sm">{t("common.robotKit")}</div>
                                    </div>
                                </div>
                            </motion.div>
                            {/* Decorative Elements */}
                            <motion.div
                                style={{ y: y2 }}
                                className="absolute -top-6 -left-6 sm:-top-10 sm:-left-10 w-16 h-16 sm:w-24 sm:h-24 bg-yellow-400 rounded-full blur-2xl opacity-40 mix-blend-multiply dark:mix-blend-screen animate-pulse"
                            />
                            <motion.div
                                style={{ y: y1 }}
                                className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 w-20 h-20 sm:w-32 sm:h-32 bg-pink-400 rounded-full blur-2xl opacity-40 mix-blend-multiply dark:mix-blend-screen animate-pulse"
                            />

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
