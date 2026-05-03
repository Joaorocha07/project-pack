'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, KeyRound, Loader2, LockKeyhole } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePassword, getMe, getStoredUser, isAdminRole } from '@/lib/auth';

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
      setCurrentPassword('');
      setNewPassword('');
      setSuccess('Senha alterada com sucesso. Redirecionando para o produto...');
      const user = getStoredUser();
      setTimeout(() => router.replace(isAdminRole(user?.role) ? '/admin' : '/acesso'), 900);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao trocar senha. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-[#F8F8F8]">
        <div className="flex items-center gap-3 text-sm text-[#F8F8F8]/70">
          <Loader2 className="h-5 w-5 animate-spin" />
          Validando sua sessao
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-[#F8F8F8]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(255,0,255,0.05),transparent_30%)]" />
      <section className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#F8F8F8]/60">Seguranca da conta</p>
            <h1 className="font-display mt-5 text-4xl font-bold tracking-normal text-[#F8F8F8] sm:text-5xl">
              Troque sua senha
            </h1>
            <p className="mt-5 text-base leading-7 text-[#F8F8F8]/70 sm:text-lg">
              Se voce entrou com uma senha temporaria, defina uma nova senha antes de acessar o produto.
            </p>
          </div>

          <div className="border border-white/10 bg-[#070707]/95 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
            <div className="mb-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-[#F8F8F8]/20 bg-[#F8F8F8] text-black shadow-[0_16px_45px_rgba(248,248,248,0.10)]">
                <KeyRound className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-[#F8F8F8]">Nova senha</h2>
              <p className="mt-2 text-sm leading-6 text-[#F8F8F8]/60">
                Use no minimo 8 caracteres.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2.5">
                <Label htmlFor="currentPassword" className="text-sm font-semibold text-[#F8F8F8]">Senha atual</Label>
                <PasswordInput
                  id="currentPassword"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  showPassword={showPassword}
                  placeholder="Senha temporaria"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="newPassword" className="text-sm font-semibold text-[#F8F8F8]">Nova senha</Label>
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
                className="flex items-center gap-2 text-sm font-medium text-[#F8F8F8]/60 transition-colors hover:text-[#F8F8F8]"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPassword ? 'Ocultar senhas' : 'Mostrar senhas'}
              </button>

              {error ? (
                <Alert variant="destructive" className="rounded-none border-red-500/35 bg-red-500/10 text-red-100">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              {success ? (
                <Alert className="rounded-none border-emerald-500/35 bg-emerald-500/10 text-emerald-100">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              ) : null}

              <Button type="submit" className="h-[58px] w-full gap-3 rounded-full bg-[#F8F8F8] text-base font-bold text-black shadow-[0_18px_55px_rgba(248,248,248,0.12)] transition duration-300 ease-out hover:scale-[1.02] hover:bg-white hover:shadow-[0_22px_70px_rgba(248,248,248,0.18)]" disabled={isSubmitting || Boolean(success)}>
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
      <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F8F8F8]/50" aria-hidden="true" />
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        autoComplete={id === 'newPassword' ? 'new-password' : 'current-password'}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[52px] rounded-none border-white/10 bg-black pl-11 text-[#F8F8F8] placeholder:text-[#F8F8F8]/40 shadow-inner shadow-black/30 outline-none transition focus-visible:border-[#F8F8F8]/70 focus-visible:ring-2 focus-visible:ring-[#FF00FF]/15"
        placeholder={placeholder}
      />
    </div>
  );
}
