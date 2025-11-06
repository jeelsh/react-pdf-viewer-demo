import { useEffect, useMemo, useRef, useState } from 'react';
import { getAccessToken, refreshTokenIfNeeded } from '@/app/_lib/spotify-auth';

function loadSdk() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);
    if (window.Spotify) return resolve(window.Spotify);
    const scriptTag = document.getElementById('spotify-sdk');
    if (scriptTag) {
      const check = () => window.Spotify ? resolve(window.Spotify) : setTimeout(check, 50);
      return check();
    }
    const script = document.createElement('script');
    script.id = 'spotify-sdk';
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);
    window.onSpotifyWebPlaybackSDKReady = () => resolve(window.Spotify);
  });
}

export default function useSpotifyPlayer() {
  const [deviceId, setDeviceId] = useState(null);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);

  const controls = useMemo(() => ({
    togglePlay: async () => playerRef.current?.togglePlay(),
    next: async () => playerRef.current?.nextTrack(),
    previous: async () => playerRef.current?.previousTrack(),
    setVolume: async (v) => playerRef.current?.setVolume(v),
  }), []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const tokenObj = (await refreshTokenIfNeeded()) || { access_token: getAccessToken() };
        const token = tokenObj?.access_token;
        if (!token) return;

        const Spotify = await loadSdk();
        if (!Spotify) return;

        if (cancelled) return;
        const player = new Spotify.Player({
          name: 'Flipbook Web Player',
          getOAuthToken: cb => cb(token),
          volume: 0.5,
        });
        playerRef.current = player;

        player.addListener('ready', ({ device_id }) => {
          setDeviceId(device_id);
          setReady(true);
          fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ device_ids: [device_id], play: false }),
          }).catch(() => {});
        });
        player.addListener('not_ready', () => {
          setReady(false);
        });
        player.addListener('player_state_changed', (s) => {
          setState(s);
        });
        player.addListener('initialization_error', ({ message }) => setError(message));
        player.addListener('authentication_error', ({ message }) => setError(message));
        player.addListener('account_error', ({ message }) => setError(message));

        await player.connect();
      } catch (e) {
        setError(e?.message || 'spotify_init_failed');
      }
    }

    init();

    return () => {
      cancelled = true;
      if (playerRef.current) {
        try { playerRef.current.disconnect(); } catch {}
        playerRef.current = null;
      }
    };
  }, []);

  const track = state?.track_window?.current_track || null;
  const isPaused = state?.paused ?? true;

  return { ready, deviceId, state, error, track, isPaused, player: playerRef.current, ...controls };
}
