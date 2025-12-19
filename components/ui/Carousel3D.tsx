"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue, useSpring } from "framer-motion";
import Image from "next/image";

// Extended Dummy Data (12 Projects) as requested
const projects = [
  { id: 1, title: "VOID HOUSE", location: "Kyoto", image: "https://placehold.co/800x1200/111/FFF/png?text=Void+House" },
  { id: 2, title: "MONOLITH 09", location: "Berlin", image: "https://placehold.co/800x1200/1a1a1a/FFF/png?text=Monolith" },
  { id: 3, title: "OBSIDIAN TOWER", location: "New York", image: "https://placehold.co/800x1200/000/FFF/png?text=Obsidian" },
  { id: 4, title: "SILENT MUSEUM", location: "Oslo", image: "https://placehold.co/800x1200/222/FFF/png?text=Museum" },
  { id: 5, title: "CARBON VILLA", location: "Reykjavik", image: "https://placehold.co/800x1200/333/FFF/png?text=Carbon" },
  { id: 6, title: "AZURE DEPOT", location: "London", image: "https://placehold.co/800x1200/050505/FFF/png?text=Azure" },
  { id: 7, title: "ECHO CHAMBER", location: "Paris", image: "https://placehold.co/800x1200/111/FFF/png?text=Echo" },
  { id: 8, title: "NORDIC SPIRE", location: "Stockholm", image: "https://placehold.co/800x1200/222/FFF/png?text=Nordic" },
  { id: 9, title: "DUNE PAVILION", location: "Dubai", image: "https://placehold.co/800x1200/333/FFF/png?text=Dune" },
  { id: 10, title: "SOLAR FORGE", location: "Barcelona", image: "https://placehold.co/800x1200/000/FFF/png?text=Solar" },
  { id: 11, title: "KINETIC LAB", location: "Seoul", image: "https://placehold.co/800x1200/1a1a1a/FFF/png?text=Kinetic" },
  { id: 12, title: "ZERO POINT", location: "Tokyo", image: "https://placehold.co/800x1200/111/FFF/png?text=Zero+Point" },
];

export default function Carousel3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Increase scroll height significantly to handle 12 items naturally
  // 1200vh gives plenty of scroll room
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.5,
    stiffness: 80,
    damping: 20
  });

  // Precise calculation for horizontal travel:
  // Start: Center the first card. Flex container has padding-left: 50vw.
  // First card center is at 50vw + (cardWidth/2).
  // We want to move left until the Last Card is centered.
  // Total Width approx = 12 * 32vw (card+gap) = ~384vw travel needed relative to first card.
  // We adjust to -450vw to ensure the last card comfortably reaches center and beyond.
  const x = useTransform(smoothProgress, [0, 1], ["0vw", "-450vw"]);

  return (
    <div ref={containerRef} className="relative h-[1200vh] bg-[#050505]">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center items-center perspective-container">

        {/* Cinematic Background Title - Moves slightly parallax */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <motion.h1
            style={{
              x: useTransform(smoothProgress, [0, 1], ["20%", "-20%"]),
              opacity: useTransform(smoothProgress, [0, 0.2], [1, 0.3])
            }}
            className="text-[25vw] font-bold text-[#0a0a0a] font-oswald tracking-tighter leading-none whitespace-nowrap"
          >
            OBSIDIAN
          </motion.h1>
        </div>

        {/* Carousel Strip */}
        <div className="relative w-full h-[70vh] flex items-center z-10 perspective-1000">
          <motion.div
            style={{ x }}
            className="flex gap-[10vw] pl-[50vw] pr-[50vw] items-center w-max"
          >
            {projects.map((project, i) => (
              <Card
                key={project.id}
                project={project}
                containerProgress={smoothProgress}
                index={i}
                total={projects.length}
              />
            ))}
          </motion.div>
        </div>

        {/* Bottom Info Bar */}
        <div className="absolute bottom-10 left-0 w-full px-8 flex justify-between items-end text-neutral-500 font-mono text-[10px] uppercase tracking-[0.2em] z-20 mix-blend-difference">
          <div className="flex flex-col gap-1">
            <span>Explore</span>
            <div className="w-48 h-[1px] bg-neutral-800 overflow-hidden relative">
              <motion.div
                style={{ scaleX: smoothProgress, transformOrigin: "left" }}
                className="absolute top-0 left-0 h-full w-full bg-white"
              />
            </div>
          </div>
          <div className="text-right">
            <span>{projects.length} PROJECTS / SELECTED WORKS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const Card = ({
  project,
  containerProgress,
  index,
  total,
}: {
  project: any;
  containerProgress: MotionValue<number>;
  index: number;
  total: number;
}) => {
  // Logic to determine when this specific card is "Active" (Center Screen)
  // Total progress range is 0 to 1.
  // Each card occupies a slice of that time.
  const center = index / (total - 1);

  // Increase range slightly so animations aren't too jumpy for neighbors
  const range = [center - 0.15, center, center + 0.15];

  const rotateY = useTransform(containerProgress, range, [45, 0, -45]);
  const scale = useTransform(containerProgress, range, [0.8, 1.2, 0.8]);
  const opacity = useTransform(containerProgress, range, [0.4, 1, 0.4]);
  const z = useTransform(containerProgress, range, [-200, 0, -200]);

  return (
    <div className="relative shrink-0 perspective-1000">
      <motion.div
        style={{
          rotateY,
          scale,
          opacity,
          z
        }}
        className="w-[30vw] md:w-[22vw] aspect-[9/16] bg-neutral-900/50 backdrop-blur-sm overflow-hidden relative shadow-2xl border border-white/5"
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          priority={index < 3}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6">
          <h2 className="text-2xl md:text-4xl font-bold font-oswald text-white uppercase tracking-tighter leading-none mb-2">
            {project.title}
          </h2>
          <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
            {project.location}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
