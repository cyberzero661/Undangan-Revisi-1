"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";
import { Event } from "@/types/database";
import { TemplateContent } from "@/types/template";
import { HeaderReveal, CardReveal, SectionReveal } from "./ScrollEffects";

interface CountdownTimerProps {
  event: Event;
  content: TemplateContent["countdown"];
  primaryColor: string;
}

export function CountdownTimer({ event, content, primaryColor }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(event.event_date + "T" + (event.event_time || "00:00"));
    const tick = () => {
      const now = new Date().getTime();
      const diff = target.getTime() - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [event.event_date, event.event_time]);

  const boxes = [
    { value: timeLeft.days, label: "Hari" },
    { value: timeLeft.hours, label: "Jam" },
    { value: timeLeft.minutes, label: "Menit" },
    { value: timeLeft.seconds, label: "Detik" },
  ];

  return (
    <section className="py-16 px-4" style={{ backgroundColor: `${primaryColor}08` }}>
      <SectionReveal>
        <div className="text-center max-w-2xl mx-auto">
          <HeaderReveal>
            <Timer className="w-8 h-8 mx-auto mb-4" style={{ color: primaryColor }} />
            <h2 className="text-2xl font-playfair text-gray-800 mb-8">{content.title}</h2>
          </HeaderReveal>
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {boxes.map((box, i) => (
              <CardReveal key={i} index={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                <p className="text-2xl md:text-3xl font-bold font-mono" style={{ color: primaryColor }}>
                  {String(box.value).padStart(2, "0")}
                </p>
                <p className="text-xs text-gray-400 mt-1">{box.label}</p>
              </CardReveal>
            ))}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
