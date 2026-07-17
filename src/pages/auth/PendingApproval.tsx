import React, { useState } from 'react';
import { Loader2, ShieldCheck, Mail, LogOut, RefreshCw } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { api } from '../../lib/api';
import { useUIStore } from '../../store';

export const PendingApprovalScreen: React.FC = () => {
  const { setLoggedIn, setView } = useUIStore();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    setSyncing(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No active corporate authentication session found.");
      }

      // Helper function to race promises against a timeout
      const withTimeout = <T,>(promise: Promise<T>, ms: number, operationName = "Operation"): Promise<T> => {
        let timeoutId: any;
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error(`${operationName} timed out after ${ms}ms`));
          }, ms);
        });
        return Promise.race([promise, timeoutPromise]).finally(() => {
          clearTimeout(timeoutId);
        });
      };

      const idToken = await withTimeout(user.getIdToken(true), 10000, "Firebase ID Token acquisition");
      const data = await withTimeout(
        api.post('/api/auth/sync', {
          idToken,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Enterprise Officer',
        }),
        10000,
        "Backend Sync API request"
      );

      if (data && data.token) {
        localStorage.setItem('insightai_jwt', data.token);
      }
      
      const payload = data?.token ? JSON.parse(atob(data.token.split('.')[1])) : null;
      const status = payload?.status || 'PENDING';
      const approved = payload?.approved || false;
      const isActive = payload?.isActive || false;
      const assignedRole = payload?.role || 'NONE';

      useUIStore.setState({
        userStatus: status,
        userApproved: approved,
        userActive: isActive,
        userRole: assignedRole
      });

      if (status === 'APPROVED' && approved && isActive) {
        setView(assignedRole === 'USER' ? 'dashboard' : 'workspace');
      } else if (status === 'REJECTED') {
        setError('Your registration request has been declined by the system administrators.');
      } else if (status === 'SUSPENDED') {
        setError('Your corporate account has been suspended by security officers.');
      } else {
        // Still pending
        setError('Your account is still awaiting administrator approval.');
      }
    } catch (err: any) {
      console.error('Failed to sync approval status:', err);
      setError(err.message || 'Could not establish connection with security authorization servers.');
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('insightai_jwt');
      localStorage.removeItem('insightai_mock_email');
      setLoggedIn(false);
      setView('login');
    } catch (e) {
      console.error('Failed to logout:', e);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-zinc-100 flex items-center justify-center p-4 selection:bg-brand-accent/30 selection:text-white">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo / Brand Shield */}
        <div className="mx-auto flex justify-center animate-pulse">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500">
            <ShieldCheck className="w-12 h-12" />
          </div>
        </div>

        {/* Status Text Section */}
        <div className="space-y-3">
          <h2 className="font-display font-extrabold text-2xl tracking-tight text-zinc-100">
            Awaiting Verification
          </h2>
          <div className="space-y-1 py-2">
            <p className="text-zinc-300 text-sm font-semibold">
              Your account is awaiting administrator approval.
            </p>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mx-auto">
              Our security policy requires administrator audit verification for all newly registered corporate profiles before system access is granted.
            </p>
          </div>
        </div>

        {/* Dynamic Status Error Banner */}
        {error && (
          <div className="p-3 bg-zinc-950/40 border border-white/5 rounded-lg text-xs font-mono text-zinc-400">
            {error}
          </div>
        )}

        {/* Custom elegant SVG Status Loader */}
        <div className="py-4 flex justify-center">
          <div className="relative w-16 h-16">
            {/* Outer spinning dash circle */}
            <svg className="w-full h-full animate-spin text-amber-500" viewBox="0 0 50 50">
              <circle
                className="opacity-25"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCw className={`w-5 h-5 text-amber-500/80 ${syncing ? 'animate-spin' : ''}`} />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-4">
          <button
            onClick={handleRefresh}
            disabled={syncing}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:bg-white/5 transition-all text-sm font-medium font-mono text-zinc-300 disabled:opacity-50"
          >
            {syncing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                Syncing Authorization...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Refresh Access Status
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-transparent hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-all text-xs font-mono"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out of Corporate Credentials
          </button>
        </div>

        {/* Compliance Footer info */}
        <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-1.5 text-zinc-500 text-[11px] font-mono">
          <div className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span>Support:</span>
            <a href="mailto:support@insightai.corp" className="text-zinc-400 hover:underline">
              support@insightai.corp
            </a>
          </div>
          <p>Security Compliance Gateway v2.4.1</p>
        </div>
      </div>
    </div>
  );
};
