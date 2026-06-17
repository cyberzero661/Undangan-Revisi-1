"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface BrandedLoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { heart: "w-3.5 h-3.5", text: "text-xs" },
  md: { heart: "w-6 h-6", text: "text-sm" },
  lg: { heart: "w-10 h-10", text: "text-base" },
};

export function BrandedLoading({ text = "Memuat...", size = "md" }: BrandedLoadingProps) {
  const s = sizes[size];

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <motion.div
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      >
        <Heart className={`${s.heart} text-primary-500`} fill="currentColor" />
      </motion.div>
      {size !== "sm" && text && (
        <p className={`${s.text} font-playfair text-primary-500`}>{text}</p>
      )}
    </div>
  );
}

export function BrandedSpinner() {
  return (
    <motion.div
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <Heart className="w-4 h-4 text-primary-500" fill="currentColor" />
    </motion.div>
  );
}
