import React from 'react';
import { QualityMetric } from '../../types/dataset';
import { Card } from '../ui/Card';
import { CheckCircle, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

interface QualityCardProps {
  metric: QualityMetric;
}

export const QualityCard: React.FC<QualityCardProps> = ({ metric }) => {
  const statusIcons = {
    passed: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    failed: <XCircle className="w-5 h-5 text-red-400" />
  };

  const severityColors = {
    low: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    high: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  return (
    <Card className="p-5 flex items-start gap-4 bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all">
      <div className="shrink-0 mt-0.5">
        {statusIcons[metric.status]}
      </div>
      
      <div className="flex-grow space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-display font-bold text-sm text-zinc-100">
            {metric.ruleName}
          </h4>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
              severityColors[metric.severity]
            }`}>
              {metric.severity} severity
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          {metric.description}
        </p>

        {metric.affectedRows > 0 && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400 bg-amber-500/5 py-1 px-2.5 rounded-lg border border-amber-500/10 w-fit">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Affected: {metric.affectedRows.toLocaleString()} rows ({metric.affectedPercentage}%)</span>
          </div>
        )}
      </div>
    </Card>
  );
};
