import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const eventPath = searchParams.get('event_path');
    const status = searchParams.get('status');

    let query = supabase
      .from('events')
      .select('*');

    if (eventPath) {
      query = query.eq('event_path', eventPath);
      const { data, error } = await query.single();
      
      if (error) {
        return NextResponse.json(
          { error: 'Event tidak ditemukan' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(data);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    const { status, is_guest } = body;

    let userId: string | null = null;

    if (authHeader && !is_guest) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    const {
      title,
      event_type,
      couple_names,
      event_date,
      event_time,
      location_name,
      maps_url,
      music_url,
      music_embed,
      video_url,
      video_embed,
      template_id,
      background_effect,
      animation_style,
      cover_image,
      gallery_images,
      guest_names,
    } = body;

    if (!title || !event_type || !event_date || !location_name) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    const eventPath = 
      title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + 
      '-' + Date.now().toString(36);

    const eventStatus = status || (is_guest ? 'published' : 'draft');

    const { data, error } = await supabase
      .from('events')
      .insert({
        user_id: userId,
        event_path: eventPath,
        title,
        event_type,
        couple_names,
        event_date,
        event_time,
        location_name,
        maps_url,
        music_url,
        music_embed,
        video_url,
        video_embed,
        template_id,
        background_effect: background_effect || 'flowers',
        animation_style: animation_style || 'fade',
        cover_image,
        gallery_images: gallery_images || [],
        guest_names: guest_names || [],
        status: eventStatus,
        expires_at: is_guest ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
