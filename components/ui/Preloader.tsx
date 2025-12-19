"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Simulate loading/asset initialization
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="preloader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] bg-[#050505] flex items-center justify-center text-white overflow-hidden"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4"
            >
              <span className="text-6xl md:text-9xl font-oswald font-bold tracking-tighter">
                {counter}%
              </span>
            </motion.div>
            <div className="w-64 h-[2px] bg-neutral-800 mt-8 relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${counter}%` }}
                className="h-full bg-white"
              />
            </div>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-neutral-500 animate-pulse">
              Initializing Environment
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
