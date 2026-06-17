"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { eventsAPI, rsvpsAPI } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { Event, RSVP } from "@/types/database";
import { TemplateContent, getDefaultContent, TemplateSection, mergeWithDefaults } from "@/types/template";
import { ModernTemplate, RusticTemplate, TraditionalTemplate, MinimalistTemplate } from "@/components/templates/TemplateRenderer";
import { RSVPFormData } from "@/components/templates/TemplateSections";
import {
  Heart,
  Volume2,
  VolumeX,
  ChevronDown,
  Flower2,
  CloudSnow,
  Sparkles,
  Crown,
} from "lucide-react";
import { BrandedLoading } from "@/components/shared/BrandedLoading";

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function InvitationPage({ params }: { params: { event_path: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [guestName, setGuestName] = useState("");
  const [showGuestModal, setShowGuestModal] = useState(true);
  const [rsvpForm, setRsvpForm] = useState<RSVPFormData>({
    name: "",
    attendance: "" as "hadir" | "tidak_hadir" | "",
    total_guests: 1,
    message: "",
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [templateContent, setTemplateContent] = useState<TemplateContent>(getDefaultContent());
  const [templatePrimaryColor, setTemplatePrimaryColor] = useState("#D4AF37");
  const [templateSecondaryColor, setTemplateSecondaryColor] = useState("#F5F5DC");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      x: seededRandom(i * 1.1) * 100,
      y: seededRandom(i * 2.2) * 100,
      rotate: seededRandom(i * 3.3) * 360,
      rotateEnd: seededRandom(i * 4.4) * 720,
      duration: seededRandom(i * 5.5) * 10 + 10,
      delay: seededRandom(i * 6.6) * 5,
    }));
  }, []);

  useEffect(() => {
    loadEventData();
  }, [params.event_path]);

  const loadEventData = async () => {
    try {
      setIsLoading(true);
      const eventPath = params.event_path;
      const urlParams = new URLSearchParams(window.location.search);
      const guestNameParam = urlParams.get("guest");

      const eventData = await eventsAPI.getByPath(eventPath);
      setEvent(eventData);

      const rsvpsData = await rsvpsAPI.getByEvent(eventData.id);
      setRsvps(rsvpsData);

      // Load template content from database
      setTemplateContent(mergeWithDefaults(eventData.template_content));
      const styles = eventData.template_styles as { primaryColor?: string; secondaryColor?: string } | null;
      if (styles?.primaryColor) setTemplatePrimaryColor(styles.primaryColor);
      if (styles?.secondaryColor) setTemplateSecondaryColor(styles.secondaryColor);

      if (guestNameParam) {
        const decodedName = decodeURIComponent(guestNameParam);
        setGuestName(decodedName);
        setShowGuestModal(false);
      } else if (eventData.guest_names && eventData.guest_names.length > 0) {
        setShowGuestModal(true);
      } else {
        setShowGuestModal(false);
        setIsOpened(true);
      }
    } catch (err: any) {
      setError(err.message || "Undangan tidak ditemukan");
    } finally {
      setIsLoading(false);
    }
  };

  const closeGuestModal = () => {
    setShowGuestModal(false);
  };

  const openInvitation = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpForm.name || !rsvpForm.attendance || !event) return;
    try {
      setIsSubmitting(true);
      await rsvpsAPI.create({
        event_id: event.id,
        guest_name: rsvpForm.name,
        attendance_status: rsvpForm.attendance,
        total_guests: rsvpForm.total_guests,
        message: rsvpForm.message || undefined,
      });
      const updatedRsvps = await rsvpsAPI.getByEvent(event.id);
      setRsvps(updatedRsvps);
      setRsvpSubmitted(true);
      setTimeout(() => {
        setRsvpSubmitted(false);
        setRsvpForm({ name: "", attendance: "", total_guests: 1, message: "" });
      }, 3000);
    } catch (err: any) {
      toast(err.message || "Gagal mengirim konfirmasi", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = ["cover", "detail", "gallery", "rsvp", "wishes"];
  const scrollToSection = (index: number) => {
    setCurrentSection(index);
    const element = document.getElementById(sections[index]);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <BrandedLoading size="lg" text="Memuat undangan..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Undangan Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-4">
            {error || "Maaf, undangan yang kamu cari tidak ditemukan atau sudah dihapus."}
          </p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  const templateProps = {
    event,
    rsvps,
    templateContent,
    primaryColor: templatePrimaryColor,
    secondaryColor: templateSecondaryColor,
    guestName,
    isOpened,
    onOpen: openInvitation,
    rsvpForm,
    onRsvpFormChange: setRsvpForm,
    onRsvpSubmit: handleRSVP,
    rsvpSubmitted,
    isSubmitting,
  };

  const renderTemplate = () => {
    const tid = event.template_id || "modern-1";
    if (tid.startsWith("rustik")) return <RusticTemplate {...templateProps} />;
    if (tid.startsWith("tradisional")) return <TraditionalTemplate {...templateProps} />;
    if (tid.startsWith("minimalis")) return <MinimalistTemplate {...templateProps} />;
    return <ModernTemplate {...templateProps} />;
  };

  const currentEffect = event.background_effect || "sparkle";

  const EffectIcon: React.ComponentType<{ className?: string }> | null = (() => {
    switch (currentEffect) {
      case "flowers": return Flower2;
      case "snow": return CloudSnow;
      case "sparkle": return Sparkles;
      case "gradient": return Sparkles;
      case "ornament": return Crown;
      default: return null;
    }
  })();

  const effectColor = (() => {
    switch (currentEffect) {
      case "flowers": return "text-pink-400";
      case "snow": return "text-blue-300";
      case "sparkle": return "text-yellow-400";
      case "gradient": return "text-orange-400";
      case "ornament": return "text-yellow-500";
      default: return "";
    }
  })();

  return (
    <div className="min-h-screen overflow-x-hidden">
      {event.music_url && (
        <audio ref={audioRef} loop muted={isMuted}>
          <source src={event.music_url} type="audio/mpeg" />
        </audio>
      )}

      {/* Floating controls */}
      {isOpened && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => scrollToSection(Math.max(0, currentSection - 1))}
            className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
          >
            <ChevronDown className="w-5 h-5 rotate-180" />
          </button>
          <button
            onClick={() => scrollToSection(Math.min(sections.length - 1, currentSection + 1))}
            className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Background particles */}
      {isOpened && EffectIcon && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className={`absolute ${effectColor} text-2xl`}
              initial={{ x: `${p.x}%`, y: "100vh", rotate: p.rotate }}
              animate={{ y: "-100vh", rotate: p.rotateEnd }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
            >
              <EffectIcon className="w-6 h-6" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Guest name modal */}
      <AnimatePresence>
        {showGuestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
            >
              <Heart className="w-12 h-12 text-primary-500 mx-auto mb-4 fill-primary-500" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Halo, Tamu Undangan!</h2>
              <p className="text-gray-500 mb-4">Pilih atau masukkan namamu</p>
              {event?.guest_names && event.guest_names.length > 0 ? (
                <select
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Pilih nama Anda</option>
                  {event.guest_names.map((name, i) => (
                    <option key={i} value={name}>{name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Nama kamu"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              )}
              <button
                onClick={closeGuestModal}
                disabled={!guestName.trim()}
                className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lihat Undangan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render template */}
      <div className="relative z-10">
        {renderTemplate()}
      </div>
    </div>
  );
}
