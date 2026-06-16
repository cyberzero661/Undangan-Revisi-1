"use client";

import { motion, AnimatePresence } from "framer-motion";

export function AmbientParticles({ color, count = 30 }: { color: string; count?: number }) {
  const dots = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    dur: Math.random() * 6 + 4,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full ambient-dot"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            backgroundColor: color,
            opacity: 0.3,
            ["--amb-dur" as string]: `${d.dur}s`,
            ["--amb-delay" as string]: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function SealBreakingEffect({ color }: { color: string }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full light-burst-ring"
          style={{ background: `radial-gradient(circle, ${color}80, ${color}30, transparent 70%)` }}
        />
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const dist = 80 + Math.random() * 60;
          const rx = Math.cos(angle) * dist;
          const ry = Math.sin(angle) * dist;
          const rot = (Math.random() - 0.5) * 720;
          return (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
              animate={{ x: rx, y: ry, scale: 0, opacity: 0, rotate: rot }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: Math.random() * 10 + 4,
                height: Math.random() * 10 + 4,
                backgroundColor: color,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              }}
            />
          );
        })}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-white pointer-events-none"
        />
      </motion.div>
    </AnimatePresence>
  );
}