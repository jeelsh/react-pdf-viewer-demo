// Server-side text extraction from a PDF buffer using pdf-parse (Node.js optimized)
// Usage:
//   const { totalPages, pages } = await extractPdfText({ pdfBuffer, maxCharsPerPage: 800 });
//   // pages: [{ page: 1, text: '...' }, ...]
export async function extractPdfText({ pdfBuffer, maxCharsPerPage = 1200 } = {}) {
  if (!pdfBuffer) throw new Error('extractPdfText: pdfBuffer is required');

  // Import pdf-parse dynamically to handle CommonJS/ES module compatibility
  const pdfParse = (await import('pdf-parse')).default;
  
  // Parse PDF with pdf-parse (much simpler for server-side)
  const data = await pdfParse(pdfBuffer);
  
  // pdf-parse gives us total pages and full text, but not per-page breakdown
  const totalPages = data.numpages;
  const fullText = data.text || '';
  
  // Estimate text per page by splitting the full text
  // This is an approximation since pdf-parse doesn't give exact page boundaries
  const estimatedCharsPerPage = Math.ceil(fullText.length / totalPages);
  const pages = [];
  
  for (let i = 1; i <= totalPages; i++) {
    const startIndex = (i - 1) * estimatedCharsPerPage;
    const endIndex = Math.min(startIndex + estimatedCharsPerPage, fullText.length);
    const pageText = fullText.slice(startIndex, endIndex).replace(/\s+/g, ' ').trim();
    
    // Keep a preview per page to control token usage
    const textPreview = pageText.slice(0, maxCharsPerPage);
    pages.push({ page: i, text: textPreview });
  }

  return { totalPages, pages };
}
