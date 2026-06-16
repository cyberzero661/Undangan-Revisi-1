"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import { Mail, Heart, Sparkles, Stamp, Crown, Flower2 } from "lucide-react";
import { Event } from "@/types/database";
import { TemplateContent } from "@/types/template";
import { AmbientParticles } from "./CoverEffects";

const sealIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  stamp: Stamp,
  heart: Heart,
  crown: Crown,
  flower: Flower2,
};

type CoverState = "sealed" | "opening";

interface DigitalEnvelopeCoverProps {
  event: Event;
  content: TemplateContent["cover"];
  primaryColor: string;
  guestName: string;
  onOpen: () => void;
}

export function DigitalEnvelopeCover({ event, content, primaryColor, guestName, onOpen }: DigitalEnvelopeCoverProps) {
  const [coverState, setCoverState] = useState<CoverState>("sealed");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const style = content.envelopeStyle || "classic";

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (coverState !== "sealed") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: ((e.clientX - rect.left) / rect.width - 0.5) * 2, y: ((e.clientY - rect.top) / rect.height - 0.5) * 2 });
  }, [coverState]);

  const handleSealTap = () => {
    setCoverState("opening");
    const burst = burstRef.current;
    const flash = flashRef.current;
    if (!burst) { setTimeout(onOpen, 600); return; }
    const tl = gsap.timeline({ onComplete: () => onOpen() });
    tl.fromTo(burst, { scale: 0, opacity: 1 }, { scale: 5, opacity: 0, duration: 0.5, ease: "power2.out" });
    if (flash) { tl.fromTo(flash, { opacity: 0 }, { opacity: 0.6, duration: 0.08 }, 0.1); tl.to(flash, { opacity: 0, duration: 0.25 }, 0.18); }
  };

  const tiltX = mousePos.y * -4;
  const tiltY = mousePos.x * 6;
  const SealIcon = sealIconMap[content.sealIcon] || Stamp;

  const renderEnvelope = () => {
    if (style === "modern") {
      return (
        <div className="w-64 h-80 rounded-2xl shadow-2xl mx-auto overflow-hidden relative">
          {event.cover_image && <Image src={event.cover_image} alt="" fill className="object-cover [filter:brightness(0.85)]" sizes="256px" />}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-white text-center p-6">
              <Mail className="w-12 h-12 mx-auto mb-4" />
              <p className="text-xs uppercase tracking-[0.3em] opacity-80">{content.tagline}</p>
              <p className="text-lg font-playfair mt-2">{content.mainText || event.couple_names}</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-white/90 rounded-t-3xl flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs text-gray-500">Sent with love</p>
              <Sparkles className="w-5 h-5 mx-auto mt-2" style={{ color: primaryColor }} />
            </div>
          </div>
        </div>
      );
    }
    if (style === "minimal") {
      return (
        <div className="w-56 h-72 bg-white shadow-lg mx-auto flex flex-col items-center justify-center border border-gray-100">
          <div className="w-16 h-px bg-gray-300 mb-6" />
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-4">{content.tagline}</p>
          <p className="text-xl font-light">{content.mainText || event.couple_names}</p>
          <div className="w-8 h-px bg-gray-300 mt-6 mb-4" />
          <Mail className="w-4 h-4 text-gray-300" />
        </div>
      );
    }
    return (
      <div className="relative w-72 h-96 mx-auto">
        <div className="absolute inset-0 bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1/2 origin-bottom transform" style={{ background: `linear-gradient(135deg, ${primaryColor}dd, ${primaryColor})`, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white flex items-center justify-center">
            <div className="text-center">
              <Heart className="w-8 h-8 mx-auto mb-3" style={{ color: primaryColor }} />
              <p className="text-sm font-playfair text-gray-700">{content.mainText || event.couple_names}</p>
            </div>
          </div>
        </div>
        <motion.div animate={coverState === "sealed" ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 1.5, repeat: Infinity }} className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full shadow-lg flex items-center justify-center bg-white" style={{ border: `2px solid ${primaryColor}` }}>
          <Mail className="w-5 h-5" style={{ color: primaryColor }} />
        </motion.div>
      </div>
    );
  };

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 40%, ${primaryColor}12 0%, ${primaryColor}05 40%, #0a0a0a 100%)` }}>
      {content.showParticles && <AmbientParticles color={primaryColor} count={35} />}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transform: coverState === "sealed" ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)` : undefined, transition: "transform 0.15s ease-out" }}
        className="relative z-10 w-full max-w-sm"
      >
        <motion.div animate={coverState === "sealed" ? { y: [0, -8, 0] } : {}} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          {renderEnvelope()}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="mt-6 text-center">
          <p className="text-xs tracking-[0.4em] uppercase opacity-40" style={{ color: primaryColor }}>{content.tagline}</p>
          <p className="text-2xl font-playfair mt-1" style={{ color: primaryColor }}>{content.mainText || event.couple_names}</p>
          {guestName && (
            <div className="mt-3">
              <span className="text-[10px] tracking-[0.5em] uppercase opacity-30 block" style={{ color: primaryColor }}>Kepada Yth.</span>
              <span className="text-xl font-playfair font-bold" style={{ color: primaryColor }}>{guestName}</span>
            </div>
          )}
        </motion.div>

        {/* Seal */}
        <AnimatePresence>
          {coverState === "sealed" && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
              onClick={handleSealTap}
            >
              <div
                className="w-22 h-22 rounded-full flex items-center justify-center glow-ring cursor-pointer"
                style={{
                  width: 88, height: 88,
                  background: `radial-gradient(circle at 35% 35%, ${primaryColor}cc, ${primaryColor}88, ${primaryColor}44)`,
                  ["--glow-color" as string]: `${primaryColor}60`,
                  boxShadow: `0 0 30px ${primaryColor}30, inset 0 2px 4px rgba(255,255,255,0.2)`,
                  border: `2px solid ${primaryColor}aa`,
                }}
              >
                <SealIcon className="w-8 h-8 text-white drop-shadow-md" />
              </div>
              <motion.div animate={{ opacity: [0.4, 0.8, 0.4], y: [0, -2, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <p className="text-xs tracking-[0.25em] font-medium" style={{ color: primaryColor, opacity: 0.7 }}>{content.openingLabel}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Cinematic burst */}
      <AnimatePresence>
        {coverState === "opening" && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            style={{ background: `radial-gradient(ellipse at center, ${primaryColor}15, transparent 70%)` }}
          >
            <div ref={burstRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full" style={{ background: `radial-gradient(circle, ${primaryColor}90, ${primaryColor}40, transparent 70%)` }} />
            <div ref={flashRef} className="absolute inset-0 bg-white opacity-0" />
            {Array.from({ length: 20 }).map((_, i) => {
              const angle = (i / 20) * Math.PI * 2;
              const dist = 120 + Math.random() * 200;
              return (
                <motion.div key={i} initial={{ x: 0, y: 0, scale: 1, opacity: 1 }} animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, scale: 0, opacity: 0 }} transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
                  className="absolute top-1/2 left-1/2 rounded-full" style={{ width: Math.random() * 6 + 2, height: Math.random() * 6 + 2, backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }} />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}