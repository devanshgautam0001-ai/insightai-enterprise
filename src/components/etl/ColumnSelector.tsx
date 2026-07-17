import React from 'react';
import { Layers } from 'lucide-react';

interface ColumnSelectorProps {
  columns: string[];
  selectedColumn: string;
  onSelect: (col: string) => void;
  label?: string;
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  selectedColumn,
  onSelect,
  label = 'Selected Column Schema',
}) => {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-mono uppercase text-zinc-500 flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5 text-zinc-500" />
        <span>{label}</span>
      </label>
      
      <div className="flex flex-wrap gap-2">
        {columns.map((col) => {
          const isSelected = selectedColumn === col;
          return (
            <button
              key={col}
              onClick={() => onSelect(col)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all ${
                isSelected
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_8px_rgba(59,130,246,0.15)]'
                  : 'bg-white/[0.02] text-zinc-400 border-white/5 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {col}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default ColumnSelector;
