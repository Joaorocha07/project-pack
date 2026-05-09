import { BACKEND_URL } from './session';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'TESTE' | 'AFILIADO' | 'admin' | 'user' | 'teste' | 'afiliado';
  roleLabel?: 'admin' | 'user' | 'teste' | 'afiliado';
  hasAccess: boolean;
  temporaryPassword: boolean;
};

type LoginResponse = {
  user: User;
};

export type AdminUser = User & {
  accessEmailSent: boolean;
  accessEmailSentAt: string | null;
  profile?: UserProfile | null;
};

export type UserRoleLabel = 'admin' | 'user' | 'teste' | 'afiliado';

export type UserProfile = {
  id: string;
  role: string;
  roleLabel: UserRoleLabel;
  temporarilyDisabled: boolean;
  disabledUntil: string | null;
  disabledReason: string | null;
};

export type ImportCaktoSummary = {
  totalOrdersRead: number;
  paidPackOrders: number;
  imported: number;
  skipped: number;
  emailsSent: number;
};

export type SendAccessEmailResponse = {
  ok: boolean;
  message?: string;
  user: AdminUser;
};

export type AdminUserMutationResponse = {
  ok: boolean;
  message: string;
  user: AdminUser;
};

const USER_KEY = 'user';
const TOKEN_KEY = 'pack_token';
const REMEMBERED_EMAIL_KEY = 'pack_remembered_email';
const REQUEST_TIMEOUT_MS = 45000;

async function parseApiResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function getApiError(data: unknown, fallback: string) {
  if (data && typeof data === 'object' && 'error' in data) {
    const message = (data as { error?: unknown }).error;

    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as { message?: unknown }).message;

    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return fallback;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('A requisicao demorou demais para responder. Tente novamente em instantes.');
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function getStoredToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function saveToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser() {
  const storedUser = sessionStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    sessionStorage.removeItem(USER_KEY);
    return null;
  }
}

export function saveSession(user: User) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function saveUser(user: User) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getRememberedEmail() {
  return localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? '';
}

export function saveRememberedEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail) {
    localStorage.setItem(REMEMBERED_EMAIL_KEY, normalizedEmail);
  }
}

export async function clearSession() {
  const token = getStoredToken();
  sessionStorage.removeItem(USER_KEY);
  clearToken();

  if (token) {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => null);
    } catch {
      // Token will expire naturally.
    }
  }
}

export function isAdminRole(role?: User['role']) {
  const normalizedRole = String(role ?? '').toLowerCase();
  return normalizedRole === 'admin' || normalizedRole === 'super_admin';
}

export function isMemberRole(user?: Pick<User, 'role' | 'roleLabel'> | null) {
  const normalizedRole = String(user?.roleLabel ?? user?.role ?? '').toLowerCase();
  return normalizedRole === 'user' || normalizedRole === 'afiliado' || normalizedRole === 'teste';
}

function authHeaders(extraHeaders?: Record<string, string>) {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

async function apiFetch<T>(path: string, options: RequestInit = {}, fallback = 'Erro na requisicao') {
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getStoredToken();

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetchWithTimeout(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await parseApiResponse(response);

  if (!response.ok) {
    if (response.status === 401) {
      sessionStorage.removeItem(USER_KEY);
      clearToken();
    }

    throw new Error(getApiError(data, fallback));
  }

  return data as T;
}

export async function login(email: string, password: string) {
  const response = await fetchWithTimeout(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = (await parseApiResponse(response)) as Partial<LoginResponse> & {
    token?: string;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(getApiError(data, 'Nao foi possivel fazer login. Verifique seus dados e tente novamente.'));
  }

  if (!data.user) {
    throw new Error('A resposta do login veio incompleta. Tente novamente.');
  }

  if (data.token) {
    saveToken(data.token);
  }

  saveSession(data.user);

  return data as LoginResponse;
}

export async function getMe() {
  const data = await apiFetch<{ user?: User } | User>('/auth/me', {}, 'Sessao expirada. Entre novamente.');
  const user = 'user' in data && data.user ? data.user : (data as User);
  saveUser(user);

  return user;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const data = await apiFetch<{ user?: User; message?: string }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  }, 'Nao foi possivel trocar a senha. Tente novamente.');

  const currentUser = getStoredUser();
  const updatedUser = data.user ?? (currentUser ? { ...currentUser, temporaryPassword: false } : null);

  if (updatedUser) {
    saveUser(updatedUser);
  }

  return data;
}

export async function requestPasswordReset(email: string) {
  const response = await fetchWithTimeout(`${BACKEND_URL}/auth/password-reset/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(getApiError(data, 'Nao foi possivel enviar o codigo. Confira o email e tente novamente.'));
  }

  return data as { ok?: boolean; message?: string };
}

export async function confirmPasswordReset(email: string, code: string, newPassword: string) {
  const response = await fetchWithTimeout(`${BACKEND_URL}/auth/password-reset/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, newPassword }),
  });

  const data = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(getApiError(data, 'Nao foi possivel alterar a senha. Confira o codigo e tente novamente.'));
  }

  return data as { ok?: boolean; message?: string };
}

export async function listUsers() {
  return apiFetch<{ ok: boolean; users: AdminUser[] }>('/admin/users', {}, 'Nao foi possivel listar usuarios.');
}

export async function sendAccessEmail(user: Pick<AdminUser, 'email'>) {
  return apiFetch<SendAccessEmailResponse>('/admin/send-access-email', {
    method: 'POST',
    body: JSON.stringify({ email: user.email }),
  }, 'Nao foi possivel enviar o email de acesso.');
}

export async function updateUserRole(userId: string, role: UserRoleLabel) {
  return apiFetch<AdminUserMutationResponse>(`/admin/users/${encodeURIComponent(userId)}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  }, 'Nao foi possivel alterar o tipo de perfil.');
}

export async function temporarilyDisableUser(userId: string, disabledUntil: string, reason: string) {
  return apiFetch<AdminUserMutationResponse>(`/admin/users/${encodeURIComponent(userId)}/temporary-disable`, {
    method: 'PATCH',
    body: JSON.stringify({ disabledUntil, reason }),
  }, 'Nao foi possivel desativar temporariamente a conta.');
}

export async function reactivateUser(userId: string) {
  return apiFetch<AdminUserMutationResponse>(`/admin/users/${encodeURIComponent(userId)}/temporary-disable`, {
    method: 'DELETE',
  }, 'Nao foi possivel reativar a conta.');
}

export async function updateUserPassword(userId: string, password: string, temporaryPassword = false) {
  return apiFetch<AdminUserMutationResponse>(`/admin/users/${encodeURIComponent(userId)}/password`, {
    method: 'PATCH',
    body: JSON.stringify({ password, temporaryPassword }),
  }, 'Nao foi possivel alterar a senha do perfil.');
}

export async function importCaktoPurchases(sendEmail = false, maxPages = 20) {
  return apiFetch<ImportCaktoSummary>('/admin/import-cakto-purchases', {
    method: 'POST',
    body: JSON.stringify({ sendEmail, maxPages }),
  }, 'Nao foi possivel importar compradores da Cakto.');
}

export async function getCheckoutLink() {
  const response = await fetchWithTimeout(`${BACKEND_URL}/checkout/link`, {
    cache: 'no-store',
  });

  const data = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(getApiError(data, 'Nao foi possivel buscar o link de checkout.'));
  }

  return data as { url: string };
}

export async function bootstrapAdmin(secret: string, name: string, email: string, password: string) {
  const response = await fetchWithTimeout(`${BACKEND_URL}/admin/bootstrap-admin?secret=${encodeURIComponent(secret)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(getApiError(data, 'Nao foi possivel criar o primeiro admin.'));
  }

  return data;
}

export function backendFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  const token = getStoredToken();

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`${BACKEND_URL}${path}`, { ...options, headers });
}
