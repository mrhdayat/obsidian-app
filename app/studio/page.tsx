"use client";

import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function StudioPage() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => setContent(data.studio));
  }, []);

  if (!content) return null;

  return (
    <main className="relative w-full min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col items-center justify-center">
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl px-8 z-10"
      >
        <h1 className="text-[12vw] md:text-[8vw] font-bold font-oswald leading-[0.8] mb-12 text-[#1a1a1a] stroke-text select-none">
          STUDIO
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-light text-xl leading-relaxed text-gray-400">
          <p>
            {content.subtitle1}
          </p>
          <p>
            {content.subtitle2}
          </p>
        </div>

        <div className="mt-20 flex gap-8 text-xs font-mono uppercase tracking-widest text-gray-500">
          <div>
            <span className="block text-white mb-2">Team</span>
            {content.team_name}<br />
            {content.team_role}
          </div>
          <div>
            <span className="block text-white mb-2">Location</span>
            {content.location_city}<br />
            {content.location_desc}
          </div>
        </div>
      </motion.div>

      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[50vw] h-full bg-gradient-to-l from-[#111] to-transparent pointer-events-none -z-0" />
    </main>
  );
}
