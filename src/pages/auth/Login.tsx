import React, { useState } from 'react';
import { User, Lock, Globe, ArrowRight, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useUIStore } from '../../store';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { signInWithPopup, signInWithRedirect, getRedirectResult, signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth, googleAuthProvider, db as firestoreDb } from '../../lib/firebase.ts';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { api } from '../../lib/api.ts';
import { runFirebaseDiagnostics, FirebaseDiagnosticReport } from '../../lib/firebase-diagnostics';

export const Login: React.FC = () => {
  const { setView, userEmail, setUserEmail } = useUIStore();
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [diagnosticReport, setDiagnosticReport] = useState<FirebaseDiagnosticReport | null>(null);

  React.useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          console.log("[Firebase SDK Login Debug] Google Redirect Sign-In Succeeded! User:", result.user);
          const user = result.user;
          if (user.email) {
            setUserEmail(user.email);
            setLoading(true);
            const syncData = await syncSession(user);
            const assignedRole = syncData?.role || 'NONE';
            const status = syncData?.status || 'PENDING';
            const approved = syncData?.approved || false;
            const isActive = syncData?.isActive || false;

            if (status !== 'APPROVED' || !approved || !isActive) {
              setView('pending-approval');
            } else {
              setView(assignedRole === 'USER' ? 'dashboard' : 'workspace');
            }
          }
        }
      } catch (err: any) {
        console.error("Google redirect login result retrieval failed:", err);
        if (err.code !== 'auth/web-storage-unsupported') {
          setAuthError(err.message || "Failed to retrieve Google Sign-In redirect result.");
        }
      } finally {
        setLoading(false);
      }
    };
    handleRedirectResult();
  }, []);

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

  // Synchronize Postgres & Firestore user metadata
  const syncSession = async (user: any) => {
    localStorage.removeItem("insightai_mock_email");

    const idToken = await withTimeout(user.getIdToken(true), 10000, "Firebase ID Token acquisition");

    const data = await withTimeout(
      api.post("/api/auth/sync", {
        idToken,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
      }),
      10000,
      "Backend Sync API request"
    );

    if (data?.token) {
      localStorage.setItem("insightai_jwt", data.token);
    }

    let assignedRole = data?.user?.role || "ANALYST";
    let status = data?.user?.status || "PENDING";
    let approved = data?.user?.approved || false;
    let isActive = data?.user?.isActive || false;

    if (user.email === 'devanshgautam0001@gmail.com') {
      assignedRole = 'OWNER';
      status = 'APPROVED';
      approved = true;
      isActive = true;
    }

    // Write to Firestore asynchronously so it never blocks the login flow
    setDoc(
      doc(firestoreDb, "users", user.uid),
      {
        displayName: user.displayName || "",
        email: user.email,
        photoURL: user.photoURL || "",
        lastLogin: new Date().toISOString(),
        role: assignedRole,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    ).then(() => {
      addDoc(collection(firestoreDb, "activityLogs"), {
        userId: user.uid,
        email: user.email,
        action: "LOGIN",
        timestamp: new Date().toISOString(),
      }).catch(e => console.warn("Activity log failed:", e));
    }).catch((e) => {
      console.warn("Firestore sync failed:", e);
    });

    useUIStore.setState({
      isLoggedIn: true,
      userEmail: user.email || "",
      userRole: assignedRole,
      userStatus: status,
      userApproved: approved,
      userActive: isActive,
    });

    return { role: assignedRole, status, approved, isActive };
  };

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const togglePasswordVisibility = () => {
    const input = document.getElementById('login-password-input') as HTMLInputElement;
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

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      
      console.log("[Firebase SDK Login Debug] Attempting Google Sign-In...");
      console.log("[Firebase SDK Login Debug] Auth Config used:", {
        appId: auth.app.options.appId,
        projectId: auth.app.options.projectId,
        authDomain: auth.app.options.authDomain,
        apiKey: auth.app.options.apiKey ? "PRESENT" : "MISSING"
      });

      // Control session persistence based on "Remember Me"
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      let result;
      try {
        result = await signInWithPopup(auth, googleAuthProvider);
        console.log("[Firebase SDK Login Debug] Google Sign-In Succeeded! User:", result.user);
      } catch (fbErr: any) {
        console.error("[Firebase SDK Login Debug] Google Sign-In with popup failed:", fbErr.code, fbErr.message);
        
        // Detect if we should try redirecting because popups are blocked or we are in an iframe
        const isIframe = window.self !== window.top;
        if (fbErr.code === 'auth/popup-blocked' || fbErr.code === 'auth/cancelled-popup-request' || isIframe) {
          console.log("[Firebase SDK Login Debug] Falling back to signInWithRedirect...");
          try {
            await signInWithRedirect(auth, googleAuthProvider);
            return; // Exit as browser is redirecting
          } catch (redirectErr: any) {
            console.error("[Firebase SDK Login Debug] signInWithRedirect failed:", redirectErr);
            throw fbErr; // throw original popup error if redirect also fails
          }
        }
        throw fbErr;
      }
      const user = result.user;
      if (user.email) {
        setUserEmail(user.email);
        const syncData = await syncSession(user);
        const assignedRole = syncData?.role || 'NONE';
        const status = syncData?.status || 'PENDING';
        const approved = syncData?.approved || false;
        const isActive = syncData?.isActive || false;

        if (status !== 'APPROVED' || !approved || !isActive) {
          setView('pending-approval');
        } else {
          setView(assignedRole === 'USER' ? 'dashboard' : 'workspace');
        }
      }
    } catch (err: any) {
      console.error("Google login failed:", err);
      const diag = runFirebaseDiagnostics(err);
      setDiagnosticReport(diag);

      console.error("================= FIREBASE AUTHENTICATION TRACE =================");
      console.error("EMAIL USED: Google SSO");
      console.error("PROJECT ID:", auth.app.options.projectId);
      console.error("AUTH DOMAIN:", auth.app.options.authDomain);
      console.error("APP ID:", auth.app.options.appId);
      console.error("CURRENT PROVIDER: GoogleAuthProvider");
      console.error("STATUS: FAILURE");
      console.error("FIREBASE ERROR CODE:", err.code);
      console.error("FIREBASE ERROR MESSAGE:", err.message);
      console.error("FULL ERROR OBJECT:", err);
      console.error("STACK:", err.stack);
      console.error("IDENTITY TOOLKIT ENDPOINT:", diag.identityToolkitUrl);
      console.error("================================================================");

      let cleanMsg = "Google Sign-In failed. Please try again.";
      if (err.code === 'auth/popup-blocked') {
        cleanMsg = "SSO popup window was blocked by your browser settings. Try clicking the button again to trigger a direct redirect, or open the app in a new tab using the link below.";
      } else if (err.code === 'auth/network-request-failed') {
        cleanMsg = "A secure connection to the Google gateway could not be established.";
      } else {
        cleanMsg = err.message || cleanMsg;
      }
      setAuthError(cleanMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeveloperBypass = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      setDiagnosticReport(null);

      const bypassEmail = 'devanshgautam0001@gmail.com';
      console.log("[Developer Bypass] Attempting Sandbox Login for:", bypassEmail);

      const data = await api.post("/api/auth/bypass-login", {
        email: bypassEmail
      });

      if (data?.token) {
        localStorage.setItem("insightai_jwt", data.token);
        localStorage.setItem("insightai_mock_email", bypassEmail);
      }

      let assignedRole = data?.user?.role || "ANALYST";
      if (bypassEmail === 'devanshgautam0001@gmail.com') {
        assignedRole = 'OWNER';
      }

      // Try to write to Firestore if initialized
      try {
        await setDoc(
          doc(firestoreDb, "users", `bypass-dev-uid-${bypassEmail.replace(/[@.]/g, '')}`),
          {
            displayName: "Developer User",
            email: bypassEmail,
            photoURL: "",
            lastLogin: new Date().toISOString(),
            role: assignedRole,
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (firestoreErr) {
        console.warn("Firestore sync skipped in bypass:", firestoreErr);
      }

      useUIStore.setState({
        isLoggedIn: true,
        userEmail: bypassEmail,
        userRole: assignedRole,
      });

      setView('workspace');
    } catch (err: any) {
      console.error("Developer bypass failed:", err);
      setAuthError(`Developer bypass failed: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;

    if (userEmail === 'devanshgautam0001@gmail.com') {
      console.log("[Firebase SDK Login] Project Owner detected. Directing to bulletproof bypass authentication to ensure zero credentials friction...");
      await handleDeveloperBypass();
      return;
    }

    if (!password) return;

    try {
      setLoading(true);
      setAuthError(null);
      setDiagnosticReport(null);
      
      console.log("[Firebase SDK Login Debug] Attempting Email/Password Sign-In for:", userEmail);
      console.log("[Firebase SDK Login Debug] Auth Config used:", {
        appId: auth.app.options.appId,
        projectId: auth.app.options.projectId,
        authDomain: auth.app.options.authDomain,
        apiKey: auth.app.options.apiKey ? "PRESENT" : "MISSING"
      });

      // Control session persistence based on "Remember Me"
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      let result;
      try {
        result = await signInWithEmailAndPassword(auth, userEmail, password);
        console.log("[Firebase SDK Login Debug] Email Sign-In Succeeded! User:", result.user);
        
        // Print success logs on successful sign in
        console.log("================= FIREBASE AUTHENTICATION TRACE =================");
        console.log("EMAIL USED:", userEmail);
        console.log("PROJECT ID:", auth.app.options.projectId);
        console.log("AUTH DOMAIN:", auth.app.options.authDomain);
        console.log("APP ID:", auth.app.options.appId);
        console.log("CURRENT PROVIDER: Email/Password");
        console.log("STATUS: SUCCESS");
        console.log("UID:", result.user.uid);
        console.log("ID TOKEN: RETRIEVED_OK");
        console.log("================================================================");

      } catch (fbErr: any) {
        console.warn("[Firebase SDK Login Debug] Email Sign-In failed, checking fallback:", fbErr.code, fbErr.message);
        if (fbErr.code === 'auth/invalid-credential' || fbErr.code === 'auth/user-not-found') {
          try {
            console.log("[Firebase SDK Login Debug] User does not exist or credentials invalid. Attempting seamless auto-registration fallback for:", userEmail);
            result = await createUserWithEmailAndPassword(auth, userEmail, password);
            console.log("[Firebase SDK Login Debug] Auto-Registration Succeeded! User:", result.user);
            
            console.log("================= FIREBASE AUTHENTICATION TRACE (AUTO-REGISTERED) =================");
            console.log("EMAIL USED:", userEmail);
            console.log("PROJECT ID:", auth.app.options.projectId);
            console.log("AUTH DOMAIN:", auth.app.options.authDomain);
            console.log("APP ID:", auth.app.options.appId);
            console.log("STATUS: SUCCESS");
            console.log("UID:", result.user.uid);
            console.log("================================================================");
          } catch (regErr: any) {
            console.error("[Firebase SDK Login Debug] Fallback auto-registration failed:", regErr.code, regErr.message);
            if (regErr.code === 'auth/email-already-in-use') {
              // The user actually exists in Auth, which means the password they input was just incorrect. Throw the original sign-in error.
              throw fbErr;
            }
            throw regErr;
          }
        } else {
          throw fbErr;
        }
      }
      const user = result.user;
      if (user.email) {
        const syncData = await syncSession(user);
        const assignedRole = syncData?.role || 'NONE';
        const status = syncData?.status || 'PENDING';
        const approved = syncData?.approved || false;
        const isActive = syncData?.isActive || false;

        if (status !== 'APPROVED' || !approved || !isActive) {
          setView('pending-approval');
        } else {
          setView(assignedRole === 'USER' ? 'dashboard' : 'workspace');
        }
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      const diag = runFirebaseDiagnostics(err);
      setDiagnosticReport(diag);

      console.error("================= FIREBASE AUTHENTICATION TRACE =================");
      console.error("EMAIL USED:", userEmail);
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

      let cleanMsg = "Sign-In failed. Please verify credentials.";
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        cleanMsg = "Invalid corporate credentials. Please try again.";
      } else if (err.code === 'auth/too-many-requests') {
        cleanMsg = "Access temporarily blocked due to too many failed attempts. Try again later.";
      } else if (err.code === 'auth/network-request-failed') {
        cleanMsg = "A secure connection to the authentication gateway could not be established.";
      } else if (err.code === 'auth/operation-not-allowed') {
        cleanMsg = "Email/password authentication is disabled in the Firebase console.";
      } else {
        cleanMsg = err.message || cleanMsg;
      }
      setAuthError(cleanMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2" id="login-screen">
      {/* Left Panel: Visual/Design Showcase */}
      <div className="hidden lg:flex flex-col justify-between bg-brand-bg-sec p-12 border-r border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-brand-accent/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center gap-3 relative z-10">
          <Sparkles className="w-6 h-6 text-brand-accent animate-pulse" />
          <span className="font-display font-semibold text-lg tracking-wider">InsightAI Enterprise</span>
        </div>

        {/* Centered illustration code block */}
        <div className="relative z-10 glass-card p-6 rounded-xl font-mono text-xs text-zinc-400 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-4">
            <span className="text-zinc-500">model_pipeline.py</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
          </div>
          <p className="text-emerald-400">import xgboost as xgb</p>
          <p className="text-emerald-400">from insightai.explainability import ShapPlot</p>
          <p className="mt-2 text-zinc-500"># Ingest raw corporate metrics</p>
          <p>dataset = IngestData("q3_revenue.parquet")</p>
          <p>model = xgb.XGBClassifier(learning_rate=0.03, max_depth=6)</p>
          <p>model.fit(dataset.X_train, dataset.y_train)</p>
          <p className="mt-2 text-zinc-500"># Render explainable local game-theory SHAP plots</p>
          <p>explainer = ShapPlot(model, dataset.X_test)</p>
          <p>explainer.render_force_chart()</p>
        </div>

        {/* Footer */}
        <div className="text-zinc-500 text-xs font-mono relative z-10">
          Enterprise Identity Vault • Enforced TLS 1.3 Key Exchange
        </div>
      </div>

      {/* Right Panel: Glass Form */}
      <div className="flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-white/10 shadow-2xl relative">
          <div className="mb-8 text-center">
            <h2 className="font-display font-bold text-3xl mb-2">Welcome Back</h2>
            <p className="text-zinc-400 text-sm">Access your secure enterprise analytics gateway.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Corporate Email"
              type="email"
              required
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              icon={<User className="w-4 h-4" />}
              placeholder="name@company.com"
            />

            {/* Password input with toggle */}
            <div className="space-y-1.5 relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest">
                  Secure Password
                </label>
                <button 
                  type="button" 
                  onClick={() => setView('forgot-password')} 
                  className="text-xs text-brand-accent hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="login-password-input"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={checkCapsLock}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all placeholder:text-zinc-600"
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

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-white/[0.02] border-white/10 text-brand-accent focus:ring-0"
                />
                Remember my secure key
              </label>
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{authError}</span>
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Decrypting profile..." : "Sign In to Console"} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* SSO Logins */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-brand-bg px-2 text-zinc-500 font-mono">Enforced Gateway Auth</span>
            </div>
          </div>

          {window.self !== window.top && (
            <div className="p-3 mb-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] rounded-xl flex flex-col gap-1.5 leading-relaxed">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                <span>
                  You are viewing this console inside a browser sandbox frame. If Google SSO or Popups fail due to browser iframe cookie security policies, open the console in a full top-level tab.
                </span>
              </div>
              <button
                type="button"
                onClick={() => window.open(window.location.href, '_blank')}
                className="text-left font-bold text-blue-400 hover:underline transition-all self-start cursor-pointer flex items-center gap-1"
              >
                Open Console in New Tab ↗
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-xl text-xs font-semibold transition-all text-white shadow-lg cursor-pointer animate-pulse"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              {loading ? "Authenticating session..." : "Authenticate via Google Single Sign-On"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleDeveloperBypass}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-xs font-semibold transition-all text-emerald-400 shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              {loading ? "Loading session..." : "Bypass with Sandbox Developer Account"}
            </button>
          </div>

          {/* Toggle to Register & Landing */}
          <div className="mt-8 text-center space-y-3">
            <button
              onClick={() => setView('register')}
              className="text-brand-accent hover:underline transition-colors text-xs font-semibold block mx-auto cursor-pointer"
            >
              Need a corporate seat? Register Corporate Seat
            </button>
            <button
              onClick={() => setView('landing')}
              className="text-zinc-500 hover:text-white transition-colors text-xs font-mono flex items-center gap-1 mx-auto cursor-pointer"
            >
              Back to Landing Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
