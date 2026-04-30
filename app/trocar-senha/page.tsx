'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, KeyRound, Loader2, LockKeyhole } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePassword, getMe, getStoredUser } from '@/lib/auth';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function validateSession() {
      try {
        await getMe();
      } catch {
        router.replace('/login');
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 8) {
      setError('A nova senha precisa ter no minimo 8 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess('Senha alterada com sucesso. Redirecionando para o produto...');
      const user = getStoredUser();
      setTimeout(() => router.replace(user?.role === 'ADMIN' ? '/admin' : '/acesso'), 900);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao trocar senha. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 text-sm text-zinc-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          Validando sua sessao
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">Seguranca da conta</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-normal text-white sm:text-5xl">
              Troque sua senha
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-300 sm:text-lg">
              Se voce entrou com uma senha temporaria, defina uma nova senha antes de acessar o produto.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/40 sm:p-8">
            <div className="mb-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-white text-black">
                <KeyRound className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Nova senha</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Use no minimo 8 caracteres.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha atual</Label>
                <PasswordInput
                  id="currentPassword"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  showPassword={showPassword}
                  placeholder="Senha temporaria"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova senha</Label>
                <PasswordInput
                  id="newPassword"
                  value={newPassword}
                  onChange={setNewPassword}
                  showPassword={showPassword}
                  placeholder="Nova senha"
                />
              </div>

              <button
                type="button"
                className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPassword ? 'Ocultar senhas' : 'Mostrar senhas'}
              </button>

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
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
                Alterar senha
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  placeholder: string;
};

function PasswordInput({ id, value, onChange, showPassword, placeholder }: PasswordInputProps) {
  return (
    <div className="relative">
      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        autoComplete={id === 'newPassword' ? 'new-password' : 'current-password'}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 border-white/10 bg-black pl-10 text-white"
        placeholder={placeholder}
      />
    </div>
  );
}
