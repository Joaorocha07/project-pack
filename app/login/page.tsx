'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, LockKeyhole, LogIn, Mail } from 'lucide-react';

import { getMe, isAdminRole, login } from '@/lib/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function redirectAuthenticatedUser() {
      try {
        const user = await getMe();

        if (!isMounted) {
          return;
        }

        if (user.temporaryPassword) {
          router.replace('/trocar-senha');
          return;
        }

        router.replace(isAdminRole(user.role) ? '/admin' : '/acesso');
      } catch {
        // No active session; stay on the login page.
      }
    }

    redirectAuthenticatedUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await login(email.trim(), password);
      router.replace(data.user.temporaryPassword ? '/trocar-senha' : isAdminRole(data.user.role) ? '/admin' : '/acesso');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">Area de membros</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-normal text-white sm:text-5xl">
              Pack do Criador
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-300 sm:text-lg">
              Entre com o email e a senha temporaria recebidos apos a compra para acessar os arquivos do produto.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/40 sm:p-8">
            <div className="mb-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-white text-black">
                <LockKeyhole className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Acessar produto</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Use as credenciais enviadas pela Cakto.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 border-white/10 bg-black pl-10 text-white"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 border-white/10 bg-black pl-10 pr-12 text-white"
                    placeholder="Sua senha"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error ? (
                <Alert variant="destructive" className="border-red-500/30 bg-red-500/10">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <Button type="submit" className="h-12 w-full gap-2" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Entrar
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
