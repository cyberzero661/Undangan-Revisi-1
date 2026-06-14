"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { eventsAPI, rsvpsAPI } from "@/lib/api";
import { Event } from "@/types/database";
import {
  Heart,
  Plus,
  Calendar,
  MapPin,
  Users,
  Eye,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Bell,
  ChevronRight,
  Loader2,
  AlertCircle,
  Share2,
} from "lucide-react";
import { useSupabaseOptional } from "@/lib/providers";

export default function DashboardPage() {
  const router = useRouter();
  const { supabase, isConfigured } = useSupabaseOptional();
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, { total: number; hadir: number; tidak_hadir: number }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [shareModal, setShareModal] = useState<{ event: Event; guestName: string } | null>(null);
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const loadData = useCallback(async () => {
    if (!supabase || !isConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const eventsData = await eventsAPI.getByUser(user.id);
      setEvents(eventsData);

      const counts: Record<string, { total: number; hadir: number; tidak_hadir: number }> = {};
      for (const event of eventsData) {
        try {
          const rsvps = await rsvpsAPI.getByEvent(event.id);
          counts[event.id] = {
            total: rsvps.length,
            hadir: rsvps.filter((r) => r.attendance_status === "hadir").length,
            tidak_hadir: rsvps.filter((r) => r.attendance_status === "tidak_hadir").length,
          };
        } catch {
          counts[event.id] = { total: 0, hadir: 0, tidak_hadir: 0 };
        }
      }
      setRsvpCounts(counts);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  }, [router, supabase, isConfigured]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus undangan ini?")) return;
    
    try {
      await eventsAPI.delete(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err.message || "Gagal menghapus");
    }
  };

  const filteredEvents = events.filter((event) => {
    if (activeTab === "all") return true;
    return event.status === activeTab;
  });

  const totalStats = {
    events: events.length,
    hadir: Object.values(rsvpCounts).reduce((sum, c) => sum + c.hadir, 0),
    tidakHadir: Object.values(rsvpCounts).reduce((sum, c) => sum + c.tidak_hadir, 0),
    menunggu: Object.values(rsvpCounts).reduce((sum, c) => sum + (c.total - c.hadir - c.tidak_hadir), 0),
  };

  const copyLink = (path: string) => {
    navigator.clipboard.writeText(`${origin}/${path}`);
    alert("Link berhasil disalin!");
  };

  const openShareModal = (event: Event) => {
    setShareModal({ event, guestName: "" });
  };

  const copyShareLink = () => {
    if (!shareModal) return;
    const guestPart = shareModal.guestName.trim() ? `?guest=${encodeURIComponent(shareModal.guestName.trim())}` : "";
    const fullLink = `${origin}/${shareModal.event.event_path}${guestPart}`;
    navigator.clipboard.writeText(fullLink);
    alert("Link berhasil disalin!");
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Konfigurasi Tidak Lengkap</h2>
          <p className="text-gray-500 mb-4">
            Pastikan file <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> sudah benar dengan credentials Supabase Anda.
          </p>
          <Link href="/" className="text-primary-600 hover:underline">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-primary-500 fill-primary-500" />
              <span className="text-xl font-bold font-playfair">Undangkuy</span>
            </Link>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 font-playfair">Dashboard</h1>
            <p className="text-gray-500 mt-1">Kelola semua undanganmu di sini</p>
          </div>
          <Link
            href="/editor/new"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
          >
            <Plus className="w-5 h-5" />
            Buat Undangan Baru
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{totalStats.events}</p>
                <p className="text-sm text-gray-500">Total Undangan</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{totalStats.hadir}</p>
                <p className="text-sm text-gray-500">Konfirmasi Hadir</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{totalStats.tidakHadir}</p>
                <p className="text-sm text-gray-500">Tidak Hadir</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{totalStats.menunggu}</p>
                <p className="text-sm text-gray-500">Menunggu</p>
              </div>
            </div>
          </motion.div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {(["all", "published", "draft"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "all" ? "Semua" : tab === "published" ? "Dipublikasi" : "Draf"}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100">
                  {tab === "all"
                    ? events.length
                    : events.filter((e) => e.status === tab).length}
                </span>
              </button>
            ))}
          </div>

          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-12 h-12 text-primary-500 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500">Memuat data...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Belum ada undangan</p>
                <Link
                  href="/editor/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Buat Undangan Baru
                </Link>
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className="w-16 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url(${event.cover_image || '/placeholder.jpg'})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 truncate">{event.title}</h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              event.status === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {event.status === "published" ? "Dipublikasi" : "Draf"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(event.event_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {rsvpCounts[event.id]?.total || 0} RSVP
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openShareModal(event)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Bagikan Link"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      <Link
                        href={`/${event.event_path}`}
                        target="_blank"
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Lihat Undangan"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link
                        href={`/editor/${event.id}`}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {rsvpCounts[event.id]?.hadir || 0} Hadir
                      </span>
                      <span className="flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-red-500" />
                        {rsvpCounts[event.id]?.tidak_hadir || 0} Tidak Hadir
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <AnimatePresence>
          {shareModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShareModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Bagikan Undangan</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Tamu (opsional)</label>
                    <input
                      type="text"
                      value={shareModal.guestName}
                      onChange={(e) => setShareModal({ ...shareModal, guestName: e.target.value })}
                      placeholder="Contoh: Budi, Siti, Ahmad"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Kosongkan jika ingin link tanpa nama tamu</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preview Link</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 break-all">
                      {origin}/{shareModal.event.event_path}{shareModal.guestName.trim() ? `?guest=${encodeURIComponent(shareModal.guestName.trim())}` : ""}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShareModal(null)}
                      className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      onClick={copyShareLink}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Salin Link
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
