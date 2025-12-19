"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/ToastProvider";
import Header from "@/components/layout/Header";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Artificial Delay for "Security Check" effect
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (username === "admin" && password === "obsidian2025") {
      // Set secure cookie (simulated)
      document.cookie = "auth_token=valid_token; path=/; max-age=3600";
      addToast("Access Granted. Welcome back, Operator.", "success");
      router.push("/admin");
    } else {
      addToast("Access Denied. Invalid credentials.", "error");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4">
      <Header />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 md:p-12 relative overflow-hidden"
      >
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8 text-neutral-500 uppercase tracking-widest text-xs font-mono">
            <Lock size={14} />
            <span>Restricted Access</span>
          </div>

          <h1 className="text-3xl font-oswald font-bold uppercase mb-8">System Login</h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-white/10 focus:border-white outline-none p-3 font-mono text-sm transition-colors text-white"
                placeholder="IDENTIFIER"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 focus:border-white outline-none p-3 font-mono text-sm transition-colors text-white"
                placeholder="KEY"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-bold uppercase py-4 mt-8 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Authenticate <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
