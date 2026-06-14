-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('modern', 'rustik', 'tradisional', 'minimalis')),
    config_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    event_path TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('pernikahan', 'ultah', 'tasyakuran', 'lainnya')),
    couple_names TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    location_name TEXT NOT NULL,
    maps_url TEXT,
    music_url TEXT,
    music_embed TEXT,
    video_url TEXT,
    video_embed TEXT,
    template_id TEXT,
    background_effect TEXT DEFAULT 'flowers',
    animation_style TEXT DEFAULT 'fade',
    cover_image TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSVPs table
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    attendance_status TEXT NOT NULL CHECK (attendance_status IN ('hadir', 'tidak_hadir', 'belum_konfirmasi')),
    total_guests INTEGER DEFAULT 1,
    message TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_event_path ON public.events(event_path);
CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON public.rsvps(event_id);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Templates policies (public read)
CREATE POLICY "Anyone can view active templates" ON public.templates
    FOR SELECT USING (is_active = true);

-- Events policies
CREATE POLICY "Anyone can view published events" ON public.events
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view own events" ON public.events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create events" ON public.events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON public.events
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" ON public.events
    FOR DELETE USING (auth.uid() = user_id);

-- RSVPs policies
CREATE POLICY "Anyone can view RSVPs for published events" ON public.rsvps
    FOR SELECT USING (
        event_id IN (SELECT id FROM public.events WHERE status = 'published')
    );

CREATE POLICY "Anyone can create RSVPs for published events" ON public.rsvps
    FOR INSERT WITH CHECK (
        event_id IN (SELECT id FROM public.events WHERE status = 'published')
    );

-- Trigger to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, display_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default templates
INSERT INTO public.templates (name, thumbnail_url, category, config_data) VALUES
('Modern Elegant', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop', 'modern', '{"primaryColor": "#D4AF37", "secondaryColor": "#1a1a2e", "fontFamily": "Playfair Display", "animation": "fade", "backgroundEffect": "gradient"}'),
('Rustic Romance', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=600&fit=crop', 'rustik', '{"primaryColor": "#8B7355", "secondaryColor": "#F5F5DC", "fontFamily": "Dancing Script", "animation": "slide", "backgroundEffect": "flowers"}'),
('Traditional Gold', 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=400&h=600&fit=crop', 'tradisional', '{"primaryColor": "#B8860B", "secondaryColor": "#2c1810", "fontFamily": "Cinzel", "animation": "zoom", "backgroundEffect": "ornament"}'),
('Minimalist White', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=600&fit=crop', 'minimalis', '{"primaryColor": "#000000", "secondaryColor": "#ffffff", "fontFamily": "Inter", "animation": "fade", "backgroundEffect": "none"}')
ON CONFLICT DO NOTHING;
