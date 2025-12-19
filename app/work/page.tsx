"use client";

import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function WorkPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-[#050505] text-white">
      <Header />

      <div className="pt-32 px-4 md:px-12 pb-20">
        <h1 className="text-[10vw] font-bold font-oswald leading-none mb-16 stroke-text opacity-50 select-none">
          INDEX
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden mb-4 bg-neutral-900 border border-white/10">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80 grayscale group-hover:grayscale-0"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="flex justify-between items-baseline border-b border-white/20 pb-4 group-hover:border-white transition-colors">
                <h2 className="text-2xl font-oswald uppercase">{project.title}</h2>
                <span className="text-xs font-mono text-gray-400">{project.location}</span>
              </div>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2 max-w-[90%]">
                {project.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
