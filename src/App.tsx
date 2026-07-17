import { useEffect, useState } from 'react';
import { AppRouter } from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useUIStore } from './store';
import { api } from './lib/api';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function decodeTokenPayload(token: string | null) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      return JSON.parse(atob(parts[1]));
    }
  } catch (e) {
    console.error("Failed to decode token:", e);
  }
  return null;
}

function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const payload = decodeTokenPayload(token);
    if (!payload || !payload.exp) return true;
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
}

export default function App() {
  const { setLoggedIn, setView } = useUIStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    // Helper to race a promise with a timeout
    const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs)
        ),
      ]);
    };

    const handleStartup = async () => {
      console.log("[Startup] Initializing application startup sequence...");

      // STEP 1: Check Developer Bypass Session (mock sessions)
      try {
        const mockEmail = localStorage.getItem('insightai_mock_email');
        const token = localStorage.getItem('insightai_jwt');

        if (mockEmail && token) {
          if (!isTokenExpired(token)) {
            console.log("[Startup] Valid developer bypass session found.");
            const payload = decodeTokenPayload(token);
            const role = mockEmail === 'devanshgautam0001@gmail.com' ? 'OWNER' : (payload?.role || 'NONE');
            const status = mockEmail === 'devanshgautam0001@gmail.com' ? 'APPROVED' : (payload?.status || 'PENDING');
            const approved = mockEmail === 'devanshgautam0001@gmail.com' ? true : (payload?.approved || false);
            const isActive = mockEmail === 'devanshgautam0001@gmail.com' ? true : (payload?.isActive || false);

            if (isSubscribed) {
              useUIStore.setState({
                isLoggedIn: true,
                userEmail: mockEmail,
                userRole: role,
                userStatus: status,
                userApproved: approved,
                userActive: isActive,
              });
              setLoading(false);
            }
            return; // Exit early as developer bypass session takes precedence and is valid
          } else {
            console.warn("[Startup] Developer bypass token expired. Clearing mock session.");
            localStorage.removeItem('insightai_mock_email');
            localStorage.removeItem('insightai_jwt');
          }
        }
      } catch (err) {
        console.error("[Startup] Failed to evaluate developer bypass session:", err);
      }

      // STEP 2: Firebase Authentication State Discovery (Listener subscription)
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!isSubscribed) return;

        if (user && user.email) {
          console.log("[Startup] Firebase user detected:", user.email);
          let idToken = '';
          let data: any = null;

          // STEP 3: Retrieve Firebase ID Token with Timeout Protection
          try {
            console.log("[Startup] Retrieving Firebase ID Token...");
            idToken = await withTimeout(user.getIdToken(true), 10000, "Firebase ID Token acquisition");
            console.log("[Startup] Firebase ID Token successfully acquired.");
          } catch (tokenErr: any) {
            console.error("[Startup] Failed to acquire Firebase ID Token:", tokenErr);
            handleFallbackToLogin();
            return;
          }

          // STEP 4: Sync with Backend and Obtain JWT (With Timeout & Database Fault Tolerance)
          try {
            console.log("[Startup] Synchronizing with backend service...");
            const syncPayload = {
              idToken,
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email.split('@')[0] || 'Enterprise Officer',
            };

            // Call API with a strict 10 second timeout protection
            data = await withTimeout(
              api.post('/api/auth/sync', syncPayload),
              10000,
              "Backend Sync API request"
            );

            console.log("[Startup] Backend synchronization succeeded.");

            if (data && data.token) {
              localStorage.setItem('insightai_jwt', data.token);
            } else {
              throw new Error("Backend response is missing custom JWT token");
            }
          } catch (syncErr: any) {
            console.error("[Startup] Backend sync failed/timed out:", syncErr);
            // If backend is unavailable or offline, continue gracefully by redirecting to Login
            handleFallbackToLogin();
            return;
          }

          // STEP 5: Parse Role, Status, and Approval Information
          try {
            const payload = decodeTokenPayload(data?.token || null);
            let assignedRole = payload?.role || 'NONE';
            let status = payload?.status || 'PENDING';
            let approved = payload?.approved || false;
            let isActive = payload?.isActive || false;

            // Hardcoded Owner overrides to safeguard owner access
            if (user.email === 'devanshgautam0001@gmail.com') {
              assignedRole = 'OWNER';
              status = 'APPROVED';
              approved = true;
              isActive = true;
            }

            console.log("[Startup] Resolved role/approval parameters:", { assignedRole, status, approved, isActive });

            useUIStore.setState({
              isLoggedIn: true,
              userEmail: user.email,
              userRole: assignedRole,
              userStatus: status,
              userApproved: approved,
              userActive: isActive,
            });

            // STEP 6: Execute Routing / View Update
            const curView = useUIStore.getState().currentView;
            if (['landing', 'login', 'register', 'forgot-password'].includes(curView)) {
              if (status !== 'APPROVED' || !approved || !isActive) {
                setView('pending-approval');
              } else {
                setView(assignedRole === 'USER' ? 'dashboard' : 'workspace');
              }
            }
          } catch (parseErr) {
            console.error("[Startup] Failed to parse session or route user:", parseErr);
            handleFallbackToLogin();
          } finally {
            if (isSubscribed) setLoading(false);
          }

        } else {
          console.log("[Startup] No active Firebase session detected.");
          handleFallbackToLogin();
        }
      });

      return unsubscribe;
    };

    const handleFallbackToLogin = () => {
      if (!isSubscribed) return;
      console.log("[Startup] Executing fallback to Login view.");
      localStorage.removeItem('insightai_jwt');
      setLoggedIn(false);
      
      const curView = useUIStore.getState().currentView;
      if (['landing', 'login', 'register', 'forgot-password', 'pending-approval'].includes(curView)) {
        setView('login');
      }
      setLoading(false);
    };

    let unsub: (() => void) | undefined;
    handleStartup().then((unsubscribeFn) => {
      unsub = unsubscribeFn;
    }).catch((err) => {
      console.error("[Startup] Fatal startup exception:", err);
      if (isSubscribed) {
        setLoading(false);
        setView('login');
      }
    });

    return () => {
      isSubscribed = false;
      if (unsub) unsub();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg text-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Decrypting Session Credentials...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-brand-bg text-white relative">
        {/* Background Animated Blobs for high-end feel */}
        <div className="blob-container">
          <div className="blob bg-blue-600/30 w-96 h-96 top-20 left-10 pointer-events-none" />
          <div className="blob bg-emerald-500/30 w-80 h-80 bottom-20 right-10 pointer-events-none" style={{ animationDelay: '-5s' }} />
          <div className="blob bg-purple-600/20 w-[500px] h-[500px] top-1/2 left-1/3 pointer-events-none" style={{ animationDelay: '-10s' }} />
        </div>

        {/* Embedded Router Controller */}
        <AppRouter />
      </div>
    </QueryClientProvider>
  );
}

