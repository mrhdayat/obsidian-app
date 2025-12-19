"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Toast, { ToastType } from "./Toast";
import { AnimatePresence } from "framer-motion";

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType }[]>([]);

  const addToast = React.useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[9000] flex flex-col items-end pointer-events-none">
        <div className="pointer-events-auto">
          <AnimatePresence>
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                id={toast.id}
                message={toast.message}
                type={toast.type}
                onClose={removeToast}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
