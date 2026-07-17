import React from 'react';
import { EyeOff, CornerDownLeft } from 'lucide-react';
import { useUIStore } from '../../store';
import { Button } from '../../components/ui/Button';

export const NotFound: React.FC = () => {
  const { setView } = useUIStore();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-brand-bg relative text-center">
      <div className="absolute inset-0 bg-radial-gradient from-brand-accent/5 via-transparent to-transparent pointer-events-none" />

      <EyeOff className="w-16 h-16 text-red-500/80 mb-6 animate-pulse" />
      <h1 className="font-display font-extrabold text-5xl mb-2 tracking-tight">404 OUT OF RANGE</h1>
      <p className="text-zinc-500 text-sm max-w-sm mb-8 font-mono uppercase tracking-wider">
        The requested system endpoint coordinate is unmapped or restricted.
      </p>

      <Button
        onClick={() => setView('dashboard')}
        variant="secondary"
      >
        <CornerDownLeft className="w-4 h-4 mr-2" /> Return to Command Cockpit
      </Button>
    </div>
  );
};
