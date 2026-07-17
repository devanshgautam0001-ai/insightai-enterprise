import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, User, Lock, Building, AlertCircle, Eye, EyeOff, Check, X } from 'lucide-react';
import { useUIStore } from '../../store';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db as firestoreDb } from '../../lib/firebase.ts';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { api } from '../../lib/api.ts';
import { runFirebaseDiagnostics, FirebaseDiagnosticReport } from '../../lib/firebase-diagnostics';

export const Register: React.FC = () => {
  const { setView, setUserEmail } = useUIStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tenantId, setTenantId] = useState('insight-tenant-id-49');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [diagnosticReport, setDiagnosticReport] = useState<FirebaseDiagnosticReport | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Strength state
  const [strengthScore, setStrengthScore] = useState(0);

  // Calculate password strength score (0 to 5)
  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setStrengthScore(score);
  }, [password]);

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const togglePasswordVisibility = () => {
    const input = document.getElementById('password-input') as HTMLInputElement;
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      setShowPassword(!showPassword);
      setTimeout(() => {
        input.setSelectionRange(start, end);
        input.focus();
      }, 0);
    } else {
      setShowPassword(!showPassword);
    }
  };

  const toggleConfirmPasswordVisibility = () => {
    const input = document.getElementById('confirm-password-input') as HTMLInputElement;
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      setShowConfirmPassword(!showConfirmPassword);
      setTimeout(() => {
        input.setSelectionRange(start, end);
        input.focus();
      }, 0);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const getStrengthLabel = (score: number) => {
    if (password.length === 0) return { label: 'Empty', color: 'text-zinc-500', barColor: 'bg-zinc-800' };
    if (score <= 1) return { label: 'Weak', color: 'text-red-400 font-bold', barColor: 'bg-red-500' };
    if (score <= 3) return { label: 'Medium', color: 'text-yellow-400 font-bold', barColor: 'bg-yellow-500' };
    if (score === 4) return { label: 'Strong', color: 'text-blue-400 font-bold', barColor: 'bg-blue-500' };
    return { label: 'Very Strong', color: 'text-emerald-400 font-bold', barColor: 'bg-emerald-500' };
  };

  const strength = getStrengthLabel(strengthScore);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName || !confirmPassword) return;

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify your entries.");
      return;
    }

    if (strengthScore < 3) {
      setErrorMsg("Your password does not meet the minimum complexity requirements.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      // Clear any leftover bypass email from localStorage
      localStorage.removeItem('insightai_mock_email');

      console.log("[Firebase SDK Registration Debug] Attempting registration for:", email);
      console.log("[Firebase SDK Registration Debug] Auth Config used:", {
        appId: auth.app.options.appId,
        projectId: auth.app.options.projectId,
        authDomain: auth.app.options.authDomain,
        apiKey: auth.app.options.apiKey ? "PRESENT" : "MISSING"
      });

      // 1. Create user in Firebase Authentication
      let result;
      try {
        result = await createUserWithEmailAndPassword(auth, email, password);
        console.log("[Firebase SDK Registration Debug] createUserWithEmailAndPassword succeeded! UserCredential:", result);
      } catch (fbErr: any) {
        console.error("[Firebase SDK Registration Debug] createUserWithEmailAndPassword THREW AN ERROR:", {
          code: fbErr.code,
          message: fbErr.message,
          stack: fbErr.stack,
          customData: fbErr.customData
        });
        throw fbErr;
      }
      const user = result.user;

      setUserEmail(email);

      // 2. Synchronize PostgreSQL and Retrieve secure Custom JWT token
      const data = await api.post('/api/auth/sync', {});
      if (data && data.token) {
        localStorage.setItem('insightai_jwt', data.token);
      }

      const assignedRole = data?.user?.role || 'ANALYST';

      // 3. Write User Profile into Firestore "users" collection
      try {
        await setDoc(doc(firestoreDb, 'users', user.uid), {
          displayName: fullName,
          email: email,
          photoURL: '',
          lastLogin: new Date().toISOString(),
          role: assignedRole,
          tenantId: tenantId,
          createdAt: new Date().toISOString()
        }, { merge: true });

        // 4. Create Activity Log in "activityLogs" collection
        await addDoc(collection(firestoreDb, 'activityLogs'), {
          userId: user.uid,
          email: email,
          action: 'REGISTER',
          timestamp: new Date().toISOString()
        });
      } catch (firestoreErr) {
        console.warn("Firestore sync skipped or unconfigured:", firestoreErr);
      }

      // 5. Update local store
      useUIStore.setState({ 
        isLoggedIn: true, 
        userEmail: email, 
        userRole: assignedRole 
      });

      // 6. Navigate to Workspace view
      setView('workspace');
    } catch (err: any) {
      console.error("Registration failed:", err);
      const diag = runFirebaseDiagnostics(err);
      setDiagnosticReport(diag);

      console.error("================= FIREBASE REGISTRATION TRACE =================");
      console.error("EMAIL USED:", email);
      console.error("PROJECT ID:", auth.app.options.projectId);
      console.error("AUTH DOMAIN:", auth.app.options.authDomain);
      console.error("APP ID:", auth.app.options.appId);
      console.error("CURRENT PROVIDER: Email/Password");
      console.error("STATUS: FAILURE");
      console.error("FIREBASE ERROR CODE:", err.code);
      console.error("FIREBASE ERROR MESSAGE:", err.message);
      console.error("FULL ERROR OBJECT:", err);
      console.error("STACK:", err.stack);
      console.error("IDENTITY TOOLKIT ENDPOINT:", diag.identityToolkitUrl);
      console.error("================================================================");

      let cleanMsg = "Corporate seat provisioning failed. Please check entries.";
      if (err.code === 'auth/email-already-in-use') {
        cleanMsg = "This corporate email address is already registered. Please sign in instead.";
      } else if (err.code === 'auth/weak-password') {
        cleanMsg = "The chosen password does not meet the enterprise complexity threshold.";
      } else if (err.code === 'auth/invalid-email') {
        cleanMsg = "Invalid corporate email address format.";
      } else if (err.code === 'auth/network-request-failed') {
        cleanMsg = "A secure connection to the authentication gateway could not be established.";
      } else if (err.code === 'auth/operation-not-allowed') {
        cleanMsg = "Email/password authentication is disabled in the Firebase console.";
      } else {
        cleanMsg = err.message || cleanMsg;
      }
      setErrorMsg(cleanMsg);
      
      // Clean up failed session on error to avoid partial client states
      try {
        await signOut(auth);
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-brand-bg relative">
      {/* Backdrop decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-lg glass-card p-8 rounded-2xl border border-white/10 shadow-2xl relative">
        <button
          onClick={() => setView('login')}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-xs font-mono mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </button>

        <div className="mb-6 text-center">
          <Sparkles className="w-8 h-8 text-brand-intel mx-auto mb-3 animate-pulse" />
          <h2 className="font-display font-bold text-2xl">Provision Corporate Seat</h2>
          <p className="text-zinc-400 text-xs mt-1">Register individual credential logs securely under company SSO guidelines.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Corporate Tenant ID"
            type="text"
            required
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            icon={<Building className="w-4 h-4" />}
            placeholder="insight-tenant-id-49"
          />

          <Input
            label="Officer Full Name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={<User className="w-4 h-4" />}
            placeholder="John Doe"
          />

          <Input
            label="Corporate Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john.doe@insightai.corp"
          />

          {/* Secure Password input */}
          <div className="space-y-1.5 relative">
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest">
              Desired Secure Secret
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={checkCapsLock}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-white transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Caps Lock Indicator */}
          {capsLockActive && (
            <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-mono uppercase tracking-wider rounded-lg flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Caps Lock is Active</span>
            </div>
          )}

          {/* Password Checklist and Strength Meter */}
          {password.length > 0 && (
            <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500 uppercase tracking-widest">Secret Strength:</span>
                <span className={strength.color}>{strength.label}</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.barColor} transition-all duration-300`}
                  style={{ width: `${(strengthScore / 5) * 100}%` }}
                />
              </div>

              {/* Password complexity checklist */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1.5 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  {password.length >= 8 ? (
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-3 h-3 text-zinc-600 shrink-0" />
                  )}
                  <span className={password.length >= 8 ? "text-emerald-400" : "text-zinc-500"}>8+ Characters</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  {/[A-Z]/.test(password) ? (
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-3 h-3 text-zinc-600 shrink-0" />
                  )}
                  <span className={/[A-Z]/.test(password) ? "text-emerald-400" : "text-zinc-500"}>Uppercase Letter</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  {/[a-z]/.test(password) ? (
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-3 h-3 text-zinc-600 shrink-0" />
                  )}
                  <span className={/[a-z]/.test(password) ? "text-emerald-400" : "text-zinc-500"}>Lowercase Letter</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  {/[0-9]/.test(password) ? (
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-3 h-3 text-zinc-600 shrink-0" />
                  )}
                  <span className={/[0-9]/.test(password) ? "text-emerald-400" : "text-zinc-500"}>Number (0-9)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono col-span-2">
                  {/[^A-Za-z0-9]/.test(password) ? (
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-3 h-3 text-zinc-600 shrink-0" />
                  )}
                  <span className={/[^A-Za-z0-9]/.test(password) ? "text-emerald-400" : "text-zinc-500"}>Special Character</span>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Secure Password */}
          <div className="space-y-1.5 relative">
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest">
              Confirm Secure Secret
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="confirm-password-input"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-white transition-colors"
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            </div>
          )}

          {diagnosticReport && (
            <div className="p-4 bg-zinc-900 border border-brand-accent/20 rounded-xl space-y-3 font-mono text-[11px] text-zinc-300">
              <div className="text-brand-accent font-semibold flex items-center gap-1.5 uppercase tracking-wider text-xs">
                <AlertCircle className="w-4 h-4 text-brand-accent shrink-0" />
                Firebase Diagnostics Report
              </div>
              <div className="space-y-1 divide-y divide-white/5 pt-1">
                <div className="py-1 flex justify-between"><span className="text-zinc-500">Project ID:</span> <span>{diagnosticReport.projectId}</span></div>
                <div className="py-1 flex justify-between"><span className="text-zinc-500">Auth Domain:</span> <span>{diagnosticReport.authDomain}</span></div>
                <div className="py-1 flex justify-between"><span className="text-zinc-500">Current Host:</span> <span>{diagnosticReport.currentDomain}</span></div>
                <div className="py-1 flex justify-between"><span className="text-zinc-500">API Key Masked:</span> <span>{diagnosticReport.apiKeyMasked}</span></div>
                <div className="py-1 flex justify-between"><span className="text-zinc-500">API Key Valid:</span> <span className={diagnosticReport.isValidApiKey ? "text-emerald-400" : "text-red-400"}>{diagnosticReport.isValidApiKey ? "YES" : "NO"}</span></div>
                <div className="py-1 flex justify-between"><span className="text-zinc-500">Domain Match:</span> <span className={diagnosticReport.isDomainMatch ? "text-emerald-400" : "text-red-400"}>{diagnosticReport.isDomainMatch ? "YES" : "NO"}</span></div>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-lg text-zinc-400 leading-relaxed text-left whitespace-pre-line">
                {diagnosticReport.errorActionStep}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2.5 mt-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Registering profile log..." : "Submit Provision Request"}
            </Button>
          </div>
        </form>

        <p className="text-[10px] text-zinc-500 text-center font-mono mt-6">
          Provisioning requests must undergo validation check audits by IT tenant administrators.
        </p>
      </div>
    </div>
  );
};
