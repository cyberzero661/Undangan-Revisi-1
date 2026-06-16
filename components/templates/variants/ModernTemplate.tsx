"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { TemplateProps } from "../shared/types";
import { DigitalEnvelopeCover } from "../shared/DigitalEnvelopeCover";
import { CoupleProfileSection } from "../shared/CoupleProfileSection";
import { CountdownTimer } from "../shared/CountdownTimer";
import { TemplateGallery } from "../shared/TemplateGallery";
import { TemplateRSVP } from "../shared/TemplateRSVP";
import { TemplateWishes } from "../shared/TemplateWishes";
import { TemplateFooter } from "../shared/TemplateFooter";
import { MapEmbed } from "../shared/MapEmbed";
import { ScrollEffectProvider } from "../shared/ScrollEffectContext";
import { ParallaxLayer, ClipPathReveal, HeaderReveal, CardReveal, SectionReveal } from "../shared/ScrollEffects";

export function ModernTemplate(props: TemplateProps) {
  const { event, templateContent, primaryColor, secondaryColor, guestName, isOpened, onOpen } = props;
  const c = templateContent;

  if (!isOpened) {
    return <DigitalEnvelopeCover event={event} content={c.cover} primaryColor={primaryColor} guestName={guestName} onOpen={onOpen} />;
  }

  return (
    <ScrollEffectProvider effectType="modern" primaryColor={primaryColor}>
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
    <div className="min-h-screen bg-white font-sans">
      <ModernHero event={event} content={c} primaryColor={primaryColor} guestName={guestName} />

      {c.couple.show && <CoupleProfileSection content={c.couple} primaryColor={primaryColor} coupleNames={event.couple_names || undefined} />}
      {c.countdown.show && <CountdownTimer event={event} content={c.countdown} primaryColor={primaryColor} />}

      <section className="py-24 px-6 max-w-5xl mx-auto">
        <HeaderReveal className="text-center mb-16">
          <h2 className="text-2xl font-playfair text-gray-800 mb-4">{c.detail.introTitle}</h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">{c.detail.introText}</p>
        </HeaderReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Calendar, label: c.detail.dateLabel, value: formatDate(event.event_date) },
            { icon: Clock, label: c.detail.timeLabel, value: event.event_time ? formatTime(event.event_time) : "-" },
            { icon: MapPin, label: c.detail.locationLabel, value: event.location_name },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <CardReveal key={i} index={i}
                className="text-center p-8 border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Icon className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{item.label}</p>
                <p className="text-gray-800 font-medium">{item.value}</p>
              </CardReveal>
            );
          })}
        </div>
        {event.maps_url && (
          <div className="mt-12">
            <MapEmbed mapsUrl={event.maps_url} locationName={event.location_name} primaryColor={primaryColor} mapsButtonText={c.detail.mapsButtonText} />
          </div>
        )}
      </section>

      <TemplateGallery event={event} content={c.gallery} primaryColor={primaryColor} />
      <TemplateRSVP {...props} />
      <TemplateWishes {...props} />
      <TemplateFooter primaryColor={primaryColor} />
    </div>
    </motion.div>
    </ScrollEffectProvider>
  );
}

function ModernHero({ event, content, primaryColor, guestName }: {
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
  const textY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.3]);

  return (
    <section ref={ref} className="h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div style={{ y: imgY }} className="absolute inset-0">
        {event.cover_image && <Image src={event.cover_image} alt="" fill className="object-cover [filter:brightness(0.92)_saturate(1.1)]" priority sizes="100vw" />}
      </motion.div>
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
      <motion.div style={{ y: textY }} className="relative z-10 text-white text-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.5em] mb-6 opacity-70">{content.cover.tagline}</p>
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-8 leading-tight">{content.cover.mainText || event.couple_names}</h1>
          {content.cover.showGuestName && guestName && (
            <p className="text-lg opacity-80 mt-4">Kepada <span className="font-semibold border-b border-white/40 pb-1">{guestName}</span></p>
          )}
          <p className="mt-10 text-sm opacity-60">{event.event_date ? formatDate(event.event_date) : ""}</p>
        </motion.div>
      </motion.div>
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-black pointer-events-none z-20" />
    </section>
  );
}
