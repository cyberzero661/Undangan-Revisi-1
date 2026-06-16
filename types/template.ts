import { Event } from "@/types/database";

export interface TemplateSection {
  id: string;
  type: "cover" | "couple" | "countdown" | "detail" | "gallery" | "rsvp" | "wishes";
  visible: boolean;
  order: number;
}

export interface CoupleProfile {
  name: string;
  role: string;
  photo: string;
  bio: string;
  parents: string;
  instagram: string;
}

export interface TemplateContent {
  cover: {
    tagline: string;
    mainText: string;
    secondaryText: string;
    showGuestName: boolean;
    envelopeStyle: "classic" | "modern" | "minimal";
    openingLabel: string;
    showParticles: boolean;
    sealIcon: "stamp" | "heart" | "crown" | "flower";
  };
  couple: {
    show: boolean;
    bride: CoupleProfile;
    groom: CoupleProfile;
  };
  countdown: {
    show: boolean;
    title: string;
  };
  detail: {
    introTitle: string;
    introText: string;
    dateLabel: string;
    timeLabel: string;
    locationLabel: string;
    mapsButtonText: string;
  };
  gallery: {
    title: string;
  };
  rsvp: {
    title: string;
    subtitle: string;
    attendanceLabel: string;
    hadirText: string;
    tidakHadirText: string;
    submitButtonText: string;
    successTitle: string;
    successText: string;
  };
  wishes: {
    title: string;
    emptyText: string;
  };
}

export interface TemplateConfig {
  id: string;
  name: string;
  thumbnail_url: string;
  category: "modern" | "rustik" | "tradisional" | "minimalis";
  sections: TemplateSection[];
  content: TemplateContent;
  styles: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    backgroundEffect: string;
  };
}

export function getDefaultContent(): TemplateContent {
  return {
    cover: {
      tagline: "The Wedding of",
      mainText: "",
      secondaryText: "",
      showGuestName: true,
      envelopeStyle: "classic",
      openingLabel: "Ketuk untuk Membuka",
      showParticles: true,
      sealIcon: "stamp",
    },
    couple: {
      show: true,
      bride: { name: "", role: "Mempelai Wanita", photo: "", bio: "", parents: "", instagram: "" },
      groom: { name: "", role: "Mempelai Pria", photo: "", bio: "", parents: "", instagram: "" },
    },
    countdown: {
      show: true,
      title: "Menuju Hari Bahagia",
    },
    detail: {
      introTitle: "Kami Mengundang Anda",
      introText: "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara spesial kami. Kehadiran dan doa restu Anda adalah hadiah terindah bagi kami.",
      dateLabel: "Tanggal",
      timeLabel: "Waktu",
      locationLabel: "Lokasi",
      mapsButtonText: "Buka di Maps",
    },
    gallery: {
      title: "Galeri Momen",
    },
    rsvp: {
      title: "Konfirmasi Kehadiran",
      subtitle: "Silakan isi form di bawah ini untuk mengkonfirmasi kehadiran Anda",
      attendanceLabel: "Konfirmasi Kehadiran",
      hadirText: "Hadir",
      tidakHadirText: "Tidak Hadir",
      submitButtonText: "Kirim Konfirmasi",
      successTitle: "Terima Kasih!",
      successText: "Konfirmasi Anda telah kami terima. Sampai jumpa di acara kami!",
    },
    wishes: {
      title: "Ucapan & Doa",
      emptyText: "Belum ada ucapan. Jadilah yang pertama!",
    },
  };
}

export function mergeWithDefaults(loaded: any): TemplateContent {
  const def = getDefaultContent();
  return {
    cover: { ...def.cover, ...(loaded?.cover || {}) },
    couple: {
      ...def.couple,
      ...(loaded?.couple || {}),
      bride: { ...def.couple.bride, ...(loaded?.couple?.bride || {}) },
      groom: { ...def.couple.groom, ...(loaded?.couple?.groom || {}) },
    },
    countdown: { ...def.countdown, ...(loaded?.countdown || {}) },
    detail: { ...def.detail, ...(loaded?.detail || {}) },
    gallery: { ...def.gallery, ...(loaded?.gallery || {}) },
    rsvp: { ...def.rsvp, ...(loaded?.rsvp || {}) },
    wishes: { ...def.wishes, ...(loaded?.wishes || {}) },
  };
}
