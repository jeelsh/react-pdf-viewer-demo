import React, { forwardRef, memo, useCallback } from 'react'
import HTMLFlipBook from 'react-pageflip'
import PdfPage from './pdf-page'
import { useDebounce } from '@/app/_hooks/use-debounce';
import { cn } from '@/app/_lib/utils';

const MemoizedPdfPage = memo(PdfPage)

const FlipbookLoader = forwardRef(({ pdfDetails, scale, viewerStates, setViewerStates, viewRange, setViewRange, isMobile }, ref) => {
    const debouncedZoom = useDebounce(viewerStates.zoomScale, 500);

    // Check if page is in View range or in view window >>>>>>>>
    const isPageInViewRange = (index) => { return index >= viewRange[0] && index <= viewRange[1] };
    const isPageInView = (index) => {
        // Desktop behavior: show current and the next page as a spread
        return viewerStates.currentPageIndex === index || viewerStates.currentPageIndex + 1 === index;
    };

    // Update pageViewRange on page flip >>>>>>>>
    const onFlip = useCallback((e) => {
        let newViewRange;
        if (e.data > viewerStates.currentPageIndex) {
            newViewRange = [viewRange[0], Math.max(Math.min(e.data + 4, pdfDetails.totalPages), viewRange[1])]
        } else if (e.data < viewerStates.currentPageIndex) {
            newViewRange = [Math.min(Math.max(e.data - 4, 0), viewRange[0]), viewRange[1]]
        } else {
            newViewRange = viewRange
        }
        setViewRange(newViewRange);
        setViewerStates({
            ...viewerStates,
            currentPageIndex: e.data,
        });
    }, [viewerStates, viewRange, setViewRange, setViewerStates, pdfDetails.totalPages]);

    return (
        <div className="relative">
            <HTMLFlipBook
                ref={ref}
                key={scale}
                startPage={viewerStates.currentPageIndex}
                width={pdfDetails.width * scale}
                height={pdfDetails.height * scale}
                size="fixed"
                autoSize={false}
                drawShadow={true}
                maxShadowOpacity={0.45}
                flippingTime={700}
                swipeDistance={30}
                // Mobile: single page; Desktop: spread
                usePortrait={isMobile ? true : false}
                showCover={true}
                showPageCorners={true}
                onFlip={onFlip}
                disableFlipByClick={isMobile}
                className={cn(viewerStates.zoomScale > 1 && 'pointer-events-none md:pointer-events-none')}
            >
                {
                    Array.from({ length: pdfDetails.totalPages }, (_, index) => (
                        <MemoizedPdfPage
                            key={index}
                            height={pdfDetails.height * scale}
                            zoomScale={debouncedZoom}
                            page={index + 1}
                            isPageInViewRange={isPageInViewRange(index)}
                            isPageInView={isPageInView(index)}
                        />
                    ))
                }
            </HTMLFlipBook >
            {/* Mobile gesture overlay removed: desktop-only behavior */}
            {/* <p className="text-background absolute z-50 top-0 -left-10">{viewRange[0] + '-' + viewRange[1]}</p> */}
        </div>
    )
})

FlipbookLoader.displayName = 'FlipbookLoader'

export default FlipbookLoader