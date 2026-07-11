'use client';

import { useState, useRef, useEffect } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function VerifyPage() {
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();

  const [otp,        setOtp]        = useState<string[]>(Array(6).fill(''));
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const [verified,   setVerified]   = useState(false);
  const [resending,  setResending]  = useState(false);
  const [resendMsg,  setResendMsg]  = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // ── Handle single digit input ─────────────────────────
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError('');
    // Auto-advance
    if (index < 5) inputRefs.current[index + 1]?.focus();
    // Auto-submit when last digit filled
    if (index === 5 && next.every(d => d !== '')) {
      verifyOtp(next.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const next = [...otp];
        next[index] = '';
        setOtp(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setOtp(next);
    const lastFilled = Math.min(pasted.length, 5);
    inputRefs.current[lastFilled]?.focus();
    if (pasted.length === 6) verifyOtp(pasted);
  };

  // ── Verify OTP with Clerk ─────────────────────────────
  const verifyOtp = async (code: string) => {
    if (!isLoaded || !signUp) return;
    setLoading(true);
    setError('');
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        setVerified(true);
        setTimeout(() => router.push('/'), 1200);
      } else {
        setError('Verification incomplete. Please try again.');
      }
    } catch (err: unknown) {
      const msg = (err as { errors?: { message: string }[] })?.errors?.[0]?.message;
      setError(msg || 'Invalid code. Please try again.');
      // Shake and clear
      setOtp(Array(6).fill(''));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    const code = otp.join('');
    if (code.length === 6) verifyOtp(code);
  };

  // ── Resend ────────────────────────────────────────────
  const handleResend = async () => {
    if (!isLoaded || !signUp) return;
    setResending(true);
    setResendMsg('');
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setResendMsg('New code sent!');
      setOtp(Array(6).fill(''));
      setError('');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setResendMsg('Could not resend. Try again.');
    } finally {
      setResending(false);
      setTimeout(() => setResendMsg(''), 3000);
    }
  };

  const filledCount = otp.filter(d => d !== '').length;

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-30" />
      <div className="dark:block hidden absolute -top-40 -left-40 w-96 h-96 bg-cyber-cyan rounded-full blur-[160px] opacity-8 pointer-events-none" />
      <div className="dark:block hidden absolute -bottom-40 -right-40 w-96 h-96 bg-cyber-purple rounded-full blur-[160px] opacity-8 pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">

        {/* Back link */}
        <Link href="/sign-up" className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#52525B] hover:text-[#A1A1AA] transition-colors mb-6">
          <ArrowLeft className="w-3 h-3" />
          Back to sign up
        </Link>

        <AnimatePresence mode="wait">
          {verified ? (
            // ── Success state ────────────────────────────
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="flex flex-col items-center gap-4 py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-cyber-lime/10 border border-cyber-lime/30 flex items-center justify-center"
              >
                <CheckCircle2 className="w-8 h-8 text-cyber-lime" />
              </motion.div>
              <div>
                <h2 className="text-lg font-bold font-display text-white tracking-wider">VERIFIED</h2>
                <p className="text-xs text-[#A1A1AA] mt-1">Redirecting to workspace...</p>
              </div>
            </motion.div>
          ) : (
            // ── OTP form ─────────────────────────────────
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0D0E16] border border-white/10 rounded-2xl p-7 shadow-2xl flex flex-col gap-6"
            >
              {/* Header */}
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyber-purple to-cyber-cyan p-[1.5px] shadow-[0_0_16px_rgba(139,92,246,0.3)]">
                  <div className="w-full h-full bg-[#0D0E16] rounded-xl flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-cyber-cyan" />
                  </div>
                </div>
                <div>
                  <h1 className="text-base font-bold font-display tracking-widest text-white uppercase">Verify Email</h1>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">Enter the 6-digit code sent to your email</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyber-purple to-cyber-cyan rounded-full"
                  animate={{ width: `${(filledCount / 6) * 100}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              {/* OTP Inputs */}
              <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <motion.input
                    key={i}
                    ref={el => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(e.target.value, i)}
                    onKeyDown={e => handleKeyDown(e, i)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold font-mono rounded-xl border bg-white/5 outline-none transition-all duration-150 ${
                      digit
                        ? 'border-cyber-cyan text-white shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                        : 'border-white/10 text-white focus:border-cyber-cyan/60 focus:shadow-[0_0_8px_rgba(0,229,255,0.1)]'
                    } ${error ? 'border-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.15)]' : ''}`}
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs font-mono text-red-400 text-center bg-red-400/5 border border-red-400/20 rounded-lg px-3 py-2"
                  >
                    ⚠ {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                onClick={handleSubmit}
                disabled={loading || filledCount < 6}
                whileHover={{ scale: filledCount === 6 && !loading ? 1.02 : 1 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-cyan text-black text-sm font-bold font-display tracking-wider transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> VERIFYING...</>
                  : 'VERIFY EMAIL'
                }
              </motion.button>

              {/* Resend */}
              <div className="text-center">
                <span className="text-xs text-[#52525B]">Didn't receive a code? </span>
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-xs text-cyber-cyan hover:underline disabled:opacity-50 font-medium"
                >
                  {resending ? 'Sending...' : 'Resend'}
                </button>
                <AnimatePresence>
                  {resendMsg && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px] font-mono text-cyber-lime mt-1"
                    >
                      {resendMsg}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
