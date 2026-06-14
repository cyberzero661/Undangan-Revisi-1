"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Save, ArrowLeft, Calendar, MapPin, Music, Image as Images,
  Palette, Info, Upload, X, Check, Monitor, Smartphone, Maximize2,
  Volume2, ChevronDown, Loader2, AlertCircle, User, Copy, ExternalLink, CheckCircle
} from "lucide-react";
import { templates, backgroundEffects, animationStyles } from "@/lib/data";
import { EditorFormData } from "@/types";
import { formatFileSize, FILE_LIMITS, formatDate, formatTime } from "@/lib/utils";
import { eventsAPI, uploadFile } from "@/lib/api";
import { supabase } from "@/lib/supabase";

const tabs = [
  { id: "info", label: "Info Acara", icon: Info },
  { id: "media", label: "Media", icon: Images },
  { id: "design", label: "Desain", icon: Palette },
];

const eventTypes = [
  { id: "pernikahan", label: "Pernikahan" },
  { id: "ultah", label: "Ulang Tahun" },
  { id: "tasyakuran", label: "Tasyakuran" },
  { id: "lainnya", label: "Lainnya" },
];

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.event_id as string;
  const isNew = eventId === "new";
  
  const [activeTab, setActiveTab] = useState("info");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [formData, setFormData] = useState<EditorFormData>({
    title: "", couple_names: "", event_date: "", event_time: "",
    location_name: "", maps_url: "", music_url: "", music_embed: "",
    video_url: "", video_embed: "", template_id: templates[0].id,
    gallery_images: [], background_effect: "flowers", animation_style: "fade",
    guest_names: [],
  });
  const [guestInput, setGuestInput] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSection, setPreviewSection] = useState(0);
  const [currentEventId, setCurrentEventId] = useState<string | null>(isNew ? null : eventId);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [origin, setOrigin] = useState<string>("");
  const [publishSuccess, setPublishSuccess] = useState<{ event_path: string; guest_names: string[] } | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!isNew && eventId) loadEvent();
    checkAuth();
  }, [eventId, isNew]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session?.user);
      setIsGuest(!session?.user);
    } catch { setIsLoggedIn(false); setIsGuest(true); }
  };

  const loadEvent = async () => {
    try {
      setIsLoading(true);
      const event = await eventsAPI.getById(eventId);
      setFormData({
        title: event.title || "",
        couple_names: event.couple_names || "",
        event_date: event.event_date || "",
        event_time: event.event_time || "",
        location_name: event.location_name || "",
        maps_url: event.maps_url || "",
        music_url: event.music_url || "",
        music_embed: event.music_embed || "",
        video_url: event.video_url || "",
        video_embed: event.video_embed || "",
        template_id: event.template_id || templates[0].id,
        gallery_images: event.gallery_images || [],
        background_effect: event.background_effect || "flowers",
        animation_style: event.animation_style || "fade",
        guest_names: event.guest_names || [],
      });
      setGalleryImages(event.gallery_images || []);
      setCoverImage(event.cover_image || "");
      const template = templates.find((t) => t.id === event.template_id);
      if (template) setSelectedTemplate(template);
    } catch (err: any) { setError(err.message || "Gagal memuat data"); }
    finally { setIsLoading(false); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "music" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > FILE_LIMITS[type]) {
      alert(`File terlalu besar. Maksimal ${formatFileSize(FILE_LIMITS[type])}`);
      return;
    }
    try {
      const result = await uploadFile(file, type === "image" ? "gallery" : "media");
      if (type === "image") {
        setGalleryImages((prev) => [...prev, result.url]);
        setFormData((prev) => ({ ...prev, gallery_images: [...prev.gallery_images, result.url] }));
      } else if (type === "music") setFormData((prev) => ({ ...prev, music_url: result.url }));
      else setFormData((prev) => ({ ...prev, video_url: result.url }));
    } catch (err: any) { alert(err.message || "Upload gagal"); }
  };

  const removeGalleryImage = (index: number) => {
    const newImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newImages);
    setFormData((prev) => ({ ...prev, gallery_images: newImages }));
  };

  const handleSave = async () => {
    if (!isLoggedIn) { alert("Silakan login untuk menyimpan draf"); return; }
    try {
      setIsSaving(true);
      setError(null);
      const eventData = {
        title: formData.title, event_type: "pernikahan", couple_names: formData.couple_names,
        event_date: formData.event_date, event_time: formData.event_time,
        location_name: formData.location_name, maps_url: formData.maps_url,
        music_url: formData.music_url, music_embed: formData.music_embed,
        video_url: formData.video_url, video_embed: formData.video_embed,
        template_id: selectedTemplate.id, background_effect: formData.background_effect,
        animation_style: formData.animation_style, cover_image: coverImage,
        gallery_images: galleryImages, status: "draft" as const,
        guest_names: formData.guest_names || [],
      };
      if (currentEventId) {
        await eventsAPI.update(currentEventId, eventData);
        alert("Undangan berhasil disimpan!");
      } else {
        const newEvent = await eventsAPI.create(eventData);
        setCurrentEventId(newEvent.id);
        router.replace(`/editor/${newEvent.id}`);
        alert("Undangan berhasil dibuat!");
      }
    } catch (err: any) { setError(err.message || "Gagal menyimpan"); }
    finally { setIsSaving(false); }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.event_date || !formData.location_name) {
      alert("Lengkapi data undangan terlebih dahulu!"); return;
    }
    try {
      setIsSaving(true);
      const eventData = {
        title: formData.title, event_type: "pernikahan", couple_names: formData.couple_names,
        event_date: formData.event_date, event_time: formData.event_time,
        location_name: formData.location_name, maps_url: formData.maps_url,
        music_url: formData.music_url, music_embed: formData.music_embed,
        video_url: formData.video_url, video_embed: formData.video_embed,
        template_id: selectedTemplate.id, background_effect: formData.background_effect,
        animation_style: formData.animation_style, cover_image: coverImage,
        gallery_images: galleryImages, status: "published" as const, is_guest: isGuest,
        guest_names: formData.guest_names || [],
      };
      let event;
      if (currentEventId) event = await eventsAPI.update(currentEventId, eventData);
      else event = await eventsAPI.create(eventData);
      setCurrentEventId(event.id);
      setPublishSuccess({ event_path: event.event_path, guest_names: event.guest_names || [] });
      setIsSaving(false);
      return;
    } catch (err: any) { setError(err.message || "Gagal mempublikasikan"); }
    finally { setIsSaving(false); }
  };

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary-500 mx-auto mb-4 animate-spin" />
        <p className="text-gray-500">Memuat...</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={isLoggedIn ? "/dashboard" : "/"} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary-500 fill-primary-500" />
            <span className="font-semibold text-gray-800">{isNew ? "Buat Undangan Baru" : "Edit Undangan"}</span>
          </div>
          {isGuest && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Mode Tamu</span>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={isSaving || !isLoggedIn}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan{isGuest ? "" : " Draf"}
          </button>
          <button onClick={handlePublish} disabled={isSaving}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2">
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isGuest ? "Publikasikan (Auto-delete 7 hari)" : "Publikasikan"}
          </button>
        </div>
      </nav>

      {error && (
        <div className="px-4 py-3 bg-red-50 border-b border-red-200 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" /><span>{error}</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className="w-96 bg-white border-r border-gray-100 flex flex-col overflow-hidden">
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === tab.id ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-500 hover:text-gray-700"}`}>
                  <Icon className="w-4 h-4" />{tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "info" && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Acara</label>
                  <select name="event_type" onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    {eventTypes.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul Undangan</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                    placeholder="Contoh: Pernikahan Dea & Adi"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Mempelai/Penyelenggara</label>
                  <input type="text" name="couple_names" value={formData.couple_names} onChange={handleInputChange}
                    placeholder="Contoh: Dea & Adi"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                    <input type="date" name="event_date" value={formData.event_date} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Waktu</label>
                    <input type="time" name="event_time" value={formData.event_time} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Acara</label>
                  <input type="text" name="location_name" value={formData.location_name} onChange={handleInputChange}
                    placeholder="Contoh: Gedung Pernikahan Harmony"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link Google Maps</label>
                  <input type="url" name="maps_url" value={formData.maps_url} onChange={handleInputChange}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Tamu Undangan</label>
                  <p className="text-xs text-gray-500 mb-2">Tambahkan nama tamu yang diundang (opsional)</p>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={guestInput} onChange={(e) => setGuestInput(e.target.value)}
                      placeholder="Contoh: Budi, Siti, Ahmad"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    <button type="button" onClick={() => {
                      if (guestInput.trim()) {
                        const names = guestInput.split(",").map(n => n.trim()).filter(n => n);
                        setFormData(prev => ({ ...prev, guest_names: [...(prev.guest_names || []), ...names] }));
                        setGuestInput("");
                      }
                    }} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Tambah</button>
                  </div>
                  {formData.guest_names?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.guest_names.map((name, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                          {name}
                          <button onClick={() => setFormData(prev => ({
                            ...prev, guest_names: prev.guest_names?.filter((_, idx) => idx !== i) || []
                          }))} className="hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "media" && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Musik Latar</h3>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors mb-2">
                    <Upload className="w-5 h-5 text-gray-400" /><span className="text-sm text-gray-500">Upload MP3</span>
                    <input type="file" accept="audio/mp3,audio/mpeg" className="hidden" onChange={(e) => handleFileUpload(e, "music")} />
                  </label>
                  <div className="text-center text-gray-400 text-xs mb-2">atau</div>
                  <input type="url" name="music_embed" value={formData.music_embed} onChange={handleInputChange}
                    placeholder="Spotify/SoundCloud embed URL"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Galeri Foto</h3>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors mb-2">
                    <Upload className="w-5 h-5 text-gray-400" /><span className="text-sm text-gray-500">Tambah Foto</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(file => handleFileUpload({ target: { files: [file] } } as any, "image"));
                    }} />
                  </label>
                  {galleryImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {galleryImages.map((img, i) => (
                        <div key={i} className="relative group">
                          <img src={img} alt={`Gallery ${i + 1}`} className="w-full aspect-square object-cover rounded-lg" />
                          <button onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "design" && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Pilih Template</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {templates.map((template) => (
                      <button key={template.id} onClick={() => setSelectedTemplate(template)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all ${selectedTemplate.id === template.id ? "border-primary-500 ring-2 ring-primary-200" : "border-gray-200 hover:border-gray-300"}`}>
                        <img src={template.thumbnail_url} alt={template.name} className="w-full aspect-[3/4] object-cover" />
                        {selectedTemplate.id === template.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60">
                          <p className="text-white text-xs font-medium">{template.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Efek Latar Belakang</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {backgroundEffects.map((effect) => (
                      <button key={effect.id} onClick={() => setFormData(p => ({ ...p, background_effect: effect.id }))}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${formData.background_effect === effect.id ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <span className="text-2xl">{effect.emoji}</span>
                        <p className="text-xs text-gray-600 mt-1">{effect.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex-1 bg-gray-100 flex flex-col">
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Pratinjau</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button onClick={() => setPreviewDevice("mobile")}
                  className={`p-2 rounded-md transition-colors ${previewDevice === "mobile" ? "bg-white shadow text-primary-600" : "text-gray-500 hover:text-gray-700"}`}>
                  <Smartphone className="w-4 h-4" />
                </button>
                <button onClick={() => setPreviewDevice("desktop")}
                  className={`p-2 rounded-md transition-colors ${previewDevice === "desktop" ? "bg-white shadow text-primary-600" : "text-gray-500 hover:text-gray-700"}`}>
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => setPreviewOpen(true)} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-8 flex items-center justify-center overflow-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className={`bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-800 relative transition-all duration-300 ${previewDevice === "mobile" ? "w-[375px] h-[812px]" : "w-full max-w-[500px] h-[700px]"}`}>
              {previewDevice === "mobile" && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-10" />}
              <div className="h-full overflow-y-auto scrollbar-hide">
                <div className="aspect-[3/4] bg-cover bg-center relative" style={{ backgroundImage: `url(${coverImage || selectedTemplate.thumbnail_url})` }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                    <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                      <Heart className="w-8 h-8 fill-white" />
                    </motion.div>
                    <p className="text-sm uppercase tracking-widest mb-2">The Wedding of</p>
                    <h1 className="text-2xl font-bold font-playfair mb-4">{formData.couple_names || "Nama Mempelai"}</h1>
                    <p className="text-sm opacity-90">{formData.event_date ? formatDate(formData.event_date) : "Tanggal Acara"}</p>
                  </div>
                </div>
                <div className="p-4 space-y-4 bg-white">
                  <div className="text-center py-6 border-b border-gray-100">
                    <p className="text-primary-600 text-sm font-medium mb-2">With Joyful Hearts</p>
                    <h2 className="text-lg font-semibold text-gray-800">{formData.title || "Judul Undangan"}</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Calendar className="w-5 h-5 text-primary-500" />
                      <span>{formData.event_date ? formatDate(formData.event_date) : "Tanggal"}{formData.event_time ? ` • ${formatTime(formData.event_time)}` : ""}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <MapPin className="w-5 h-5 text-primary-500" />
                      <span>{formData.location_name || "Lokasi"}</span>
                    </div>
                    {(formData.music_embed || formData.music_url) && (
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Music className="w-5 h-5 text-primary-500" />
                        <span>Musik latar tersedia</span>
                      </div>
                    )}
                  </div>
                  {galleryImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-4">
                      <div className="col-span-2 text-sm font-medium text-gray-700 mb-2">Galeri Foto</div>
                      {galleryImages.slice(0, 4).map((img, i) => (
                        <img key={i} src={img} alt={`Gallery ${i + 1}`} className="w-full aspect-square object-cover rounded-lg" />
                      ))}
                    </div>
                  )}
                  <div className="pt-4">
                    <div className="bg-primary-50 rounded-xl p-4 text-center">
                      <p className="text-sm text-gray-600 mb-3">Konfirmasi Kehadiran</p>
                      <div className="flex gap-2 justify-center">
                        <button className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium">Hadir</button>
                        <button className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">Tidak Hadir</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {previewOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
            <button onClick={() => setPreviewOpen(false)}
              className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full p-2">
              <button onClick={() => setPreviewSection(Math.max(0, previewSection - 1))} disabled={previewSection === 0}
                className="p-2 hover:bg-white/20 rounded-full text-white transition-colors disabled:opacity-50">
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>
              <span className="text-white text-sm px-4">Halaman {previewSection + 1} / 5</span>
              <button onClick={() => setPreviewSection(Math.min(4, previewSection + 1))} disabled={previewSection === 4}
                className="p-2 hover:bg-white/20 rounded-full text-white transition-colors disabled:opacity-50">
                <ChevronDown className="w-5 h-5 -rotate-90" />
              </button>
            </div>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-[375px] h-[812px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-gray-800 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl" />
              <div className="h-full overflow-y-auto">
                <motion.div key={previewSection} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-full">
                  {previewSection === 0 && (
                    <div className="aspect-[3/4] bg-cover bg-center relative" style={{ backgroundImage: `url(${coverImage || selectedTemplate.thumbnail_url})` }}>
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                        <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}
                          className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                          <Heart className="w-10 h-10 fill-white" />
                        </motion.div>
                        <p className="text-sm uppercase tracking-[0.3em] mb-4">The Wedding of</p>
                        <h1 className="text-3xl font-bold font-playfair mb-6">{formData.couple_names || "Nama Mempelai"}</h1>
                        <div className="flex items-center justify-center gap-4 mb-8">
                          <div className="w-16 h-px bg-white/50" /><Heart className="w-4 h-4 fill-white" /><div className="w-16 h-px bg-white/50" />
                        </div>
                        <p className="text-sm opacity-90">{formData.event_date ? formatDate(formData.event_date) : "Tanggal Acara"}</p>
                      </div>
                    </div>
                  )}
                  {previewSection === 1 && (
                    <div className="p-6 space-y-6 bg-white min-h-full">
                      <div className="text-center py-8">
                        <p className="text-primary-600 font-medium mb-2">With Joyful Hearts</p>
                        <h2 className="text-2xl font-bold font-playfair text-gray-800">Kami Mengundang Anda</h2>
                        <p className="text-gray-500 mt-4 text-sm leading-relaxed">Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara spesial kami.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-primary-50 rounded-2xl p-6 text-center"><Calendar className="w-8 h-8 text-primary-600 mx-auto mb-3" /><h3 className="font-semibold text-gray-800 mb-1">Tanggal</h3><p className="text-gray-600">{formData.event_date ? formatDate(formData.event_date) : "-"}</p></div>
                        <div className="bg-primary-50 rounded-2xl p-6 text-center"><Volume2 className="w-8 h-8 text-primary-600 mx-auto mb-3" /><h3 className="font-semibold text-gray-800 mb-1">Waktu</h3><p className="text-gray-600">{formData.event_time ? formatTime(formData.event_time) : "-"}</p></div>
                        <div className="bg-primary-50 rounded-2xl p-6 text-center"><MapPin className="w-8 h-8 text-primary-600 mx-auto mb-3" /><h3 className="font-semibold text-gray-800 mb-1">Lokasi</h3><p className="text-gray-600 text-sm">{formData.location_name || "-"}</p></div>
                      </div>
                    </div>
                  )}
                  {previewSection === 2 && (
                    <div className="p-6 bg-gradient-to-b from-white to-primary-50 min-h-full">
                      <div className="text-center py-8"><Images className="w-8 h-8 text-primary-600 mx-auto mb-3" /><h2 className="text-2xl font-bold font-playfair text-gray-800">Galeri Momen</h2></div>
                      <div className="grid grid-cols-2 gap-3">
                        {[...Array(6)].map((_, i) => (
                          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                            className={`rounded-xl overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                            <img src={`https://images.unsplash.com/photo-${["1519741497674-611481863552", "1511285560929-80b456fea0bc", "1460978812857-470ed1c77af0", "1522673607200-164d1b6ce486", "1515934753879-df5c3c63b69c", "1507003211169-0a1dd7228f2d"][i]}?w=400&h=400&fit=crop`} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  {previewSection === 3 && (
                    <div className="p-6 bg-white min-h-full">
                      <div className="text-center py-8"><p className="text-4xl mb-2">📋</p><h2 className="text-2xl font-bold font-playfair text-gray-800 mb-2">Konfirmasi Kehadiran</h2><p className="text-gray-500 text-sm">Silakan isi form untuk mengkonfirmasi kehadiran Anda</p></div>
                      <div className="space-y-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label><div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 text-sm">Nama Anda</div></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Kehadiran</label>
                          <div className="grid grid-cols-2 gap-3">
                            <button className="p-4 rounded-xl border-2 border-green-500 bg-green-50 text-green-700 text-center"><Check className="w-6 h-6 mx-auto mb-2" /><span className="font-medium">Hadir</span></button>
                            <button className="p-4 rounded-xl border-2 border-gray-200 text-gray-400 text-center"><X className="w-6 h-6 mx-auto mb-2" /><span className="font-medium">Tidak Hadir</span></button>
                          </div>
                        </div>
                        <div className="pt-4"><button className="w-full py-4 bg-primary-600 text-white rounded-xl font-semibold">Kirim Konfirmasi</button></div>
                      </div>
                    </div>
                  )}
                  {previewSection === 4 && (
                    <div className="p-6 bg-gradient-to-b from-white to-primary-50 min-h-full">
                      <div className="text-center py-8"><Heart className="w-10 h-10 text-primary-600 mx-auto mb-3 fill-primary-100" /><h2 className="text-2xl font-bold font-playfair text-gray-800">Ucapan & Doa</h2></div>
                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">B</div>
                            <div><h4 className="font-semibold text-gray-800">Budi Santoso</h4><span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Hadir</span></div>
                          </div>
                          <p className="text-gray-600 text-sm">Selamat ya Dea & Adi! Semoga menjadi keluarga sakinah mawaddah warahmah.</p>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">S</div>
                            <div><h4 className="font-semibold text-gray-800">Siti Rahayu</h4><span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Hadir</span></div>
                          </div>
                          <p className="text-gray-600 text-sm">Semoga hari spesialnya menyenangkan!</p>
                        </div>
                      </div>
                      <div className="text-center pt-8 pb-4"><p className="text-gray-400 text-sm">Dibuat dengan cinta di Indonesia</p>
                        <div className="flex items-center justify-center gap-2 mt-2"><Heart className="w-4 h-4 text-primary-500 fill-primary-400" /><span className="font-playfair font-semibold text-gray-600">Undangkuy</span></div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {publishSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Undangan Berhasil Dipublikasi!</h2>
                <p className="text-gray-500">Bagikan link undangan kepada tamu</p>
              </div>

              <div className="space-y-4 max-h-80 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link Utama</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${origin}/${publishSuccess.event_path}`}
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(`${origin}/${publishSuccess.event_path}`)}
                      className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <a
                      href={`/${publishSuccess.event_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {publishSuccess.guest_names.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link per Tamu</label>
                    <div className="space-y-2">
                      {publishSuccess.guest_names.map((name, index) => {
                        const link = `${origin}/${publishSuccess.event_path}?guest=${encodeURIComponent(name)}`;
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
                              <p className="text-xs text-gray-500 truncate">{link}</p>
                            </div>
                            <button
                              onClick={() => navigator.clipboard.writeText(link)}
                              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex-shrink-0"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setPublishSuccess(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    if (isLoggedIn) router.push("/dashboard");
                    else router.push(`/${publishSuccess.event_path}`);
                  }}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {isLoggedIn ? "Ke Dashboard" : "Lihat Undangan"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
