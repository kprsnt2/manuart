"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
    { href: "/", label: "Home", emoji: "🏠" },
    { href: "/drawings", label: "Drawings", emoji: "🎨" },
    { href: "/blog", label: "Stories", emoji: "📖" },
    { href: "/gallery", label: "Gallery", emoji: "📸" },
    { href: "/timeline", label: "Timeline", emoji: "🌱" },
    { href: "/ai-studio", label: "AI Studio", emoji: "🪄" },
    { href: "/ask-manu", label: "Ask Manu", emoji: "🗣️" },
    { href: "/tags", label: "Tags", emoji: "🏷️" },
    { href: "/games/train-crash", label: "Games", emoji: "🎮" },
    { href: "/docs", label: "Docs", emoji: "📚" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-14">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-black text-xl text-purple-700">
                        <Palette className="w-5 h-5 text-pink-500" />
                        Manu&apos;s Art World
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Button key={link.href} asChild variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800 hover:bg-purple-50">
                                <Link href={link.href}>
                                    <span className="mr-1">{link.emoji}</span> {link.label}
                                </Link>
                            </Button>
                        ))}
                    </div>

                    {/* Mobile buttons */}
                    <div className="flex items-center gap-1 md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-600"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile nav */}
                {isOpen && (
                    <div className="md:hidden pb-4 border-t border-purple-100 mt-2 pt-2">
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Button
                                    key={link.href}
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Link href={link.href}>
                                        <span className="mr-2">{link.emoji}</span> {link.label}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
