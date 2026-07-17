import React from 'react';
import { Card } from '../ui/Card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  color?: 'purple' | 'blue' | 'emerald' | 'red' | 'zinc';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  color = 'purple',
}) => {
  const colors = {
    purple: {
      bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      text: 'text-purple-400',
    },
    blue: {
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      text: 'text-blue-400',
    },
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      text: 'text-emerald-400',
    },
    red: {
      bg: 'bg-red-500/10 text-red-400 border-red-500/20',
      text: 'text-red-400',
    },
    zinc: {
      bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
      text: 'text-zinc-400',
    },
  };

  return (
    <Card className="border border-white/5 bg-zinc-950/25 flex items-center justify-between p-5 hover:border-white/10 transition-colors">
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">{title}</span>
        <span className="text-2xl font-bold font-mono text-white tracking-tight">{value}</span>
        <span className="text-xs text-zinc-400 font-mono block">{subtext}</span>
      </div>
      <div className={`p-3 rounded-xl border ${colors[color].bg}`}>
        <Icon className="w-5 h-5" />
      </div>
    </Card>
  );
};
export default MetricCard;
