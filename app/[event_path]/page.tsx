"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, formatTime } from "@/lib/utils";
import { eventsAPI, rsvpsAPI, wishesAPI } from "@/lib/api";
import { Event, RSVP, Wish, LoveStory, DigitalEnvelopeItem } from "@/types";
import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  Send,
  Check,
  X,
  Loader2,
  Users,
  MessageCircle,
  Gift,
  Image as ImageIcon,
  Home,
  Youtube,
} from "lucide-react";

import CountdownTimer from "@/components/invitation/CountdownTimer";
import CoupleSection from "@/components/invitation/CoupleSection";
import LoveStoryComponent from "@/components/invitation/LoveStory";
import DigitalEnvelope from "@/components/invitation/DigitalEnvelope";
import FloatingNav from "@/components/invitation/FloatingNav";
import GoogleMapEmbed from "@/components/invitation/GoogleMapEmbed";
import YouTubeLive from "@/components/invitation/YouTubeLive";
import QRCheckIn from "@/components/invitation/QRCheckIn";
import SaveToCalendar from "@/components/invitation/SaveToCalendar";
import WhatsAppShare from "@/components/invitation/WhatsAppShare";
import WishesForm from "@/components/invitation/WishesForm";
import WishesStats from "@/components/invitation/WishesStats";

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function InvitationPage({ params }: { params: { event_path: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [showGuestModal, setShowGuestModal] = useState(true);
  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    attendance: "" as "hadir" | "tidak_hadir" | "",
    total_guests: 1,
    message: "",
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      const eventData = await eventsAPI.getByPath(eventPath) as any;
      setEvent(eventData);

      try {
        const rsvpsData = await rsvpsAPI.getByEvent(eventData.id);
        setRsvps(rsvpsData);
      } catch {}

      try {
        const wishesData = await wishesAPI.getByEvent(eventData.id);
        setWishes(wishesData);
      } catch {}

      if (guestNameParam) {
        const decodedName = decodeURIComponent(guestNameParam);
        setGuestName(decodedName);
        setShowGuestModal(false);
        setIsOpened(true);
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

  const refreshWishes = async () => {
    if (!event) return;
    try {
      const wishesData = await wishesAPI.getByEvent(event.id);
      setWishes(wishesData);
    } catch {}
  };

  const refreshRSVPs = async () => {
    if (!event) return;
    try {
      const updatedRsvps = await rsvpsAPI.getByEvent(event.id);
      setRsvps(updatedRsvps);
    } catch {}
  };

  const openInvitation = () => {
    setIsOpened(true);
    setShowGuestModal(false);
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

      await refreshRSVPs();

      setRsvpSubmitted(true);
      setTimeout(() => {
        setRsvpSubmitted(false);
        setRsvpForm({ name: "", attendance: "", total_guests: 1, message: "" });
      }, 3000);
    } catch (err: any) {
      alert(err.message || "Gagal mengirim konfirmasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loveStories: LoveStory[] = event?.love_stories?.length
    ? (event.love_stories as LoveStory[])
    : [];

  const digitalEnvelope: DigitalEnvelopeItem[] = event?.digital_envelope?.length
    ? (event.digital_envelope as DigitalEnvelopeItem[])
    : [];

  const invUrl = typeof window !== "undefined" ? window.location.origin + "/" + event?.event_path : "";

  const navSections = [
    { id: "cover", label: "Beranda", icon: <Home className="w-4 h-4" /> },
    { id: "couple", label: "Mempelai", icon: <Heart className="w-4 h-4" /> },
    { id: "countdown", label: "Hitung Mundur", icon: <Clock className="w-4 h-4" /> },
    { id: "detail", label: "Acara", icon: <Calendar className="w-4 h-4" /> },
    ...(loveStories.length > 0 ? [{ id: "lovestory", label: "Cerita Cinta", icon: <Heart className="w-4 h-4" /> }] : []),
    { id: "gallery", label: "Galeri", icon: <ImageIcon className="w-4 h-4" /> },
    ...(event?.youtube_live_url ? [{ id: "livestream", label: "Live", icon: <Youtube className="w-4 h-4" /> }] : []),
    { id: "rsvp", label: "RSVP", icon: <Users className="w-4 h-4" /> },
    { id: "wishes", label: "Ucapan", icon: <MessageCircle className="w-4 h-4" /> },
    ...(digitalEnvelope.length > 0 ? [{ id: "envelope", label: "Amplop", icon: <Gift className="w-4 h-4" /> }] : []),
  ];

  const backgroundEffects: Record<string, { emoji: string; color: string }> = {
    flowers: { emoji: "🌸", color: "text-pink-400" },
    snow: { emoji: "❄️", color: "text-blue-300" },
    sparkle: { emoji: "✨", color: "text-yellow-400" },
    gradient: { emoji: "🌅", color: "text-orange-400" },
    ornament: { emoji: "👑", color: "text-yellow-500" },
    none: { emoji: "", color: "" },
  };

  const currentEffect = event
    ? backgroundEffects[event.background_effect || "sparkle"] || backgroundEffects.sparkle
    : backgroundEffects.sparkle;

  if (isLoading) {
    return (
      <div className="min-h-screen vintage-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-vintage-gold mx-auto mb-4 animate-spin" />
          <p className="font-kalam text-vintage-brown">Memuat undangan...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen vintage-bg flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Heart className="w-16 h-16 text-vintage-beige mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-vintage-darkBrown mb-2 font-cormorant">Undangan Tidak Ditemukan</h1>
          <p className="text-vintage-brown mb-4 font-kalam">
            {error || "Maaf, undangan yang kamu cari tidak ditemukan atau sudah dihapus."}
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-vintage-gold to-vintage-darkGold text-white rounded-full font-kalam hover:shadow-lg transition-shadow"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen vintage-bg overflow-x-hidden">
      {event.music_url && (
        <audio ref={audioRef} loop muted={isMuted}>
          <source src={event.music_url} type="audio/mpeg" />
        </audio>
      )}

      {isOpened && (
        <FloatingNav
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          sections={navSections}
        />
      )}

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
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-vintage-beige"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-vintage-gold to-vintage-darkGold flex items-center justify-center">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <h2 className="text-xl font-bold text-vintage-darkBrown mb-2 font-cormorant">
                Assalamu&apos;alaikum
              </h2>
              <p className="text-vintage-brown mb-4 font-kalam">Pilih atau masukkan namamu</p>
              {event?.guest_names && event.guest_names.length > 0 ? (
                <select
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 border border-vintage-beige rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 font-kalam text-vintage-darkBrown"
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
                  className="w-full px-4 py-3 border border-vintage-beige rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 font-kalam text-vintage-darkBrown"
                />
              )}
              <button
                onClick={openInvitation}
                disabled={!guestName.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-vintage-gold to-vintage-darkGold text-white rounded-xl font-kalam font-semibold shadow-lg shadow-vintage-gold/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buka Undangan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpened ? (
        <section className="min-h-screen flex items-center justify-center p-4 vintage-bg">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <div
                className="w-64 h-80 rounded-3xl shadow-2xl mx-auto relative overflow-hidden envelope-float"
                style={{
                  backgroundImage: `url(${event.cover_image || "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-vintage-parchment/80 to-vintage-cream/80" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vintage-gold to-vintage-darkGold flex items-center justify-center shadow-lg">
                    <Heart className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-4 right-4 text-center">
                  <p className="font-kalam text-vintage-darkBrown text-sm">Kepada Yth.</p>
                  <p className="font-cormorant text-vintage-darkBrown font-bold text-lg mt-1">
                    {guestName || "Tamu Undangan"}
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.button
              onClick={openInvitation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-vintage-gold to-vintage-darkGold text-white rounded-full font-kalam font-semibold shadow-lg shadow-vintage-gold/30 hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              <Heart className="w-5 h-5 fill-white" />
              Buka Undangan
            </motion.button>
          </motion.div>
        </section>
      ) : (
        <>
          {currentEffect.emoji && (
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
              {particles.map((p, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${currentEffect.color} text-2xl`}
                  initial={{
                    x: `${p.x}%`,
                    y: "100vh",
                    rotate: p.rotate,
                  }}
                  animate={{
                    y: "-100vh",
                    rotate: p.rotateEnd,
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    delay: p.delay,
                  }}
                >
                  {currentEffect.emoji}
                </motion.div>
              ))}
            </div>
          )}

          {/* SECTION: Cover */}
          <section id="cover" className="min-h-screen flex items-center justify-center relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.cover_image || "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=1800&fit=crop"})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 text-center text-white p-8"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-kalam text-sm md:text-base mb-4 tracking-widest uppercase opacity-90"
              >
                The Wedding of
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-cormorant text-4xl md:text-7xl font-bold mb-4"
              >
                {event.couple_names || event.title.replace("Pernikahan ", "")}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="ornamental-divider mb-6"
              >
                <Heart className="w-5 h-5 fill-white text-white" />
              </motion.div>
              {guestName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="font-kalam text-lg opacity-90 mb-8"
                >
                  Kepada Yth. <span className="font-semibold">{guestName}</span>
                </motion.p>
              )}
              <motion.button
                onClick={() => {
                  const el = document.getElementById("couple");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 border-2 border-white/80 rounded-full hover:bg-white hover:text-vintage-darkBrown transition-colors inline-flex items-center gap-2 font-kalam"
              >
                Lihat Undangan
                <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.button>
            </motion.div>
          </section>

          {/* SECTION: Couple */}
          <CoupleSection
            brideName={event.bride_name}
            groomName={event.groom_name}
            bridePhoto={event.bride_photo}
            groomPhoto={event.groom_photo}
            brideParentName={event.bride_parent_name}
            groomParentName={event.groom_parent_name}
            coupleNames={event.couple_names}
            title={event.event_type === "pernikahan" ? "The Wedding of" : undefined}
          />

          {/* SECTION: Countdown */}
          <section id="countdown" className="py-20 px-4 bg-white relative">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-cormorant text-3xl md:text-5xl font-bold text-vintage-darkBrown mb-3">
                  Menuju Hari Bahagia
                </h2>
                <p className="font-kalam text-vintage-brown mb-10">
                  Menghitung hari menuju momen istimewa kami
                </p>
                <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} />
              </motion.div>
            </div>
          </section>

          {/* SECTION: Event Details */}
          <section id="detail" className="py-20 px-4 vintage-bg relative">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="font-kalam text-vintage-gold text-base mb-2">Dengan penuh rasa syukur</p>
                <h2 className="font-cormorant text-3xl md:text-4xl font-bold text-vintage-darkBrown mb-4">
                  Kami Mengundang Anda
                </h2>
                <p className="font-kalam text-vintage-brown mb-10 leading-relaxed max-w-md mx-auto">
                  Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir
                  dalam acara spesial kami.
                </p>
                <div className="ornamental-divider mb-10">
                  <span className="text-vintage-gold text-xl">&#10047;</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="vintage-card p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-vintage-gold/10 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-7 h-7 text-vintage-gold" />
                  </div>
                  <h3 className="font-cormorant text-xl font-semibold text-vintage-darkBrown mb-2">Tanggal</h3>
                  <p className="font-kalam text-vintage-brown text-lg">{formatDate(event.event_date)}</p>
                </div>

                <div className="vintage-card p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-vintage-gold/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-7 h-7 text-vintage-gold" />
                  </div>
                  <h3 className="font-cormorant text-xl font-semibold text-vintage-darkBrown mb-2">Waktu</h3>
                  <p className="font-kalam text-vintage-brown text-lg">
                    {event.event_time ? formatTime(event.event_time) : "10:00 WIB"}
                  </p>
                </div>

                <div className="vintage-card p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-vintage-gold/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-7 h-7 text-vintage-gold" />
                  </div>
                  <h3 className="font-cormorant text-xl font-semibold text-vintage-darkBrown mb-2">Lokasi</h3>
                  <p className="font-kalam text-vintage-brown mb-2">{event.location_name}</p>
                  {event.maps_url && (
                    <GoogleMapEmbed
                      mapsUrl={event.maps_url}
                      locationName={event.location_name}
                    />
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8"
              >
                <SaveToCalendar
                  title={event.title}
                  date={event.event_date}
                  time={event.event_time}
                  location={event.location_name}
                />
              </motion.div>
            </div>
          </section>

          {/* SECTION: Love Story */}
          {loveStories.length > 0 && (
            <LoveStoryComponent stories={loveStories} />
          )}

          {/* SECTION: Gallery */}
          <section id="gallery" className="py-20 px-4 vintage-bg">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-cormorant text-3xl md:text-5xl font-bold text-vintage-darkBrown mb-3">
                  Galeri Momen
                </h2>
                <p className="font-kalam text-vintage-brown">
                  Momen-momen indah yang kami abadikan
                </p>
                <div className="ornamental-divider mt-4">
                  <span className="text-vintage-gold text-xl">&#10047;</span>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.gallery_images?.length ? (
                  event.gallery_images.map((img, i) => {
                    const tiltClass = `scrapbook-tilt-${(i % 4) + 1}`;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`rounded-2xl overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""} ${tiltClass}`}
                      >
                        <div className={`polaroid-frame ${i === 0 ? "" : "pb-4"}`}>
                          <img
                            src={img}
                            alt={`Gallery ${i + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  [...Array(6)].map((_, i) => {
                    const tiltClass = `scrapbook-tilt-${(i % 4) + 1}`;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`rounded-2xl overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""} ${tiltClass}`}
                      >
                        <div className="polaroid-frame">
                          <img
                            src={`https://images.unsplash.com/photo-${
                              ["1519741497674-611481863552", "1511285560929-80b456fea0bc", "1460978812857-470ed1c77af0", "1522673607200-164d1b6ce486", "1515934753879-df5c3c63b69c", "1507003211169-0a1dd7228f2d"][i]
                            }?w=600&h=600&fit=crop`}
                            alt={`Gallery ${i + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          {/* SECTION: YouTube Live */}
          {event.youtube_live_url && (
            <YouTubeLive
              youtubeUrl={event.youtube_live_url}
              title={`Live Streaming ${event.couple_names || event.title}`}
            />
          )}

          {/* SECTION: RSVP */}
          <section id="rsvp" className="py-20 px-4 bg-white">
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <div className="w-14 h-14 rounded-full bg-vintage-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-vintage-gold" />
                </div>
                <h2 className="font-cormorant text-3xl md:text-4xl font-bold text-vintage-darkBrown mb-3">
                  Konfirmasi Kehadiran
                </h2>
                <p className="font-kalam text-vintage-brown">
                  Silakan isi form di bawah ini untuk mengkonfirmasi kehadiran Anda
                </p>
                <div className="ornamental-divider mt-4">
                  <span className="text-vintage-gold text-xl">&#10047;</span>
                </div>
              </motion.div>

              {rsvpSubmitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center p-8 bg-green-50 rounded-2xl border border-green-200"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-cormorant text-xl font-semibold text-green-800 mb-2">
                    Terima Kasih!
                  </h3>
                  <p className="font-kalam text-green-600">
                    Konfirmasi Anda telah kami terima. Sampai jumpa di acara kami!
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleRSVP} className="space-y-4">
                  <div>
                    <label className="block font-kalam text-sm text-vintage-brown mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={rsvpForm.name}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                      placeholder="Nama Anda"
                      className="w-full px-4 py-3 bg-vintage-cream border border-vintage-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 font-kalam text-vintage-darkBrown placeholder:text-vintage-brown/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-kalam text-sm text-vintage-brown mb-2">
                      Konfirmasi Kehadiran
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRsvpForm({ ...rsvpForm, attendance: "hadir" })}
                        className={`p-4 rounded-xl border-2 transition-all font-kalam ${
                          rsvpForm.attendance === "hadir"
                            ? "border-green-400 bg-green-50 text-green-700"
                            : "border-vintage-beige hover:border-vintage-gold/50"
                        }`}
                      >
                        <Check className="w-6 h-6 mx-auto mb-2" />
                        <span className="font-medium">Hadir</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpForm({ ...rsvpForm, attendance: "tidak_hadir" })}
                        className={`p-4 rounded-xl border-2 transition-all font-kalam ${
                          rsvpForm.attendance === "tidak_hadir"
                            ? "border-red-400 bg-red-50 text-red-700"
                            : "border-vintage-beige hover:border-vintage-gold/50"
                        }`}
                      >
                        <X className="w-6 h-6 mx-auto mb-2" />
                        <span className="font-medium">Tidak Hadir</span>
                      </button>
                    </div>
                  </div>

                  {rsvpForm.attendance === "hadir" && (
                    <div>
                      <label className="block font-kalam text-sm text-vintage-brown mb-2">
                        Jumlah Tamu (termasuk Anda)
                      </label>
                      <select
                        value={rsvpForm.total_guests}
                        onChange={(e) =>
                          setRsvpForm({ ...rsvpForm, total_guests: parseInt(e.target.value) })
                        }
                        className="w-full px-4 py-3 bg-vintage-cream border border-vintage-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 font-kalam text-vintage-darkBrown"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "orang" : "orang"}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block font-kalam text-sm text-vintage-brown mb-2">
                      Ucapan / Doa (Opsional)
                    </label>
                    <textarea
                      value={rsvpForm.message}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                      placeholder="Tulis ucapan atau doa untuk kedua mempelai..."
                      rows={4}
                      className="w-full px-4 py-3 bg-vintage-cream border border-vintage-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 font-kalam text-vintage-darkBrown placeholder:text-vintage-brown/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-vintage-gold to-vintage-darkGold text-white rounded-xl font-kalam font-semibold shadow-lg shadow-vintage-gold/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    Kirim Konfirmasi
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* SECTION: Wishes */}
          <section id="wishes" className="py-20 px-4 vintage-bg">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <div className="w-14 h-14 rounded-full bg-vintage-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-vintage-gold" />
                </div>
                <h2 className="font-cormorant text-3xl md:text-4xl font-bold text-vintage-darkBrown mb-3">
                  Ucapan & Doa
                </h2>
                <p className="font-kalam text-vintage-brown">
                  Berikan ucapan dan doa terbaik untuk kedua mempelai
                </p>
                <div className="ornamental-divider mt-4">
                  <span className="text-vintage-gold text-xl">&#10047;</span>
                </div>
              </motion.div>

              <WishesStats
                totalWishes={wishes.length}
                totalAttending={rsvps.filter(r => r.attendance_status === "hadir").length}
                totalDeclined={rsvps.filter(r => r.attendance_status === "tidak_hadir").length}
              />

              <div className="max-w-md mx-auto mb-10">
                <WishesForm eventId={event.id} onWishSent={refreshWishes} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {wishes.length === 0 && rsvps.filter(r => r.message).length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <p className="font-kalam text-vintage-brown">
                      Belum ada ucapan. Jadilah yang pertama!
                    </p>
                  </div>
                ) : (
                  <>
                    {wishes.map((wish, index) => (
                      <motion.div
                        key={wish.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="wishes-card"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vintage-gold to-vintage-darkGold flex items-center justify-center text-white font-cormorant font-bold text-lg">
                            {wish.guest_name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-cormorant font-semibold text-vintage-darkBrown">{wish.guest_name}</h4>
                            <span className="font-kalam text-xs text-vintage-brown">
                              {new Date(wish.submitted_at).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                        </div>
                        <p className="font-kalam text-vintage-brown text-sm leading-relaxed">{wish.message}</p>
                      </motion.div>
                    ))}
                    {rsvps.filter(r => r.message).map((rsvp, index) => (
                      <motion.div
                        key={`rsvp-${rsvp.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (wishes.length + index) * 0.05 }}
                        className="wishes-card"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vintage-gold to-vintage-darkGold flex items-center justify-center text-white font-cormorant font-bold text-lg">
                            {rsvp.guest_name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-cormorant font-semibold text-vintage-darkBrown">{rsvp.guest_name}</h4>
                            <span className={`font-kalam text-xs px-2 py-0.5 rounded-full ${
                              rsvp.attendance_status === "hadir"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              {rsvp.attendance_status === "hadir" ? "Hadir" : "Tidak Hadir"}
                            </span>
                          </div>
                        </div>
                        <p className="font-kalam text-vintage-brown text-sm leading-relaxed">{rsvp.message}</p>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </section>

          {/* SECTION: Digital Envelope */}
          {digitalEnvelope.length > 0 && (
            <DigitalEnvelope
              items={digitalEnvelope}
              coupleNames={event.couple_names || event.title}
            />
          )}

          {/* SECTION: Footer */}
          <footer className="py-16 px-4 bg-vintage-darkBrown text-center relative">
            <div className="max-w-md mx-auto">
              {event && (
                <>
                  <QRCheckIn url={invUrl} eventName={event.title} />
                  <div className="my-8">
                    <WhatsAppShare
                      url={invUrl}
                      coupleNames={event.couple_names}
                      guestName={guestName}
                    />
                  </div>
                </>
              )}
              <div className="ornamental-divider mb-6">
                <Heart className="w-5 h-5 text-vintage-gold fill-vintage-gold" />
              </div>
              <p className="font-cormorant text-vintage-gold text-lg font-semibold mb-2">
                Undangkuy
              </p>
              <p className="font-kalam text-vintage-brown/60 text-sm">
                Dibuat dengan cinta di Indonesia
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

