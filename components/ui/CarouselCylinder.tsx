"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, useSpring, MotionValue, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

export default function CarouselCylinder() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.6,
    stiffness: 70,
    damping: 20
  });

  const totalAngle = 280;
  const currentAngle = useTransform(smoothProgress, [0, 1], [0, -totalAngle]);

  /* Parallax Tilt Logic */
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2; // -1 to 1
    const y = (clientY / innerHeight - 0.5) * 2; // -1 to 1
    setMousePosition({ x, y });
  };

  const smoothMouseX = useSpring(mousePosition.x, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mousePosition.y, { damping: 50, stiffness: 400 });

  const tiltX = useTransform(smoothMouseY, [-1, 1], [5, -5]); // Tilt up/down
  const tiltY = useTransform(smoothMouseX, [-1, 1], [-5, 5]); // Tilt left/right

  return (
    <div
      ref={containerRef}
      className="relative h-[1200vh] bg-[#050505]"
      onMouseMove={handleMouseMove}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center items-center perspective-container">

        {/* Background - 3D Grid Floor */}
        <motion.div
          style={{
            rotateX: useTransform(tiltX, (v) => 60 + v),
            rotateZ: tiltY,
          }}
          className="absolute bottom-0 w-[200vw] h-[50vh] bg-[linear-gradient(to_bottom,transparent_0%,#111_100%),linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem] [perspective:1000px] [transform:translateY(20vh)] opacity-30 pointer-events-none z-0"
        />

        {/* Cinematic Title - Liquid Texture Effect */}
        <div className="absolute top-20 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden mix-blend-difference">
          <motion.h1
            style={{
              opacity: useTransform(smoothProgress, [0, 0.2], [1, 0.1]),
              x: useTransform(smoothMouseX, (v) => v * -20), // Parallax text
              y: useTransform(smoothMouseY, (v) => v * -20),
            }}
            className="text-[15vw] font-bold font-oswald tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 via-white to-neutral-500 bg-[length:200%_auto] animate-shine"
          >
            OBSIDIAN
          </motion.h1>
        </div>

        {/* 3D Scene Root - Controlled by Scroll AND Mouse Tilt */}
        <motion.div
          style={{
            rotateX: tiltX,
            rotateY: tiltY,
          }}
          className="relative w-full h-full flex items-center justify-center z-10 perspective-3000"
        >
          {projects.map((project, i) => (
            <Card3D
              key={project.id}
              project={project}
              index={i}
              currentAngle={currentAngle}
              onSelect={() => setSelectedProject(project)}
            />
          ))}
        </motion.div>

        <Particles />

        {/* Info Bar */}
        <div className="absolute bottom-10 w-full px-8 flex justify-between items-end text-neutral-500 font-mono text-[10px] uppercase tracking-[0.2em] z-20 mix-blend-difference">
          <div className="flex flex-col gap-1">
            <span>Rotation</span>
            <motion.div className="text-white">
              {useTransform(currentAngle, (v) => `${Math.abs(Math.round(v))}°`)}
            </motion.div>
          </div>
          <div className="text-right">
            <span>SCROLL FOR DEPTH</span>
          </div>
        </div>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-12"
              onClick={() => setSelectedProject(null)}
            >
              <div
                className="bg-[#0a0a0a] w-full max-w-6xl h-full md:h-[80vh] border border-white/10 flex flex-col md:flex-row shadow-2xl overflow-hidden relative"
                onClick={(e) => e.stopPropagation()} // Prevent close on modal click
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 z-50 p-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors"
                >
                  <X size={24} />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-2/3 h-1/2 md:h-full relative overflow-hidden">
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                </div>

                {/* Text Section */}
                <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col justify-center gap-8">
                  <div>
                    <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest mb-2">Project</p>
                    <h2 className="text-5xl md:text-6xl font-oswald font-bold leading-[0.9] text-white uppercase">
                      {selectedProject.title}
                    </h2>
                  </div>

                  <div>
                    <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest mb-2">Location / Year</p>
                    <p className="text-xl text-white">{selectedProject.location} — {selectedProject.year}</p>
                  </div>

                  <div>
                    <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest mb-2">Manifesto</p>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div >
  );
}

const Card3D = ({
  project,
  index,
  currentAngle,
  onSelect
}: {
  project: any;
  index: number;
  currentAngle: MotionValue<number>;
  onSelect: () => void;
}) => {
  // Tighter Cylinder for more obvious curvature
  const gapAngle = 25;
  const radius = 800;

  const initialAngle = index * gapAngle;
  const rotateValue = useTransform(currentAngle, (v) => initialAngle + v);

  const x = useTransform(rotateValue, (val) => {
    const rad = (val * Math.PI) / 180;
    return Math.sin(rad) * radius;
  });

  const z = useTransform(rotateValue, (val) => {
    const rad = (val * Math.PI) / 180;
    return (Math.cos(rad) * radius) - radius;
  });

  const rotateY = useTransform(rotateValue, (val) => val);

  const opacity = useTransform(rotateValue, (val) => {
    const abs = Math.abs(val);
    if (abs > 80) return 0;
    return 1 - Math.pow(abs / 80, 2);
  });

  const brightness = useTransform(rotateValue, (val) => {
    const abs = Math.abs(val);
    return 1 - (abs / 90);
  });

  const pointerEvents = useTransform(rotateValue, (val) => Math.abs(val) < 30 ? "auto" : "none");

  return (
    <motion.div
      style={{
        x,
        z,
        rotateY,
        opacity,
        pointerEvents,
        position: "absolute",
        left: "calc(50% - 14vw)",
        top: "calc(50% - 28vh)"
      }}
      className="w-[28vw] h-[56vh] origin-center perspective-1000 cursor-pointer"
      onClick={onSelect}
    >
      <div className="w-full h-full bg-neutral-900 border border-white/5 relative shadow-2xl group">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority={index < 3}
        />

        <motion.div
          style={{ opacity: useTransform(brightness, b => 1 - b) }}
          className="absolute inset-0 bg-black pointer-events-none z-10"
        />

        <div className="absolute bottom-8 left-8 z-20">
          <h2 className="text-3xl font-oswald text-white uppercase font-bold translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">{project.title}</h2>
        </div>
      </div>

      {/* Reflection */}
      <div className="absolute top-[100%] left-0 w-full h-full opacity-20 transform scale-y-[-1] mask-image-gradient">
        <Image
          src={project.image}
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>
    </motion.div>
  )
}

const Particles = () => {
  const particles = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((_, i) => (
        <Particle key={i} index={i} />
      ))}
    </div>
  )
}

const Particle = ({ index }: { index: number }) => {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  const duration = 10 + Math.random() * 20;

  return (
    <motion.div
      initial={{ x: `${randomX}vw`, y: `${randomY}vh`, opacity: 0 }}
      animate={{
        x: [`${randomX}vw`, `${randomX + (Math.random() * 10 - 5)}vw`],
        y: [`${randomY}vh`, `${randomY - 20}vh`],
        opacity: [0, 0.5, 0]
      }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
    />
  )
}
