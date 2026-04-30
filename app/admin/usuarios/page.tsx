'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, LogOut, Mail, RefreshCw } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { clearSession, getMe, isAdminRole, listUsers, sendAccessEmail, type AdminUser } from '@/lib/auth';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sendingAccessTo, setSendingAccessTo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  function handleLogout() {
    clearSession();
    router.replace('/login');
  }

  async function handleSendAccessEmail(user: AdminUser) {
    setError('');
    setSuccess('');
    setSendingAccessTo(user.id || user.email);

    try {
      const data = await sendAccessEmail(user);
      const updatedUser = data.data?.usuario;

      setSuccess(data.message || 'Email de acesso enviado com sucesso.');

      if (updatedUser) {
        setUsers((currentUsers) =>
          currentUsers.map((currentUser) =>
            currentUser.id === updatedUser.id || currentUser.email === updatedUser.email
              ? {
                  ...currentUser,
                  name: updatedUser.nome || currentUser.name,
                  email: updatedUser.email || currentUser.email,
                  role: (updatedUser.perfil as AdminUser['role']) || currentUser.role,
                  accessEmailSent: updatedUser.email_enviado === 'ENVIADO',
                  accessEmailSentAt: updatedUser.enviado_em,
                }
              : currentUser
          )
        );
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao enviar email de acesso.');
    } finally {
      setSendingAccessTo('');
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
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">Lista de usuarios</h2>
          </div>
          <Button variant="secondary" className="gap-2" onClick={() => loadUsers(true)} disabled={isRefreshing}>
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Atualizar
          </Button>
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

        <div className="rounded-lg border border-white/10 bg-zinc-950">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Acesso</TableHead>
                <TableHead>Senha temporaria</TableHead>
                <TableHead>Email enviado</TableHead>
                <TableHead>Enviado em</TableHead>
                <TableHead className="text-right">Acao</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length ? (
                users.map((user) => (
                  <TableRow key={user.id} className="border-white/10">
                    <TableCell className="font-medium text-white">{user.name}</TableCell>
                    <TableCell className="min-w-[220px] break-all text-zinc-300">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={isAdminRole(user.role) ? 'default' : 'secondary'}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.hasAccess ? <StatusOk label="Sim" /> : <StatusMuted label="Nao" />}</TableCell>
                    <TableCell>{user.temporaryPassword ? <StatusMuted label="Sim" /> : <StatusOk label="Nao" />}</TableCell>
                    <TableCell>{user.accessEmailSent ? <StatusOk label="Enviado" /> : <StatusMuted label="Pendente" />}</TableCell>
                    <TableCell className="text-zinc-300">{formatDate(user.accessEmailSentAt)}</TableCell>
                    <TableCell className="text-right">
                      {user.accessEmailSent ? (
                        <span className="text-sm text-emerald-300">Enviado</span>
                      ) : (
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={() => handleSendAccessEmail(user)}
                          disabled={sendingAccessTo === (user.id || user.email)}
                        >
                          {sendingAccessTo === (user.id || user.email) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                          {sendingAccessTo === (user.id || user.email) ? 'Enviando...' : 'Enviar acesso'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-white/10">
                  <TableCell colSpan={8} className="py-10 text-center text-zinc-400">
                    Nenhum usuario encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}

function StatusOk({ label }: { label: string }) {
  return <span className="text-sm text-emerald-300">{label}</span>;
}

function StatusMuted({ label }: { label: string }) {
  return <span className="text-sm text-zinc-400">{label}</span>;
}

function normalizeUser(user: AdminUser | Record<string, unknown>): AdminUser {
  const raw = user as Record<string, unknown>;
  const emailStatus = typeof raw.email_enviado === 'string' ? raw.email_enviado : '';

  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? raw.nome ?? ''),
    email: String(raw.email ?? ''),
    role: String(raw.role ?? raw.perfil ?? 'USER') as AdminUser['role'],
    hasAccess: Boolean(raw.hasAccess ?? raw.has_access ?? raw.tem_acesso ?? true),
    temporaryPassword: Boolean(raw.temporaryPassword ?? raw.temporary_password ?? raw.senha_temporaria ?? false),
    accessEmailSent: Boolean(raw.accessEmailSent ?? raw.access_email_sent ?? emailStatus === 'ENVIADO'),
    accessEmailSentAt: (raw.accessEmailSentAt ?? raw.access_email_sent_at ?? raw.enviado_em ?? null) as string | null,
  };
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
