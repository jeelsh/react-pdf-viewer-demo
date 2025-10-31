'use client';
import React, { memo, useState, useEffect, useCallback } from 'react';
import useRefSize from '@/app/_hooks/use-ref-size';
import FlipbookLoader from './flipbook-loader';
import { cn } from '@/app/_lib/utils';
import { TransformComponent } from 'react-zoom-pan-pinch';
import screenfull from 'screenfull';
import useScreenSize from '@/app/_hooks/use-screensize';

const Flipbook = memo(({ viewerStates, setViewerStates, flipbookRef, pdfDetails }) => {
    const { ref, width, height, refreshSize } = useRefSize();
    const [scale, setScale] = useState(1); // Max scale for flipbook
    const [wrapperCss, setWrapperCss] = useState({});
    const [viewRange, setViewRange] = useState([0, 4]);
    const { width: screenWidth } = useScreenSize();
    const isMobile = screenWidth < 768;

    // Calculate scale when pageSize or dimensions change >>>>>>>>
    // Responsive: on mobile (<768px) we render a single page and compute scale/size for 1 page;
    // on desktop we render a spread (2 pages) and compute scale/size for 2 pages.
    useEffect(() => {
        if (pdfDetails && width && height) {
            // Single page on mobile, double page on desktop
            const pageWidthCount = isMobile ? 1 : 2;
            const calculatedScale = Math.min(
                width / (pageWidthCount * pdfDetails.width),
                height / pdfDetails.height
            );
            setScale(calculatedScale);
            setWrapperCss({
                width: `${pdfDetails.width * calculatedScale * pageWidthCount}px`,
                height: `${pdfDetails.height * calculatedScale}px`,
            });
        }
    }, [pdfDetails, width, height, isMobile]);

    // Refresh flipbook size & page range on window resize >>>>>>>>
    const shrinkPageLoadingRange = useCallback(() => {
        setViewRange([Math.max(viewerStates.currentPageIndex - 2, 0), Math.min(viewerStates.currentPageIndex + 2, pdfDetails.totalPages)]);
    }, [viewerStates.currentPageIndex, pdfDetails.totalPages, setViewRange]);

    const handleFullscreenChange = useCallback(() => {
        shrinkPageLoadingRange();
        refreshSize();
    }, [shrinkPageLoadingRange, refreshSize]);

    useEffect(() => {
        if (screenfull) {
            screenfull.on('change', handleFullscreenChange);
        }
        // Clean up the event listener
        return () => {
            if (screenfull) {
                screenfull.off('change', handleFullscreenChange);
            }
        };
    }, [handleFullscreenChange]);

    return (
        <div ref={ref} className={cn("relative h-[85vh] w-full bg-transparent flex justify-center items-center overflow-hidden", screenfull?.isFullscreen && 'h-[calc(100vh-5.163rem)] xs:h-[calc(100vh-5.163rem)] lg:h-[calc(100vh-5.163rem)] xl:h-[calc(100vh-4.66rem)]')}>
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
                <div className='overflow-hidden flex justify-center items-center h-full w-full'>
                    {pdfDetails && scale && (
                        <div style={wrapperCss}>
                            <FlipbookLoader
                                ref={flipbookRef}
                                pdfDetails={pdfDetails}
                                scale={scale}
                                viewRange={viewRange}
                                setViewRange={setViewRange}
                                viewerStates={viewerStates}
                                setViewerStates={setViewerStates}
                                isMobile={isMobile}
                            />
                        </div>
                    )}
                </div>
            </TransformComponent>
        </div>
    );
});

Flipbook.displayName = 'Flipbook';
export default Flipbook;
