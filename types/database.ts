import { createClient } from '@supabase/supabase-js';

type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          name: string;
          thumbnail_url: string;
          category: 'modern' | 'rustik' | 'tradisional' | 'minimalis';
          config_data: Record<string, unknown>;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          thumbnail_url: string;
          category: 'modern' | 'rustik' | 'tradisional' | 'minimalis';
          config_data?: Record<string, unknown>;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          thumbnail_url?: string;
          category?: 'modern' | 'rustik' | 'tradisional' | 'minimalis';
          config_data?: Record<string, unknown>;
          is_active?: boolean;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          user_id: string | null;
          event_path: string;
          title: string;
          event_type: 'pernikahan' | 'ultah' | 'tasyakuran' | 'lainnya';
          couple_names: string | null;
          event_date: string;
          event_time: string | null;
          location_name: string;
          maps_url: string | null;
          music_url: string | null;
          music_embed: string | null;
          video_url: string | null;
          video_embed: string | null;
          template_id: string | null;
          background_effect: string;
          animation_style: string;
          cover_image: string | null;
          gallery_images: string[];
          guest_names: string[];
          status: 'draft' | 'published';
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_path: string;
          title: string;
          event_type: 'pernikahan' | 'ultah' | 'tasyakuran' | 'lainnya';
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
          status?: 'draft' | 'published';
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_path?: string;
          title?: string;
          event_type?: 'pernikahan' | 'ultah' | 'tasyakuran' | 'lainnya';
          couple_names?: string | null;
          event_date?: string;
          event_time?: string | null;
          location_name?: string;
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
          status?: 'draft' | 'published';
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      rsvps: {
        Row: {
          id: string;
          event_id: string;
          guest_name: string;
          attendance_status: 'hadir' | 'tidak_hadir' | 'belum_konfirmasi';
          total_guests: number;
          message: string | null;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          guest_name: string;
          attendance_status: 'hadir' | 'tidak_hadir' | 'belum_konfirmasi';
          total_guests?: number;
          message?: string | null;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          guest_name?: string;
          attendance_status?: 'hadir' | 'tidak_hadir' | 'belum_konfirmasi';
          total_guests?: number;
          message?: string | null;
          submitted_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type Event = Tables<'events'>;
export type RSVP = Tables<'rsvps'>;
export type Template = Tables<'templates'>;
export type User = Tables<'users'>;
