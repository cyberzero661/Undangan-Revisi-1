export interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

export interface LoveStory {
  date: string;
  title: string;
  description: string;
  photo_url?: string;
}

export interface DigitalEnvelopeItem {
  name: string;
  bank?: string;
  account_number: string;
  holder: string;
  type: "bank" | "ewallet";
  icon?: string;
}

export interface Event {
  id: string;
  user_id?: string | null;
  event_path: string;
  title: string;
  event_type: "pernikahan" | "ultah" | "tasyakuran" | "lainnya";
  couple_names?: string | null;
  event_date: string;
  event_time?: string | null;
  location_name: string;
  maps_url?: string | null;
  music_url?: string | null;
  music_embed?: string | null;
  video_url?: string | null;
  video_embed?: string | null;
  template_id?: string | null;
  background_effect?: string;
  animation_style?: string;
  cover_image?: string | null;
  gallery_images?: string[];
  guest_names?: string[];
  status: "draft" | "published";
  created_at: string;
  updated_at?: string;
  bride_name?: string | null;
  groom_name?: string | null;
  bride_photo?: string | null;
  groom_photo?: string | null;
  bride_parent_name?: string | null;
  groom_parent_name?: string | null;
  love_stories?: LoveStory[];
  digital_envelope?: DigitalEnvelopeItem[];
  youtube_live_url?: string | null;
  expires_at?: string | null;
}

export interface Template {
  id: string;
  name: string;
  thumbnail_url: string;
  category: "modern" | "rustik" | "tradisional" | "minimalis" | "premium";
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
  message: string | null;
  submitted_at: string;
}

export interface Wish {
  id: string;
  event_id: string;
  guest_name: string;
  message: string;
  submitted_at: string;
}

export interface EditorFormData {
  title: string;
  couple_names: string;
  bride_name: string;
  groom_name: string;
  bride_photo: string;
  groom_photo: string;
  bride_parent_name: string;
  groom_parent_name: string;
  event_date: string;
  event_time: string;
  location_name: string;
  maps_url: string;
  music_url: string;
  music_embed: string;
  video_url: string;
  video_embed: string;
  youtube_live_url: string;
  template_id: string;
  gallery_images: string[];
  background_effect: string;
  animation_style: string;
  guest_names: string[];
  love_stories: LoveStory[];
  digital_envelope: DigitalEnvelopeItem[];
}

export interface RSVPFormData {
  guest_name: string;
  attendance_status: "hadir" | "tidak_hadir";
  total_guests: number;
  message: string;
}

export interface WishFormData {
  guest_name: string;
  message: string;
}