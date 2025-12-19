"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function SoundManager() {
  const [isMuted, setIsMuted] = useState(true); // Default muted for autoplay policy
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize Audio Context on user interaction (Click) because browsers block autoplay
  const initAudio = () => {
    if (audioContextRef.current) return;

    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    audioContextRef.current = ctx;

    // Create Ambient Drone (Low Sine Wave + Noise)
    // For simplicity, just a low sine wave for "Deep Space" feel
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(50, ctx.currentTime); // 50Hz deep drone

    // Add LFO for "breathing" effect
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime); // Slow cycle
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.1, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain); // Modulate volume

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    lfo.start();

    gain.gain.setValueAtTime(0, ctx.currentTime); // Start silent

    oscillatorRef.current = osc;
    gainNodeRef.current = gain;
  };

  const toggleSound = () => {
    if (!audioContextRef.current) initAudio();

    if (isMuted) {
      // Fade In
      gainNodeRef.current?.gain.setTargetAtTime(0.05, audioContextRef.current!.currentTime, 2);
      setIsMuted(false);
    } else {
      // Fade Out
      gainNodeRef.current?.gain.setTargetAtTime(0, audioContextRef.current!.currentTime, 0.5);
      setIsMuted(true);
    }
  };

  // Click Sound Effect
  useEffect(() => {
    const playClick = () => {
      if (isMuted || !audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    };

    document.addEventListener("click", playClick);
    return () => document.removeEventListener("click", playClick);
  }, [isMuted]);

  return (
    <button
      onClick={toggleSound}
      className="fixed bottom-8 left-8 z-50 text-neutral-500 hover:text-white transition-colors"
      title={isMuted ? "Enable Sound" : "Mute Sound"}
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
}
