import React, { useEffect, useCallback } from 'react';
import { Button } from '../../button';
import { ChevronLeft, ChevronRight, Maximize, Minimize, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import keyboardjs from 'keyboardjs';
import Zoom from './zoom';
import SliderNav from './slider-nav/slider-nav';
import useScreenSize from '@/app/_hooks/use-screensize';
import Share from '../../share';
import useSpotifyPlayer from '@/app/_hooks/use-spotify-player';
import { beginLogin, getAccessToken } from '@/app/_lib/spotify-auth';

const Toolbar = ({ flipbookRef, containerRef, screenfull, pdfDetails, viewerStates, shareUrl, disableShare, isIndexVisible }) => {
    const { width: screenWidth } = useScreenSize();
    const isMobileOrTablet = screenWidth < 1024; // lg breakpoint
    const isMobile = screenWidth < 768;

    // Fixed padding values
    const paddingBottom = 10;

    // Full screen >>>>>>>>>
    const fullScreen = useCallback(() => {
        if (screenfull.isEnabled) {
            screenfull.toggle(containerRef.current, { navigationUI: "hide" });
        }
        screenfull.on('error', (event) => {
            alert('Failed to enable fullscreen', event);
        });
    }, [screenfull, containerRef]);

    // Keyboard shortcuts >>>>>>>>>
    useEffect(() => {
        const handleRight = () => flipbookRef.current.pageFlip().flipNext();
        const handleLeft = () => flipbookRef.current.pageFlip().flipPrev();

        keyboardjs.bind('right', null, handleRight);
        keyboardjs.bind('left', null, handleLeft);
        // keyboardjs.bind('f', null, fullScreen);

        return () => {
            keyboardjs.unbind('right', null, handleRight);
            keyboardjs.unbind('left', null, handleLeft);
            // keyboardjs.unbind('f', null, fullScreen);
        };
    }, [flipbookRef, fullScreen]);

    return (
        <div className="w-full absolute bottom-0 bg-transparent z-50" style={{ paddingBottom: paddingBottom }}>
            <div className={`px-3 transition-all duration-300 ease-in-out ${!isMobileOrTablet && isIndexVisible ? 'ml-0' : 'ml-0'}`}>
                {/* Slider with backdrop blur container */}
                <div className="mb-2">
                    <SliderNav
                        flipbookRef={flipbookRef}
                        pdfDetails={pdfDetails}
                        viewerStates={viewerStates}
                        screenWidth={screenWidth}
                    />
                </div>
                <div className="flex items-center gap-3 pb-3">
                    <div className="hidden lg:block flex-1"></div>
                    {/* Main navigation controls with glass effect */}
                    <div className="border border-white/20 rounded-full flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-md shadow-lg">
                        <Button
                            onClick={() => { screenWidth < 768 ? flipbookRef.current.pageFlip().flipPrev() : flipbookRef.current.pageFlip().flipPrev() }}
                            disabled={viewerStates.currentPageIndex === 0}
                            variant='ghost'
                            size='icon'
                            className='size-9 min-w-9 rounded-full hover:bg-white/10 disabled:opacity-30 transition-all'
                        >
                            <ChevronLeft className="size-5 min-w-5 text-foreground" />
                        </Button>
                        <Button
                            onClick={() => { screenWidth < 768 ? flipbookRef.current.pageFlip().flipNext() : flipbookRef.current.pageFlip().flipNext() }}
                            disabled={isMobile ? (viewerStates.currentPageIndex === pdfDetails?.totalPages - 1) : (viewerStates.currentPageIndex === pdfDetails?.totalPages - 1 || viewerStates.currentPageIndex === pdfDetails?.totalPages - 2)}
                            variant='ghost'
                            size='icon'
                            className='size-9 min-w-9 rounded-full hover:bg-white/10 disabled:opacity-30 transition-all'
                        >
                            <ChevronRight className="size-5 min-w-5 text-foreground" />
                        </Button>
                        <div className="w-px h-6 bg-white/20 mx-1"></div>
                        <Zoom zoomScale={viewerStates.zoomScale} screenWidth={screenWidth} />
                        <div className="w-px h-6 bg-white/20 mx-1"></div>
                        {!disableShare && <Share shareUrl={shareUrl} />}
                        <div className="w-px h-6 bg-white/20 mx-1"></div>
                        <Button
                            onClick={fullScreen}
                            variant='ghost'
                            size='icon'
                            className='size-9 min-w-9 rounded-full hover:bg-white/10 transition-all'
                        >
                            {screenfull.isEnabled && screenfull.isFullscreen ?
                                <Minimize className="size-5 min-w-5 text-foreground" /> :
                                <Maximize className="size-5 min-w-5 text-foreground" />
                            }
                        </Button>
                    </div>
                    <div className="flex-1"></div>
                    {/* Spotify Controls with glass effect */}
                    <SpotifyControls />
                </div>
            </div>
        </div>
    );
};

export default Toolbar;

function SpotifyControls() {
    const { track, isPaused, ready, togglePlay, next, previous, state } = useSpotifyPlayer();
    const token = getAccessToken();

    const onLogin = () => {
        beginLogin([
            'streaming',
            'user-read-email',
            'user-read-private',
            'user-modify-playback-state',
            'user-read-playback-state',
        ]);
    };

    if (!token) {
        return (
            <div className="border border-white/20 rounded-full px-4 py-2 bg-background/80 backdrop-blur-md shadow-lg">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onLogin}
                    className="hover:bg-transparent text-foreground transition-all"
                >
                    Login Spotify
                </Button>
            </div>
        );
    }

    const handlePlay = async () => {
        if (!ready) return;
        try {
            // If there is no current track/context, start a default playlist
            const hasContext = !!(state && state.track_window && state.track_window.current_track);
            if (!hasContext && token) {
                await fetch('https://api.spotify.com/v1/me/player/play', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        context_uri: 'spotify:playlist:15QKu8bVtMHrhFysmTF01i',
                    }),
                }).catch(() => {});
            }
        } catch {}
        await togglePlay();
    };

    return (
        <div className="border border-white/20 rounded-full flex items-center gap-3 px-4 py-2 bg-background/80 backdrop-blur-md shadow-lg">
            <Button 
                variant='ghost' 
                size='icon' 
                className='size-9 min-w-9 rounded-full hover:bg-white/10 disabled:opacity-30 transition-all' 
                onClick={previous} 
                disabled={!ready}
            >
                <SkipBack className="size-5 min-w-5 text-foreground" />
            </Button>
            <Button 
                variant='ghost' 
                size='icon' 
                className='size-9 min-w-9 rounded-full hover:bg-white/10 disabled:opacity-30 transition-all' 
                onClick={handlePlay} 
                disabled={!ready}
            >
                {isPaused ? (
                    <Play className="size-5 min-w-5 text-foreground" />
                ) : (
                    <Pause className="size-5 min-w-5 text-foreground" />
                )}
            </Button>
            <Button 
                variant='ghost' 
                size='icon' 
                className='size-9 min-w-9 rounded-full hover:bg-white/10 disabled:opacity-30 transition-all' 
                onClick={next} 
                disabled={!ready}
            >
                <SkipForward className="size-5 min-w-5 text-foreground" />
            </Button>
            {track && (
                <>
                    <div className="w-px h-6 bg-white/20"></div>
                    <div className='ml-1 max-w-[220px] truncate text-xs font-medium text-foreground'>
                        {track.name} — {track.artists?.map(a => a.name).join(', ')}
                    </div>
                </>
            )}
        </div>
    );
}
