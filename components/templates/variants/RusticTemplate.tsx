"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import { Calendar, Clock, MapPin, Flower2, Stamp, Heart, Crown } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { TemplateProps } from "../shared/types";
import { CoupleProfileSection } from "../shared/CoupleProfileSection";
import { CountdownTimer } from "../shared/CountdownTimer";
import { TemplateGallery } from "../shared/TemplateGallery";
import { TemplateRSVP } from "../shared/TemplateRSVP";
import { TemplateWishes } from "../shared/TemplateWishes";
import { TemplateFooter } from "../shared/TemplateFooter";
import { AmbientParticles, SealBreakingEffect } from "../shared/CoverEffects";
import { MapEmbed } from "../shared/MapEmbed";
import { ScrollEffectProvider } from "../shared/ScrollEffectContext";
import { ZoomOutCover, SlideInFromSide, HeaderReveal, CardReveal, SectionReveal } from "../shared/ScrollEffects";

const sealIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  stamp: Stamp,
  heart: Heart,
  crown: Crown,
  flower: Flower2,
};

type CoverState = "sealed" | "opening";

export function RusticTemplate(props: TemplateProps) {
  const { event, templateContent, primaryColor, secondaryColor, guestName, isOpened, onOpen } = props;
  const c = templateContent;
  const rusticColor = "#b45309";

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
    tl.fromTo(burst, { scale: 0, opacity: 1 }, { scale: 5, opacity: 0, duration: 0.5, ease: "power2.out" });
    if (flash) { tl.fromTo(flash, { opacity: 0 }, { opacity: 0.6, duration: 0.08 }, 0.1); tl.to(flash, { opacity: 0, duration: 0.25 }, 0.18); }
  };

  const tiltX = mousePos.y * -3;
  const tiltY = mousePos.x * 5;
  const SealIcon = sealIconMap[c.cover.sealIcon] || Flower2;

  if (!isOpened) {
    return (
      <div ref={containerRef} onMouseMove={handleMouseMove} className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 40%, ${rusticColor}18 0%, ${rusticColor}08 40%, #1a0f05 100%)` }}>
        {c.cover.showParticles && <AmbientParticles color={rusticColor} count={30} />}

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transform: coverState === "sealed" ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)` : undefined, transition: "transform 0.15s ease-out" }}
          className="relative z-10 w-full max-w-sm"
        >
          <motion.div animate={coverState === "sealed" ? { y: [0, -8, 0] } : {}} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="relative inline-block mx-auto">
            <div className="absolute -inset-4 border-2 border-dashed border-amber-300/50 rounded-full" />
            <div className="w-56 h-72 rounded-full shadow-lg mx-auto overflow-hidden border-4 border-white relative">
              {event.cover_image && <Image src={event.cover_image} alt="" fill className="object-cover [filter:sepia(0.2)_brightness(0.9)_saturate(0.85)]" sizes="224px" />}
            </div>
            <Flower2 className="absolute -top-3 -right-3 w-8 h-8 text-amber-400" />
            <Flower2 className="absolute -bottom-3 -left-3 w-8 h-8 text-amber-400" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="mt-6 text-center">
            <p className="text-xs tracking-[0.3em] uppercase opacity-40" style={{ color: rusticColor }}>{c.cover.tagline}</p>
            <p className="text-2xl font-serif italic mt-1" style={{ color: rusticColor }}>{c.cover.mainText || event.couple_names}</p>
            {guestName && (
              <div className="mt-3">
                <span className="text-[10px] tracking-[0.4em] uppercase opacity-40 block" style={{ color: rusticColor }}>Kepada Yth.</span>
                <span className="text-xl font-serif italic font-bold" style={{ color: rusticColor }}>{guestName}</span>
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
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center glow-ring cursor-pointer"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${rusticColor}cc, ${rusticColor}88)`,
                    ["--glow-color" as string]: `${rusticColor}50`,
                    boxShadow: `0 0 24px ${rusticColor}25, inset 0 2px 4px rgba(0,0,0,0.12)`,
                    border: `2px solid ${rusticColor}99`,
                  }}
                >
                  <SealIcon className="w-7 h-7 text-white drop-shadow-md" />
                </div>
                <motion.div animate={{ opacity: [0.4, 0.8, 0.4], y: [0, -2, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <p className="text-xs tracking-[0.2em] font-medium" style={{ color: rusticColor, opacity: 0.7 }}>{c.cover.openingLabel}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {coverState === "opening" && (<SealBreakingEffect color={rusticColor} />)}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {coverState === "opening" && (
            <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${rusticColor}15, transparent 70%)` }}>
              <div ref={burstRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full" style={{ background: `radial-gradient(circle, ${rusticColor}80, ${rusticColor}30, transparent 70%)` }} />
              <div ref={flashRef} className="absolute inset-0 bg-white opacity-0" />
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (i / 16) * Math.PI * 2;
                const dist = 100 + Math.random() * 180;
                return (<motion.div key={i} initial={{ x: 0, y: 0, scale: 1, opacity: 1 }} animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, scale: 0, opacity: 0 }} transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }} className="absolute top-1/2 left-1/2" style={{ color: rusticColor }}><Flower2 className="w-4 h-4" /></motion.div>);
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <ScrollEffectProvider effectType="rustic" primaryColor={primaryColor}>
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
    <div className="min-h-screen font-serif" style={{ backgroundColor: "#fdfaf5", color: "#5c4033" }}>
      <RusticHero event={event} content={c} primaryColor={primaryColor} guestName={guestName} />
      {c.couple.show && <CoupleProfileSection content={c.couple} primaryColor={primaryColor} coupleNames={event.couple_names || undefined} />}
      {c.countdown.show && <CountdownTimer event={event} content={c.countdown} primaryColor={primaryColor} />}
      <section className="py-20 px-6 max-w-lg mx-auto">
        <HeaderReveal className="text-center mb-12">
          <Flower2 className="w-8 h-8 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold italic mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>{c.detail.introTitle}</h2>
          <div className="w-12 h-px bg-amber-300 mx-auto mb-4" />
          <p className="text-sm text-stone-500 leading-relaxed max-w-md mx-auto">{c.detail.introText}</p>
        </HeaderReveal>
        <div className="space-y-4">
          {[{ icon: Calendar, label: c.detail.dateLabel, value: formatDate(event.event_date) }, { icon: Clock, label: c.detail.timeLabel, value: event.event_time ? formatTime(event.event_time) : "-" }, { icon: MapPin, label: c.detail.locationLabel, value: event.location_name }].map((item, i) => {
            const Icon = item.icon;
            return (
              <CardReveal key={i} index={i}
                className="flex items-center gap-4 p-5 bg-white border border-stone-200 rounded-lg shadow-sm">
                <Icon className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-400">{item.label}</p>
                  <p className="text-stone-700">{item.value}</p>
                </div>
              </CardReveal>
            );
          })}
        </div>
        {event.maps_url && (
          <div className="mt-10">
            <MapEmbed mapsUrl={event.maps_url} locationName={event.location_name} primaryColor="#92400e" mapsButtonText={c.detail.mapsButtonText} />
          </div>
        )}
      </section>
      <TemplateGallery event={event} content={c.gallery} primaryColor="#92400e" />
      <TemplateRSVP {...props} />
      <TemplateWishes {...props} />
      <TemplateFooter primaryColor="#92400e" />
    </div>
    </motion.div>
    </ScrollEffectProvider>
  );
}

function RusticHero({ event, content, primaryColor, guestName }: {
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
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-1, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div ref={ref}>
      <motion.div style={{ scale, rotate, opacity }}>
        <section className="min-h-screen flex items-center justify-center px-4 py-20" style={{ background: "linear-gradient(135deg, #f5f0e8 0%, #ede0cc 100%)" }}>
          <motion.div
            initial={{ opacity: 0, y: 60, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white p-6 pb-12 shadow-2xl max-w-md w-full text-center"
            style={{ transform: "rotate(-1deg)" }}
          >
            <div className="aspect-[4/5] mb-6 relative overflow-hidden rounded">
              {event.cover_image && <Image src={event.cover_image} alt="" fill className="object-cover [filter:sepia(0.15)_brightness(0.92)_saturate(0.9)]" sizes="400px" />}
            </div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-600 mb-3">{content.cover.tagline}</p>
            <h1 className="text-3xl font-bold italic mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>{content.cover.mainText || event.couple_names}</h1>
            {content.cover.showGuestName && guestName && (<p className="text-xs text-gray-500 mt-2">Dear, <span className="font-semibold italic">{guestName}</span></p>)}
            <p className="text-xs text-amber-500 mt-4">{event.event_date ? formatDate(event.event_date) : ""}</p>
            <div className="flex justify-center gap-1 mt-3">{[...Array(5)].map((_, i) => <Flower2 key={i} className="w-3 h-3 text-amber-300" />)}</div>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
}
