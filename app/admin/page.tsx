'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, DownloadCloud, Loader2, LogOut, RefreshCw, Users } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { clearSession, getMe, importCaktoPurchases, type ImportCaktoSummary, type User } from '@/lib/auth';

const emptySummary: ImportCaktoSummary = {
  totalOrdersRead: 0,
  paidPackOrders: 0,
  imported: 0,
  skipped: 0,
  emailsSent: 0,
};

export default function AdminPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<User | null>(null);
  const [summary, setSummary] = useState<ImportCaktoSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

        if (currentUser.role !== 'ADMIN') {
          router.replace('/acesso');
          return;
        }

        setAdmin(currentUser);
      } catch {
        if (isMounted) {
          router.replace('/login');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    validateAdmin();

    return () => {
      isMounted = false;
    };
  }, [router]);

  function handleLogout() {
    clearSession();
    router.replace('/login');
  }

  async function handleImport() {
    setError('');
    setSuccess('');
    setIsImporting(true);

    try {
      const data = await importCaktoPurchases(false, 20);
      setSummary({ ...emptySummary, ...data });
      setSuccess('Importacao concluida. Revise os usuarios e envie os acessos manualmente.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao importar compradores.');
    } finally {
      setIsImporting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 text-sm text-zinc-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          Validando permissao admin
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5">
          <div>
            <p className="text-sm text-zinc-400">Pack do Criador</p>
            <h1 className="text-xl font-semibold text-white">Painel admin</h1>
          </div>
          <Button variant="outline" className="gap-2 border-white/15 bg-transparent text-white hover:bg-white/10" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">Administrador</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">Ola, {admin?.name || 'admin'}.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Importe compradores da Cakto, acompanhe usuarios e envie emails de acesso quando necessario.
            </p>
          </div>
          <Button className="gap-2" onClick={() => router.push('/admin/usuarios')}>
            <Users className="h-4 w-4" />
            Ver usuarios
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

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-white/10 bg-zinc-950 p-6">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-white text-black">
              <DownloadCloud className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold">Importar compradores da Cakto</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              A importacao usa envio de email desativado por padrao. Depois, envie o acesso manualmente na tabela de usuarios.
            </p>
            <Button className="mt-6 gap-2" onClick={handleImport} disabled={isImporting}>
              {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Importar compradores
            </Button>
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-950 p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">Resumo da ultima importacao</h3>
              <Button variant="ghost" className="gap-2 text-zinc-300 hover:bg-white/10 hover:text-white" onClick={() => router.push('/admin/usuarios')}>
                Usuarios
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <SummaryItem label="Pedidos lidos" value={summary?.totalOrdersRead ?? 0} />
              <SummaryItem label="Pedidos pagos" value={summary?.paidPackOrders ?? 0} />
              <SummaryItem label="Importados" value={summary?.imported ?? 0} />
              <SummaryItem label="Ignorados" value={summary?.skipped ?? 0} />
              <SummaryItem label="Emails enviados" value={summary?.emailsSent ?? 0} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/10 bg-black p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
