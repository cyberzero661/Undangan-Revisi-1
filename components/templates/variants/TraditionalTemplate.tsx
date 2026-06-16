"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import { Calendar, Clock, MapPin, Crown, Stamp, Heart, Flower2 } from "lucide-react";
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
import { HeaderReveal, CardReveal, SectionReveal, ScrollProgressLine, BorderDrawReveal } from "../shared/ScrollEffects";

const sealIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  stamp: Stamp,
  heart: Heart,
  crown: Crown,
  flower: Flower2,
};

type CoverState = "sealed" | "opening";

export function TraditionalTemplate(props: TemplateProps) {
  const { event, templateContent, primaryColor, secondaryColor, guestName, isOpened, onOpen } = props;
  const c = templateContent;
  const goldColor = "#d4af37";

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
  const SealIcon = sealIconMap[c.cover.sealIcon] || Crown;

  if (!isOpened) {
    return (
      <div ref={containerRef} onMouseMove={handleMouseMove} className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 40%, ${goldColor}10 0%, ${goldColor}06 30%, #0a0500 100%)` }}>
        {c.cover.showParticles && <AmbientParticles color={goldColor} count={40} />}

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transform: coverState === "sealed" ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)` : undefined, transition: "transform 0.15s ease-out" }}
          className="relative z-10 w-full max-w-sm"
        >
          <motion.div animate={coverState === "sealed" ? { rotate: [0, 2, -2, 0] } : {}} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative inline-block p-3 mx-auto" style={{ border: "3px double #d4a017" }}>
            <div className="w-56 h-72 bg-cover bg-center relative overflow-hidden">
              {event.cover_image && <Image src={event.cover_image} alt="" fill className="object-cover [filter:brightness(0.85)_contrast(1.15)_saturate(1.2)]" sizes="224px" />}
            </div>
            <Crown className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 text-yellow-600" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="mt-6 text-center">
            <p className="text-xs tracking-[0.4em] uppercase opacity-30" style={{ color: goldColor }}>{c.cover.tagline}</p>
            <p className="text-2xl mt-1" style={{ color: goldColor, fontFamily: "'Cinzel', serif" }}>{c.cover.mainText || event.couple_names}</p>
            {guestName && (
              <div className="mt-3">
                <span className="text-[10px] tracking-[0.5em] uppercase opacity-35 block" style={{ color: goldColor }}>Yang Terhormat</span>
                <span className="text-xl font-bold italic" style={{ color: goldColor, fontFamily: "'Cinzel', serif" }}>{guestName}</span>
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
                  className="w-24 h-24 rounded-full flex items-center justify-center glow-ring cursor-pointer"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${goldColor}dd, ${goldColor}99, ${goldColor}66)`,
                    ["--glow-color" as string]: `${goldColor}50`,
                    boxShadow: `0 0 40px ${goldColor}35, 0 8px 32px rgba(0,0,0,0.3), inset 0 2px 6px rgba(255,255,255,0.25)`,
                    border: `3px solid ${goldColor}88`,
                  }}
                >
                  <SealIcon className="w-9 h-9 text-white drop-shadow-lg" />
                </div>
                <motion.div animate={{ opacity: [0.5, 1, 0.5], y: [0, -2, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <p className="text-xs tracking-[0.3em] font-medium" style={{ color: goldColor, opacity: 0.7 }}>{c.cover.openingLabel}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {coverState === "opening" && <SealBreakingEffect color={goldColor} />}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {coverState === "opening" && (
            <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${goldColor}12, transparent 70%)` }}>
              <div ref={burstRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full" style={{ background: `radial-gradient(circle, ${goldColor}90, ${goldColor}40, transparent 70%)` }} />
              <div ref={flashRef} className="absolute inset-0 opacity-0" style={{ background: `radial-gradient(circle, ${goldColor}40, transparent 60%)` }} />
              {Array.from({ length: 20 }).map((_, i) => {
                const angle = (i / 20) * Math.PI * 2;
                const dist = 130 + Math.random() * 200;
                return (<motion.div key={i} initial={{ x: 0, y: 0, scale: 1, opacity: 1 }} animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, scale: 0, opacity: 0 }} transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }} className="absolute top-1/2 left-1/2" style={{ color: goldColor }}><Crown className="w-4 h-4" /></motion.div>);
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <ScrollEffectProvider effectType="traditional" primaryColor={primaryColor}>
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
    <div className="min-h-screen" style={{ backgroundColor: "#1a0f0a", color: "#d4af37" }}>
      <TraditionalHero event={event} content={c} primaryColor={primaryColor} guestName={guestName} />
      {c.couple.show && <CoupleProfileSection content={c.couple} primaryColor={primaryColor} coupleNames={event.couple_names || undefined} />}
      {c.countdown.show && <CountdownTimer event={event} content={c.countdown} primaryColor={primaryColor} />}
      <section className="py-20 px-6 max-w-2xl mx-auto">
        <HeaderReveal className="text-center mb-12">
          <Crown className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Cinzel', serif", color: "#d4af37" }}>{c.detail.introTitle}</h2>
          <div className="flex items-center justify-center gap-3 mb-4"><div className="h-px w-12 bg-yellow-700/30" /><span className="text-yellow-600">&#9830;</span><div className="h-px w-12 bg-yellow-700/30" /></div>
          <p className="text-sm text-yellow-200/60 max-w-lg mx-auto leading-relaxed">{c.detail.introText}</p>
        </HeaderReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{ icon: Calendar, label: c.detail.dateLabel, value: formatDate(event.event_date) }, { icon: Clock, label: c.detail.timeLabel, value: event.event_time ? formatTime(event.event_time) : "-" }, { icon: MapPin, label: c.detail.locationLabel, value: event.location_name }].map((item, i) => {
            const Icon = item.icon;
            return (
              <CardReveal key={i} index={i} className="text-center p-6 border border-yellow-700/20" >
                <div style={{ backgroundColor: "rgba(212,175,55,0.05)" }}>
                  <Icon className="w-6 h-6 text-yellow-600 mx-auto mb-3" />
                  <p className="text-xs uppercase tracking-wider text-yellow-500/60 mb-1">{item.label}</p>
                  <p className="text-yellow-200 font-medium">{item.value}</p>
                </div>
              </CardReveal>
            );
          })}
        </div>
        {event.maps_url && (
          <div className="mt-12">
            <MapEmbed mapsUrl={event.maps_url} locationName={event.location_name} primaryColor="#d4af37" mapsButtonText={c.detail.mapsButtonText} />
          </div>
        )}
      </section>
      <TemplateGallery event={event} content={c.gallery} primaryColor="#d4af37" />
      <TemplateRSVP {...props} />
      <TemplateWishes {...props} />
      <TemplateFooter primaryColor="#d4af37" />
    </div>
    </motion.div>
    </ScrollEffectProvider>
  );
}

function TraditionalHero({ event, content, primaryColor, guestName }: {
  event: TemplateProps["event"];
  content: TemplateProps["templateContent"];
  primaryColor: string;
  guestName: string;
}) {
  const goldColor = "#d4af37";
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const outerBorderClip = useTransform(scrollYProgress, [0, 0.5], ["inset(8% 8% 8% 8% round 4px)", "inset(0% 0% 0% 0% round 4px)"]);
  const innerBorderClip = useTransform(scrollYProgress, [0.1, 0.6], ["inset(6% 6% 6% 6% round 2px)", "inset(0% 0% 0% 0% round 2px)"]);
  const contentOpacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center relative px-4" style={{ backgroundColor: "#1a0f0a" }}>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, #d4af37 20px, #d4af37 21px), repeating-linear-gradient(-45deg, transparent, transparent 20px, #d4af37 20px, #d4af37 21px)" }} />
      <div className="relative z-10 text-center max-w-xl">
        <motion.div
          style={{ clipPath: outerBorderClip }}
          className="p-8 border-4 border-double border-yellow-700/50"
        >
          <motion.div
            style={{ clipPath: innerBorderClip }}
            className="border border-yellow-600/30 p-8"
          >
            <motion.div style={{ opacity: contentOpacity }} className="text-center max-w-xl">
              <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-6" />
              <p className="text-xs uppercase tracking-[0.5em] text-yellow-500 mb-4">{content.cover.tagline}</p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold mb-4"
                style={{ fontFamily: "'Cinzel', serif", color: "#d4af37" }}
              >
                {content.cover.mainText || event.couple_names}
              </motion.h1>
              <div className="flex items-center justify-center gap-4 my-6">
                <div className="h-px flex-1 bg-yellow-700/30" />
                <span className="text-2xl" style={{ color: goldColor }}>&#9813;</span>
                <div className="h-px flex-1 bg-yellow-700/30" />
              </div>
              {content.cover.showGuestName && guestName && (<p className="text-sm text-yellow-500 italic">Yang terhormat <span className="not-italic font-semibold">{guestName}</span></p>)}
              <p className="text-xs text-yellow-600 mt-4">{event.event_date ? formatDate(event.event_date) : ""}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}