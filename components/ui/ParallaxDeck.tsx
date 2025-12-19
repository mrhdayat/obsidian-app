"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "VOID HOUSE",
    location: "Kyoto, Japan",
    year: "2024",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1920&auto=format&fit=crop", // Placeholder: Concrete texture
  },
  {
    id: 2,
    title: "MONOLITH 09",
    location: "Berlin, Germany",
    year: "2023",
    image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=1920&auto=format&fit=crop", // Placeholder: Brutalist building
  },
  {
    id: 3,
    title: "OBSIDIAN TOWER",
    location: "New York, USA",
    year: "2025",
    image: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=1920&auto=format&fit=crop", // Placeholder: Dark architecture
  },
  {
    id: 4,
    title: "SILENT MUSEUM",
    location: "Oslo, Norway",
    year: "2024",
    image: "https://images.unsplash.com/photo-1502005229766-3c8ef564ee11?q=80&w=1920&auto=format&fit=crop", // Placeholder: Minimalist interior
  },
  {
    id: 5,
    title: "CARBON VILLA",
    location: "Reykjavik, Iceland",
    year: "2023",
    image: "https://images.unsplash.com/photo-1542385806-69d5e305e94b?q=80&w=1920&auto=format&fit=crop", // Placeholder: Modern concrete
  },
];

export default function ParallaxDeck() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-[#050505]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <div className="relative w-full h-full flex flex-col justify-center items-center">
          {/* Background Title Fading In/Out */}
          <motion.h1
            style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] leading-none font-bold text-[#1a1a1a] select-none pointer-events-none whitespace-nowrap z-0"
          >
            BRUTAL FORM
          </motion.h1>

          <div className="relative z-10 w-full max-w-[1400px] h-[60vh] flex justify-center items-center perspective-1000">
            {projects.map((project, i) => {
              // Calculate targetScale based on index and scroll progress
              // We want cards to stack on top of each other.
              const rangeStart = i * 0.25;
              const rangeEnd = 1;
              const targetScale = 1 - (projects.length - 1 - i) * 0.05;

              return (
                <Card
                  key={project.id}
                  i={i}
                  project={project}
                  progress={scrollYProgress}
                  range={[i * 0.2, 1]}
                  targetScale={targetScale}
                  total={projects.length}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const Card = ({
  i,
  project,
  progress,
  range,
  targetScale,
  total,
}: {
  i: number;
  project: any;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  total: number;
}) => {
  const scale = useTransform(progress, range, [1, targetScale]);

  // Create a stacking effect where they come from bottom
  const translateY = useTransform(progress, [range[0], range[0] + 0.15], ["100vh", "0vh"]);

  // Add a slight rotation for style when entering
  const rotateX = useTransform(progress, [range[0], range[0] + 0.1], [45, 0]);

  // Fade out previous cards slightly as new ones come in? No, let's keep them stacked like a deck.
  // But maybe push them up slightly when the next one comes?
  // Let's keep it simple first: Stack on top.

  // To make the "deck" feel, earlier cards should scale down slightly as scroll matches deeper.
  // Actually, let's just use the logic where they pile up.

  return (
    <motion.div
      style={{
        scale,
        y: translateY,
        rotateX,
        zIndex: i,
        top: `calc(10vh + ${i * 20}px)`, // Slight offset for each stacked card visually if we wanted, but let's center them.
      }}
      className="absolute w-[80vw] max-w-[1000px] h-[60vh] origin-top bg-[#111] border border-[#222] overflow-hidden group rounded-sm"
    >
      <div className="relative w-full h-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 image-scale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div>
            <p className="text-sm md:text-base text-gray-400 font-mono mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full inline-block" />
              {project.location} — {project.year}
            </p>
            <h2 className="text-4xl md:text-6xl font-bold uppercase leading-[0.9] tracking-tighter">
              {project.title}
            </h2>
          </div>

          <button className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
            <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
