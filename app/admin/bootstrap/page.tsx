'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { bootstrapAdmin } from '@/lib/auth';

export default function BootstrapAdminPage() {
  const router = useRouter();
  const [secret, setSecret] = useState('');
  const [name, setName] = useState('Pack do Criador');
  const [email, setEmail] = useState('packdocriador1@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 8) {
      setError('Use uma senha de admin com no minimo 8 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      await bootstrapAdmin(secret.trim(), name.trim(), email.trim(), password);
      setSecret('');
      setPassword('');
      setSuccess('Admin criado com sucesso. Redirecionando para o login...');
      setTimeout(() => router.replace('/login'), 1000);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao criar admin.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_430px] lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">Primeiro acesso</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-normal text-white sm:text-5xl">
              Criar admin inicial
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-300 sm:text-lg">
              Use esta tela apenas para criar o administrador inicial. O segredo e digitado manualmente e nao fica salvo no front-end.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/40 sm:p-8">
            <div className="mb-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-white text-black">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Bootstrap admin</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Depois de criado, entre pelo login normal.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="secret">ADMIN_IMPORT_SECRET</Label>
                <Input
                  id="secret"
                  type="password"
                  autoComplete="off"
                  required
                  value={secret}
                  onChange={(event) => setSecret(event.target.value)}
                  className="h-12 border-white/10 bg-black text-white"
                  placeholder="Digite o segredo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-12 border-white/10 bg-black text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 border-white/10 bg-black text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha admin</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 border-white/10 bg-black pr-12 text-white"
                    placeholder="Senha forte"
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

              {success ? (
                <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-100">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              ) : null}

              <Button type="submit" className="h-12 w-full gap-2" disabled={isSubmitting || Boolean(success)}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Criar primeiro admin
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
