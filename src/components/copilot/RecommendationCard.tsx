import React from 'react';
import { RecommendationItem } from '../../types/copilot';
import { Card } from '../ui/Card';
import { Sparkles, Hammer, LineChart, Cpu } from 'lucide-react';

interface RecommendationCardProps {
  rec: RecommendationItem;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ rec }) => {
  const getIcon = () => {
    switch (rec.type) {
      case 'cleaning':
        return <Hammer className="w-4 h-4 text-amber-400" />;
      case 'ml':
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'visualization':
        return <LineChart className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <Card className="border border-white/5 bg-zinc-950/20 p-5 hover:border-white/10 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
            {getIcon()}
          </div>
          <span className="text-xs font-semibold text-zinc-300 capitalize font-mono text-[10px] bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded-full">
            {rec.type} Advice
          </span>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white tracking-tight">{rec.title}</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">{rec.description}</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono">
        <span className="text-zinc-500 uppercase text-[9px] block">Expected Advantage</span>
        <strong className="text-purple-400">{rec.benefit}</strong>
      </div>
    </Card>
  );
};
export default RecommendationCard;
