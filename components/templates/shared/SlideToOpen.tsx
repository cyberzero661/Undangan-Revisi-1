"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ChevronRight, ChevronsRight } from "lucide-react";

interface SlideToOpenProps {
  onOpen: () => void;
  primaryColor?: string;
  label?: string;
}

export function SlideToOpen({ onOpen, primaryColor = "#D4AF37", label = "Geser untuk Membuka Undangan" }: SlideToOpenProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const handleSize = 56;
  const threshold = 0.72;

  const x = useMotionValue(0);
  const maxDrag = trackWidth - handleSize;
  const progress = useTransform(x, [0, maxDrag || 1], [0, 100]);
  const fillWidth = useTransform(progress, (v) => `${v}%`);

  const glowIntensity = useTransform(progress, [0, 100], [
    `0 0 8px ${primaryColor}30`,
    `0 0 24px ${primaryColor}80, 0 0 48px ${primaryColor}40`
  ]);

  useEffect(() => {
    const el = constraintsRef.current;
    if (!el) return;
    const updateWidth = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setTrackWidth(w);
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleDragEnd = useCallback(() => {
    const currentX = x.get();
    if (currentX >= maxDrag * threshold) {
      setIsComplete(true);
      setTimeout(onOpen, 500);
    } else {
      x.set(0);
    }
  }, [x, maxDrag, threshold, onOpen]);

  return (
    <div className="w-full max-w-xs mx-auto mt-8 px-2">
      <div
        ref={constraintsRef}
        className="relative h-[58px] rounded-full overflow-hidden"
        style={{
          background: `linear-gradient(90deg, rgba(255,255,255,0.03) 0%, ${primaryColor}10 50%, rgba(255,255,255,0.03) 100%)`,
          border: `1px solid ${primaryColor}25`,
          backdropFilter: "blur(8px)",
        }}
      >
        {!isComplete && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="slide-shimmer-text text-sm font-medium tracking-wider select-none"
              style={{ color: `${primaryColor}90` }}
            >
              {label}
            </span>
          </div>
        )}

        <motion.div
          className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
          style={{
            width: fillWidth,
            background: `linear-gradient(90deg, ${primaryColor}20, ${primaryColor}50)`,
            transition: "background 0.3s",
          }}
        />

        <motion.div
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0}
          dragMomentum={false}
          style={{
            x,
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
            color: "#fff",
            touchAction: "none",
            boxShadow: isComplete
              ? `0 0 30px ${primaryColor}80, 0 0 60px ${primaryColor}40`
              : `0 4px 20px ${primaryColor}30`,
            transition: "box-shadow 0.3s",
          }}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.08 }}
          animate={
            isComplete && maxDrag > 0
              ? { x: maxDrag }
              : {}
          }
          transition={isComplete ? { duration: 0.35, ease: [0.22, 1, 0.36, 1] } : undefined}
          className="absolute top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
        >
          <motion.div
            animate={isComplete ? { scale: [1, 1.3, 1], rotate: [0, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {isComplete ? (
              <ChevronsRight className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </motion.div>
        </motion.div>
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-3"
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: primaryColor, opacity: 0.6 }}>
            Membuka...
          </span>
        </motion.div>
      )}
    </div>
  );
}