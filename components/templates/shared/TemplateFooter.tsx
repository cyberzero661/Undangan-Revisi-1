"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { FadeScaleSection } from "./ScrollEffects";

interface TemplateFooterProps {
  primaryColor: string;
}

export function TemplateFooter({ primaryColor }: TemplateFooterProps) {
  return (
    <FadeScaleSection className="py-8 text-center">
      <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
        <Heart className="w-4 h-4" style={{ color: primaryColor }} />
        <span className="font-playfair">Undangkuy</span>
      </div>
    </FadeScaleSection>
  );
}
