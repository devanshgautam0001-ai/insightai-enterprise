import React from 'react';
import { BusinessInsight } from '../../types/copilot';
import { Card } from '../ui/Card';
import { Lightbulb, ArrowUpRight } from 'lucide-react';

interface InsightCardProps {
  insight: BusinessInsight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getCategoryTheme = () => {
    switch (insight.category) {
      case 'revenue':
        return { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'Revenue' };
      case 'risk':
        return { color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', label: 'Risk & Churn' };
      case 'marketing':
        return { color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', label: 'Marketing' };
      default:
        return { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', label: 'Operational' };
    }
  };

  const theme = getCategoryTheme();

  return (
    <Card className="border border-white/5 bg-zinc-950/20 p-5 hover:border-white/10 transition-all flex flex-col justify-between relative overflow-hidden group">
      {/* Dynamic background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />

      <div className="space-y-3.5 relative z-10">
        {/* Header meta */}
        <div className="flex justify-between items-center">
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider border ${theme.color}`}>
            {theme.label}
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-zinc-500 uppercase text-[9px]">Impact</span>
            <span className={`font-bold px-1.5 py-0.5 rounded ${
              insight.impactScore >= 8 ? 'text-red-400 bg-red-500/5' : 'text-purple-400 bg-purple-500/5'
            }`}>
              {insight.impactScore}/10
            </span>
          </div>
        </div>

        {/* Title & description */}
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            {insight.title}
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-purple-400 transition-colors shrink-0" />
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {insight.description}
          </p>
        </div>
      </div>

      {/* Actionable item */}
      <div className="mt-4 pt-3.5 border-t border-white/5 flex gap-2.5 items-start text-xs font-sans relative z-10">
        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-zinc-300 block">Strategic Recommendation</span>
          <p className="text-[11px] text-zinc-400 leading-normal mt-0.5">{insight.actionItem}</p>
        </div>
      </div>
    </Card>
  );
};
export default InsightCard;
