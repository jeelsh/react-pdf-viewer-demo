import React from 'react'
import { useControls } from 'react-zoom-pan-pinch';
import { Button } from '../../button';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

const Zoom = ({ zoomScale, screenWidth }) => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
        <>
            {screenWidth > 768 &&
                <>
                    <Button 
                        onClick={() => zoomOut(0.25)} 
                        disabled={zoomScale == 1} 
                        variant='ghost' 
                        size='icon' 
                        className='size-8 sm:size-9 min-w-8 sm:min-w-9 rounded-full hover:bg-white/10 disabled:opacity-30 transition-all'
                    >
                        <ZoomOut className="size-4 sm:size-5 min-w-4 sm:min-w-5 text-foreground" />
                    </Button>
                    <Button 
                        onClick={() => zoomIn(0.25)} 
                        disabled={zoomScale >= 5} 
                        variant='ghost' 
                        size='icon' 
                        className='size-8 sm:size-9 min-w-8 sm:min-w-9 rounded-full hover:bg-white/10 disabled:opacity-30 transition-all'
                    >
                        <ZoomIn className="size-4 sm:size-5 min-w-4 sm:min-w-5 text-foreground" />
                    </Button>
                    <Button 
                        onClick={() => resetTransform()} 
                        variant='ghost' 
                        size='icon' 
                        className='size-8 sm:size-9 min-w-8 sm:min-w-9 rounded-full hover:bg-white/10 transition-all'
                    >
                        <RotateCcw className="size-4 sm:size-5 min-w-4 sm:min-w-5 text-foreground" />
                    </Button>
                </>
            }
        </>
    )
}

export default Zoom