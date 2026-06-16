import { Template, Event, RSVP } from "@/types";

export const templates: Template[] = [
  {
    id: "modern-1",
    name: "Modern Elegant",
    thumbnail_url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=600&fit=crop",
    category: "modern",
    config_data: {
      primaryColor: "#D4AF37",
      secondaryColor: "#1a1a2e",
      fontFamily: "Playfair Display",
      animation: "fade",
      backgroundEffect: "gradient",
    },
  },
  {
    id: "rustik-1",
    name: "Rustic Romance",
    thumbnail_url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=600&fit=crop",
    category: "rustik",
    config_data: {
      primaryColor: "#8B7355",
      secondaryColor: "#F5F5DC",
      fontFamily: "Dancing Script",
      animation: "slide",
      backgroundEffect: "flowers",
    },
  },
  {
    id: "tradisional-1",
    name: "Traditional Gold",
    thumbnail_url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=600&fit=crop",
    category: "tradisional",
    config_data: {
      primaryColor: "#B8860B",
      secondaryColor: "#2c1810",
      fontFamily: "Cinzel",
      animation: "zoom",
      backgroundEffect: "ornament",
    },
  },
  {
    id: "minimalis-1",
    name: "Minimalist White",
      thumbnail_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=600&fit=crop",
    category: "minimalis",
    config_data: {
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
      fontFamily: "Inter",
      animation: "fade",
      backgroundEffect: "none",
    },
  },
];

export const mockEvents: Event[] = [
  {
    id: "1",
    user_id: "user-1",
    event_path: "dea-adi-wedding",
    title: "Pernikahan Fulana & Fulani",
    event_type: "pernikahan",
    event_date: "2026-07-15",
    event_time: "10:00",
    location_name: "Gedung Pernikahan Harmony, Jakarta",
    maps_url: "https://maps.google.com/?q=-6.2088,106.8456",
    music_embed: "",
    video_embed: "",
    template_id: "modern-1",
    cover_image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop",
    created_at: "2026-06-01T10:00:00Z",
    status: "published",
  },
  {
    id: "2",
    user_id: "user-1",
    event_path: "ulang-tahun-rina",
    title: "Ulang Tahun Rina ke-25",
    event_type: "ultah",
    event_date: "2026-06-20",
    event_time: "19:00",
    location_name: "Rumah Makan Bintang, Bandung",
    maps_url: "",
    template_id: "minimalis-1",
    created_at: "2026-06-10T08:00:00Z",
    status: "draft",
  },
];

export const mockRSVPs: RSVP[] = [
  {
    id: "1",
    event_id: "1",
    guest_name: "Budi Santoso",
    attendance_status: "hadir",
    total_guests: 2,
    message: "Selamat ya Fulana & Fulani! Semoga menjadi keluarga sakinah mawaddah warahmah.",
    submitted_at: "2026-06-05T14:30:00Z",
  },
  {
    id: "2",
    event_id: "1",
    guest_name: "Siti Rahayu",
    attendance_status: "hadir",
    total_guests: 1,
    message: "Semoga hari spesialnya menyenangkan!",
    submitted_at: "2026-06-06T09:15:00Z",
  },
  {
    id: "3",
    event_id: "1",
    guest_name: "Ahmad Fauzi",
    attendance_status: "tidak_hadir",
    total_guests: 0,
    message: "Maaf tidak bisa hadir. Semoga luar biasa ya!",
    submitted_at: "2026-06-07T11:00:00Z",
  },
];

export const featureCards = [
  {
    icon: "Sparkles",
    title: "Animasi Interaktif",
    description: "Efek transisi halaman, animasi teks, dan visual yang memukau.",
  },
  {
    icon: "Music",
    title: "Musik Latar",
    description: "Tambahkan musik atau gunakan tautan Spotify, SoundCloud, YouTube.",
  },
  {
    icon: "Images",
    title: "Galeri Foto & Video",
    description: "Pamerkan momen spesial dengan galeri yang indah.",
  },
  {
    icon: "MapPin",
    title: "Integrasi Peta",
    description: "Tamu mudah menemukan lokasi acara dengan Google Maps.",
  },
  {
    icon: "Users",
    title: "Sistem RSVP",
    description: "Pantau kehadiran tamu secara real-time.",
  },
  {
    icon: "Share2",
    title: "Share Link",
    description: "Bagikan ke WhatsApp dan media sosial dengan mudah.",
  },
];

export const backgroundEffects = [
  { id: "none", name: "Tanpa Efek", icon: null },
  { id: "gradient", name: "Gradient Halus", icon: "Sparkles" },
  { id: "flowers", name: "Guguran Bunga", icon: "Flower2" },
  { id: "snow", name: "Salju", icon: "CloudSnow" },
  { id: "sparkle", name: "Kilauan", icon: "Sparkles" },
  { id: "ornament", name: "Ornamen Emas", icon: "Crown" },
];

export const animationStyles = [
  { id: "fade", name: "Fade" },
  { id: "slide", name: "Slide" },
  { id: "zoom", name: "Zoom" },
  { id: "bounce", name: "Bounce" },
];
