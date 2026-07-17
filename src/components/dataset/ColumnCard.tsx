import React from 'react';
import { ColumnDefinition } from '../../types/dataset';
import { Card } from '../ui/Card';

interface ColumnCardProps {
  column: ColumnDefinition;
  onSelect?: (col: ColumnDefinition) => void;
  isSelected?: boolean;
}

export const ColumnCard: React.FC<ColumnCardProps> = ({ column, onSelect, isSelected }) => {
  const typeColors: Record<string, string> = {
    numerical: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    categorical: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    boolean: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    temporal: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    text: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
  };

  return (
    <Card
      onClick={() => onSelect?.(column)}
      className={`p-5 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between h-48 border hover:bg-white/[0.04] ${
        isSelected
          ? 'border-blue-500/50 bg-blue-500/[0.03] shadow-[0_0_12px_rgba(59,130,246,0.15)]'
          : 'border-white/5 bg-white/[0.01]'
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-bold text-white truncate max-w-[70%]">
            {column.name}
          </span>
          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase border ${
            typeColors[column.type] || typeColors.text
          }`}>
            {column.type}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider block">Nullability & Missing</span>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">{column.isNullable ? 'Nullable (Optional)' : 'Strict (Required)'}</span>
            <span className={column.stats.nullCount > 0 ? 'text-amber-400' : 'text-zinc-500'}>
              {column.stats.nullPercentage}% Null
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-white/5">
        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
          <span>Quality Score</span>
          <span className={column.qualityScore >= 90 ? 'text-emerald-400' : column.qualityScore >= 70 ? 'text-amber-400' : 'text-red-400'}>
            {column.qualityScore}%
          </span>
        </div>
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              column.qualityScore >= 90 ? 'bg-emerald-500' : column.qualityScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${column.qualityScore}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
