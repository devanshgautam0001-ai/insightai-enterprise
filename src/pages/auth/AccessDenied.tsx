import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useUIStore } from '../../store';
import { Button } from '../../components/ui/Button';

export const AccessDenied: React.FC = () => {
  const { setView } = useUIStore();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in max-w-lg mx-auto" id="access-denied-view">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8 text-red-400" />
      </div>
      <h2 className="font-display font-extrabold text-3xl mb-3 text-zinc-100">Enterprise Access Restricted</h2>
      <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
        This configuration gateway is restricted to authorized corporate administrators. Only members with an assigned <span className="font-mono text-xs bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">ADMIN</span> role may manage division workspaces, modify settings, configure analytics parameters, or run system audit logs.
      </p>
      <Button onClick={() => setView('dashboard')} className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Return to Executive Cockpit
      </Button>
    </div>
  );
};
