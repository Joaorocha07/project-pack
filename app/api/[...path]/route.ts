import { NextRequest, NextResponse } from 'next/server';

import { API_BASE_URL, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from '@/lib/session';

type RouteContext = {
  params: {
    path: string[];
  };
};

async function handler(request: NextRequest, context: RouteContext) {
  const path = `/${context.params.path.join('/')}`;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (path === '/auth/logout') {
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }).catch(() => null);
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text();
  const headers = new Headers();

  headers.set('Accept', 'application/json');

  if (body) {
    headers.set('Content-Type', request.headers.get('Content-Type') ?? 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const backendResponse = await fetch(`${API_BASE_URL}${path}`, {
    method: request.method,
    headers,
    body,
    cache: 'no-store',
  });

  const text = await backendResponse.text();
  const data = parseJson(text);
  const responseBody = path === '/auth/login' && backendResponse.ok ? stripToken(data) : data;
  const response = NextResponse.json(responseBody, { status: backendResponse.status });

  if (path === '/auth/login' && backendResponse.ok && isObject(data) && typeof data.token === 'string') {
    response.cookies.set(SESSION_COOKIE, data.token, SESSION_COOKIE_OPTIONS);
  }

  if (backendResponse.status === 401) {
    response.cookies.delete(SESSION_COOKIE);
  }

  return response;
}

function parseJson(text: string) {
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return {};
  }
}

function stripToken(data: unknown) {
  if (!isObject(data)) {
    return data;
  }

  const { token: _token, ...rest } = data;
  return rest;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export const GET = handler;
export const POST = handler;
