"use client";

import Header from "@/components/layout/Header";
import CarouselCylinder from "@/components/ui/CarouselCylinder";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative w-full bg-[#050505] text-white">
      <Header />

      {/* The Carousel IS the Hero */}
      <CarouselCylinder />

      {/* Footer Section */}
      <section className="h-[40vh] flex flex-col items-center justify-center border-t border-white/10 bg-[#050505] relative z-20">
        <p className="font-oswald text-4xl md:text-6xl text-center text-neutral-800 uppercase tracking-tighter hover:text-white transition-colors duration-500 cursor-pointer">
          Next Project
        </p>
        <footer className="absolute bottom-6 text-[10px] text-neutral-600 uppercase tracking-widest font-mono">
          Obsidian Architecture © 2025
        </footer>
      </section>
    </main>
  );
}
