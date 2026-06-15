import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { event_id: string } }
) {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .eq('event_id', params.event_id)
      .order('submitted_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Get wishes error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}