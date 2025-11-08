import { pdfjs } from 'react-pdf';
import { createWorker } from 'tesseract.js';

// Client-side text extraction using react-pdf + OCR for scanned PDFs
// This runs in the browser where pdfjs-dist works properly
export async function extractPdfTextClient(pdfUrl, maxCharsPerPage = 1200) {
  try {
    // Load the PDF document
    const loadingTask = pdfjs.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;
    
    const pages = [];
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine all text items from the page
      console.log(`Page ${pageNum} textContent:`, textContent);
      
      if (!textContent.items || textContent.items.length === 0) {
        console.warn(`Page ${pageNum} has no extractable text - trying OCR...`);
        
        // Try OCR for scanned pages
        try {
          const ocrText = await extractTextWithOCR(page);
          if (ocrText && ocrText.trim().length > 0) {
            const textPreview = ocrText.slice(0, maxCharsPerPage);
            pages.push({ page: pageNum, text: textPreview });
            console.log(`Page ${pageNum} OCR extracted ${ocrText.length} characters`);
          } else {
            pages.push({ 
              page: pageNum, 
              text: `[Página ${pageNum} - Sin texto extraíble con OCR]` 
            });
          }
        } catch (ocrError) {
          console.error(`OCR failed for page ${pageNum}:`, ocrError);
          pages.push({ 
            page: pageNum, 
            text: `[Página ${pageNum} - Error en OCR: ${ocrError.message}]` 
          });
        }
        continue;
      }
      
      const pageText = textContent.items
        .map(item => item.str || '')
        .filter(str => str.trim().length > 0)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      console.log(`Page ${pageNum} extracted text length:`, pageText.length);
      
      if (pageText.length === 0) {
        pages.push({ 
          page: pageNum, 
          text: `[Página ${pageNum} - Texto vacío después de procesamiento]` 
        });
      } else {
        // Limit text length to control token usage
        const textPreview = pageText.slice(0, maxCharsPerPage);
        pages.push({ page: pageNum, text: textPreview });
      }
    }
    
    return { totalPages, pages };
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

// Helper function to extract text using OCR from a PDF page
async function extractTextWithOCR(page) {
  // Render page as canvas
  const scale = 2; // Higher scale for better OCR accuracy
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  // Render PDF page to canvas
  await page.render({
    canvasContext: context,
    viewport: viewport
  }).promise;

  // Convert canvas to image data for OCR
  const imageData = canvas.toDataURL('image/png');
  
  // Create OCR worker
  const worker = await createWorker('spa'); // Spanish language
  
  try {
    // Perform OCR
    const { data: { text } } = await worker.recognize(imageData);
    return text;
  } finally {
    // Clean up worker
    await worker.terminate();
  }
}
