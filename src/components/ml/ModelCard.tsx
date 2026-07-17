import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MLModel } from '../../types/model';
import { ALGORITHM_LABELS } from '../../services/ml.service';
import { BestModelBadge } from './BestModelBadge';
import { Binary, Calendar, Cpu, Zap } from 'lucide-react';

interface ModelCardProps {
  model: MLModel;
  isSelected: boolean;
  onSelect: () => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  isSelected,
  onSelect,
}) => {
  const { name, algorithm, taskType, targetColumn, metrics, trainingTimeMs, createdAt, isBest } = model;

  return (
    <Card
      hoverEffect
      className={`border transition-all duration-300 ${
        isSelected
          ? 'border-purple-500/40 bg-purple-600/[0.03] shadow-lg shadow-purple-500/5'
          : 'border-white/5 bg-zinc-950/20'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono uppercase bg-white/5 border border-white/5 text-zinc-400">
              {taskType}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono uppercase bg-blue-500/10 border border-blue-500/20 text-blue-400">
              {ALGORITHM_LABELS[algorithm]}
            </span>
            {isBest && <BestModelBadge />}
          </div>

          <h3 className="text-base font-semibold text-white tracking-tight">{name}</h3>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5 text-zinc-500" />
              Target: <span className="text-zinc-200 font-bold">{targetColumn}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-zinc-500" />
              Features: <span className="text-zinc-200">{model.featuresSelected.length}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-zinc-500" />
              Time: <span className="text-zinc-200">{(trainingTimeMs / 1000).toFixed(1)}s</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              {createdAt}
            </span>
          </div>
        </div>

        {/* Core Metrics Summary */}
        <div className="flex flex-row md:flex-col items-end gap-3 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
          <div className="text-left md:text-right">
            {taskType === 'classification' ? (
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Accuracy (OOB)</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {((metrics.accuracy || 0) * 100).toFixed(1)}%
                </span>
              </div>
            ) : (
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">R² Score</span>
                <span className="text-xl font-bold font-mono text-blue-400">
                  {metrics.r2 !== undefined ? metrics.r2.toFixed(3) : '0.00'}
                </span>
              </div>
            )}
          </div>

          <Button
            size="sm"
            variant={isSelected ? 'success' : 'secondary'}
            onClick={onSelect}
            className="h-9 px-4 font-mono text-xs"
          >
            {isSelected ? 'Active Model' : 'Load Model'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
export default ModelCard;
