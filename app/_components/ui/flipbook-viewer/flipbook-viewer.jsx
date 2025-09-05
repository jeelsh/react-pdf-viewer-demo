'use client';
import React, { useCallback, useRef, useState } from "react";
import Toolbar from "./toolbar/toolbar";
import { cn } from "@/app/_lib/utils";
import Flipbook from "./flipbook/flipbook";
import screenfull from 'screenfull';
import { TransformWrapper } from "react-zoom-pan-pinch";
import { Document } from "react-pdf";
import PdfLoading from "./pad-loading/pdf-loading";
import TableOfContents from "./index/table-of-contents";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const FlipbookViewer = ({ pdfUrl, shareUrl, className, disableShare }) => {
  const containerRef = useRef(); // For full screen container
  const flipbookRef = useRef();
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfDetails, setPdfDetails] = useState(null);
  const [isIndexVisible, setIsIndexVisible] = useState(false);
  const [viewerStates, setViewerStates] = useState({
    currentPageIndex: 0,
    zoomScale: 1,
  });

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
    <div ref={containerRef} className={cn("relative h-[100vh] bg-foreground w-full overflow-hidden", className)}>
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
            <div className="w-full relative bg-foreground flex flex-col justify-between">
              {/* Table of Contents */}
              <TableOfContents
                isVisible={isIndexVisible}
                onToggle={handleIndexToggle}
                onPageSelect={handlePageSelect}
                currentPage={viewerStates.currentPageIndex}
              />
              
              {/* Main content area */}
              <div className={cn(
                "transition-all duration-300 ease-in-out",
                isIndexVisible ? "ml-80" : "ml-0"
              )}>
                <Flipbook
                  viewerStates={viewerStates}
                  setViewerStates={setViewerStates}
                  flipbookRef={flipbookRef}
                  screenfull={screenfull}
                  pdfDetails={pdfDetails}
                />
              </div>
              
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
                onIndexToggle={handleIndexToggle}
              />
            </div>
          </TransformWrapper >
        }
      </Document>
    </div>
  );
}

export default FlipbookViewer;
