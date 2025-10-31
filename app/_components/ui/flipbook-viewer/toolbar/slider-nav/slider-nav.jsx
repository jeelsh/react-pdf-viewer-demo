import React, { useCallback, useMemo } from 'react';
import Slider from './slider';
import useScreenSize from '@/app/_hooks/use-screensize';

const SliderNav = ({ flipbookRef, pdfDetails, viewerStates }) => {
    const { width } = useScreenSize();
    const isMobile = width < 768;
    const totalSlides = useMemo(() => {
        if (isMobile) return pdfDetails?.totalPages;
        return pdfDetails?.totalPages % 2 === 0 ? pdfDetails?.totalPages / 2 + 1 : (pdfDetails?.totalPages - 1) / 2 + 1;
    }, [pdfDetails?.totalPages, isMobile]);

    const currentSlide = useMemo(() => {
        if (isMobile) return Math.max(1, Math.min(totalSlides, (viewerStates.currentPageIndex + 1)));
        return Math.max(1, Math.min(totalSlides, Math.floor((viewerStates.currentPageIndex + 3) / 2)));
    }, [viewerStates.currentPageIndex, totalSlides, isMobile]);

    // Turn to page number >>>>>>>>
    const onSlideChange = useCallback((slide) => {
        const newPageIndex = isMobile ? Math.max(0, slide - 1) : Math.max(0, (slide * 2) - 3);
        flipbookRef.current?.pageFlip()?.turnToPage(newPageIndex);
    }, [flipbookRef, isMobile]);

    return (
        <Slider
            totalPages={pdfDetails?.totalPages}
            currentSlide={currentSlide}
            onSlideChange={onSlideChange}
            maxSlide={totalSlides}
        />
    );
}

export default SliderNav;