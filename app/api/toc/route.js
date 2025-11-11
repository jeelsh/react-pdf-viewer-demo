import { NextResponse } from 'next/server';
import { buildTocWithGemini } from '@/app/_lib/toc/build-with-gemini';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const url = new URL(req.url);
    const queryReset = url.searchParams.get('reset');
    const resetRequested = queryReset === 'true' || body?.reset === true || body?.force === 'reset' || body?.force === 'RESET';
    const { pages, totalPages, language = 'es' } = body || {};

    // Cache file path (project-root/data/toc-cache.json)
    const cacheDir = path.join(process.cwd(), 'data');
    const cachePath = path.join(cacheDir, 'toc-cache.json');

    // If not forcing a reset, try to read cached result and return it
    if (!resetRequested) {
      try {
        const raw = await fs.readFile(cachePath, 'utf8');
        if (raw && raw.trim()) {
          const parsed = JSON.parse(raw);
          // basic validation
          if (parsed && Array.isArray(parsed.items) && parsed.totalPages) {
            return NextResponse.json(parsed, { status: 200 });
          }
        }
        // fall through to regenerate if file empty or invalid
      } catch (readErr) {
        // If file not found or corrupted, we'll regenerate below
        // console.debug('TOC cache read failed, will regenerate:', readErr?.message);
      }
    }

    // Expect client to send extracted text instead of PDF processing on server
    if (!Array.isArray(pages) || !totalPages) {
      return NextResponse.json({ 
        error: 'pages array and totalPages are required when regenerating TOC. Extract text on client side.' 
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

    const result = { totalPages, items: withIds(toc) };

    // Ensure cache directory exists then write the file (pretty-printed)
    try {
      await fs.mkdir(cacheDir, { recursive: true });
      await fs.writeFile(cachePath, JSON.stringify(result, null, 2), 'utf8');
    } catch (writeErr) {
      // If writing fails, still return the generated TOC but surface a warning in console
      // console.error('Failed to write TOC cache:', writeErr?.message);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'toc_failed' }, { status: 500 });
  }
}
