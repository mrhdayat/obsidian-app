"use client";

import { useEffect, useRef } from "react";

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<{ x: number; y: number; life: number; vx: number; vy: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Mouse Tracking
    let mouseX = -100;
    let mouseY = -100;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Add particle on move
      for (let i = 0; i < 2; i++) {
        particles.current.push({
          x: mouseX,
          y: mouseY,
          life: 1,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Render Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and Draw
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        p.life -= 0.02;
        p.x += p.vx;
        p.y += p.vy;

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          i--;
          continue;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998] mix-blend-screen"
    />
  );
}
