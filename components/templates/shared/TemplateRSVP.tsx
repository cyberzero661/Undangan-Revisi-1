"use client";

import { motion } from "framer-motion";
import { Check, X, Loader2, Send } from "lucide-react";
import { TemplateProps } from "./types";
import { HeaderReveal, SectionReveal, FadeScaleSection } from "./ScrollEffects";

export function TemplateRSVP(props: TemplateProps) {
  const { event, templateContent, rsvpSubmitted, rsvpForm, onRsvpFormChange, onRsvpSubmit, isSubmitting } = props;
  const c = templateContent.rsvp;
  const primaryColor = props.primaryColor;

  return (
    <section className="py-20 px-4 max-w-md mx-auto">
      <SectionReveal>
        <HeaderReveal className="text-center mb-10">
          <h2 className="text-2xl font-playfair text-gray-800 mb-2">{c.title}</h2>
          <p className="text-sm text-gray-400">{c.subtitle}</p>
        </HeaderReveal>

        {rsvpSubmitted ? (
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-center p-8 bg-gray-50 rounded-2xl">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: primaryColor }}>
              <Check className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{c.successTitle}</h3>
            <p className="text-sm text-gray-500">{c.successText}</p>
          </motion.div>
        ) : (
          <form onSubmit={onRsvpSubmit} className="space-y-4">
            <FadeScaleSection delay={0}>
              <input type="text" value={rsvpForm.name} onChange={(e) => onRsvpFormChange({ ...rsvpForm, name: e.target.value })}
                placeholder="Nama Lengkap" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-sm" required />
            </FadeScaleSection>
            <FadeScaleSection delay={0.08}>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => onRsvpFormChange({ ...rsvpForm, attendance: "hadir" })}
                  className={`p-4 rounded-xl border-2 transition-all ${rsvpForm.attendance === "hadir" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200"}`}>
                  <Check className="w-5 h-5 mx-auto mb-1" /><span className="text-sm font-medium">{c.hadirText}</span>
                </button>
                <button type="button" onClick={() => onRsvpFormChange({ ...rsvpForm, attendance: "tidak_hadir" })}
                  className={`p-4 rounded-xl border-2 transition-all ${rsvpForm.attendance === "tidak_hadir" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200"}`}>
                  <X className="w-5 h-5 mx-auto mb-1" /><span className="text-sm font-medium">{c.tidakHadirText}</span>
                </button>
              </div>
            </FadeScaleSection>
            <FadeScaleSection delay={0.16}>
              {rsvpForm.attendance === "hadir" && (
                <select value={rsvpForm.total_guests} onChange={(e) => onRsvpFormChange({ ...rsvpForm, total_guests: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-sm">
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} orang</option>)}
                </select>
              )}
            </FadeScaleSection>
            <FadeScaleSection delay={0.24}>
              <textarea value={rsvpForm.message} onChange={(e) => onRsvpFormChange({ ...rsvpForm, message: e.target.value })}
                placeholder="Ucapan / Doa (opsional)" rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-sm resize-none" />
            </FadeScaleSection>
            <FadeScaleSection delay={0.32}>
              <button type="submit" disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-semibold text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}>
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {c.submitButtonText}
              </button>
            </FadeScaleSection>
          </form>
        )}
      </SectionReveal>
    </section>
  );
}
