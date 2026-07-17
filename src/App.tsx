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

export default function App() {
  const { setLoggedIn, setView } = useUIStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have an active developer bypass session first
    const mockEmail = localStorage.getItem('insightai_mock_email');
    const token = localStorage.getItem('insightai_jwt');
    if (mockEmail && token) {
      const payload = decodeTokenPayload(token);
      const role = mockEmail === 'devanshgautam0001@gmail.com' ? 'OWNER' : (payload?.role || 'NONE');
      const status = mockEmail === 'devanshgautam0001@gmail.com' ? 'APPROVED' : (payload?.status || 'PENDING');
      const approved = mockEmail === 'devanshgautam0001@gmail.com' ? true : (payload?.approved || false);
      const isActive = mockEmail === 'devanshgautam0001@gmail.com' ? true : (payload?.isActive || false);

      useUIStore.setState({
        isLoggedIn: true,
        userEmail: mockEmail,
        userRole: role,
        userStatus: status,
        userApproved: approved,
        userActive: isActive,
      });
      setLoading(false);
      return;
    }

    // Fall back to standard Firebase Authentication listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        try {
          // Sync backend and retrieve custom JWT token
          const data = await api.post('/api/auth/sync', {});
          if (data && data.token) {
            localStorage.setItem('insightai_jwt', data.token);
          }
          const payload = decodeTokenPayload(data?.token || null);
          let assignedRole = payload?.role || 'NONE';
          let status = payload?.status || 'PENDING';
          let approved = payload?.approved || false;
          let isActive = payload?.isActive || false;

          if (user.email === 'devanshgautam0001@gmail.com') {
            assignedRole = 'OWNER';
            status = 'APPROVED';
            approved = true;
            isActive = true;
          }

          useUIStore.setState({
            isLoggedIn: true,
            userEmail: user.email,
            userRole: assignedRole,
            userStatus: status,
            userApproved: approved,
            userActive: isActive,
          });

          // Prevent redirect if already deep inside another dashboard screen
          const curView = useUIStore.getState().currentView;
          if (['landing', 'login', 'register', 'forgot-password'].includes(curView)) {
            if (status !== 'APPROVED' || !approved || !isActive) {
              setView('pending-approval');
            } else {
              setView(assignedRole === 'USER' ? 'dashboard' : 'workspace');
            }
          }
        } catch (e) {
          console.error("Session recovery backend sync failed:", e);
        }
      } else {
        // Clear tokens
        localStorage.removeItem('insightai_jwt');
        setLoggedIn(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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

