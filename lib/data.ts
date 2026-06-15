import { Template, Event, RSVP, Wish, LoveStory, DigitalEnvelopeItem } from "@/types";

export const templates: Template[] = [
  {
    id: "modern-1",
    name: "Modern Elegant",
    thumbnail_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop",
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
    thumbnail_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=600&fit=crop",
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
    thumbnail_url: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=400&h=600&fit=crop",
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
  {
    id: "premium-1",
    name: "Premium Scrapbook",
    thumbnail_url: "https://images.unsplash.com/photo-1520854221556-9c3a0e1f2b13?w=400&h=600&fit=crop",
    category: "premium",
    config_data: {
      primaryColor: "#c9a84c",
      secondaryColor: "#5c4a32",
      fontFamily: "Cormorant Garamond",
      animation: "fade",
      backgroundEffect: "flowers",
    },
  },
];

const mockLoveStories: LoveStory[] = [
  {
    date: "2020-01-15",
    title: "Pertama Bertemu",
    description: "Kami bertemu di sebuah kafe kecil di sudut kota. Senyummu yang hangat membuat hari itu menjadi istimewa.",
    photo_url: "https://images.unsplash.com/photo-1518199266791-5375d4e3293c?w=400&h=300&fit=crop",
  },
  {
    date: "2020-06-20",
    title: "Mulai Dekat",
    description: "Setelah berbulan-bulan mengenal satu sama lain, kami menyadari bahwa kami adalah takdir yang ditulis bersama.",
    photo_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop",
  },
  {
    date: "2022-12-25",
    title: "Lamaran",
    description: "Di bawah langit malam yang penuh bintang, aku mengatakan tiga kata yang mengubah hidup kami selamanya.",
    photo_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
  },
];

const mockDigitalEnvelope: DigitalEnvelopeItem[] = [
  {
    name: "Bank BCA",
    bank: "BCA",
    account_number: "1234567890",
    holder: "Dea & Adi",
    type: "bank",
  },
  {
    name: "Bank Mandiri",
    bank: "Mandiri",
    account_number: "0987654321",
    holder: "Dea & Adi",
    type: "bank",
  },
  {
    name: "GoPay - Dea",
    bank: "GoPay",
    account_number: "081234567890",
    holder: "Dea Putri",
    type: "ewallet",
  },
  {
    name: "OVO - Adi",
    bank: "OVO",
    account_number: "081234567891",
    holder: "Adi Nugraha",
    type: "ewallet",
  },
];

export const mockEvents: Event[] = [
  {
    id: "1",
    user_id: "user-1",
    event_path: "dea-adi-wedding",
    title: "Pernikahan Dea & Adi",
    event_type: "pernikahan",
    event_date: "2026-07-15",
    event_time: "10:00",
    location_name: "Gedung Pernikahan Harmony, Jakarta",
    maps_url: "https://maps.google.com/?q=-6.2088,106.8456",
    music_embed: "",
    video_embed: "",
    template_id: "premium-1",
    cover_image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop",
    created_at: "2026-06-01T10:00:00Z",
    status: "published",
    couple_names: "Dea & Adi",
    bride_name: "Dea Putri",
    groom_name: "Adi Nugraha",
    bride_photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    groom_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bride_parent_name: "Bapak Rudi & Ibu Sari",
    groom_parent_name: "Bapak Budi & Ibu Ani",
    love_stories: mockLoveStories,
    digital_envelope: mockDigitalEnvelope,
    youtube_live_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    background_effect: "flowers",
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
    message: "Selamat ya Dea & Adi! Semoga menjadi keluarga sakinah mawaddah warahmah.",
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

export const mockWishes: Wish[] = [
  {
    id: "1",
    event_id: "1",
    guest_name: "Budi Santoso",
    message: "Selamat ya Dea & Adi! Semoga menjadi keluarga sakinah mawaddah warahmah.",
    submitted_at: "2026-06-05T14:30:00Z",
  },
  {
    id: "2",
    event_id: "1",
    guest_name: "Siti Rahayu",
    message: "Semoga hari spesialnya menyenangkan! Bahagia selalu ya!",
    submitted_at: "2026-06-06T09:15:00Z",
  },
  {
    id: "3",
    event_id: "1",
    guest_name: "Ahmad Fauzi",
    message: "Maaf tidak bisa hadir. Semoga luar biasa ya! Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fi khair.",
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
  { id: "none", name: "Tanpa Efek", emoji: "⬜" },
  { id: "gradient", name: "Gradient Halus", emoji: "🌅" },
  { id: "flowers", name: "Guguran Bunga", emoji: "🌸" },
  { id: "snow", name: "Salju", emoji: "❄️" },
  { id: "sparkle", name: "Kilauan", emoji: "✨" },
  { id: "ornament", name: "Ornamen Emas", emoji: "👑" },
];

export const animationStyles = [
  { id: "fade", name: "Fade" },
  { id: "slide", name: "Slide" },
  { id: "zoom", name: "Zoom" },
  { id: "bounce", name: "Bounce" },
];