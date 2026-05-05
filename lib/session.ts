export const BACKEND_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.BACKEND_API_URL ??
  'https://pack-do-criador-back-end-production.up.railway.app'
).replace(/\/$/, '');
