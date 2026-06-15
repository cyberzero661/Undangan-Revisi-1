"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Save, ArrowLeft, Calendar, MapPin, Music, Image as Images,
  Palette, Info, Upload, X, Check, Monitor, Smartphone, Maximize2,
  Volume2, ChevronDown, ChevronRight, Loader2, AlertCircle, User, Copy, ExternalLink, CheckCircle,
  Gift, Plus, Trash2, Link as LinkIcon, Video, Users, Sparkles
} from "lucide-react";
import { templates, backgroundEffects, animationStyles } from "@/lib/data";
import { EditorFormData, LoveStory, DigitalEnvelopeItem } from "@/types";
import { formatFileSize, FILE_LIMITS, formatDate, formatTime } from "@/lib/utils";
import { eventsAPI, uploadFile } from "@/lib/api";
import { supabase } from "@/lib/supabase";

const tabs = [
  { id: "info", label: "Info Acara", icon: Info, description: "Judul, tanggal, lokasi" },
  { id: "couple", label: "Mempelai", icon: Heart, description: "Data pengantin" },
  { id: "story", label: "Cerita Cinta", icon: Sparkles, description: "Timeline hubungan" },
  { id: "envelope", label: "Amplop Digital", icon: Gift, description: "Rekening & e-wallet" },
  { id: "media", label: "Media", icon: Images, description: "Foto, musik, video" },
  { id: "extra", label: "Fitur Lainnya", icon: LinkIcon, description: "YouTube, dll" },
  { id: "design", label: "Desain", icon: Palette, description: "Template & efek" },
];

const eventTypes = [
  { id: "pernikahan", label: "Pernikahan" },
  { id: "ultah", label: "Ulang Tahun" },
  { id: "tasyakuran", label: "Tasyakuran" },
  { id: "lainnya", label: "Lainnya" },
];

function FormField({ label, hint, children, className = "" }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description?: string }) {
  return (
    <div className="pb-4 mb-6 border-b border-gray-100">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm ${className}`}>{children}</div>;
}

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.event_id as string;
  const isNew = eventId === "new";

  const [activeTab, setActiveTab] = useState("info");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [formData, setFormData] = useState<EditorFormData>({
    title: "", couple_names: "", bride_name: "", groom_name: "",
    bride_photo: "", groom_photo: "", bride_parent_name: "", groom_parent_name: "",
    event_date: "", event_time: "",
    location_name: "", maps_url: "", music_url: "", music_embed: "",
    video_url: "", video_embed: "", youtube_live_url: "",
    template_id: templates[0].id,
    gallery_images: [], background_effect: "flowers", animation_style: "fade",
    guest_names: [], love_stories: [], digital_envelope: [],
  });
  const [guestInput, setGuestInput] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>("");
  const [musicUploading, setMusicUploading] = useState(false);
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarMinWidth = 280;
  const sidebarMaxWidth = 600;

  const [tabsHeight, setTabsHeight] = useState(120);
  const [isResizingTabs, setIsResizingTabs] = useState(false);
  const tabsMinHeight = 80;
  const tabsMaxHeight = 300;

  useEffect(() => { setOrigin(window.location.origin); }, []);
  useEffect(() => { if (!isNew && eventId) loadEvent(); checkAuth(); }, [eventId, isNew]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.min(sidebarMaxWidth, Math.max(sidebarMinWidth, e.clientX));
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => { setIsResizing(false); };
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingTabs) return;
      const sidebarEl = document.getElementById("editor-sidebar");
      if (!sidebarEl) return;
      const rect = sidebarEl.getBoundingClientRect();
      const newHeight = Math.min(tabsMaxHeight, Math.max(tabsMinHeight, e.clientY - rect.top));
      setTabsHeight(newHeight);
    };
    const handleMouseUp = () => { setIsResizingTabs(false); };
    if (isResizingTabs) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizingTabs]);

  const startResize = (e: React.MouseEvent) => { e.preventDefault(); setIsResizing(true); };

  const startResizeTabs = (e: React.MouseEvent) => { e.preventDefault(); setIsResizingTabs(true); };

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
      const ev = await eventsAPI.getById(eventId);
      setFormData({
        title: ev.title || "", couple_names: ev.couple_names || "",
        bride_name: (ev as any).bride_name || "", groom_name: (ev as any).groom_name || "",
        bride_photo: (ev as any).bride_photo || "", groom_photo: (ev as any).groom_photo || "",
        bride_parent_name: (ev as any).bride_parent_name || "", groom_parent_name: (ev as any).groom_parent_name || "",
        event_date: ev.event_date || "", event_time: ev.event_time || "",
        location_name: ev.location_name || "", maps_url: ev.maps_url || "",
        music_url: ev.music_url || "", music_embed: ev.music_embed || "",
        video_url: ev.video_url || "", video_embed: ev.video_embed || "",
        youtube_live_url: (ev as any).youtube_live_url || "",
        template_id: ev.template_id || templates[0].id,
        gallery_images: ev.gallery_images || [],
        background_effect: ev.background_effect || "flowers",
        animation_style: ev.animation_style || "fade",
        guest_names: ev.guest_names || [],
        love_stories: (ev as any).love_stories || [],
        digital_envelope: (ev as any).digital_envelope || [],
      });
      setGalleryImages(ev.gallery_images || []);
      setCoverImage(ev.cover_image || "");
      const t = templates.find((x) => x.id === ev.template_id);
      if (t) setSelectedTemplate(t);
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
    if (file.size > FILE_LIMITS[type]) { alert(`File terlalu besar. Maksimal ${formatFileSize(FILE_LIMITS[type])}`); return; }
    try {
      if (type === "music") setMusicUploading(true);
      const result = await uploadFile(file, type === "image" ? "gallery" : "media");
      if (type === "image") {
        setGalleryImages((prev) => [...prev, result.url]);
        setFormData((prev) => ({ ...prev, gallery_images: [...prev.gallery_images, result.url] }));
      } else if (type === "music") {
        setFormData((prev) => ({ ...prev, music_url: result.url }));
      } else {
        setFormData((prev) => ({ ...prev, video_url: result.url }));
      }
    } catch (err: any) { alert(err.message || "Upload gagal"); }
    finally { if (type === "music") setMusicUploading(false); }
  };

  const removeMusic = () => { setFormData((prev) => ({ ...prev, music_url: "" })); };
  const removeGalleryImage = (index: number) => {
    const imgs = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(imgs);
    setFormData((prev) => ({ ...prev, gallery_images: imgs }));
  };

  const addLoveStory = () => {
    setFormData((prev) => ({ ...prev, love_stories: [...(prev.love_stories || []), { date: "", title: "", description: "", photo_url: "" }] }));
  };
  const updateLoveStory = (index: number, field: keyof LoveStory, value: string) => {
    const s = [...(formData.love_stories || [])];
    s[index] = { ...s[index], [field]: value };
    setFormData((prev) => ({ ...prev, love_stories: s }));
  };
  const removeLoveStory = (index: number) => {
    setFormData((prev) => ({ ...prev, love_stories: (prev.love_stories || []).filter((_, i) => i !== index) }));
  };

  const addEnvelope = () => {
    setFormData((prev) => ({ ...prev, digital_envelope: [...(prev.digital_envelope || []), { name: "", bank: "", account_number: "", holder: "", type: "bank" as const }] }));
  };
  const updateEnvelope = (index: number, field: keyof DigitalEnvelopeItem, value: string) => {
    const e = [...(formData.digital_envelope || [])];
    e[index] = { ...e[index], [field]: value };
    setFormData((prev) => ({ ...prev, digital_envelope: e }));
  };
  const removeEnvelope = (index: number) => {
    setFormData((prev) => ({ ...prev, digital_envelope: (prev.digital_envelope || []).filter((_, i) => i !== index) }));
  };

  const getEventData = (status: "draft" | "published") => ({
    title: formData.title, event_type: "pernikahan" as const, couple_names: formData.couple_names,
    bride_name: formData.bride_name, groom_name: formData.groom_name,
    bride_photo: formData.bride_photo, groom_photo: formData.groom_photo,
    bride_parent_name: formData.bride_parent_name, groom_parent_name: formData.groom_parent_name,
    event_date: formData.event_date, event_time: formData.event_time,
    location_name: formData.location_name, maps_url: formData.maps_url,
    music_url: formData.music_url, music_embed: formData.music_embed,
    video_url: formData.video_url, video_embed: formData.video_embed,
    youtube_live_url: formData.youtube_live_url,
    template_id: selectedTemplate.id, background_effect: formData.background_effect,
    animation_style: formData.animation_style, cover_image: coverImage,
    gallery_images: galleryImages, status,
    guest_names: formData.guest_names || [],
    love_stories: formData.love_stories || [],
    digital_envelope: formData.digital_envelope || [],
    ...(status === "published" ? { is_guest: isGuest } : {}),
  });

  const handleSave = async () => {
    if (!isLoggedIn) { alert("Silakan login untuk menyimpan draf"); return; }
    try {
      setIsSaving(true); setError(null);
      const d = getEventData("draft");
      if (currentEventId) { await eventsAPI.update(currentEventId, d); alert("Undangan berhasil disimpan!"); }
      else { const n = await eventsAPI.create(d); setCurrentEventId(n.id); router.replace(`/editor/${n.id}`); alert("Undangan berhasil dibuat!"); }
    } catch (err: any) { setError(err.message || "Gagal menyimpan"); }
    finally { setIsSaving(false); }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.event_date || !formData.location_name) { alert("Lengkapi data undangan terlebih dahulu!"); return; }
    try {
      setIsSaving(true);
      const d = getEventData("published");
      let ev;
      if (currentEventId) ev = await eventsAPI.update(currentEventId, d);
      else ev = await eventsAPI.create(d);
      setCurrentEventId(ev.id);
      setPublishSuccess({ event_path: ev.event_path, guest_names: ev.guest_names || [] });
      setIsSaving(false);
    } catch (err: any) { setError(err.message || "Gagal mempublikasikan"); }
    finally { setIsSaving(false); }
  };

  const inputCls = "w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-shadow placeholder:text-gray-300";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-1.5";

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center"><Loader2 className="w-10 h-10 text-primary-500 mx-auto mb-3 animate-spin" /><p className="text-gray-400 text-sm">Memuat editor...</p></div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-200 px-4 md:px-6 h-14 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link href={isLoggedIn ? "/dashboard" : "/"} className="p-2 -ml-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold text-gray-900 text-sm leading-tight">{isNew ? "Buat Undangan" : "Edit Undangan"}</p>
              <p className="text-[11px] text-gray-400">{formData.title || "Belum ada judul"}</p>
            </div>
          </div>
          {isGuest && <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-medium rounded-full border border-amber-200">Guest</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPreviewOpen(true)} className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Smartphone className="w-4 h-4" />Pratinjau
          </button>
          <button onClick={handleSave} disabled={isSaving || !isLoggedIn} className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">Simpan</span>
          </button>
          <button onClick={handlePublish} disabled={isSaving} className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 flex items-center gap-1.5 shadow-sm shadow-primary-600/20">
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            Publikasikan
          </button>
        </div>
      </nav>

      {error && (
        <div className="px-4 py-2.5 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <div
          id="editor-sidebar"
          style={{ width: sidebarOpen ? sidebarWidth : 56 }}
          className="bg-white border-r border-gray-200 flex flex-col overflow-hidden flex-shrink-0"
        >
          {/* Sidebar Toggle / Collapsed Icons */}
          {!sidebarOpen ? (
            <div className="flex flex-col items-center py-2 gap-1 overflow-y-auto scrollbar-hide">
              <button onClick={() => setSidebarOpen(true)} className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mb-2" title="Buka sidebar">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(true); }}
                    className={`p-2.5 rounded-lg transition-colors ${isActive ? "bg-primary-50 text-primary-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"}`}
                    title={tab.label}>
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              {/* Sidebar Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                <span className="text-sm font-bold text-gray-800">Panel Editor</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setSidebarOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Tutup sidebar">
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="overflow-y-auto flex-shrink-0 px-2 py-2" style={{ height: tabsHeight }}>
                <div className="space-y-0.5">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${isActive ? "bg-primary-50 text-primary-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? "bg-primary-100" : "bg-gray-100"}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[13px] font-medium truncate ${isActive ? "text-primary-700" : ""}`}>{tab.label}</p>
                          <p className="text-[10px] text-gray-400 truncate leading-tight">{tab.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tabs Resize Handle */}
              <div
                onMouseDown={startResizeTabs}
                className={`h-1.5 flex-shrink-0 cursor-row-resize hover:bg-primary-400/30 active:bg-primary-500/50 transition-colors relative group ${isResizingTabs ? "bg-primary-500/30" : "bg-gray-50"}`}
                title="Geser untuk mengubah tinggi"
              >
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-1 rounded-full transition-all ${isResizingTabs ? "bg-primary-500 w-16" : "bg-gray-300 group-hover:bg-primary-400"}`} />
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
                <div className="p-5">
                  {/* INFO TAB */}
                  {activeTab === "info" && (
                    <div className="space-y-5">
                      <SectionHeader icon={Info} title="Info Acara" description="Data dasar undangan Anda" />
                      <Card className="space-y-4">
                        <FormField label="Tipe Acara">
                          <select name="event_type" onChange={handleInputChange} className={inputCls}>
                            {eventTypes.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
                          </select>
                        </FormField>
                        <FormField label="Judul Undangan" hint="Contoh: Pernikahan Dea & Adi">
                          <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Pernikahan Dea & Adi" className={inputCls} />
                        </FormField>
                        <FormField label="Nama Mempelai">
                          <input type="text" name="couple_names" value={formData.couple_names} onChange={handleInputChange} placeholder="Dea & Adi" className={inputCls} />
                        </FormField>
                      </Card>
                      <Card className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Calendar className="w-4 h-4 text-primary-500" />Tanggal & Waktu</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField label="Tanggal">
                            <input type="date" name="event_date" value={formData.event_date} onChange={handleInputChange} className={inputCls} />
                          </FormField>
                          <FormField label="Waktu">
                            <input type="time" name="event_time" value={formData.event_time} onChange={handleInputChange} className={inputCls} />
                          </FormField>
                        </div>
                      </Card>
                      <Card className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-500" />Lokasi</h4>
                        <FormField label="Nama Lokasi">
                          <input type="text" name="location_name" value={formData.location_name} onChange={handleInputChange} placeholder="Gedung Pernikahan Harmony" className={inputCls} />
                        </FormField>
                        <FormField label="Google Maps URL" hint="Link Google Maps lokasi acara">
                          <input type="url" name="maps_url" value={formData.maps_url} onChange={handleInputChange} placeholder="https://maps.google.com/..." className={inputCls} />
                        </FormField>
                      </Card>
                      <Card className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Users className="w-4 h-4 text-primary-500" />Tamu Undangan</h4>
                        <p className="text-xs text-gray-400">Tambahkan nama tamu untuk personalisasi undangan</p>
                        <div className="flex gap-2">
                          <input type="text" value={guestInput} onChange={(e) => setGuestInput(e.target.value)} placeholder="Nama tamu, pisahkan dengan koma"
                            className={`flex-1 ${inputCls}`} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (guestInput.trim()) { const names = guestInput.split(",").map(n => n.trim()).filter(n => n); setFormData(prev => ({ ...prev, guest_names: [...(prev.guest_names || []), ...names] })); setGuestInput(""); } } }} />
                          <button onClick={() => { if (guestInput.trim()) { const names = guestInput.split(",").map(n => n.trim()).filter(n => n); setFormData(prev => ({ ...prev, guest_names: [...(prev.guest_names || []), ...names] })); setGuestInput(""); } }}
                            className="px-3 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex-shrink-0">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {formData.guest_names?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {formData.guest_names.map((name, i) => (
                              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium border border-primary-100">
                                {name}
                                <button onClick={() => setFormData(prev => ({ ...prev, guest_names: prev.guest_names?.filter((_, idx) => idx !== i) || [] }))} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                              </span>
                            ))}
                          </div>
                        )}
                      </Card>
                    </div>
                  )}

                  {/* COUPLE TAB */}
                  {activeTab === "couple" && (
                    <div className="space-y-5">
                      <SectionHeader icon={Heart} title="Data Mempelai" description="Informasi pengantin pria & wanita" />
                      <Card className="space-y-4">
                        <div className="flex items-center gap-3 mb-2 p-3 bg-pink-50 rounded-xl">
                          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center"><span className="text-lg">&#128120;</span></div>
                          <div><p className="text-sm font-semibold text-gray-800">Pengantin Wanita</p><p className="text-[11px] text-gray-400">Isi data mempelai wanita</p></div>
                        </div>
                        <FormField label="Nama Lengkap">
                          <input type="text" name="bride_name" value={formData.bride_name} onChange={handleInputChange} placeholder="Dea Putri" className={inputCls} />
                        </FormField>
                        <FormField label="Foto (URL)" hint="URL foto mempelai wanita">
                          <input type="url" name="bride_photo" value={formData.bride_photo} onChange={handleInputChange} placeholder="https://..." className={inputCls} />
                        </FormField>
                        <FormField label="Nama Orang Tua" hint="Bapak ... & Ibu ...">
                          <input type="text" name="bride_parent_name" value={formData.bride_parent_name} onChange={handleInputChange} placeholder="Bapak Rudi & Ibu Sari" className={inputCls} />
                        </FormField>
                      </Card>
                      <Card className="space-y-4">
                        <div className="flex items-center gap-3 mb-2 p-3 bg-blue-50 rounded-xl">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><span className="text-lg">&#128117;</span></div>
                          <div><p className="text-sm font-semibold text-gray-800">Pengantin Pria</p><p className="text-[11px] text-gray-400">Isi data mempelai pria</p></div>
                        </div>
                        <FormField label="Nama Lengkap">
                          <input type="text" name="groom_name" value={formData.groom_name} onChange={handleInputChange} placeholder="Adi Nugraha" className={inputCls} />
                        </FormField>
                        <FormField label="Foto (URL)" hint="URL foto mempelai pria">
                          <input type="url" name="groom_photo" value={formData.groom_photo} onChange={handleInputChange} placeholder="https://..." className={inputCls} />
                        </FormField>
                        <FormField label="Nama Orang Tua" hint="Bapak ... & Ibu ...">
                          <input type="text" name="groom_parent_name" value={formData.groom_parent_name} onChange={handleInputChange} placeholder="Bapak Budi & Ibu Ani" className={inputCls} />
                        </FormField>
                      </Card>
                    </div>
                  )}

                  {/* STORY TAB */}
                  {activeTab === "story" && (
                    <div className="space-y-5">
                      <SectionHeader icon={Sparkles} title="Cerita Cinta" description="Bagikan momen penting hubungan kalian" />
                      <button onClick={addLoveStory} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Tambah Momen
                      </button>
                      {(formData.love_stories || []).length === 0 && (
                        <div className="text-center py-10 bg-gray-50 rounded-xl">
                          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3"><Heart className="w-6 h-6 text-gray-300" /></div>
                          <p className="text-sm text-gray-400">Belum ada cerita</p>
                          <p className="text-xs text-gray-300 mt-1">Klik tombol di atas untuk menambahkan</p>
                        </div>
                      )}
                      {(formData.love_stories || []).map((story, index) => (
                        <Card key={index} className="space-y-3 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">Momen {index + 1}</span>
                            <button onClick={() => removeLoveStory(index)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <FormField label="Tanggal"><input type="date" value={story.date} onChange={(e) => updateLoveStory(index, "date", e.target.value)} className={inputCls} /></FormField>
                            <FormField label="Judul"><input type="text" value={story.title} onChange={(e) => updateLoveStory(index, "title", e.target.value)} placeholder="Pertama Bertemu" className={inputCls} /></FormField>
                          </div>
                          <FormField label="Deskripsi">
                            <textarea value={story.description} onChange={(e) => updateLoveStory(index, "description", e.target.value)} placeholder="Ceritakan momen ini..." rows={2} className={`${inputCls} resize-none`} />
                          </FormField>
                          <FormField label="Foto (URL)" hint="Opsional">
                            <input type="url" value={story.photo_url || ""} onChange={(e) => updateLoveStory(index, "photo_url", e.target.value)} placeholder="https://..." className={inputCls} />
                          </FormField>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* ENVELOPE TAB */}
                  {activeTab === "envelope" && (
                    <div className="space-y-5">
                      <SectionHeader icon={Gift} title="Amplop Digital" description="Rekening & e-wallet untuk hadiah" />
                      <button onClick={addEnvelope} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Tambah Rekening/E-Wallet
                      </button>
                      {(formData.digital_envelope || []).length === 0 && (
                        <div className="text-center py-10 bg-gray-50 rounded-xl">
                          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3"><Gift className="w-6 h-6 text-gray-300" /></div>
                          <p className="text-sm text-gray-400">Belum ada rekening</p>
                          <p className="text-xs text-gray-300 mt-1">Klik tombol di atas untuk menambahkan</p>
                        </div>
                      )}
                      {(formData.digital_envelope || []).map((env, index) => (
                        <Card key={index} className="space-y-3 relative">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${env.type === "bank" ? "text-blue-600 bg-blue-50" : "text-green-600 bg-green-50"}`}>{env.type === "bank" ? "🏦 Bank" : "📱 E-Wallet"}</span>
                            <button onClick={() => removeEnvelope(index)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                          <FormField label="Tipe">
                            <select value={env.type} onChange={(e) => updateEnvelope(index, "type", e.target.value)} className={inputCls}>
                              <option value="bank">Bank Transfer</option>
                              <option value="ewallet">E-Wallet</option>
                            </select>
                          </FormField>
                          <FormField label={env.type === "bank" ? "Nama Bank" : "Nama E-Wallet"}>
                            <input type="text" value={env.name} onChange={(e) => updateEnvelope(index, "name", e.target.value)} placeholder={env.type === "bank" ? "BCA, Mandiri..." : "GoPay, OVO..."} className={inputCls} />
                          </FormField>
                          {env.type === "bank" && (
                            <FormField label="Nama Bank Lengkap"><input type="text" value={env.bank || ""} onChange={(e) => updateEnvelope(index, "bank", e.target.value)} placeholder="Bank Central Asia" className={inputCls} /></FormField>
                          )}
                          <FormField label="Nomor Rekening / No. HP"><input type="text" value={env.account_number} onChange={(e) => updateEnvelope(index, "account_number", e.target.value)} placeholder="1234567890" className={inputCls} /></FormField>
                          <FormField label="Atas Nama"><input type="text" value={env.holder} onChange={(e) => updateEnvelope(index, "holder", e.target.value)} placeholder="Dea & Adi" className={inputCls} /></FormField>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* MEDIA TAB */}
                  {activeTab === "media" && (
                    <div className="space-y-5">
                      <SectionHeader icon={Images} title="Media" description="Foto, musik, dan video undangan" />
                      <Card className="space-y-4">
                        <FormField label="Foto Cover (URL)" hint="Gambar utama yang tampil di awal undangan">
                          <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." className={inputCls} />
                          {coverImage && <img src={coverImage} alt="Cover" className="w-full h-32 object-cover rounded-lg mt-2" />}
                        </FormField>
                      </Card>
                      <Card className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Music className="w-4 h-4 text-primary-500" />Musik Latar</h4>
                        {formData.music_url ? (
                          <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl border border-primary-100">
                            <Music className="w-5 h-5 text-primary-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-700 truncate">Musik diupload</p><p className="text-xs text-gray-400 truncate">{formData.music_url.split("/").pop()}</p></div>
                            <button onClick={removeMusic} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors">
                            {musicUploading ? <Loader2 className="w-5 h-5 text-gray-400 animate-spin" /> : <Upload className="w-5 h-5 text-gray-400" />}
                            <span className="text-sm text-gray-500">{musicUploading ? "Mengupload..." : "Upload MP3"}</span>
                            <input type="file" accept="audio/mp3,audio/mpeg" className="hidden" disabled={musicUploading} onChange={(e) => handleFileUpload(e, "music")} />
                          </label>
                        )}
                        {formData.music_url && (
                          <label className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors text-sm text-gray-500">
                            <Upload className="w-4 h-4" />Ganti Musik
                            <input type="file" accept="audio/mp3,audio/mpeg" className="hidden" disabled={musicUploading} onChange={(e) => handleFileUpload(e, "music")} />
                          </label>
                        )}
                        <div className="flex items-center gap-3"><div className="flex-1 h-px bg-gray-100" /><span className="text-xs text-gray-300">atau</span><div className="flex-1 h-px bg-gray-100" /></div>
                        <FormField label="Embed URL" hint="Spotify / SoundCloud link">
                          <input type="url" name="music_embed" value={formData.music_embed} onChange={handleInputChange} placeholder="https://open.spotify.com/..." className={inputCls} />
                        </FormField>
                      </Card>
                      <Card className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-800">Galeri Foto</h4>
                        <label className="flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors">
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-500">Tambah Foto</span>
                          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { Array.from(e.target.files || []).forEach(file => handleFileUpload({ target: { files: [file] } } as any, "image")); }} />
                        </label>
                        {galleryImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {galleryImages.map((img, i) => (
                              <div key={i} className="relative group aspect-square">
                                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button onClick={() => removeGalleryImage(i)} className="p-1.5 bg-white/90 text-red-500 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    </div>
                  )}

                  {/* EXTRA TAB */}
                  {activeTab === "extra" && (
                    <div className="space-y-5">
                      <SectionHeader icon={LinkIcon} title="Fitur Lainnya" description="YouTube Live & embed video" />
                      <Card className="space-y-4">
                        <FormField label="YouTube Live Stream URL" hint="Link video YouTube untuk live streaming acara">
                          <div className="relative">
                            <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="url" name="youtube_live_url" value={formData.youtube_live_url} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=..." className={`${inputCls} pl-10`} />
                          </div>
                        </FormField>
                        <FormField label="Video Embed URL" hint="YouTube / Vimeo embed URL">
                          <input type="url" name="video_embed" value={formData.video_embed} onChange={handleInputChange} placeholder="https://www.youtube.com/embed/..." className={inputCls} />
                        </FormField>
                      </Card>
                    </div>
                  )}

                  {/* DESIGN TAB */}
                  {activeTab === "design" && (
                    <div className="space-y-5">
                      <SectionHeader icon={Palette} title="Desain" description="Template & efek visual" />
                      <Card className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-800">Pilih Template</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {templates.map((template) => (
                            <button key={template.id} onClick={() => setSelectedTemplate(template)}
                              className={`relative rounded-xl overflow-hidden border-2 transition-all hover:shadow-md ${selectedTemplate.id === template.id ? "border-primary-500 ring-2 ring-primary-200" : "border-gray-200 hover:border-gray-300"}`}>
                              <img src={template.thumbnail_url} alt={template.name} className="w-full aspect-[3/4] object-cover" />
                              {selectedTemplate.id === template.id && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow"><Check className="w-3.5 h-3.5 text-white" /></div>
                              )}
                              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                                <p className="text-white text-xs font-medium">{template.name}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </Card>
                      <Card className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-800">Efek Latar Belakang</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {backgroundEffects.map((effect) => (
                            <button key={effect.id} onClick={() => setFormData(p => ({ ...p, background_effect: effect.id }))}
                              className={`p-3 rounded-xl border-2 text-center transition-all ${formData.background_effect === effect.id ? "border-primary-500 bg-primary-50 shadow-sm" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}>
                              <span className="text-xl">{effect.emoji}</span>
                              <p className="text-[10px] text-gray-500 mt-1 leading-tight">{effect.name}</p>
                            </button>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Resize Handle */}
        {sidebarOpen && (
          <div
            onMouseDown={startResize}
            className={`w-1.5 flex-shrink-0 cursor-col-resize hover:bg-primary-400/30 active:bg-primary-500/50 transition-colors relative group ${isResizing ? "bg-primary-500/30" : "bg-transparent"}`}
            title="Geser untuk mengubah lebar"
          >
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-10 rounded-full transition-all ${isResizing ? "bg-primary-500 h-16" : "bg-gray-300 group-hover:bg-primary-400"}`} />
          </div>
        )}

        {/* Right Panel - Preview */}
        <div className="flex-1 bg-gray-100 flex flex-col min-w-0">
          <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <EyeIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Pratinjau</span>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Live</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                <button onClick={() => setPreviewDevice("mobile")} className={`p-1.5 rounded-md transition-colors ${previewDevice === "mobile" ? "bg-white shadow text-primary-600" : "text-gray-400 hover:text-gray-600"}`}>
                  <Smartphone className="w-4 h-4" />
                </button>
                <button onClick={() => setPreviewDevice("desktop")} className={`p-1.5 rounded-md transition-colors ${previewDevice === "desktop" ? "bg-white shadow text-primary-600" : "text-gray-400 hover:text-gray-600"}`}>
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => setPreviewOpen(true)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 flex items-center justify-center overflow-auto">
            <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border-[6px] border-gray-900 relative transition-all duration-300 ${previewDevice === "mobile" ? "w-[360px] h-[780px]" : "w-full max-w-[520px] h-[680px]"}`}>
              {previewDevice === "mobile" && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-900 rounded-b-xl z-10" />}
              <div className="h-full overflow-y-auto scrollbar-hide">
                {/* Cover */}
                <div className="aspect-[3/4] bg-cover bg-center relative" style={{ backgroundImage: `url(${coverImage || selectedTemplate.thumbnail_url})` }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4"><Heart className="w-8 h-8 fill-white" /></div>
                    <p className="text-xs uppercase tracking-[0.2em] mb-2 font-kalam opacity-80">The Wedding of</p>
                    <h1 className="text-2xl font-bold font-cormorant mb-3">{formData.couple_names || "Nama Mempelai"}</h1>
                    {formData.event_date && <p className="text-xs opacity-80 font-kalam">{formatDate(formData.event_date)}</p>}
                  </div>
                </div>
                {/* Content Preview */}
                <div className="p-5 space-y-5 vintage-bg">
                  <div className="text-center py-4">
                    <p className="font-kalam text-vintage-gold text-xs mb-1">بسم الله الرحمن الرحیم</p>
                    <h2 className="font-cormorant text-lg font-bold text-vintage-darkBrown">{formData.title || "Judul Undangan"}</h2>
                  </div>
                  {formData.bride_name && formData.groom_name && (
                    <div className="flex items-center justify-center gap-4 py-3">
                      <div className="text-center"><div className="w-14 h-14 rounded-full bg-vintage-parchment flex items-center justify-center mx-auto mb-1"><span className="font-cormorant text-lg text-vintage-darkBrown font-bold">{formData.bride_name.charAt(0)}</span></div><p className="font-cormorant text-xs font-semibold text-vintage-darkBrown">{formData.bride_name}</p></div>
                      <Heart className="w-4 h-4 text-vintage-gold fill-vintage-gold" />
                      <div className="text-center"><div className="w-14 h-14 rounded-full bg-vintage-parchment flex items-center justify-center mx-auto mb-1"><span className="font-cormorant text-lg text-vintage-darkBrown font-bold">{formData.groom_name.charAt(0)}</span></div><p className="font-cormorant text-xs font-semibold text-vintage-darkBrown">{formData.groom_name}</p></div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 text-xs text-vintage-brown"><Calendar className="w-4 h-4 text-vintage-gold flex-shrink-0" /><span className="font-kalam">{formData.event_date ? formatDate(formData.event_date) : "Tanggal"}{formData.event_time ? ` - ${formatTime(formData.event_time)}` : ""}</span></div>
                    <div className="flex items-center gap-2.5 text-xs text-vintage-brown"><MapPin className="w-4 h-4 text-vintage-gold flex-shrink-0" /><span className="font-kalam">{formData.location_name || "Lokasi"}</span></div>
                  </div>
                  {galleryImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-1.5">
                      {galleryImages.slice(0, 6).map((img, i) => (
                        <img key={i} src={img} alt="" className="w-full aspect-square object-cover rounded" />
                      ))}
                    </div>
                  )}
                  <div className="py-3 text-center">
                    <p className="font-kalam text-[10px] text-vintage-brown/60">Undangkuy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen Preview Modal */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            <button onClick={() => setPreviewOpen(false)} className="absolute top-4 right-4 z-50 p-3 text-white/70 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-5 py-2.5">
              <button onClick={() => setPreviewSection(Math.max(0, previewSection - 1))} disabled={previewSection === 0} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors disabled:opacity-30"><ChevronDown className="w-5 h-5 rotate-90" /></button>
              <span className="text-white/80 text-sm font-medium">{previewSection + 1} / 5</span>
              <button onClick={() => setPreviewSection(Math.min(4, previewSection + 1))} disabled={previewSection === 4} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors disabled:opacity-30"><ChevronDown className="w-5 h-5 -rotate-90" /></button>
            </div>
            <div className="w-[375px] h-[812px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-[6px] border-gray-900 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-900 rounded-b-xl z-10" />
              <div className="h-full overflow-y-auto scrollbar-hide">
                {/* Cover */}
                <div className="aspect-[3/4] bg-cover bg-center relative" style={{ backgroundImage: `url(${coverImage || selectedTemplate.thumbnail_url})` }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4"><Heart className="w-8 h-8 fill-white" /></div>
                    <p className="text-xs uppercase tracking-[0.2em] mb-2 font-kalam opacity-80">The Wedding of</p>
                    <h1 className="text-2xl font-bold font-cormorant mb-3">{formData.couple_names || "Nama Mempelai"}</h1>
                    {formData.event_date && <p className="text-xs opacity-80 font-kalam">{formatDate(formData.event_date)}</p>}
                  </div>
                </div>
                {/* Content Preview */}
                <div className="p-5 space-y-5 vintage-bg">
                  <div className="text-center py-4">
                    <p className="font-kalam text-vintage-gold text-xs mb-1">بسم الله الرحمن الرحیم</p>
                    <h2 className="font-cormorant text-lg font-bold text-vintage-darkBrown">{formData.title || "Judul Undangan"}</h2>
                  </div>
                  {formData.bride_name && formData.groom_name && (
                    <div className="flex items-center justify-center gap-4 py-3">
                      <div className="text-center"><div className="w-14 h-14 rounded-full bg-vintage-parchment flex items-center justify-center mx-auto mb-1"><span className="font-cormorant text-lg text-vintage-darkBrown font-bold">{formData.bride_name.charAt(0)}</span></div><p className="font-cormorant text-xs font-semibold text-vintage-darkBrown">{formData.bride_name}</p></div>
                      <Heart className="w-4 h-4 text-vintage-gold fill-vintage-gold" />
                      <div className="text-center"><div className="w-14 h-14 rounded-full bg-vintage-parchment flex items-center justify-center mx-auto mb-1"><span className="font-cormorant text-lg text-vintage-darkBrown font-bold">{formData.groom_name.charAt(0)}</span></div><p className="font-cormorant text-xs font-semibold text-vintage-darkBrown">{formData.groom_name}</p></div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 text-xs text-vintage-brown"><Calendar className="w-4 h-4 text-vintage-gold flex-shrink-0" /><span className="font-kalam">{formData.event_date ? formatDate(formData.event_date) : "Tanggal"}{formData.event_time ? ` - ${formatTime(formData.event_time)}` : ""}</span></div>
                    <div className="flex items-center gap-2.5 text-xs text-vintage-brown"><MapPin className="w-4 h-4 text-vintage-gold flex-shrink-0" /><span className="font-kalam">{formData.location_name || "Lokasi"}</span></div>
                  </div>
                  {galleryImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-1.5">
                      {galleryImages.slice(0, 6).map((img, i) => (
                        <img key={i} src={img} alt="" className="w-full aspect-square object-cover rounded" />
                      ))}
                    </div>
                  )}
                  <div className="py-3 text-center">
                    <p className="font-kalam text-[10px] text-vintage-brown/60">Undangkuy</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Publish Success Modal */}
      <AnimatePresence>
        {publishSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3"><CheckCircle className="w-7 h-7 text-green-600" /></div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Berhasil Dipublikasi!</h2>
                <p className="text-sm text-gray-500">Bagikan link undangan kepada tamu</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Link Utama</label>
                  <div className="flex items-center gap-2">
                    <input type="text" readOnly value={`${origin}/${publishSuccess.event_path}`} className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                    <button onClick={() => navigator.clipboard.writeText(`${origin}/${publishSuccess.event_path}`)} className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"><Copy className="w-4 h-4" /></button>
                    <a href={`/${publishSuccess.event_path}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"><ExternalLink className="w-4 h-4" /></a>
                  </div>
                </div>
                {publishSuccess.guest_names.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Link per Tamu ({publishSuccess.guest_names.length})</label>
                    <div className="max-h-32 overflow-y-auto space-y-1.5">
                      {publishSuccess.guest_names.map((name, i) => {
                        const link = `${origin}/${publishSuccess.event_path}?guest=${encodeURIComponent(name)}`;
                        return (
                          <div key={i} className="flex items-center gap-2">
                            <p className="text-xs font-medium text-gray-700 flex-shrink-0">{name}</p>
                            <button onClick={() => navigator.clipboard.writeText(link)} className="p-1 bg-primary-50 text-primary-600 rounded hover:bg-primary-100 flex-shrink-0"><Copy className="w-3 h-3" /></button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setPublishSuccess(null)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm">Tutup</button>
                <button onClick={() => { if (isLoggedIn) router.push("/dashboard"); else router.push(`/${publishSuccess.event_path}`); }} className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium text-sm">{isLoggedIn ? "Ke Dashboard" : "Lihat Undangan"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}