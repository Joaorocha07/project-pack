export const API_BASE_URL = 'https://pack-do-criador-back-end.onrender.com';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  hasAccess: boolean;
  temporaryPassword: boolean;
};

type LoginResponse = {
  token: string;
  user: User;
};

export type AdminUser = User & {
  accessEmailSent: boolean;
  accessEmailSentAt: string | null;
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
  user: AdminUser;
};

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
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
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function saveSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function saveUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAdminRole(role?: User['role']) {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

async function apiFetch<T>(path: string, options: RequestInit = {}, fallback = 'Erro na requisicao') {
  const token = getStoredToken();
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await parseApiResponse(response);

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }

    throw new Error(getApiError(data, fallback));
  }

  return data as T;
}

export async function login(email: string, password: string) {
  const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = (await parseApiResponse(response)) as Partial<LoginResponse> & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(getApiError(data, 'Nao foi possivel fazer login. Verifique seus dados e tente novamente.'));
  }

  if (!data.token || !data.user) {
    throw new Error('A resposta do login veio incompleta. Tente novamente.');
  }

  saveSession(data.token, data.user);

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

export async function listUsers() {
  return apiFetch<{ ok: boolean; users: AdminUser[] }>('/admin/users', {}, 'Nao foi possivel listar usuarios.');
}

export async function sendAccessEmail(user: Pick<AdminUser, 'email'>) {
  return apiFetch<SendAccessEmailResponse>('/admin/send-access-email', {
    method: 'POST',
    body: JSON.stringify({ email: user.email }),
  }, 'Nao foi possivel enviar o email de acesso.');
}

export async function importCaktoPurchases(sendEmail = false, maxPages = 20) {
  return apiFetch<ImportCaktoSummary>('/admin/import-cakto-purchases', {
    method: 'POST',
    body: JSON.stringify({ sendEmail, maxPages }),
  }, 'Nao foi possivel importar compradores da Cakto.');
}

export async function bootstrapAdmin(secret: string, name: string, email: string, password: string) {
  const response = await fetchWithTimeout(`${API_BASE_URL}/admin/bootstrap-admin?secret=${encodeURIComponent(secret)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(getApiError(data, 'Nao foi possivel criar o primeiro admin.'));
  }

  return data;
}
