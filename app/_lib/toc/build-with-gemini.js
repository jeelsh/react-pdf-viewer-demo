import { GoogleGenerativeAI } from '@google/generative-ai';

// Build a Table of Contents using Gemini from extracted PDF text previews
// Input shape:
//   { totalPages: number, pages: [{ page: number, text: string }], language?: 'es' | 'en' }
// Output:
//   Array<{ id: string, title: string, page: number, children?: Array<...> }>
export async function buildTocWithGemini({ totalPages, pages, language = 'es' }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

  const genAI = new GoogleGenerativeAI(apiKey);
  // const models = await genAI.listModels();
  // console.log('Available models (short):', models.map(m => m.name || m.model || m.id));
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const safePages = Array.isArray(pages) ? pages.slice(0, Math.max(1, pages.length)) : [];

  const prompt = [
    `Eres un asistente que construye una tabla de contenidos (TOC) para un documento PDF en ${language}.`,
    `Debes devolver SOLO JSON válido (sin comentarios, sin texto extra).`,
    `Formato: [{ "id": string, "title": string, "page": number, "children": [...] }]`,
    `Reglas:`,
    `- pages deben estar entre 1 y ${totalPages}`,
    `- orden ascendente por página`,
    `- no inventes contenido; si no estás seguro, devuelve una lista vacía`,
    `- usa títulos cortos y claros`,
    `- conserva el idioma original de los títulos si es posible`,
    `Contexto por página (preview acotado):`,
    `${safePages.map(p => `# Page ${p.page}:\n${p.text}`).join('\n\n')}`,
    `Devuelve únicamente el JSON.`,
  ].join('\n');

  const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
  
  const text = result?.response?.text?.() || result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch {}

  // Fallback: try to extract JSON from code fences
  const match = text.match(/```json([\s\S]*?)```/i) || text.match(/\[\s*{[\s\S]*}\s*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[1] || match[0]);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }

  return [];
}
