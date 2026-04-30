'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, KeyRound, Loader2, LogOut, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { clearSession, getMe, isAdminRole, type User } from '@/lib/auth';

export default function AccessPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function validateSession() {
      try {
        const currentUser = await getMe();

        if (!isMounted) {
          return;
        }

        if (currentUser.temporaryPassword) {
          router.replace('/trocar-senha');
          return;
        }

        if (isAdminRole(currentUser.role)) {
          router.replace('/admin');
          return;
        }

        setUser(currentUser);
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

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleLogout() {
    await clearSession();
    router.replace('/login');
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 text-sm text-zinc-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          Validando seu acesso
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
            <h1 className="text-xl font-semibold text-white">Area do produto</h1>
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
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-emerald-400 text-black">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-semibold tracking-normal">Bem-vindo, {user?.name || 'criador'}.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Seu acesso esta ativo. Use esta area para entrar no produto e manter sua conta segura.
            </p>
          </div>

          <Button
            variant="secondary"
            className="gap-2"
            onClick={() => router.push('/trocar-senha')}
          >
            <KeyRound className="h-4 w-4" />
            Trocar senha
          </Button>
        </div>

        {error ? (
          <Alert variant="destructive" className="mb-6 border-red-500/30 bg-red-500/10">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-5 md:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-lg border border-white/10 bg-zinc-950 p-6">
            <h3 className="text-lg font-semibold">Acesso ao Pack do Criador</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Aqui fica o acesso ao conteudo comprado. Quando o link final do produto estiver disponivel, conecte-o neste botao.
            </p>
            <Button
              className="mt-6 gap-2"
              onClick={() => setError('O link do produto ainda nao foi configurado neste front-end.')}
            >
              <Download className="h-4 w-4" />
              Acessar produto
            </Button>
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-950 p-6">
            <h3 className="text-lg font-semibold">Conta</h3>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-zinc-500">Email</dt>
                <dd className="mt-1 break-all text-zinc-200">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Status</dt>
                <dd className="mt-1 text-emerald-300">Acesso liberado</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </main>
  );
}
