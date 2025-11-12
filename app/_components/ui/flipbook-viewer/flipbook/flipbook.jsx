'use client';
import React, { memo, useState, useEffect, useCallback } from 'react';
import useRefSize from '@/app/_hooks/use-ref-size';
import FlipbookLoader from './flipbook-loader';
import { cn } from '@/app/_lib/utils';
import { TransformComponent } from 'react-zoom-pan-pinch';
import screenfull from 'screenfull';

const Flipbook = memo(({ viewerStates, setViewerStates, flipbookRef, pdfDetails, isMobileOrTablet }) => {
    const { ref, width, height, refreshSize } = useRefSize();
    const [scale, setScale] = useState(1); // Max scale for flipbook
    const [wrapperCss, setWrapperCss] = useState({});
    const [viewRange, setViewRange] = useState([0, 4]);

    // Fixed horizontal padding (in px) to create side space
    const horizontalPadding = 10;
    const paddingTop = 60;
    const paddingBottom = 120; // Reserve space for toolbar overlay

    // Calculate scale when pageSize or dimensions change >>>>>>>>
    // Single page on mobile, two-page spread on desktop. Animation params remain in loader.
    useEffect(() => {
        if (pdfDetails && width && height) {
            const pageWidthCount = isMobileOrTablet ? 1 : 2;
            const availableWidth = Math.max(0, width - (horizontalPadding * 2));
            
            // Limit maximum width on large screens to prevent oversized display
            const maxContentWidth = isMobileOrTablet ? availableWidth : Math.min(availableWidth, 1200);
            
            // Limit height for tablets to prevent pushing buttons too far down
            // Use 70% of available height for tablets, full height for desktop
            const maxContentHeight = isMobileOrTablet ? Math.min(height, height * 0.7) : height;
            
            const calculatedScale = Math.min(
                maxContentWidth / (pageWidthCount * pdfDetails.width),
                maxContentHeight / pdfDetails.height
            );
            setScale(calculatedScale);
            setWrapperCss({
                width: `${pdfDetails.width * calculatedScale * pageWidthCount}px`,
                height: `${pdfDetails.height * calculatedScale}px`,
            });
        }
    }, [pdfDetails, width, height, horizontalPadding, isMobileOrTablet]);

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
        <div ref={ref} className={cn("relative h-full w-full bg-background flex justify-center items-center overflow-hidden", screenfull?.isFullscreen && 'h-[calc(100vh-5.163rem)] xs:h-[calc(100vh-5.163rem)] lg:h-[calc(100vh-5.163rem)] xl:h-[calc(100vh-4.66rem)]')}>
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
                <div className='overflow-hidden flex justify-center items-center h-full w-full' style={{ paddingLeft: horizontalPadding, paddingRight: horizontalPadding, paddingTop: paddingTop, paddingBottom: paddingBottom }}>
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
                                isMobileOrTablet={isMobileOrTablet}
                            />
                        </div>
                    )}
                </div>
            </TransformComponent>
        </div>
    );
})

Flipbook.displayName = 'Flipbook';
export default Flipbook;

