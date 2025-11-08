import { NextResponse } from 'next/server';
import { buildTocWithGemini } from '@/app/_lib/toc/build-with-gemini';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const body = await req.json();
    const { pages, totalPages, language = 'es' } = body || {};
    
    // Expect client to send extracted text instead of PDF processing on server
    if (!Array.isArray(pages) || !totalPages) {
      return NextResponse.json({ 
        error: 'pages array and totalPages are required. Extract text on client side.' 
      }, { status: 400 });
    }

    const toc = await buildTocWithGemini({ totalPages, pages, language });

    // Normalize ids (slug)
    const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
    const withIds = (items) => (items || []).map((it) => ({
      id: it.id || slug(it.title || 'section'),
      title: it.title || 'Sección',
      page: Math.min(Math.max(1, Number(it.page || 1)), totalPages),
      children: withIds(it.children),
    }));

    return NextResponse.json({ totalPages, items: withIds(toc) }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'toc_failed' }, { status: 500 });
  }
}
