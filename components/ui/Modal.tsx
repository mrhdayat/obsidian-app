"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export default function Modal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-[#0a0a0a] border border-white/20 p-8 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative Warning Strip if Destructive */}
            {isDestructive && (
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
            )}

            <div className="flex justify-between items-start mb-6">
              <div className={`flex items-center gap-3 uppercase font-mono tracking-widest text-xs ${isDestructive ? 'text-red-500' : 'text-neutral-400'}`}>
                <AlertTriangle size={16} />
                <span>System Warning</span>
              </div>
              <button onClick={onCancel} className="text-neutral-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <h2 className="text-2xl font-oswald font-bold uppercase mb-4 text-white">
              {title}
            </h2>

            <p className="text-neutral-400 font-sans text-sm leading-relaxed mb-8">
              {description}
            </p>

            <div className="flex gap-4">
              <button
                onClick={onCancel}
                className="flex-1 py-3 border border-white/10 hover:bg-white/5 text-neutral-300 font-mono text-xs uppercase tracking-widest transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-3 font-mono text-xs uppercase tracking-widest transition-colors font-bold ${isDestructive
                    ? 'bg-red-900/20 text-red-500 hover:bg-red-900/40 border border-red-900/50'
                    : 'bg-white text-black hover:bg-neutral-200'
                  }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
