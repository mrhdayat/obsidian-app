import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import Preloader from "@/components/ui/Preloader";
import MouseTrail from "@/components/ui/MouseTrail";
import SoundManager from "@/components/ui/SoundManager";
import { ToastProvider } from "@/components/ui/ToastProvider";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "OBSIDIAN ARCH | Brutal Form Studio",
  description: "A brutalist exploration of concrete and void.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${oswald.variable} ${inter.variable} antialiased bg-[#050505] text-white selection:bg-white selection:text-black overflow-x-hidden`}
      >
        <ToastProvider>
          <Preloader />
          <MouseTrail />
          <CustomCursor />
          <SoundManager />
          <SmoothScroll>{children}</SmoothScroll>
        </ToastProvider>
      </body>
    </html>
  );
}
