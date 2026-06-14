"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, formatTime } from "@/lib/utils";
import { eventsAPI, rsvpsAPI } from "@/lib/api";
import { Event, RSVP } from "@/types/database";
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
      
      const eventData = await eventsAPI.getByPath(eventPath);
      setEvent(eventData);
      
      const rsvpsData = await rsvpsAPI.getByEvent(eventData.id);
      setRsvps(rsvpsData);
      
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
      
      const updatedRsvps = await rsvpsAPI.getByEvent(event.id);
      setRsvps(updatedRsvps);
      
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Memuat undangan...</p>
        </div>
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
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  const backgroundEffects: Record<string, { emoji: string; color: string }> = {
    flowers: { emoji: "🌸", color: "text-pink-400" },
    snow: { emoji: "❄️", color: "text-blue-300" },
    sparkle: { emoji: "✨", color: "text-yellow-400" },
    gradient: { emoji: "🌅", color: "text-orange-400" },
    ornament: { emoji: "👑", color: "text-yellow-500" },
    none: { emoji: "", color: "" },
  };

  const currentEffect = backgroundEffects[event.background_effect] || backgroundEffects.sparkle;

  const sections = ["cover", "detail", "gallery", "rsvp", "wishes"];
  const scrollToSection = (index: number) => {
    setCurrentSection(index);
    const element = document.getElementById(sections[index]);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white overflow-x-hidden">
      {event.music_url && (
        <audio ref={audioRef} loop muted={isMuted}>
          <source src={event.music_url} type="audio/mpeg" />
        </audio>
      )}

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
                onClick={openInvitation}
                disabled={!guestName.trim()}
                className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buka Undangan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpened ? (
        <section className="min-h-screen flex items-center justify-center p-4">
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
                  backgroundImage: `url(${event.cover_image || event.template_id})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary-100/80 to-primary-200/80" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Heart className="w-16 h-16 text-primary-500 fill-primary-300" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-sm text-primary-700 font-medium">You&apos;re Invited!</p>
                </div>
              </div>
            </motion.div>
            <motion.button
              onClick={openInvitation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-8 py-4 bg-primary-600 text-white rounded-full font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
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

          <section id="cover" className="min-h-screen flex items-center justify-center relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.cover_image || event.template_id})` }}
            />
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
                <Heart className="w-10 h-10 fill-white" />
              </motion.div>
              <p className="text-sm uppercase tracking-[0.3em] mb-4 opacity-80">
                The Wedding of
              </p>
              <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6">
                {event.couple_names || event.title.replace("Pernikahan ", "")}
              </h1>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-16 h-px bg-white/50" />
                <Heart className="w-4 h-4 fill-white" />
                <div className="w-16 h-px bg-white/50" />
              </div>
              {guestName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg opacity-90"
                >
                  Special for: <span className="font-semibold">{guestName}</span>
                </motion.p>
              )}
              <motion.button
                onClick={() => scrollToSection(1)}
                whileHover={{ scale: 1.05 }}
                className="mt-12 px-6 py-3 border-2 border-white rounded-full hover:bg-white hover:text-gray-800 transition-colors inline-flex items-center gap-2"
              >
                Lihat Undangan
                <ChevronDown className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </section>

          <section id="detail" className="min-h-screen py-20 px-4 bg-white relative">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-primary-600 font-medium mb-2">With Joyful Hearts</p>
                <h2 className="text-3xl md:text-4xl font-bold font-playfair text-gray-800 mb-8">
                  Kami Mengundang Anda
                </h2>
                <p className="text-gray-600 mb-12 leading-relaxed">
                  Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir
                  dalam acara spesial kami. Kehadiran dan doa restu Anda adalah hadiah terindah
                  bagi kami.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid gap-6 mb-12"
              >
                <div className="p-8 bg-primary-50 rounded-2xl">
                  <Calendar className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Tanggal</h3>
                  <p className="text-gray-600">{formatDate(event.event_date)}</p>
                </div>

                <div className="p-8 bg-primary-50 rounded-2xl">
                  <Clock className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Waktu</h3>
                  <p className="text-gray-600">
                    {event.event_time ? formatTime(event.event_time) : "10:00 AM"}
                  </p>
                </div>

                <div className="p-8 bg-primary-50 rounded-2xl">
                  <MapPin className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Lokasi</h3>
                  <p className="text-gray-600 mb-4">{event.location_name}</p>
                  {event.maps_url && (
                    <a
                      href={event.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Buka di Maps
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </section>

          <section id="gallery" className="min-h-screen py-20 px-4 bg-gradient-to-b from-white to-primary-50">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <Images className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold font-playfair text-gray-800">
                  Galeri Momen
                </h2>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.gallery_images?.length ? (
                  event.gallery_images.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={`rounded-2xl overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                    >
                      <img
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </motion.div>
                  ))
                ) : (
                  [...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={`rounded-2xl overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                    >
                      <img
                        src={`https://images.unsplash.com/photo-${
                          ["1519741497674-611481863552", "1511285560929-80b456fea0bc", "1460978812857-470ed1c77af0", "1522673607200-164d1b6ce486", "1515934753879-df5c3c63b69c", "1507003211169-0a1dd7228f2d"][i]
                        }?w=600&h=600&fit=crop`}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section id="rsvp" className="min-h-screen py-20 px-4 bg-white">
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <Users className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold font-playfair text-gray-800 mb-4">
                  Konfirmasi Kehadiran
                </h2>
                <p className="text-gray-500">
                  Silakan isi form di bawah ini untuk mengkonfirmasi kehadiran Anda
                </p>
              </motion.div>

              {rsvpSubmitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center p-8 bg-green-50 rounded-2xl"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    Terima Kasih!
                  </h3>
                  <p className="text-green-600">
                    Konfirmasi Anda telah kami terima. Sampai jumpa di acara kami!
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleRSVP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={rsvpForm.name}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                      placeholder="Nama Anda"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Kehadiran
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRsvpForm({ ...rsvpForm, attendance: "hadir" })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          rsvpForm.attendance === "hadir"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Check className="w-6 h-6 mx-auto mb-2" />
                        <span className="font-medium">Hadir</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpForm({ ...rsvpForm, attendance: "tidak_hadir" })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          rsvpForm.attendance === "tidak_hadir"
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <X className="w-6 h-6 mx-auto mb-2" />
                        <span className="font-medium">Tidak Hadir</span>
                      </button>
                    </div>
                  </div>

                  {rsvpForm.attendance === "hadir" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jumlah Tamu (termasuk Anda)
                      </label>
                      <select
                        value={rsvpForm.total_guests}
                        onChange={(e) =>
                          setRsvpForm({ ...rsvpForm, total_guests: parseInt(e.target.value) })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ucapan / Doa (Opsional)
                    </label>
                    <textarea
                      value={rsvpForm.message}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                      placeholder="Tulis ucapan atau doa untuk kedua mempelai..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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

          <section id="wishes" className="min-h-screen py-20 px-4 bg-gradient-to-b from-white to-primary-50">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <Heart className="w-10 h-10 text-primary-600 mx-auto mb-4 fill-primary-100" />
                <h2 className="text-3xl md:text-4xl font-bold font-playfair text-gray-800 mb-4">
                  Ucapan & Doa
                </h2>
              </motion.div>

              <div className="grid gap-4 md:grid-cols-2">
                {rsvps.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-gray-500">
                    <p>Belum ada ucapan. Jadilah yang pertama!</p>
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
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
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

          <footer className="py-8 text-center bg-gray-900 text-white">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-primary-400 fill-primary-400" />
              <span className="font-playfair font-semibold">Undangkuy</span>
            </div>
            <p className="text-gray-400 text-sm">
              Dibuat dengan cinta di Indonesia
            </p>
          </footer>
        </>
      )}
    </div>
  );
}
