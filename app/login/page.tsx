'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2, LockKeyhole, LogIn, Mail, Send } from 'lucide-react';

import {
  confirmPasswordReset,
  getMe,
  getRememberedEmail,
  isAdminRole,
  login,
  requestPasswordReset,
  saveRememberedEmail,
} from '@/lib/auth';
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
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetStep, setResetStep] = useState<'request' | 'confirm'>('request');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);

  useEffect(() => {
    const rememberedEmail = getRememberedEmail();

    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setResetEmail(rememberedEmail);
    }

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
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim();
      const data = await login(normalizedEmail, password);
      saveRememberedEmail(normalizedEmail);
      router.replace(data.user.temporaryPassword ? '/trocar-senha' : isAdminRole(data.user.role) ? '/admin' : '/acesso');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRequestReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsResetSubmitting(true);

    try {
      const normalizedEmail = resetEmail.trim();
      await requestPasswordReset(normalizedEmail);
      saveRememberedEmail(normalizedEmail);
      setResetStep('confirm');
      setSuccessMessage('Codigo enviado. Confira seu email e informe os 6 digitos abaixo.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Nao foi possivel enviar o codigo.');
    } finally {
      setIsResetSubmitting(false);
    }
  }

  async function handleConfirmReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword.length < 6) {
      setError('A nova senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (resetCode.trim().length !== 6) {
      setError('Informe o codigo de 6 digitos.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('As senhas nao conferem.');
      return;
    }

    setIsResetSubmitting(true);

    try {
      const normalizedEmail = resetEmail.trim();
      await confirmPasswordReset(normalizedEmail, resetCode.trim(), newPassword);
      saveRememberedEmail(normalizedEmail);
      setEmail(normalizedEmail);
      setPassword('');
      setResetCode('');
      setNewPassword('');
      setConfirmNewPassword('');
      setResetStep('request');
      setIsResetMode(false);
      setSuccessMessage('Senha alterada. Agora entre com sua nova senha.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Nao foi possivel alterar a senha.');
    } finally {
      setIsResetSubmitting(false);
    }
  }

  function openResetMode() {
    setError('');
    setSuccessMessage('');
    setResetEmail(email.trim());
    setResetStep('request');
    setIsResetMode(true);
  }

  function closeResetMode() {
    setError('');
    setSuccessMessage('');
    setIsResetMode(false);
    setResetStep('request');
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-[#F8F8F8]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(255,0,255,0.05),transparent_30%)]" />
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#F8F8F8]/60">Area de membros</p>
            <h1 className="font-display mt-5 text-4xl font-bold tracking-normal text-[#F8F8F8] sm:text-5xl">
              Pack do Criador
            </h1>
            <p className="mt-5 text-base leading-7 text-[#F8F8F8]/70 sm:text-lg">
              Entre com o email e a senha temporaria recebidos apos a compra para acessar os arquivos do produto.
            </p>
          </div>

          <div className="border border-white/10 bg-[#070707]/95 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
            <div className="mb-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-[#F8F8F8]/20 bg-[#F8F8F8] text-black shadow-[0_16px_45px_rgba(248,248,248,0.10)]">
                <LockKeyhole className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-[#F8F8F8]">{isResetMode ? 'Recuperar senha' : 'Acessar produto'}</h2>
              <p className="mt-2 text-sm leading-6 text-[#F8F8F8]/60">
                {isResetMode
                  ? resetStep === 'request'
                    ? 'Informe o mesmo email usado para comprar o Pack do Criador pela Cakto.'
                    : 'Informe o codigo recebido e escolha sua nova senha.'
                  : 'Use as credenciais enviadas pela Cakto.'}
              </p>
            </div>

            {isResetMode ? (
              <form className="space-y-5" onSubmit={resetStep === 'request' ? handleRequestReset : handleConfirmReset}>
                <div className="space-y-2.5">
                  <Label htmlFor="reset-email" className="text-sm font-semibold text-[#F8F8F8]">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F8F8F8]/50" aria-hidden="true" />
                    <Input
                      id="reset-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      value={resetEmail}
                      onChange={(event) => setResetEmail(event.target.value)}
                      disabled={resetStep === 'confirm'}
                      className="h-[52px] rounded-none border-white/10 bg-black pl-11 text-[#F8F8F8] placeholder:text-[#F8F8F8]/40 shadow-inner shadow-black/30 outline-none transition focus-visible:border-[#F8F8F8]/70 focus-visible:ring-2 focus-visible:ring-[#FF00FF]/15 disabled:opacity-70"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                {resetStep === 'confirm' ? (
                  <>
                    <div className="space-y-2.5">
                      <Label htmlFor="reset-code" className="text-sm font-semibold text-[#F8F8F8]">Codigo de 6 digitos</Label>
                      <div className="relative">
                        <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F8F8F8]/50" aria-hidden="true" />
                        <Input
                          id="reset-code"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          required
                          value={resetCode}
                          onChange={(event) => setResetCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="h-[52px] rounded-none border-white/10 bg-black pl-11 text-[#F8F8F8] placeholder:text-[#F8F8F8]/40 shadow-inner shadow-black/30 outline-none transition focus-visible:border-[#F8F8F8]/70 focus-visible:ring-2 focus-visible:ring-[#FF00FF]/15"
                          placeholder="123456"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="new-password" className="text-sm font-semibold text-[#F8F8F8]">Nova senha</Label>
                      <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F8F8F8]/50" aria-hidden="true" />
                        <Input
                          id="new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          value={newPassword}
                          onChange={(event) => setNewPassword(event.target.value)}
                          className="h-[52px] rounded-none border-white/10 bg-black pl-11 pr-12 text-[#F8F8F8] placeholder:text-[#F8F8F8]/40 shadow-inner shadow-black/30 outline-none transition focus-visible:border-[#F8F8F8]/70 focus-visible:ring-2 focus-visible:ring-[#FF00FF]/15"
                          placeholder="Nova senha"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-[#F8F8F8]/60 transition-colors hover:bg-[#F8F8F8]/10 hover:text-[#F8F8F8]"
                          onClick={() => setShowNewPassword((value) => !value)}
                          aria-label={showNewPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="confirm-new-password" className="text-sm font-semibold text-[#F8F8F8]">Confirmar nova senha</Label>
                      <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F8F8F8]/50" aria-hidden="true" />
                        <Input
                          id="confirm-new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          value={confirmNewPassword}
                          onChange={(event) => setConfirmNewPassword(event.target.value)}
                          className="h-[52px] rounded-none border-white/10 bg-black pl-11 text-[#F8F8F8] placeholder:text-[#F8F8F8]/40 shadow-inner shadow-black/30 outline-none transition focus-visible:border-[#F8F8F8]/70 focus-visible:ring-2 focus-visible:ring-[#FF00FF]/15"
                          placeholder="Repita a nova senha"
                        />
                      </div>
                    </div>
                  </>
                ) : null}

                {successMessage ? (
                  <Alert className="rounded-none border-emerald-400/35 bg-emerald-400/10 text-emerald-100">
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                ) : null}

                {error ? (
                  <Alert variant="destructive" className="rounded-none border-red-500/35 bg-red-500/10 text-red-100">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                <Button
                  type="submit"
                  className="h-[58px] w-full gap-3 rounded-full bg-[#F8F8F8] text-base font-bold text-black shadow-[0_18px_55px_rgba(248,248,248,0.12)] transition duration-300 ease-out hover:scale-[1.02] hover:bg-white hover:shadow-[0_22px_70px_rgba(248,248,248,0.18)]"
                  disabled={isResetSubmitting}
                >
                  {isResetSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : resetStep === 'request' ? <Send className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
                  {resetStep === 'request' ? 'Enviar codigo' : 'Alterar senha'}
                </Button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-[#F8F8F8]/70 transition hover:text-[#F8F8F8]"
                  onClick={closeResetMode}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para o login
                </button>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-sm font-semibold text-[#F8F8F8]">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F8F8F8]/50" aria-hidden="true" />
                    <Input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-[52px] rounded-none border-white/10 bg-black pl-11 text-[#F8F8F8] placeholder:text-[#F8F8F8]/40 shadow-inner shadow-black/30 outline-none transition focus-visible:border-[#F8F8F8]/70 focus-visible:ring-2 focus-visible:ring-[#FF00FF]/15"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <Label htmlFor="password" className="text-sm font-semibold text-[#F8F8F8]">Senha</Label>
                    <button
                      type="button"
                      className="w-fit text-left text-sm font-semibold text-[#F8F8F8]/65 transition hover:text-[#F8F8F8] sm:text-right"
                      onClick={openResetMode}
                    >
                      Nao sabe sua senha? Clique aqui
                    </button>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F8F8F8]/50" aria-hidden="true" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-[52px] rounded-none border-white/10 bg-black pl-11 pr-12 text-[#F8F8F8] placeholder:text-[#F8F8F8]/40 shadow-inner shadow-black/30 outline-none transition focus-visible:border-[#F8F8F8]/70 focus-visible:ring-2 focus-visible:ring-[#FF00FF]/15"
                      placeholder="Sua senha"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-[#F8F8F8]/60 transition-colors hover:bg-[#F8F8F8]/10 hover:text-[#F8F8F8]"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {successMessage ? (
                  <Alert className="rounded-none border-emerald-400/35 bg-emerald-400/10 text-emerald-100">
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                ) : null}

                {error ? (
                  <Alert variant="destructive" className="rounded-none border-red-500/35 bg-red-500/10 text-red-100">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                <Button
                  type="submit"
                  className="h-[58px] w-full gap-3 rounded-full bg-[#F8F8F8] text-base font-bold text-black shadow-[0_18px_55px_rgba(248,248,248,0.12)] transition duration-300 ease-out hover:scale-[1.02] hover:bg-white hover:shadow-[0_22px_70px_rgba(248,248,248,0.18)]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                  Entrar
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
