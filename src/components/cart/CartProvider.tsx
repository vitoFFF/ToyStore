"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
    id: string;
    title: string;
    price_cents: number;
    currency: string;
    image_url?: string | null;
    slug: string;
    quantity: number;
};

export type CartItemInput = Omit<CartItem, "quantity"> & { quantity?: number };

type CartContextValue = {
    items: CartItem[];
    itemCount: number;
    subtotalCents: number;
    addItem: (item: CartItemInput) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clear: () => void;
};

const STORAGE_KEY = "toyverse_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

function normalizeItems(raw: unknown): CartItem[] {
    if (!Array.isArray(raw)) return [];
    return raw
        .filter((item) => item && typeof item === "object")
        .map((item) => {
            const record = item as Record<string, unknown>;
            return {
                id: String(record.id ?? ""),
                title: String(record.title ?? ""),
                price_cents: Number(record.price_cents ?? 0),
                currency: String(record.currency ?? "GEL"),
                image_url: record.image_url ?? null,
                slug: String(record.slug ?? ""),
                quantity: Math.max(1, Number(record.quantity ?? 1)),
            };
        })
        .filter((item) => item.id && item.title);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setItems(normalizeItems(JSON.parse(stored)));
            }
        } catch (error) {
            console.error("Failed to load cart from storage", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error("Failed to save cart to storage", error);
        }
    }, [items, isLoaded]);

    const addItem = (item: CartItemInput) => {
        setItems((prev) => {
            const match = prev.find((existing) => existing.id === item.id);
            if (match) {
                return prev.map((existing) =>
                    existing.id === item.id
                        ? {
                              ...existing,
                              quantity: existing.quantity + (item.quantity ?? 1),
                          }
                        : existing
                );
            }
            return [
                ...prev,
                {
                    ...item,
                    quantity: Math.max(1, item.quantity ?? 1),
                },
            ];
        });
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    };

    const clear = () => setItems([]);

    const itemCount = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const subtotalCents = useMemo(
        () => items.reduce((sum, item) => sum + item.price_cents * item.quantity, 0),
        [items]
    );

    const value = useMemo(
        () => ({
            items,
            itemCount,
            subtotalCents,
            addItem,
            removeItem,
            updateQuantity,
            clear,
        }),
        [items, itemCount, subtotalCents]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}
