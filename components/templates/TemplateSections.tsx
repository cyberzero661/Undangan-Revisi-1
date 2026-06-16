"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  Music,
  Volume2,
  VolumeX,
  Image as Images,
  Send,
  ChevronDown,
  ExternalLink,
  Users,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Event, RSVP } from "@/types/database";
import { TemplateContent, TemplateSection } from "@/types/template";
import { formatDate, formatTime } from "@/lib/utils";

interface CoverSectionProps {
  event: Event;
  content: TemplateContent["cover"];
  primaryColor: string;
  guestName: string;
  onNext: () => void;
}

export function CoverSection({ event, content, primaryColor, guestName, onNext }: CoverSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center relative">
      {event.cover_image && <Image src={event.cover_image} alt="" fill className="object-cover [filter:brightness(0.75)]" priority sizes="100vw" />}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center text-white p-8"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6"
        >
          <Heart className="w-10 h-10 fill-white" style={{ color: primaryColor }} />
        </motion.div>
        <p className="text-sm uppercase tracking-[0.3em] mb-4 opacity-80">
          {content.tagline}
        </p>
        <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6">
          {content.mainText || event.couple_names || event.title.replace("Pernikahan ", "")}
        </h1>
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-16 h-px bg-white/50" />
          <Heart className="w-4 h-4 fill-white" style={{ color: primaryColor }} />
          <div className="w-16 h-px bg-white/50" />
        </div>
        {content.showGuestName && guestName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg opacity-90"
          >
            Special for: <span className="font-semibold">{guestName}</span>
          </motion.p>
        )}
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.05 }}
          className="mt-12 px-6 py-3 border-2 border-white rounded-full hover:bg-white hover:text-gray-800 transition-colors inline-flex items-center gap-2"
          style={{ borderColor: 'white' }}
        >
          Lihat Undangan
          <ChevronDown className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </section>
  );
}

interface DetailSectionProps {
  event: Event;
  content: TemplateContent["detail"];
  primaryColor: string;
  secondaryColor: string;
}

export function DetailSection({ event, content, primaryColor, secondaryColor }: DetailSectionProps) {
  return (
    <section className="min-h-screen py-20 px-4 bg-white relative">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-medium mb-2" style={{ color: primaryColor }}>{content.introTitle}</p>
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-gray-800 mb-8">
            {content.introTitle}
          </h2>
          <p className="text-gray-600 mb-12 leading-relaxed">
            {content.introText}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-6 mb-12"
        >
          <div className="p-8 rounded-2xl" style={{ backgroundColor: secondaryColor }}>
            <Calendar className="w-10 h-10 mx-auto mb-4" style={{ color: primaryColor }} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{content.dateLabel}</h3>
            <p className="text-gray-600">{formatDate(event.event_date)}</p>
          </div>

          <div className="p-8 rounded-2xl" style={{ backgroundColor: secondaryColor }}>
            <Clock className="w-10 h-10 mx-auto mb-4" style={{ color: primaryColor }} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{content.timeLabel}</h3>
            <p className="text-gray-600">
              {event.event_time ? formatTime(event.event_time) : "10:00 AM"}
            </p>
          </div>

          <div className="p-8 rounded-2xl" style={{ backgroundColor: secondaryColor }}>
            <MapPin className="w-10 h-10 mx-auto mb-4" style={{ color: primaryColor }} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{content.locationLabel}</h3>
            <p className="text-gray-600 mb-4">{event.location_name}</p>
            {event.maps_url && (
              <a
                href={event.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full hover:opacity-90 transition-colors text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <ExternalLink className="w-4 h-4" />
                {content.mapsButtonText}
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface GallerySectionProps {
  event: Event;
  content: TemplateContent["gallery"];
  primaryColor: string;
}

export function GallerySection({ event, content, primaryColor }: GallerySectionProps) {
  const images = event.gallery_images?.length
    ? event.gallery_images
      : [
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1526045478516-99145907081c?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=600&fit=crop",
      ];

  return (
    <section className="min-h-screen py-20 px-4" style={{ backgroundColor: secondaryColor }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Images className="w-10 h-10 mx-auto mb-4" style={{ color: primaryColor }} />
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-gray-800">
            {content.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl overflow-hidden relative aspect-square ${i === 0 ? "col-span-2 row-span-2" : ""}`}
            >
              <Image
                src={img}
                alt={`Gallery ${i + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500 rounded-xl"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const secondaryColor = "bg-gradient-to-b from-white to-primary-50";

export interface RSVPFormData {
  name: string;
  attendance: "hadir" | "tidak_hadir" | "";
  total_guests: number;
  message: string;
}

interface RSVPSectionProps {
  event: Event;
  content: TemplateContent["rsvp"];
  primaryColor: string;
  rsvpSubmitted: boolean;
  rsvpForm: RSVPFormData;
  onRsvpFormChange: (form: RSVPFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function RSVPSection({
  event,
  content,
  primaryColor,
  rsvpSubmitted,
  rsvpForm,
  onRsvpFormChange,
  onSubmit,
  isSubmitting,
}: RSVPSectionProps) {
  return (
    <section className="min-h-screen py-20 px-4 bg-white">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Users className="w-10 h-10 mx-auto mb-4" style={{ color: primaryColor }} />
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-gray-800 mb-4">
            {content.title}
          </h2>
          <p className="text-gray-500">
            {content.subtitle}
          </p>
        </motion.div>

        {rsvpSubmitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-8 rounded-2xl"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: primaryColor }}>
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {content.successTitle}
            </h3>
            <p className="text-gray-600">
              {content.successText}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={rsvpForm.name}
                onChange={(e) => onRsvpFormChange({ ...rsvpForm, name: e.target.value })}
                placeholder="Nama Anda"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
                required
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {content.attendanceLabel}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onRsvpFormChange({ ...rsvpForm, attendance: "hadir" })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    rsvpForm.attendance === "hadir"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Check className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">{content.hadirText}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onRsvpFormChange({ ...rsvpForm, attendance: "tidak_hadir" })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    rsvpForm.attendance === "tidak_hadir"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <X className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">{content.tidakHadirText}</span>
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
            {rsvpForm.attendance === "hadir" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Tamu (termasuk Anda)
                </label>
                <select
                  value={rsvpForm.total_guests}
                  onChange={(e) =>
                    onRsvpFormChange({ ...rsvpForm, total_guests: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} orang
                    </option>
                  ))}
                </select>
              </div>
            )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ucapan / Doa (Opsional)
              </label>
              <textarea
                value={rsvpForm.message}
                onChange={(e) => onRsvpFormChange({ ...rsvpForm, message: e.target.value })}
                placeholder="Tulis ucapan atau doa untuk kedua mempelai..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 resize-none"
                style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-white"
              style={{ backgroundColor: primaryColor }}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {content.submitButtonText}
            </button>
            </motion.div>
          </form>
        )}
      </div>
    </section>
  );
}

interface WishesSectionProps {
  rsvps: RSVP[];
  content: TemplateContent["wishes"];
  primaryColor: string;
}

export function WishesSection({ rsvps, content, primaryColor }: WishesSectionProps) {
  return (
    <section className="min-h-screen py-20 px-4" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Heart className="w-10 h-10 mx-auto mb-4" style={{ color: primaryColor }} />
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-gray-800 mb-4">
            {content.title}
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {rsvps.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-gray-500">
              <p>{content.emptyText}</p>
            </div>
          ) : (
            rsvps.map((rsvp, index) => (
              <motion.div
                key={rsvp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}
                  >
                    {rsvp.guest_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{rsvp.guest_name}</h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        rsvp.attendance_status === "hadir"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {rsvp.attendance_status === "hadir" ? "Hadir" : "Tidak Hadir"}
                    </span>
                  </div>
                </div>
                {rsvp.message && (
                  <p className="text-gray-600 text-sm leading-relaxed">{rsvp.message}</p>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
