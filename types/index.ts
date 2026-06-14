export interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

export interface Event {
  id: string;
  user_id: string;
  event_path: string;
  title: string;
  event_type: "pernikahan" | "ultah" | "tasyakuran" | "lainnya";
  event_date: string;
  event_time?: string;
  location_name: string;
  maps_url?: string;
  music_url?: string;
  music_embed?: string;
  video_url?: string;
  video_embed?: string;
  template_id: string;
  cover_image?: string;
  created_at: string;
  status: "draft" | "published";
  guest_names?: string[];
}

export interface Template {
  id: string;
  name: string;
  thumbnail_url: string;
  category: "modern" | "rustik" | "tradisional" | "minimalis";
  config_data: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    animation: string;
    backgroundEffect: string;
  };
}

export interface EventImage {
  id: string;
  event_id: string;
  image_url: string;
  display_order: number;
}

export interface RSVP {
  id: string;
  event_id: string;
  guest_name: string;
  attendance_status: "hadir" | "tidak_hadir" | "belum_konfirmasi";
  total_guests: number;
  message?: string;
  submitted_at: string;
}

export interface EditorFormData {
  title: string;
  couple_names: string;
  event_date: string;
  event_time: string;
  location_name: string;
  maps_url: string;
  music_url: string;
  music_embed: string;
  video_url: string;
  video_embed: string;
  template_id: string;
  gallery_images: string[];
  background_effect: string;
  animation_style: string;
  guest_names: string[];
}

export interface RSVPFormData {
  guest_name: string;
  attendance_status: "hadir" | "tidak_hadir";
  total_guests: number;
  message: string;
}
