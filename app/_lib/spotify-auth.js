const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'd852e401b5a94c5ba7946935f0bbb925';
function getRedirectUri() {
  if (process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI) return process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  if (typeof window !== 'undefined') return `${window.location.origin}/spotify-callback`;
  return 'https://pomarola.almaquinta.com/spotify-callback';
}
const AUTH_BASE = 'https://accounts.spotify.com';

const storage = typeof window !== 'undefined' ? window.sessionStorage : undefined;

function base64UrlEncode(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(digest);
}

function randomString(len = 64) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => ('0' + b.toString(16)).slice(-2)).join('');
}

export function getStoredToken() {
  if (!storage) return null;
  const raw = storage.getItem('spotify_token');
  if (!raw) return null;
  const t = JSON.parse(raw);
  if (!t.expires_at || Date.now() > t.expires_at - 30000) return null;
  return t;
}

function storeToken(t) {
  if (!storage) return;
  storage.setItem('spotify_token', JSON.stringify(t));
}

export function clearToken() {
  if (!storage) return;
  storage.removeItem('spotify_token');
}

export async function beginLogin(scopes = []) {
  const verifier = randomString(64);
  const challenge = await sha256(verifier);
  storage && storage.setItem('code_verifier', verifier);
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: getRedirectUri(),
    code_challenge_method: 'S256',
    code_challenge: challenge,
    scope: scopes.join(' '),
  });
  window.location.href = `${AUTH_BASE}/authorize?${params.toString()}`;
}

export async function handleRedirectCallback() {
  if (typeof window === 'undefined') return null;
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  if (error) throw new Error(error);
  if (!code) return null;
  const verifier = storage ? storage.getItem('code_verifier') : null;
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: getRedirectUri(),
    code_verifier: verifier || '',
  });
  const resp = await fetch(`${AUTH_BASE}/api/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!resp.ok) throw new Error('token_exchange_failed');
  const data = await resp.json();
  const expires_at = Date.now() + (data.expires_in * 1000);
  const token = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at,
    token_type: data.token_type,
  };
  storeToken(token);
  return token;
}

export async function refreshTokenIfNeeded() {
  if (!storage) return null;
  const raw = storage.getItem('spotify_token');
  if (!raw) return null;
  const t = JSON.parse(raw);
  if (Date.now() < t.expires_at - 60000) return t;
  if (!t.refresh_token) return null;
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'refresh_token',
    refresh_token: t.refresh_token,
  });
  const resp = await fetch(`${AUTH_BASE}/api/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  const newToken = {
    ...t,
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in * 1000),
  };
  storeToken(newToken);
  return newToken;
}

export function getAccessToken() {
  const t = getStoredToken();
  return t?.access_token || null;
}
