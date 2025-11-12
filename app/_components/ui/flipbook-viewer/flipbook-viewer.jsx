'use client';
import React, { useCallback, useEffect, useRef, useState } from "react";
import Toolbar from "./toolbar/toolbar";
import Header from "./header/header";
import { cn } from "@/app/_lib/utils";
import Flipbook from "./flipbook/flipbook";
import screenfull from 'screenfull';
import { TransformWrapper } from "react-zoom-pan-pinch";
import { Document } from "react-pdf";
import PdfLoading from "./pad-loading/pdf-loading";
import TableOfContents from "./index/table-of-contents";
import useScreenSize from "@/app/_hooks/use-screensize";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const FlipbookViewer = ({ pdfUrl, shareUrl, className, disableShare }) => {
  const { width: screenWidth } = useScreenSize();
  const isMobileOrTablet = screenWidth < 1024; // lg breakpoint
  const containerRef = useRef(); // For full screen container
  const flipbookRef = useRef();
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfDetails, setPdfDetails] = useState(null);
  const [isIndexVisible, setIsIndexVisible] = useState(!isMobileOrTablet);
  const [viewerStates, setViewerStates] = useState({
    currentPageIndex: 0,
    zoomScale: 1,
  });
  const [tocItems, setTocItems] = useState([]);

  // Setting pdf details on document load >>>>>>>>>
  const onDocumentLoadSuccess = useCallback(async (document) => {
    try {
      const pageDetails = await document.getPage(1);
      setPdfDetails({
        totalPages: document.numPages,
        width: pageDetails.view[2],
        height: pageDetails.view[3],
      });
      setPdfLoading(false);
    } catch (error) {
      console.error('Error loading document:', error);
    }
  }, []);

  // Extract PDF text on client and generate TOC with Gemini
  useEffect(() => {
    let aborted = false;
    async function run() {
      try {
        if (!pdfUrl) return;
        
        // Import client-side text extraction
        const { extractPdfTextClient } = await import('@/app/_lib/pdf/extract-text-client');
        
        // Extract text on client (where pdfjs works properly)
        const { totalPages, pages } = await extractPdfTextClient('receta-content.pdf');
        
        // Send extracted text to server for Gemini processing
        const res = await fetch('/api/toc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pages, totalPages }),
        });
        
        if (!res.ok) return;
        const data = await res.json();
        if (!aborted && Array.isArray(data?.items)) {
          setTocItems(data.items);
        }
      } catch (error) {
        console.error('Error generating TOC:', error);
      }
    }
    run();
    return () => { aborted = true; };
  }, [pdfUrl]);

  // Handle index toggle
  const handleIndexToggle = useCallback(() => {
    setIsIndexVisible(prev => !prev);
  }, []);

  // Handle page selection from index
  const handlePageSelect = useCallback((pageIndex) => {
    setViewerStates(prev => ({ ...prev, currentPageIndex: pageIndex }));
    if (flipbookRef.current) {
      flipbookRef.current.pageFlip().turnToPage(pageIndex);
    }
  }, []);

  return (
    <div ref={containerRef} className={cn("relative h-svh bg-foreground w-full overflow-hidden", className)}>
      {pdfLoading && <PdfLoading />}
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} loading={<></>} >
        {(pdfDetails && !pdfLoading) &&
          <TransformWrapper
            doubleClick={{ disabled: true }}
            pinch={{ step: 2 }}
            disablePadding={viewerStates?.zoomScale <= 1}
            initialScale={1}
            minScale={1}
            maxScale={5}
            onTransformed={({ state }) => setViewerStates({ ...viewerStates, zoomScale: state.scale })}
          >
            <div className="w-full relative bg-foreground flex flex-col h-svh">
              {/* Table of Contents */}
              <TableOfContents
                isVisible={isIndexVisible}
                onToggle={handleIndexToggle}
                onPageSelect={handlePageSelect}
                currentPage={viewerStates.currentPageIndex}
                items={tocItems}
              />
              
              {/* Header */}
              <Header
                isIndexVisible={isIndexVisible}
                onIndexToggle={handleIndexToggle}
                pdfDetails={pdfDetails}
                viewerStates={viewerStates}
                documentTitle="Recetario"
              />
              
              {/* Main content area with relative positioning for absolute toolbar */}
              <div className={cn(
                "flex-1 relative transition-all duration-300 ease-in-out",
                // Only apply margin on desktop (lg and up), not on mobile/tablet
                !isMobileOrTablet && isIndexVisible ? "ml-80" : "ml-0"
              )}>
                <Flipbook
                  viewerStates={viewerStates}
                  setViewerStates={setViewerStates}
                  flipbookRef={flipbookRef}
                  pdfDetails={pdfDetails}
                  isMobileOrTablet={isMobileOrTablet}
                />
                
                <Toolbar
                  viewerStates={viewerStates}
                  setViewerStates={setViewerStates}
                  containerRef={containerRef}
                  flipbookRef={flipbookRef}
                  screenfull={screenfull}
                  pdfDetails={pdfDetails}
                  shareUrl={shareUrl}
                  disableShare={disableShare}
                  isIndexVisible={isIndexVisible}
                />
              </div>
            </div>
          </TransformWrapper >
        }
      </Document>
    </div>
  );
}

export default FlipbookViewer;

