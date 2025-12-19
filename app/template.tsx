"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-[#1a1a1a] z-[5000] pointer-events-none origin-bottom"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  );
}
