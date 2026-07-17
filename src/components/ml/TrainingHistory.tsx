import React from 'react';
import { MLModel } from '../../types/model';
import { Card } from '../ui/Card';
import { ALGORITHM_LABELS } from '../../services/ml.service';
import { BestModelBadge } from './BestModelBadge';
import { ListFilter, Award } from 'lucide-react';

interface TrainingHistoryProps {
  models: MLModel[];
  selectedModelId: string | null;
  onSelectModel: (model: MLModel) => void;
}

export const TrainingHistory: React.FC<TrainingHistoryProps> = ({
  models,
  selectedModelId,
  onSelectModel,
}) => {
  return (
    <Card className="border border-white/5 bg-zinc-950/25">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2.5">
          <ListFilter className="w-5 h-5 text-purple-400" />
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight">Optimized Models Leaderboard</h4>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Interactive candidates sorted by cross-validation performance</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/5 bg-zinc-950/20">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01] text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
              <th className="py-3.5 px-4 font-semibold">Rank</th>
              <th className="py-3.5 px-4 font-semibold">Model Name & Algorithm</th>
              <th className="py-3.5 px-4 font-semibold">Task Type</th>
              <th className="py-3.5 px-4 font-semibold text-right">Target Feature</th>
              <th className="py-3.5 px-4 font-semibold text-right">CV Score (R²/Acc)</th>
              <th className="py-3.5 px-4 font-semibold text-right">Inference Speed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-zinc-300">
            {models.map((model, idx) => {
              const isSelected = selectedModelId === model.id;
              const displayScore = model.taskType === 'classification'
                ? `${((model.metrics.accuracy || 0) * 100).toFixed(1)}%`
                : `${(model.metrics.r2 || 0).toFixed(3)}`;

              return (
                <tr
                  key={model.id}
                  onClick={() => onSelectModel(model)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-purple-500/[0.04] hover:bg-purple-500/[0.06]'
                      : 'hover:bg-white/[0.01]'
                  }`}
                >
                  <td className="py-4 px-4 font-mono text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      {idx === 0 ? (
                        <Award className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span>#{idx + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                          {model.name}
                        </span>
                        {model.isBest && <BestModelBadge />}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        Algorithm: {ALGORITHM_LABELS[model.algorithm]}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 font-mono text-[10px] uppercase text-zinc-400">
                      {model.taskType}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-zinc-200">
                    {model.targetColumn}
                  </td>
                  <td className="py-4 px-4 text-right font-mono">
                    <span className={`font-semibold ${idx === 0 ? 'text-emerald-400' : 'text-zinc-300'}`}>
                      {displayScore}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-zinc-500">
                    {(model.trainingTimeMs / 1000).toFixed(1)}s
                  </td>
                </tr>
              );
            })}
            {models.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-zinc-500 font-mono italic">
                  No trained models in repository. Run your first AutoML Optimization!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
export default TrainingHistory;
