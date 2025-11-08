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
        <div className="w-full bg-background">
            <div className={`px-3 transition-all duration-300 ease-in-out ${!isMobileOrTablet && isIndexVisible ? 'ml-80' : 'ml-0'}`}>
                <SliderNav
                    flipbookRef={flipbookRef}
                    pdfDetails={pdfDetails}
                    viewerStates={viewerStates}
                    screenWidth={screenWidth}
                />
                <div className="flex items-center gap-2 pb-2 max-xl:pt-2">
                    <div className="hidden lg:block flex-1"></div>
                    <Button
                        onClick={() => { screenWidth < 768 ? flipbookRef.current.pageFlip().flipPrev() : flipbookRef.current.pageFlip().flipPrev() }}
                        disabled={viewerStates.currentPageIndex === 0}
                        variant='secondary'
                        size='icon'
                        className='size-8 min-w-8'
                    >
                        <ChevronLeft className="size-4 min-w-4" />
                    </Button>
                    <Button
                        onClick={() => { screenWidth < 768 ? flipbookRef.current.pageFlip().flipNext() : flipbookRef.current.pageFlip().flipNext() }}
                        disabled={isMobile ? (viewerStates.currentPageIndex === pdfDetails?.totalPages - 1) : (viewerStates.currentPageIndex === pdfDetails?.totalPages - 1 || viewerStates.currentPageIndex === pdfDetails?.totalPages - 2)}
                        variant='secondary'
                        size='icon'
                        className='size-8 min-w-8'
                    >
                        <ChevronRight className="size-4 min-w-4" />
                    </Button>
                    <Zoom zoomScale={viewerStates.zoomScale} screenWidth={screenWidth} />
                    {!disableShare && <Share shareUrl={shareUrl} />}
                    <Button
                        onClick={fullScreen}
                        variant='secondary'
                        size='icon'
                        className='size-8 min-w-8'
                    >
                        {screenfull.isEnabled && screenfull.isFullscreen ?
                            <Minimize className="size-4 min-w-4" /> :
                            <Maximize className="size-4 min-w-4" />
                        }
                    </Button>
                    <div className="flex-1"></div>
                    {/* Spotify Controls */}
                    <SpotifyControls />
                    {/* <div className="w-72 h-[80px] overflow-hidden rounded-md">
                        <iframe
                            title="Spotify Embed: Recommendation Playlist "
                            src={`https://open.spotify.com/embed/playlist/5WE00BaJbf1b5d1rF66YtE?utm_source=generator&theme=0`}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        />
                    </div> */}
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
            <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={onLogin}>
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
        <div className="flex items-center gap-2">
            <Button variant='secondary' size='icon' className='size-8 min-w-8' onClick={previous} disabled={!ready}>
                <SkipBack className="size-4 min-w-4" />
            </Button>
            <Button variant='secondary' size='icon' className='size-8 min-w-8' onClick={handlePlay} disabled={!ready}>
                {isPaused ? (
                    <Play className="size-4 min-w-4" />
                ) : (
                    <Pause className="size-4 min-w-4" />
                )}
            </Button>
            <Button variant='secondary' size='icon' className='size-8 min-w-8' onClick={next} disabled={!ready}>
                <SkipForward className="size-4 min-w-4" />
            </Button>
            {track && (
                <div className='ml-2 max-w-[220px] truncate text-xs font-medium'>
                    {track.name} — {track.artists?.map(a => a.name).join(', ')}
                </div>
            )}
        </div>
    );
}
