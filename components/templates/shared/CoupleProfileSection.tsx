"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Users, Instagram } from "lucide-react";
import { TemplateContent } from "@/types/template";
import { useScrollEffect } from "./ScrollEffectContext";
import { HeaderReveal, CardReveal, ScrollProgressLine } from "./ScrollEffects";

interface CoupleProfileSectionProps {
  content: TemplateContent["couple"];
  primaryColor: string;
  coupleNames?: string;
}

export function CoupleProfileSection({ content, primaryColor, coupleNames }: CoupleProfileSectionProps) {
  const { bride, groom } = content;
  const parsedNames = coupleNames ? coupleNames.split(/\s*&\s*/).map(s => s.trim()) : [];
  const brideName = bride.name || parsedNames[0] || "";
  const groomName = groom.name || parsedNames[1] || "";
  const { effectType } = useScrollEffect();

  const profileCard = (person: typeof bride, name: string) => (
    <>
      <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 shadow-lg mb-4 relative" style={{ borderColor: primaryColor }}>
        {person.photo ? (
          <Image src={person.photo} alt={person.name || "Profile"} fill className="object-cover [filter:saturate(1.05)_contrast(1.02)]" sizes="160px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100"><Users className="w-12 h-12 text-gray-300" /></div>
        )}
      </div>
      <h3 className="text-xl font-playfair font-bold text-gray-800">{name}</h3>
      <p className="text-xs uppercase tracking-widest mt-1" style={{ color: primaryColor }}>{person.role}</p>
      {person.parents && <p className="text-xs text-gray-400 mt-2">Putra/putri dari {person.parents}</p>}
      {person.bio && <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-xs mx-auto">{person.bio}</p>}
      {person.instagram && (
        <a href={`https://instagram.com/${person.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-3 text-xs hover:opacity-70 transition-opacity" style={{ color: primaryColor }}>
          <Instagram className="w-3 h-3" /> {person.instagram}
        </a>
      )}
    </>
  );

  const renderAmpersand = () => {
    const ampContent = effectType === "minimalist" ? (
      <>
        <div className="w-8 h-px" style={{ backgroundColor: primaryColor }} />
        <p className="text-3xl md:text-4xl font-playfair mx-3" style={{ color: primaryColor }}>&</p>
        <div className="w-8 h-px" style={{ backgroundColor: primaryColor }} />
      </>
    ) : (
      <p className="text-3xl md:text-4xl font-playfair" style={{ color: primaryColor }}>&</p>
    );

    switch (effectType) {
      case "modern":
        return (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.5 }}
            className="flex items-center justify-center py-4 md:py-0 flex-shrink-0">
            {ampContent}
          </motion.div>
        );
      case "minimalist":
        return (
          <motion.div initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center justify-center py-4 md:py-0 flex-shrink-0">
            {ampContent}
          </motion.div>
        );
      case "rustic":
        return (
          <motion.div initial={{ opacity: 0, rotate: 180 }} whileInView={{ opacity: 1, rotate: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center py-4 md:py-0 flex-shrink-0">
            {ampContent}
          </motion.div>
        );
      case "traditional":
        return (
          <motion.div initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center py-4 md:py-0 flex-shrink-0">
            {ampContent}
          </motion.div>
        );
      default:
        return (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.5 }}
            className="flex items-center justify-center py-4 md:py-0 flex-shrink-0">
            {ampContent}
          </motion.div>
        );
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <HeaderReveal className="text-center mb-12">
          <Heart className="w-10 h-10 mx-auto mb-4" style={{ color: primaryColor, fill: `${primaryColor}30` }} />
          <h2 className="text-2xl font-playfair text-gray-800">Mempelai</h2>
        </HeaderReveal>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 max-w-3xl mx-auto">
          <CardReveal index={0} className="text-center flex-1 w-full max-w-xs">
            {profileCard(bride, brideName || "Bride")}
          </CardReveal>
          {renderAmpersand()}
          <CardReveal index={1} className="text-center flex-1 w-full max-w-xs">
            {profileCard(groom, groomName || "Groom")}
          </CardReveal>
        </div>
        {effectType === "minimalist" && (
          <ScrollProgressLine color={primaryColor} className="max-w-md mx-auto mt-8" />
        )}
      </div>
    </section>
  );
}
