import React, { forwardRef, memo, useCallback, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import PdfPage from './pdf-page'
import { useDebounce } from '@/app/_hooks/use-debounce';
import { cn } from '@/app/_lib/utils';
import useScreenSize from '@/app/_hooks/use-screensize';
const MemoizedPdfPage = memo(PdfPage)

const FlipbookLoader = forwardRef(({ pdfDetails, scale, viewerStates, setViewerStates, viewRange, setViewRange, isMobile }, ref) => {
    const { width } = useScreenSize();
    const debouncedZoom = useDebounce(viewerStates.zoomScale, 500);
    const [dragStart, setDragStart] = useState(null);
    const SWIPE_THRESHOLD = 35;
    // Check if page is in View range or in view window >>>>>>>>
    const isPageInViewRange = (index) => { return index >= viewRange[0] && index <= viewRange[1] };
    const isPageInView = (index) => {
        return isMobile
            ? viewerStates.currentPageIndex === index
            : (viewerStates.currentPageIndex === index || viewerStates.currentPageIndex + 1 === index)
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
                maxShadowOpacity={0.35}
                flippingTime={900}
                swipeDistance={20}
                // Keep spreads (two pages) on desktop like before; allow single page on mobile
                usePortrait={isMobile ? true : false}
                showCover={true}
                showPageCorners={false}
                onFlip={onFlip}
                disableFlipByClick={width < 768 ? true : false}
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
            {/* Gesture overlay for mobile: detect drag direction to flip pages */}
            {width < 768 && viewerStates.zoomScale <= 1 && (
                <div
                    className="absolute inset-0 z-40"
                    style={{ touchAction: 'pan-y', userSelect: 'none' }}
                    onPointerDown={(e) => setDragStart({ x: e.clientX, y: e.clientY })}
                    onPointerUp={(e) => {
                        if (!dragStart) return;
                        const dx = e.clientX - dragStart.x;
                        const dy = e.clientY - dragStart.y;
                        // Horizontal swipe with enough distance wins
                        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
                            if (dx < 0) {
                                // swipe left -> next page
                                ref?.current?.pageFlip()?.flipNext();
                            } else {
                                // swipe right -> previous page
                                ref?.current?.pageFlip()?.flipPrev();
                            }
                        }
                        setDragStart(null);
                    }}
                    onPointerCancel={() => setDragStart(null)}
                />
            )}
            {/* <p className="text-background absolute z-50 top-0 -left-10">{viewRange[0] + '-' + viewRange[1]}</p> */}
        </div>
    )
})

FlipbookLoader.displayName = 'FlipbookLoader'

export default FlipbookLoader