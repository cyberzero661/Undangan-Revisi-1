"use client";

import { motion } from "framer-motion";
import { TemplateProps } from "./types";
import { HeaderReveal, CardReveal, SectionReveal } from "./ScrollEffects";

export function TemplateWishes(props: TemplateProps) {
  const { rsvps, templateContent, primaryColor } = props;
  const c = templateContent.wishes;

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto">
      <HeaderReveal className="text-center mb-10">
        <h2 className="text-2xl font-playfair text-gray-800 mb-2">{c.title}</h2>
      </HeaderReveal>
      <SectionReveal>
        <div className="grid gap-4 md:grid-cols-2">
          {rsvps.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-gray-400"><p>{c.emptyText}</p></div>
          ) : (
            rsvps.map((rsvp, i) => (
              <CardReveal key={rsvp.id} index={i}
                className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}>
                    {rsvp.guest_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{rsvp.guest_name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${rsvp.attendance_status === "hadir" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {rsvp.attendance_status === "hadir" ? "Hadir" : "Tidak Hadir"}
                    </span>
                  </div>
                </div>
                {rsvp.message && <p className="text-gray-500 text-sm leading-relaxed">{rsvp.message}</p>}
              </CardReveal>
            ))
          )}
        </div>
      </SectionReveal>
    </section>
  );
}
