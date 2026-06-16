"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import { Stamp, Heart, Crown, Flower2 } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { TemplateProps } from "../shared/types";
import { CoupleProfileSection } from "../shared/CoupleProfileSection";
import { CountdownTimer } from "../shared/CountdownTimer";
import { TemplateGallery } from "../shared/TemplateGallery";
import { TemplateRSVP } from "../shared/TemplateRSVP";
import { TemplateWishes } from "../shared/TemplateWishes";
import { AmbientParticles, SealBreakingEffect } from "../shared/CoverEffects";
import { MapEmbed } from "../shared/MapEmbed";
import { ScrollEffectProvider } from "../shared/ScrollEffectContext";
import { ZoomOutCover, StaggeredTextReveal, ScrollProgressLine, HeaderReveal, CardReveal } from "../shared/ScrollEffects";

const sealIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  stamp: Stamp,
  heart: Heart,
  crown: Crown,
  flower: Flower2,
};

type CoverState = "sealed" | "opening";

export function MinimalistTemplate(props: TemplateProps) {
  const { event, templateContent, primaryColor, secondaryColor, guestName, isOpened, onOpen } = props;
  const c = templateContent;
  const monoColor = "#333333";

  const [coverState, setCoverState] = useState<CoverState>("sealed");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

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
    tl.fromTo(burst, { scale: 0, opacity: 1 }, { scale: 4, opacity: 0, duration: 0.4, ease: "power2.out" });
    if (flash) { tl.fromTo(flash, { opacity: 0 }, { opacity: 0.4, duration: 0.06 }, 0.06); tl.to(flash, { opacity: 0, duration: 0.2 }, 0.12); }
  };

  const tiltX = mousePos.y * -2;
  const tiltY = mousePos.x * 4;
  const SealIcon = sealIconMap[c.cover.sealIcon] || Stamp;

  if (!isOpened) {
    return (
      <div ref={containerRef} onMouseMove={handleMouseMove} className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-white">
        {c.cover.showParticles && <AmbientParticles color={monoColor} count={15} />}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transform: coverState === "sealed" ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)` : undefined, transition: "transform 0.15s ease-out" }}
          className="relative z-10 w-full max-w-sm"
        >
          <motion.div animate={coverState === "sealed" ? { y: [0, -5, 0] } : {}} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
            <div className="w-48 h-64 mx-auto shadow-sm relative overflow-hidden">
              {event.cover_image && <Image src={event.cover_image} alt="" fill className="object-cover [filter:grayscale(0.15)_brightness(0.95)]" sizes="192px" />}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="mt-6 text-center">
            <div className="w-12 h-px bg-gray-200 mx-auto mb-3" />
            <p className="text-xs uppercase tracking-[0.5em] text-gray-300">{c.cover.tagline}</p>
            <p className="text-xl font-light tracking-wide mt-1 text-gray-700">{c.cover.mainText || event.couple_names}</p>
            {guestName && (
              <div className="mt-3">
                <span className="text-[10px] tracking-[0.5em] uppercase text-gray-300">Invited</span>
                <span className="block text-lg font-light tracking-wide text-gray-800 mt-1">{guestName}</span>
              </div>
            )}
          </motion.div>

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
                <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2.5, repeat: Infinity }} className="relative">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: monoColor, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
                    <SealIcon className="w-6 h-6 text-white" />
                  </div>
                  <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <p className="text-[10px] tracking-[0.3em] font-light uppercase text-gray-400">{c.cover.openingLabel}</p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {coverState === "opening" && <SealBreakingEffect color={monoColor} />}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {coverState === "opening" && (
            <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-white">
              <div ref={burstRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,0,0,0.06), transparent 70%)" }} />
              <div ref={flashRef} className="absolute inset-0 bg-white opacity-0" />
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const dist = 80 + Math.random() * 120;
                return (<motion.div key={i} initial={{ x: 0, y: 0, scale: 1, opacity: 0.5 }} animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, scale: 0, opacity: 0 }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }} className="absolute top-1/2 left-1/2 rounded-full bg-gray-800" style={{ width: Math.random() * 4 + 1, height: Math.random() * 4 + 1 }} />);
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <ScrollEffectProvider effectType="minimalist" primaryColor={primaryColor}>
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <MinimalistHero event={event} content={c} primaryColor={primaryColor} guestName={guestName} />
      {c.couple.show && <CoupleProfileSection content={c.couple} primaryColor={primaryColor} coupleNames={event.couple_names || undefined} />}
      {c.countdown.show && <CountdownTimer event={event} content={c.countdown} primaryColor={primaryColor} />}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <HeaderReveal className="mb-16">
          <div className="text-center">
            <h2 className="text-xl font-light tracking-wide mb-6">{c.detail.introTitle}</h2>
            <ScrollProgressLine color={primaryColor} className="max-w-xs mx-auto mb-6" />
            <p className="text-sm text-gray-400 text-center max-w-md mx-auto leading-relaxed">{c.detail.introText}</p>
          </div>
        </HeaderReveal>
        <div className="space-y-1">
          {[{ label: c.detail.dateLabel, value: formatDate(event.event_date) }, { label: c.detail.timeLabel, value: event.event_time ? formatTime(event.event_time) : "-" }, { label: c.detail.locationLabel, value: event.location_name }].map((item, i) => (
            <CardReveal key={i} index={i}
              className="flex justify-between items-center py-5 border-b border-gray-100">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-400">{item.label}</span>
              <span className="text-sm text-gray-700 text-right font-light">{item.value}</span>
            </CardReveal>
          ))}
        </div>
        {event.maps_url && (
          <div className="mt-14">
            <MapEmbed mapsUrl={event.maps_url} locationName={event.location_name} primaryColor="#000000" mapsButtonText={c.detail.mapsButtonText} />
          </div>
        )}
      </section>
      <TemplateGallery event={event} content={c.gallery} primaryColor="#000000" />
      <TemplateRSVP {...props} />
      <TemplateWishes {...props} />
      <footer className="py-12 text-center border-t border-gray-100"><p className="text-xs text-gray-300 uppercase tracking-[0.3em]">Made with love</p></footer>
    </div>
    </motion.div>
    </ScrollEffectProvider>
  );
}

function MinimalistHero({ event, content, primaryColor, guestName }: {
  event: TemplateProps["event"];
  content: TemplateProps["templateContent"];
  primaryColor: string;
  guestName: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div ref={ref}>
      <motion.div style={{ scale, opacity }}>
        <section className="h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center px-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-xl">
              <div className="w-20 h-px bg-gray-300 mx-auto mb-8" />
              <p className="text-xs uppercase tracking-[0.6em] text-gray-400 mb-8">{content.cover.tagline}</p>
              <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-2">
                <StaggeredTextReveal text={content.cover.mainText || event.couple_names || ""} staggerDelay={0.04} />
              </h1>
              <div className="w-12 h-px bg-gray-300 mx-auto my-8" />
              {content.cover.showGuestName && guestName && (<p className="text-sm text-gray-400 tracking-wider">&#8212; {guestName} &#8212;</p>)}
            </motion.div>
          </div>
          <div className="text-center pb-8"><p className="text-xs text-gray-300 uppercase tracking-[0.3em]">{event.event_date ? formatDate(event.event_date) : ""}</p></div>
        </section>
      </motion.div>
    </div>
  );
}
