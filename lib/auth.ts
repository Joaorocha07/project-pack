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
const DEVICE_ID_KEY = 'pack_device_id';
const REQUEST_TIMEOUT_MS = 45000;
const API_BASE_URL = '/api';

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
  return null;
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

export function saveSession(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function saveUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getOrCreateDeviceId() {
  const storedDeviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (storedDeviceId) {
    return storedDeviceId;
  }

  const deviceId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `device-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(DEVICE_ID_KEY, deviceId);
  return deviceId;
}

export async function clearSession() {
  localStorage.removeItem(USER_KEY);

  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  } catch {
    // The local user state is already cleared; the server cookie will expire naturally if logout fails.
  }
}

export function isAdminRole(role?: User['role']) {
  const normalizedRole = String(role ?? '').toLowerCase();
  return normalizedRole === 'admin' || normalizedRole === 'super_admin';
}

async function apiFetch<T>(path: string, options: RequestInit = {}, fallback = 'Erro na requisicao') {
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await parseApiResponse(response);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem(USER_KEY);
    }

    throw new Error(getApiError(data, fallback));
  }

  return data as T;
}

export async function login(email: string, password: string, deviceId = getOrCreateDeviceId()) {
  const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password, deviceId, device_id: deviceId }),
  });

  const data = (await parseApiResponse(response)) as Partial<LoginResponse> & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(getApiError(data, 'Nao foi possivel fazer login. Verifique seus dados e tente novamente.'));
  }

  if (!data.user) {
    throw new Error('A resposta do login veio incompleta. Tente novamente.');
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
