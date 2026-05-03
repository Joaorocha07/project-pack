'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, KeyRound, Loader2, LogOut, Mail, RefreshCw, ShieldCheck, ShieldOff } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  clearSession,
  getMe,
  isAdminRole,
  listUsers,
  reactivateUser,
  sendAccessEmail,
  temporarilyDisableUser,
  updateUserPassword,
  updateUserRole,
  type AdminUser,
  type UserRoleLabel,
} from '@/lib/auth';

const PROFILE_ROLES: UserRoleLabel[] = ['admin', 'user', 'teste', 'afiliado'];

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sendingAccessTo, setSendingAccessTo] = useState('');
  const [busyAction, setBusyAction] = useState('');
  const [disableUntilByUser, setDisableUntilByUser] = useState<Record<string, string>>({});
  const [disableReasonByUser, setDisableReasonByUser] = useState<Record<string, string>>({});
  const [passwordByUser, setPasswordByUser] = useState<Record<string, string>>({});
  const [temporaryPasswordByUser, setTemporaryPasswordByUser] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const totalUsers = users.length;
  const disabledUsers = users.filter((user) => user.profile?.temporarilyDisabled).length;
  const pendingEmails = users.filter((user) => !user.accessEmailSent).length;

  const loadUsers = useCallback(async (showLoader = false) => {
    setError('');

    if (showLoader) {
      setIsRefreshing(true);
    }

    try {
      const data = await listUsers();
      setUsers((data.users ?? []).map(normalizeUser));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao carregar usuarios.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function validateAdmin() {
      try {
        const currentUser = await getMe();

        if (!isMounted) {
          return;
        }

        if (currentUser.temporaryPassword) {
          router.replace('/trocar-senha');
          return;
        }

        if (!isAdminRole(currentUser.role)) {
          router.replace('/acesso');
          return;
        }

        await loadUsers();
      } catch {
        if (isMounted) {
          router.replace('/login');
        }
      }
    }

    validateAdmin();

    return () => {
      isMounted = false;
    };
  }, [loadUsers, router]);

  async function handleLogout() {
    await clearSession();
    router.replace('/login');
  }

  async function handleSendAccessEmail(user: AdminUser) {
    setError('');
    setSuccess('');
    setSendingAccessTo(user.id || user.email);

    try {
      const data = await sendAccessEmail(user);
      const updatedUser = data.user;

      setSuccess('Email de acesso enviado com sucesso.');

      if (updatedUser) {
        applyUpdatedUser(updatedUser);
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao enviar email de acesso.');
    } finally {
      setSendingAccessTo('');
    }
  }

  function applyUpdatedUser(updatedUser: AdminUser) {
    setUsers((currentUsers) =>
      currentUsers.map((currentUser) =>
        currentUser.id === updatedUser.id || currentUser.email === updatedUser.email
          ? normalizeUser({
              ...currentUser,
              ...updatedUser,
              accessEmailSent: updatedUser.accessEmailSent ?? currentUser.accessEmailSent,
              accessEmailSentAt: updatedUser.accessEmailSentAt ?? currentUser.accessEmailSentAt,
            })
          : currentUser
      )
    );
  }

  function setDisablePreset(userId: string, days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setDisableUntilByUser((current) => ({
      ...current,
      [userId]: toDateTimeLocalValue(date),
    }));
  }

  async function handleRoleChange(user: AdminUser, role: UserRoleLabel) {
    setError('');
    setSuccess('');
    setBusyAction(`role-${user.id}`);

    try {
      const data = await updateUserRole(user.id, role);
      applyUpdatedUser(data.user);
      setSuccess(data.message || 'Tipo de perfil atualizado.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao alterar tipo de perfil.');
    } finally {
      setBusyAction('');
    }
  }

  async function handleTemporaryDisable(user: AdminUser) {
    const disabledUntilLocal = disableUntilByUser[user.id];

    if (!disabledUntilLocal) {
      setError('Informe ate quando a conta deve ficar desativada.');
      return;
    }

    setError('');
    setSuccess('');
    setBusyAction(`disable-${user.id}`);

    try {
      const data = await temporarilyDisableUser(
        user.id,
        new Date(disabledUntilLocal).toISOString(),
        disableReasonByUser[user.id]?.trim() || 'Pausa temporaria definida pelo admin.'
      );
      applyUpdatedUser(data.user);
      setSuccess(data.message || 'Conta desativada temporariamente.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao desativar conta.');
    } finally {
      setBusyAction('');
    }
  }

  async function handleReactivate(user: AdminUser) {
    setError('');
    setSuccess('');
    setBusyAction(`reactivate-${user.id}`);

    try {
      const data = await reactivateUser(user.id);
      applyUpdatedUser(data.user);
      setSuccess(data.message || 'Conta reativada.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao reativar conta.');
    } finally {
      setBusyAction('');
    }
  }

  async function handleAdminPasswordChange(user: AdminUser) {
    const password = passwordByUser[user.id]?.trim();

    if (!password || password.length < 6) {
      setError('Informe uma senha com pelo menos 6 caracteres.');
      return;
    }

    setError('');
    setSuccess('');
    setBusyAction(`password-${user.id}`);

    try {
      const data = await updateUserPassword(user.id, password, Boolean(temporaryPasswordByUser[user.id]));
      applyUpdatedUser(data.user);
      setPasswordByUser((current) => ({ ...current, [user.id]: '' }));
      setSuccess(data.message || 'Senha atualizada.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao alterar senha.');
    } finally {
      setBusyAction('');
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 text-sm text-zinc-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          Carregando usuarios
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <div>
            <p className="text-sm text-zinc-400">Pack do Criador</p>
            <h1 className="text-xl font-semibold text-white">Usuarios</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 border-white/15 bg-transparent text-white hover:bg-white/10" onClick={() => router.push('/admin')}>
              <ArrowLeft className="h-4 w-4" />
              Admin
            </Button>
            <Button variant="outline" className="gap-2 border-white/15 bg-transparent text-white hover:bg-white/10" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-5 py-10">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">Admin</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">Perfis e acessos</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Gerencie tipo de perfil, envio de acesso, bloqueios temporarios e senha dos usuarios.
            </p>
          </div>
          <Button variant="secondary" className="gap-2" onClick={() => loadUsers(true)} disabled={isRefreshing}>
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Atualizar
          </Button>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <SummaryCard label="Usuarios" value={totalUsers} />
          <SummaryCard label="Emails pendentes" value={pendingEmails} tone={pendingEmails ? 'text-amber-300' : 'text-emerald-300'} />
          <SummaryCard label="Bloqueios temporarios" value={disabledUsers} tone={disabledUsers ? 'text-red-300' : 'text-emerald-300'} />
        </div>

        {error ? (
          <Alert variant="destructive" className="mb-6 border-red-500/30 bg-red-500/10">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {success ? (
          <Alert className="mb-6 border-emerald-500/30 bg-emerald-500/10 text-emerald-100">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        ) : null}

        {users.length ? (
          <div className="space-y-4">
            {users.map((user) => {
              const roleLabel = getRoleLabel(user);
              const isTemporarilyDisabled = Boolean(user.profile?.temporarilyDisabled);

              return (
                <article key={user.id} className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
                  <div className="border-b border-white/10 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{user.name || 'Usuario sem nome'}</h3>
                          <RoleBadge role={roleLabel} />
                          {isTemporarilyDisabled ? (
                            <Badge className="border-red-500/20 bg-red-500/10 text-red-300">desativado</Badge>
                          ) : (
                            <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300">ativo</Badge>
                          )}
                        </div>
                        <p className="mt-2 break-all text-sm text-zinc-400">{user.email}</p>
                      </div>

                      <div className="grid gap-3 text-sm sm:grid-cols-3 lg:min-w-[420px]">
                        <MiniStatus label="Acesso" value={user.hasAccess ? 'Liberado' : 'Bloqueado'} ok={user.hasAccess} />
                        <MiniStatus label="Senha temp." value={user.temporaryPassword ? 'Sim' : 'Nao'} ok={!user.temporaryPassword} />
                        <MiniStatus label="Email" value={user.accessEmailSent ? 'Enviado' : 'Pendente'} ok={user.accessEmailSent} />
                      </div>
                    </div>

                    {isTemporarilyDisabled ? (
                      <div className="mt-4 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">
                        <p>Conta desativada ate {formatDate(user.profile?.disabledUntil ?? null)}.</p>
                        {user.profile?.disabledReason ? <p className="mt-1 text-red-200/80">{user.profile.disabledReason}</p> : null}
                      </div>
                    ) : null}
                  </div>

                  <div className="grid gap-4 p-5 xl:grid-cols-[220px_minmax(0,1fr)_280px_280px]">
                    <section className="rounded-lg border border-white/10 bg-black p-4">
                      <PanelTitle title="Perfil" />
                      <select
                        value={roleLabel}
                        onChange={(event) => handleRoleChange(user, event.target.value as UserRoleLabel)}
                        disabled={busyAction === `role-${user.id}`}
                        className="mt-3 h-11 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-sm text-white"
                      >
                        {PROFILE_ROLES.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </section>

                    <section className="rounded-lg border border-white/10 bg-black p-4">
                      <PanelTitle title="Email de acesso" />
                      <p className="mt-2 text-sm text-zinc-500">
                        {user.accessEmailSent ? `Enviado em ${formatDate(user.accessEmailSentAt)}` : 'Ainda nao enviado para este usuario.'}
                      </p>
                      <Button
                        className="mt-4 w-full gap-2"
                        variant={user.accessEmailSent ? 'secondary' : 'default'}
                        onClick={() => handleSendAccessEmail(user)}
                        disabled={sendingAccessTo === (user.id || user.email)}
                      >
                        {sendingAccessTo === (user.id || user.email) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                        {user.accessEmailSent ? 'Reenviar acesso' : 'Enviar acesso'}
                      </Button>
                    </section>

                    <section className="rounded-lg border border-white/10 bg-black p-4">
                      <PanelTitle title="Bloqueio temporario" />
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <QuickDateButton label="1 dia" onClick={() => setDisablePreset(user.id, 1)} />
                        <QuickDateButton label="1 semana" onClick={() => setDisablePreset(user.id, 7)} />
                        <QuickDateButton label="1 mes" onClick={() => setDisablePreset(user.id, 30)} />
                      </div>
                      <Input
                        type="datetime-local"
                        value={disableUntilByUser[user.id] ?? ''}
                        onChange={(event) => setDisableUntilByUser((current) => ({ ...current, [user.id]: event.target.value }))}
                        className="mt-3 h-11 border-white/10 bg-zinc-950 text-white"
                      />
                      <Input
                        value={disableReasonByUser[user.id] ?? ''}
                        onChange={(event) => setDisableReasonByUser((current) => ({ ...current, [user.id]: event.target.value }))}
                        className="mt-2 h-11 border-white/10 bg-zinc-950 text-white"
                        placeholder="Motivo do bloqueio"
                      />
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <Button
                          variant="secondary"
                          className="gap-2"
                          onClick={() => handleTemporaryDisable(user)}
                          disabled={busyAction === `disable-${user.id}`}
                        >
                          {busyAction === `disable-${user.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldOff className="h-4 w-4" />}
                          Desativar
                        </Button>
                        <Button
                          variant="outline"
                          className="gap-2 border-white/15 bg-transparent text-white hover:bg-white/10"
                          onClick={() => handleReactivate(user)}
                          disabled={!isTemporarilyDisabled || busyAction === `reactivate-${user.id}`}
                        >
                          {busyAction === `reactivate-${user.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                          Reativar
                        </Button>
                      </div>
                    </section>

                    <section className="rounded-lg border border-white/10 bg-black p-4">
                      <PanelTitle title="Senha" />
                      <Input
                        type="password"
                        value={passwordByUser[user.id] ?? ''}
                        onChange={(event) => setPasswordByUser((current) => ({ ...current, [user.id]: event.target.value }))}
                        className="mt-3 h-11 border-white/10 bg-zinc-950 text-white"
                        placeholder="Nova senha"
                      />
                      <label className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                        <input
                          type="checkbox"
                          checked={Boolean(temporaryPasswordByUser[user.id])}
                          onChange={(event) => setTemporaryPasswordByUser((current) => ({ ...current, [user.id]: event.target.checked }))}
                          className="h-4 w-4 rounded border-white/10 bg-black"
                        />
                        exigir troca no proximo acesso
                      </label>
                      <Button
                        className="mt-4 w-full gap-2"
                        onClick={() => handleAdminPasswordChange(user)}
                        disabled={busyAction === `password-${user.id}`}
                      >
                        {busyAction === `password-${user.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                        Alterar senha
                      </Button>
                    </section>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 bg-zinc-950 p-10 text-center text-zinc-400">
            Nenhum usuario encontrado.
          </div>
        )}
      </section>
    </main>
  );
}

function SummaryCard({ label, value, tone = 'text-white' }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950 p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function PanelTitle({ title }: { title: string }) {
  return <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">{title}</h4>;
}

function MiniStatus({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  const tone = ok === undefined ? 'text-zinc-300' : ok ? 'text-emerald-300' : 'text-amber-300';

  return (
    <div className="rounded-md border border-white/10 bg-black p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`mt-1 truncate text-sm font-medium ${tone}`}>{value}</p>
    </div>
  );
}

function RoleBadge({ role }: { role: UserRoleLabel }) {
  const classNameByRole: Record<UserRoleLabel, string> = {
    admin: 'bg-white text-black',
    user: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
    teste: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
    afiliado: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
  };

  return <Badge className={classNameByRole[role]}>{role}</Badge>;
}

function QuickDateButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" size="sm" variant="secondary" className="h-9 gap-1 px-2 text-xs" onClick={onClick}>
      <Clock className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

function normalizeUser(user: AdminUser | Record<string, unknown>): AdminUser {
  const raw = user as Record<string, unknown>;
  const emailStatus = typeof raw.email_enviado === 'string' ? raw.email_enviado : '';
  const profile = normalizeProfile(raw.profile);
  const roleLabel = normalizeRoleLabel(
    profile?.roleLabel ??
    raw.roleLabel ??
    raw.role_label ??
    raw.role ??
    raw.perfil
  );

  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? raw.nome ?? ''),
    email: String(raw.email ?? ''),
    role: String(raw.role ?? roleLabel ?? 'user') as AdminUser['role'],
    roleLabel,
    hasAccess: Boolean(raw.hasAccess ?? raw.has_access ?? raw.tem_acesso ?? true),
    temporaryPassword: Boolean(raw.temporaryPassword ?? raw.temporary_password ?? raw.senha_temporaria ?? false),
    accessEmailSent: Boolean(raw.accessEmailSent ?? raw.access_email_sent ?? emailStatus === 'ENVIADO'),
    accessEmailSentAt: (raw.accessEmailSentAt ?? raw.access_email_sent_at ?? raw.enviado_em ?? null) as string | null,
    profile,
  };
}

function normalizeProfile(profile: unknown): AdminUser['profile'] {
  if (!profile || typeof profile !== 'object') {
    return null;
  }

  const raw = profile as Record<string, unknown>;

  return {
    id: String(raw.id ?? ''),
    role: String(raw.role ?? 'USER'),
    roleLabel: normalizeRoleLabel(raw.roleLabel ?? raw.role_label ?? raw.role),
    temporarilyDisabled: Boolean(raw.temporarilyDisabled ?? raw.temporarily_disabled ?? false),
    disabledUntil: (raw.disabledUntil ?? raw.disabled_until ?? null) as string | null,
    disabledReason: (raw.disabledReason ?? raw.disabled_reason ?? null) as string | null,
  };
}

function normalizeRoleLabel(value: unknown): UserRoleLabel {
  const normalized = String(value ?? 'user').toLowerCase();
  return PROFILE_ROLES.includes(normalized as UserRoleLabel) ? normalized as UserRoleLabel : 'user';
}

function getRoleLabel(user: AdminUser): UserRoleLabel {
  return normalizeRoleLabel(user.profile?.roleLabel ?? user.roleLabel ?? user.role);
}

function formatDate(value: string | null) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function toDateTimeLocalValue(date: Date) {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}
