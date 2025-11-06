"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { handleRedirectCallback } from '@/app/_lib/spotify-auth';

export default function SpotifyCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function run() {
      try {
        const t = await handleRedirectCallback();
        router.replace('/');
      } catch (e) {
        router.replace('/');
      }
    }
    run();
  }, [router]);

  return (
    <div className="w-full h-[50vh] flex items-center justify-center text-sm">
      Procesando autenticación con Spotify...
    </div>
  );
}
