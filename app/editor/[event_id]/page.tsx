"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Save, ArrowLeft, Calendar, MapPin, Music, Image as Images,
  Palette, Info, Upload, X, Check, Monitor, Smartphone, Maximize2,
  Volume2, ChevronDown, AlertCircle, User, Copy, ExternalLink, CheckCircle,
  FileText, Eye
} from "lucide-react";
import { BrandedLoading, BrandedSpinner } from "@/components/shared/BrandedLoading";
import { templates } from "@/lib/data";
import { EditorFormData } from "@/types";
import { formatFileSize, FILE_LIMITS, formatDate, formatTime, copyToClipboard } from "@/lib/utils";
import { eventsAPI, uploadFile, deleteFile } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/lib/toast";
import { TemplateContent, TemplateSection, getDefaultContent, mergeWithDefaults } from "@/types/template";
import { TemplateEditorPanel, ModernTemplate, RusticTemplate, TraditionalTemplate, MinimalistTemplate } from "@/components/templates";
import { CoverEditor } from "@/components/templates/editors/CoverEditor";
import { RSVPFormData } from "@/components/templates/TemplateSections";
import { Event as DBEvent } from "@/types/database";

const tabs = [
  { id: "info", label: "Info Acara", icon: Info },
  { id: "media", label: "Media", icon: Images },
  { id: "cover", label: "Cover", icon: Eye },
  { id: "template", label: "Template", icon: FileText },
  { id: "design", label: "Desain", icon: Palette },
];

const eventTypes = [
  { id: "pernikahan", label: "Pernikahan" },
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
  const [templateContent, setTemplateContent] = useState<TemplateContent>(getDefaultContent());
  const [templateSections, setTemplateSections] = useState<TemplateSection[]>([
    { id: "cover", type: "cover", visible: true, order: 0 },
    { id: "couple", type: "couple", visible: true, order: 1 },
    { id: "countdown", type: "countdown", visible: true, order: 2 },
    { id: "detail", type: "detail", visible: true, order: 3 },
    { id: "gallery", type: "gallery", visible: true, order: 4 },
    { id: "rsvp", type: "rsvp", visible: true, order: 5 },
    { id: "wishes", type: "wishes", visible: true, order: 6 },
  ]);
  const [templatePrimaryColor, setTemplatePrimaryColor] = useState("#D4AF37");
  const [templateSecondaryColor, setTemplateSecondaryColor] = useState("#F5F5DC");
  const [sidebarWidth, setSidebarWidth] = useState(384); // w-96 = 384px
  const [isResizing, setIsResizing] = useState(false);
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setOrigin(window.location.origin);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(280, Math.min(800, e.clientX));
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const buildPreviewEvent = (): DBEvent => ({
    id: currentEventId || "preview",
    user_id: "",
    event_path: "preview",
    title: formData.title,
    event_type: "pernikahan",
    couple_names: formData.couple_names,
    event_date: formData.event_date || new Date().toISOString().split("T")[0],
    event_time: formData.event_time || "",
    location_name: formData.location_name || "Lokasi Acara",
    maps_url: formData.maps_url,
    music_url: formData.music_url,
    music_embed: formData.music_embed,
    video_url: formData.video_url,
    video_embed: formData.video_embed,
    template_id: selectedTemplate.id,
    background_effect: formData.background_effect,
    animation_style: formData.animation_style,
    cover_image: coverImage || null,
    gallery_images: galleryImages,
    guest_names: formData.guest_names || [],
    template_content: templateContent as unknown as Record<string, unknown>,
    template_styles: { primaryColor: templatePrimaryColor, secondaryColor: templateSecondaryColor },
    template_sections: templateSections as unknown as Record<string, unknown>[],
    status: "draft",
    expires_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const renderPreviewTemplate = () => {
    const previewEvent = buildPreviewEvent();
    const tid = selectedTemplate.id;
    const props = {
      event: previewEvent,
      rsvps: [],
      templateContent,
      primaryColor: templatePrimaryColor,
      secondaryColor: templateSecondaryColor,
      guestName: "",
      isOpened: true,
      onOpen: () => {},
      rsvpForm: { name: "", attendance: "" as const, total_guests: 1, message: "" } as RSVPFormData,
      onRsvpFormChange: () => {},
      onRsvpSubmit: () => {},
      rsvpSubmitted: false,
      isSubmitting: false,
    };
    if (tid.startsWith("rustik")) return <RusticTemplate {...props} />;
    if (tid.startsWith("tradisional")) return <TraditionalTemplate {...props} />;
    if (tid.startsWith("minimalis")) return <MinimalistTemplate {...props} />;
    return <ModernTemplate {...props} />;
  };

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
      if (event.template_content && Object.keys(event.template_content).length > 0) {
        setTemplateContent(mergeWithDefaults(event.template_content));
      }
      if (event.template_styles && Object.keys(event.template_styles).length > 0) {
        const styles = event.template_styles as { primaryColor?: string; secondaryColor?: string };
        if (styles.primaryColor) setTemplatePrimaryColor(styles.primaryColor);
        if (styles.secondaryColor) setTemplateSecondaryColor(styles.secondaryColor);
      }
      if (event.template_sections && Array.isArray(event.template_sections) && event.template_sections.length > 0) {
        setTemplateSections(event.template_sections as unknown as TemplateSection[]);
      }
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
      toast(`File terlalu besar. Maksimal ${formatFileSize(FILE_LIMITS[type])}`, "error");
      return;
    }
    try {
      if (type === "music") setMusicUploading(true);
      const result = await uploadFile(file, type === "image" ? "gallery" : "media");
      if (type === "image") {
        setGalleryImages((prev) => [...prev, result.url]);
        setFormData((prev) => ({ ...prev, gallery_images: [...prev.gallery_images, result.url] }));
      } else if (type === "music") {
        setFormData((prev) => ({ ...prev, music_url: result.url }));
      }
      else setFormData((prev) => ({ ...prev, video_url: result.url }));
    } catch (err: any) { toast(err.message || "Upload gagal", "error"); }
    finally { if (type === "music") setMusicUploading(false); }
  };

  const removeMusic = () => {
    if (formData.music_url) {
      deleteFile(formData.music_url).catch(() => {});
    }
    setFormData((prev) => ({ ...prev, music_url: "" }));
  };

  const removeGalleryImage = (index: number) => {
    const url = galleryImages[index];
    if (url) deleteFile(url).catch(() => {});
    const newImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newImages);
    setFormData((prev) => ({ ...prev, gallery_images: newImages }));
  };

  const handleSave = async () => {
    if (!isLoggedIn) { toast("Silakan login untuk menyimpan draf", "info"); return; }
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
        template_content: templateContent,
        template_styles: { primaryColor: templatePrimaryColor, secondaryColor: templateSecondaryColor },
        template_sections: templateSections,
      };
      if (currentEventId) {
        await eventsAPI.update(currentEventId, eventData);
        toast("Undangan berhasil disimpan!", "success");
      } else {
        const newEvent = await eventsAPI.create(eventData);
        setCurrentEventId(newEvent.id);
        router.replace(`/editor/${newEvent.id}`);
        toast("Undangan berhasil dibuat!", "success");
      }
    } catch (err: any) { setError(err.message || "Gagal menyimpan"); }
    finally { setIsSaving(false); }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.event_date || !formData.location_name) {
      toast("Lengkapi data undangan terlebih dahulu!", "error"); return;
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
        template_content: templateContent,
        template_styles: { primaryColor: templatePrimaryColor, secondaryColor: templateSecondaryColor },
        template_sections: templateSections,
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
      <BrandedLoading size="lg" text="Memuat..." />
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
            <span className="font-semibold text-gray-800 text-sm sm:text-base">{isNew ? "Buat Undangan" : "Edit Undangan"}</span>
          </div>
          {isGuest && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Mode Tamu</span>}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileView(mobileView === "editor" ? "preview" : "editor")}
            className="md:hidden px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            {mobileView === "editor" ? "Preview" : "Edit"}
          </button>
          <button onClick={handleSave} disabled={isSaving || !isLoggedIn}
            className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 disabled:opacity-50 text-sm"
          >
            {isSaving ? <BrandedSpinner /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">Simpan{isGuest ? "" : " Draf"}</span>
          </button>
          <button onClick={handlePublish} disabled={isSaving}
            className="px-3 sm:px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-1 sm:gap-2 text-sm"
          >
            {isSaving && <BrandedSpinner />}
            <span className="hidden sm:inline">{isGuest ? "Publikasikan (7 hari)" : "Publikasikan"}</span>
            <span className="sm:hidden">Publish</span>
          </button>
        </div>
      </nav>

      {error && (
        <div className="px-4 py-3 bg-red-50 border-b border-red-200 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" /><span>{error}</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div
          className={`bg-white border-r border-gray-100 flex flex-col overflow-hidden relative ${
            isMobile ? (mobileView === "preview" ? "hidden" : "") : ""
          } ${isMobile ? "w-full" : ""}`}
          style={isMobile ? undefined : { width: sidebarWidth }}
        >
          <div
            onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
            className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-primary-500/20 z-10"
          />
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-3 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2 ${activeTab === tab.id ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-500 hover:text-gray-700"}`}>
                  <Icon className="w-4 h-4" /><span className="hidden sm:inline">{tab.label}</span>
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
                    placeholder="Contoh: Pernikahan Fulana & Fulani"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Mempelai/Penyelenggara</label>
                  <input type="text" name="couple_names" value={formData.couple_names} onChange={handleInputChange}
                    placeholder="Contoh: Fulana & Fulani"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link Google Maps / Alamat</label>
                  <input type="text" name="maps_url" value={formData.maps_url} onChange={handleInputChange}
                    placeholder="Alamat lengkap atau link Google Maps..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  <p className="text-xs text-gray-400 mt-1">Contoh: Jl. Kartini No.49, Bandar Lampung, atau https://maps.google.com/?q=...</p>
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
                  {formData.music_url ? (
                    <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg border border-primary-200 mb-3">
                      <Music className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">Musik latar diupload</p>
                        <p className="text-xs text-gray-500 truncate">{formData.music_url.split('/').pop()}</p>
                      </div>
                      <button onClick={removeMusic} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors mb-3">
                      {musicUploading ? <BrandedSpinner /> : <Upload className="w-5 h-5 text-gray-400" />}
                      <span className="text-sm text-gray-500">{musicUploading ? "Mengupload..." : "Upload MP3"}</span>
                      <input type="file" accept="audio/mp3,audio/mpeg" className="hidden" disabled={musicUploading} onChange={(e) => handleFileUpload(e, "music")} />
                    </label>
                  )}
                  {formData.music_url && (
                    <label className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors mb-2">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Ganti Musik</span>
                      <input type="file" accept="audio/mp3,audio/mpeg" className="hidden" disabled={musicUploading} onChange={(e) => handleFileUpload(e, "music")} />
                    </label>
                  )}
                  <div className="text-center text-gray-400 text-xs mb-2">atau</div>
                  <input type="url" name="music_embed" value={formData.music_embed} onChange={handleInputChange}
                    placeholder="Spotify/SoundCloud embed URL"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Foto Mempelai</h3>
                  <p className="text-xs text-gray-500 mb-3">Upload foto untuk profil mempelai di undangan</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-xs font-medium text-pink-600 mb-2">Mempelai Wanita</p>
                      {templateContent.couple.bride.photo ? (
                        <div className="relative group aspect-square rounded-lg overflow-hidden">
                          <Image src={templateContent.couple.bride.photo} alt="Bride" fill className="object-cover" sizes="150px" />
                          <button onClick={() => {
                            if (templateContent.couple.bride.photo) deleteFile(templateContent.couple.bride.photo).catch(() => {});
                            setTemplateContent(prev => ({
                              ...prev, couple: { ...prev.couple, bride: { ...prev.couple.bride, photo: "" } }
                            }));
                          }} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 px-3 py-6 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-colors">
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-500">Upload</span>
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const result = await uploadFile(file, "profiles");
                              setTemplateContent(prev => ({
                                ...prev, couple: { ...prev.couple, bride: { ...prev.couple.bride, photo: result.url } }
                              }));
                            } catch (err: any) { toast(err.message || "Upload gagal", "error"); }
                          }} />
                        </label>
                      )}
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-xs font-medium text-blue-600 mb-2">Mempelai Pria</p>
                      {templateContent.couple.groom.photo ? (
                        <div className="relative group aspect-square rounded-lg overflow-hidden">
                          <Image src={templateContent.couple.groom.photo} alt="Groom" fill className="object-cover" sizes="150px" />
                          <button onClick={() => {
                            if (templateContent.couple.groom.photo) deleteFile(templateContent.couple.groom.photo).catch(() => {});
                            setTemplateContent(prev => ({
                              ...prev, couple: { ...prev.couple, groom: { ...prev.couple.groom, photo: "" } }
                            }));
                          }} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 px-3 py-6 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-500">Upload</span>
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const result = await uploadFile(file, "profiles");
                              setTemplateContent(prev => ({
                                ...prev, couple: { ...prev.couple, groom: { ...prev.couple.groom, photo: result.url } }
                              }));
                            } catch (err: any) { toast(err.message || "Upload gagal", "error"); }
                          }} />
                        </label>
                      )}
                    </div>
                  </div>
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
                        <div key={i} className="relative group aspect-square rounded-lg overflow-hidden">
                          <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover" sizes="100px" />
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

            {activeTab === "cover" && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <CoverEditor
                  content={templateContent.cover}
                  onChange={(c) => setTemplateContent(prev => ({ ...prev, cover: c }))}
                />
              </motion.div>
            )}

            {activeTab === "template" && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="h-full">
                <TemplateEditorPanel
                  content={templateContent}
                  sections={templateSections}
                  primaryColor={templatePrimaryColor}
                  secondaryColor={templateSecondaryColor}
                  onContentChange={setTemplateContent}
                  onSectionsChange={setTemplateSections}
                  onStylesChange={({ primaryColor, secondaryColor }) => {
                    setTemplatePrimaryColor(primaryColor);
                    setTemplateSecondaryColor(secondaryColor);
                  }}
                  onFileUpload={async (file: File) => {
                    const result = await uploadFile(file, "profiles");
                    return result.url;
                  }}
                />
              </motion.div>
            )}

            {activeTab === "design" && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Pilih Template</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {templates.map((template) => (
                      <button key={template.id} onClick={() => setSelectedTemplate(template)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all aspect-[3/4] ${selectedTemplate.id === template.id ? "border-primary-500 ring-2 ring-primary-200" : "border-gray-200 hover:border-gray-300"}`}>
                        <Image src={template.thumbnail_url} alt={template.name} fill className="object-cover" sizes="200px" />
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
              </motion.div>
            )}
          </div>
        </div>

        <div className={`${isMobile && mobileView === "editor" ? "hidden" : ""} flex-1 bg-gray-100 flex flex-col`}>
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
          
          <div className="flex-1 p-2 flex items-center justify-center overflow-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className={`bg-white shadow-2xl overflow-hidden border-4 border-gray-800 relative transition-all duration-300 ${
                previewDevice === "mobile" ? "w-[375px] h-[667px] rounded-[3rem]" : "w-full max-w-[480px] h-[700px] rounded-2xl"
              }`}>
              {previewDevice === "mobile" && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-10" />}
              <div className="h-full overflow-y-auto scrollbar-hide" style={{ pointerEvents: "none" }}>
                <div className="scale-75 origin-top-left w-[133%]">
                  {renderPreviewTemplate()}
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
            <button onClick={() => setPreviewOpen(false)}
              className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-[390px] h-[844px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-gray-800 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-10" />
              <div className="h-full overflow-y-auto scrollbar-hide">
                <div className="scale-[0.85] origin-top-left w-[118%]">
                  {renderPreviewTemplate()}
                </div>
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
                      onClick={async () => {
                        const ok = await copyToClipboard(`${origin}/${publishSuccess.event_path}`);
                        if (ok) toast("Link berhasil disalin!", "success");
                      }}
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
                              onClick={async () => {
                                const ok = await copyToClipboard(link);
                                if (ok) toast("Link berhasil disalin!", "success");
                              }}
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
