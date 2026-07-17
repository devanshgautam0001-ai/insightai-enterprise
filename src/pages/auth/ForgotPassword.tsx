import React, { useState } from 'react';
import { ArrowLeft, Key, Mail, AlertCircle } from 'lucide-react';
import { useUIStore } from '../../store';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase.ts';

export const ForgotPassword: React.FC = () => {
  const { setView } = useUIStore();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setErrorMsg(null);
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Password reset dispatch failed:", err);
      let cleanMsg = "Password reset failed. Please try again.";
      if (err.code === 'auth/user-not-found') {
        cleanMsg = "No account found with this email.";
      } else if (err.code === 'auth/invalid-email') {
        cleanMsg = "Invalid email format.";
      }
      setErrorMsg(cleanMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-brand-bg relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-white/10 shadow-2xl relative">
        <button
          onClick={() => setView('login')}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-xs font-mono mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </button>

        <div className="mb-6 text-center">
          <Key className="w-8 h-8 text-brand-warning mx-auto mb-3 animate-pulse" />
          <h2 className="font-display font-bold text-2xl">Recover Security Key</h2>
          <p className="text-zinc-400 text-xs mt-1">Submit registered corporate email address to receive secure OTP credentials.</p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-2">
            <p className="text-sm font-bold text-emerald-400">Recovery Logs Dispatched</p>
            <p className="text-xs text-zinc-400">An encrypted challenge link has been dispatched to your corporate email system logs.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              placeholder="name@company.com"
            />

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending challenge link..." : "Dispatch Secure Link"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
