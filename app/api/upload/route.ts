import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

const MAX_FILE_SIZES = {
  image: 5 * 1024 * 1024,
  music: 10 * 1024 * 1024,
  video: 20 * 1024 * 1024,
};

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'general';
    const type = formData.get('type') as 'image' | 'music' | 'video';

    if (!file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 400 }
      );
    }

    const maxSize = MAX_FILE_SIZES[type] || MAX_FILE_SIZES.image;
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        { error: `Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB` },
        { status: 400 }
      );
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('undangkuy')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    const { data: { publicUrl } } = supabase.storage
      .from('undangkuy')
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: publicUrl,
      path: filePath,
      fileName: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL tidak ditemukan' }, { status: 400 });
    }

    // Extract path from public URL: https://xxx.supabase.co/storage/v1/object/public/undangkuy/path/to/file.jpg
    const storageUrl = supabaseUrl.replace(/\/$/, '');
    const publicPrefix = `${storageUrl}/storage/v1/object/public/undangkuy/`;
    
    let filePath = url;
    if (url.startsWith(publicPrefix)) {
      filePath = url.substring(publicPrefix.length);
    } else if (url.includes('/storage/v1/object/public/undangkuy/')) {
      const idx = url.indexOf('/storage/v1/object/public/undangkuy/');
      filePath = url.substring(idx + '/storage/v1/object/public/undangkuy/'.length);
    }

    if (!filePath) {
      return NextResponse.json({ error: 'Invalid URL path' }, { status: 400 });
    }

    const { error } = await supabase.storage.from('undangkuy').remove([decodeURIComponent(filePath)]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'File deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
