"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface BrandedLoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { heart: "w-4 h-4", ring: "w-5 h-5", text: "text-xs" },
  md: { heart: "w-8 h-8", ring: "w-10 h-10", text: "text-sm" },
  lg: { heart: "w-12 h-12", ring: "w-16 h-16", text: "text-lg" },
};

export function BrandedLoading({ text = "Memuat...", size = "md" }: BrandedLoadingProps) {
  const s = sizes[size];

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`relative flex items-center justify-center ${s.ring}`}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            animation: "glow-ring-pulse 2.5s ease-in-out infinite",
            "--glow-color": "rgba(237,118,25,0.4)",
          } as React.CSSProperties}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className={`${s.heart} text-primary-500`} fill="currentColor" />
        </motion.div>
      </div>

      {size !== "sm" && text && (
        <p className={`${s.text} gold-text font-playfair text-center`}>{text}</p>
      )}
    </div>
  );
}

export function BrandedSpinner() {
  return (
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <Heart className="w-5 h-5 text-primary-500" fill="currentColor" />
    </motion.div>
  );
}
