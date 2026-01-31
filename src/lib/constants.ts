import { Share2, Star, Zap, Puzzle, Gamepad, Cuboid as Cube, Rocket, Smile, Music, BookOpen, Palette, Crown, Heart } from "lucide-react";

export const BRAND = {
    name: "ToyVerse",
    slogan: "Big Smiles. Smart Toys.",
};

export const NAV_LINKS = [
    { href: "/", labelKey: "nav.home" },
    { href: "/shop", labelKey: "nav.shop" },
    { href: "#categories", labelKey: "nav.categories", isScroll: true },
    { href: "/deals", labelKey: "nav.deals", isScroll: false },
    { href: "/about", labelKey: "nav.about", isScroll: false },
];

export const CATEGORIES = [
    {
        id: "educational",
        nameKey: "categories.educational",
        slug: "educational",
        color: "bg-blue-100 text-blue-600",
        gradient: "from-blue-400 to-cyan-300",
        icon: Zap,
    },
    {
        id: "creative",
        nameKey: "categories.creative",
        slug: "creative",
        color: "bg-purple-100 text-purple-600",
        gradient: "from-purple-400 to-pink-300",
        icon: Palette,
    },
    {
        id: "action",
        nameKey: "categories.action",
        slug: "action",
        color: "bg-orange-100 text-orange-600",
        gradient: "from-orange-400 to-amber-300",
        icon: Rocket,
    },
    {
        id: "puzzles",
        nameKey: "categories.puzzles",
        slug: "puzzles",
        color: "bg-green-100 text-green-600",
        gradient: "from-green-400 to-emerald-300",
        icon: Puzzle,
    },
    {
        id: "games",
        nameKey: "categories.games",
        slug: "games",
        color: "bg-yellow-100 text-yellow-600",
        gradient: "from-yellow-400 to-amber-200",
        icon: Gamepad,
    },
    {
        id: "plush",
        nameKey: "categories.plush",
        slug: "plush",
        color: "bg-pink-100 text-pink-600",
        gradient: "from-pink-400 to-rose-300",
        icon: Smile,
    },
    {
        id: "music",
        nameKey: "categories.music",
        slug: "music",
        color: "bg-indigo-100 text-indigo-600",
        gradient: "from-indigo-400 to-violet-300",
        icon: Music,
    },
    {
        id: "books",
        nameKey: "categories.books",
        slug: "books",
        color: "bg-teal-100 text-teal-600",
        gradient: "from-teal-400 to-cyan-300",
        icon: BookOpen,
    },
];

export interface Product {
    id: string;
    title: string;
    price: number;
    rating: number;
    reviews: number;
    age: string;
    category: string;
    badge?: "New" | "Sale" | "Bestseller";
    imageGradient: string;
    description?: string;
}

export const PRODUCTS: Product[] = [
    {
        id: "1",
        title: "Space Explorer Rocket",
        price: 49.99,
        rating: 4.9,
        reviews: 128,
        age: "3-5 years",
        category: "action",
        badge: "Bestseller",
        imageGradient: "bg-gradient-to-br from-indigo-300 to-purple-400",
        description: "Blast off into adventure with this durable, light-up rocket ship! Includes miniature astronaut figures.",
    },
    {
        id: "2",
        title: "Mega Block Builder",
        price: 29.99,
        rating: 4.8,
        reviews: 85,
        age: "3-5 years",
        category: "educational",
        badge: "New",
        imageGradient: "bg-gradient-to-br from-yellow-300 to-orange-400",
        description: "Unleash creativity with 100 colorful blocks. easy to grip for little hands.",
    },
    {
        id: "3",
        title: "Cuddly Bear",
        price: 19.99,
        rating: 5.0,
        reviews: 210,
        age: "0-12 months",
        category: "plush",
        imageGradient: "bg-gradient-to-br from-pink-200 to-rose-300",
        description: "The softest huggable bear for bedtime comfort. Machine washable.",
    },
    {
        id: "4",
        title: "Robot Companion",
        price: 89.99,
        rating: 4.7,
        reviews: 56,
        age: "5-8 years",
        category: "educational",
        badge: "Sale",
        imageGradient: "bg-gradient-to-br from-cyan-300 to-blue-400",
        description: "Programmable robot friend that teaches basic coding logic through play.",
    },
    {
        id: "5",
        title: "Wooden Puzzle Set",
        price: 24.99,
        rating: 4.8,
        reviews: 92,
        age: "1-3 years",
        category: "puzzles",
        imageGradient: "bg-gradient-to-br from-green-300 to-emerald-400",
        description: "Sustainably sourced wooden puzzles featuring farm animals and shapes.",
    },
    {
        id: "6",
        title: "Artist Painting Kit",
        price: 34.99,
        rating: 4.9,
        reviews: 74,
        age: "5-8 years",
        category: "creative",
        badge: "New",
        imageGradient: "bg-gradient-to-br from-purple-300 to-fuchsia-400",
        description: "Complete set with easel, non-toxic paints, and brushes for young Picassos.",
    },
    {
        id: "7",
        title: "Remote Control Car",
        price: 59.99,
        rating: 4.6,
        reviews: 112,
        age: "8+ years",
        category: "action",
        imageGradient: "bg-gradient-to-br from-red-300 to-orange-400",
        description: "High-speed racer with 360-degree stunt capability. Rechargeable battery included.",
    },
    {
        id: "8",
        title: "Family Board Game",
        price: 39.99,
        rating: 4.9,
        reviews: 205,
        age: "8+ years",
        category: "games",
        badge: "Bestseller",
        imageGradient: "bg-gradient-to-br from-teal-300 to-cyan-400",
        description: "Fun for the whole family! A game of strategy, luck, and laughter.",
    },
    {
        id: "9",
        title: "Musical Xylophone",
        price: 15.99,
        rating: 4.7,
        reviews: 45,
        age: "1-3 years",
        category: "music",
        imageGradient: "bg-gradient-to-br from-pink-300 to-purple-300",
        description: "Colorful keys produce clear, lovely tones. Great for rhythm introduction.",
    },
    {
        id: "10",
        title: "Dinosaur Encyclopedia",
        price: 12.99,
        rating: 4.8,
        reviews: 300,
        age: "5-8 years",
        category: "books",
        imageGradient: "bg-gradient-to-br from-amber-200 to-yellow-300",
        description: "Full-color pop-up book with amazing facts about prehistoric giants.",
    },
    {
        id: "11",
        title: "Magic Clay Set",
        price: 18.50,
        rating: 4.5,
        reviews: 67,
        age: "3-5 years",
        category: "creative",
        imageGradient: "bg-gradient-to-br from-lime-300 to-green-400",
        description: "Air-drying clay in 12 vibrant colors. Mess-free fun.",
    },
    {
        id: "12",
        title: "Solar System Model",
        price: 45.00,
        rating: 4.9,
        reviews: 89,
        age: "8+ years",
        category: "educational",
        imageGradient: "bg-gradient-to-br from-blue-900 to-purple-900",
        description: "Build your own glow-in-the-dark solar system. Perfect for school projects.",
    },
];
