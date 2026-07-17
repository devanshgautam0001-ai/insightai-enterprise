import React from 'react';
import { Card } from '../ui/Card';
import { TransformationStep } from '../../types/pipeline';
import { History, Activity } from 'lucide-react';

interface TransformationHistoryProps {
  history: TransformationStep[];
}

export const TransformationHistory: React.FC<TransformationHistoryProps> = ({ history }) => {
  return (
    <Card className="p-6 space-y-6 bg-white/[0.01] border border-white/5">
      <div>
        <h4 className="font-display font-bold text-sm text-zinc-200 flex items-center gap-2">
          <History className="w-4 h-4 text-purple-400" />
          <span>Transformation Timeline</span>
        </h4>
        <p className="text-[11px] text-zinc-500 mt-0.5">Chronological record of injected transformation actions.</p>
      </div>

      <div className="space-y-4">
        {history.length > 0 ? (
          <div className="relative pl-6 border-l border-white/5 space-y-4">
            {history.map((step) => (
              <div key={step.id} className="relative">
                {/* Timeline node dot indicator */}
                <span className="absolute -left-[28px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 border-2 border-zinc-950" />

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-bold text-white font-mono">{step.type.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white/[0.01] border border-dashed border-white/5 rounded-xl text-zinc-500 text-xs font-mono">
            NO RULES INJECTED YET
          </div>
        )}
      </div>
    </Card>
  );
};
export default TransformationHistory;
