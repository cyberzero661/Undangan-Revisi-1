import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Event tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get event error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin();
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    
    const { data: existingEvent, error: fetchError } = await supabase
      .from('events')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingEvent) {
      return NextResponse.json(
        { error: 'Event tidak ditemukan' },
        { status: 404 }
      );
    }

    let userId: string | null = null;
    if (authHeader && !body.is_guest) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    if (existingEvent.user_id && userId && existingEvent.user_id !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from('events')
      .update({
        title: body.title,
        event_type: body.event_type,
        couple_names: body.couple_names,
        event_date: body.event_date,
        event_time: body.event_time,
        location_name: body.location_name,
        maps_url: body.maps_url,
        music_url: body.music_url,
        music_embed: body.music_embed,
        video_url: body.video_url,
        video_embed: body.video_embed,
        template_id: body.template_id,
        background_effect: body.background_effect,
        animation_style: body.animation_style,
        cover_image: body.cover_image,
        gallery_images: body.gallery_images,
        guest_names: body.guest_names || [],
        template_content: body.template_content || {},
        template_styles: body.template_styles || {},
        template_sections: body.template_sections || [],
        status: body.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin();
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: existingEvent, error: fetchError } = await supabase
      .from('events')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingEvent) {
      return NextResponse.json(
        { error: 'Event tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existingEvent.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Event berhasil dihapus' });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
