import { API_BASE_URL } from '@/lib/session';

export async function POST(req: Request) {
  const body = await req.text();

  return fetch(`${API_BASE_URL}/auth/password-reset/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    cache: 'no-store',
  });
}
