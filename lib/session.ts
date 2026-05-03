export const API_BASE_URL = (process.env.BACKEND_API_URL ?? 'https://pack-do-criador-back-end-production.up.railway.app').replace(/\/$/, '');
export const SESSION_COOKIE = 'pack_session';

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
} as const;
