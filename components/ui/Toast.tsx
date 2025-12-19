"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  id: number;
  message: string;
  type: ToastType;
  onClose: (id: number) => void;
}

const Toast = ({ id, message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      className="relative bg-[#0a0a0a] border border-white/20 p-6 min-w-[300px] shadow-2xl overflow-hidden group mb-4"
    >
      {/* Progress Bar (Timer) */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 5, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-[2px] ${type === 'error' ? 'bg-red-500' : 'bg-white'}`}
      />

      <div className="flex items-start gap-4">
        <div className={`mt-1 ${type === 'error' ? 'text-red-500' : 'text-white'}`}>
          {type === 'success' && <CheckCircle size={16} />}
          {type === 'error' && <AlertTriangle size={16} />}
        </div>
        <div className="flex-1">
          <h4 className={`text-xs font-mono uppercase tracking-widest mb-1 ${type === 'error' ? 'text-red-500' : 'text-white/50'}`}>
            {type === 'success' ? 'System_Success' : type === 'error' ? 'System_Error' : 'System_Log'}
          </h4>
          <p className="font-oswald text-sm uppercase tracking-wide text-white leading-tight">
            {message}
          </p>
        </div>
        <button onClick={() => onClose(id)} className="text-white/20 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default Toast;

// Global Store for Toasts (Simple event bus or Context would work, but let's expose specific hooks if needed)
// For simplicity in this nextjs app pattern, I'll export a Component and a Context.
