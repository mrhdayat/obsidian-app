"use client";

import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => setContent(data.contact));
  }, []);

  if (!content) return null;

  return (
    <main className="relative w-full min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col items-center justify-center">
      <Header />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <p className="text-sm font-mono uppercase tracking-[0.5em] text-gray-500 mb-8">Get in Touch</p>
        <a
          href={`mailto:${content.email}`}
          className="text-[8vw] font-bold font-oswald leading-none hover:text-transparent hover:stroke-text transition-all duration-300 block uppercase"
        >
          {content.email && content.email.split('@')[0]}@<br />
          {content.email && content.email.split('@')[1]}
        </a>

        <div className="mt-16 flex justify-center gap-12 text-sm uppercase tracking-widest font-medium">
          <a href={content.instagram} target="_blank" className="hover:line-through">Instagram</a>
          <a href={content.twitter} target="_blank" className="hover:line-through">Twitter</a>
          <a href={content.linkedin} target="_blank" className="hover:line-through">LinkedIn</a>
        </div>
      </motion.div>
    </main>
  );
}
