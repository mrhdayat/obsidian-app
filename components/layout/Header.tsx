"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-start mix-blend-difference text-white pointer-events-none"
    >
      <div className="pointer-events-auto">
        <Link href="/" className="text-xl font-bold tracking-tighter uppercase font-oswald block leading-none">
          Obsidian
        </Link>
        <span className="text-xs uppercase tracking-widest opacity-60 font-inter">Studio ©2025</span>
      </div>

      <nav className="pointer-events-auto hidden md:flex flex-col items-end gap-1">
        {[
          { name: "Work", href: "/work" },
          { name: "Studio", href: "/studio" },
          { name: "Contact", href: "/contact" }
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onMouseEnter={() => setHovered(item.name)}
            onMouseLeave={() => setHovered(null)}
            className="relative overflow-hidden group"
          >
            <span className={cn(
              "block text-sm font-medium uppercase tracking-widest transition-transform duration-500",
              hovered === item.name ? "-translate-y-full" : "translate-y-0"
            )}>
              {item.name}
            </span>
            <span className={cn(
              "absolute top-0 left-0 block text-sm font-medium uppercase tracking-widest transition-transform duration-500",
              hovered === item.name ? "translate-y-0" : "translate-y-full"
            )}>
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      <button className="pointer-events-auto md:hidden text-sm uppercase font-bold tracking-widest border border-white/30 px-3 py-1 rounded-full">
        Menu
      </button>
    </motion.header>
  );
}
