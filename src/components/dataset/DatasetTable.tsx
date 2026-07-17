import React from 'react';
import { ColumnDefinition } from '../../types/dataset';
import { Eye } from 'lucide-react';

interface DatasetTableProps {
  columns: ColumnDefinition[];
  onSelectColumn?: (col: ColumnDefinition) => void;
  selectedColumn?: ColumnDefinition | null;
}

export const DatasetTable: React.FC<DatasetTableProps> = ({
  columns,
  onSelectColumn,
  selectedColumn
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/10">
      <table className="w-full text-left border-collapse min-w-max">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.01]">
            <th className="p-4 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Parameter</th>
            <th className="p-4 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Type Schema</th>
            <th className="p-4 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider text-right">Missing count</th>
            <th className="p-4 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider text-right">Null percentage</th>
            <th className="p-4 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider text-right">Unique count</th>
            <th className="p-4 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider text-right">Quality</th>
            <th className="p-4 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider text-center">Diagnostics</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {columns.map((col) => {
            const isSelected = selectedColumn?.name === col.name;
            return (
              <tr
                key={col.name}
                onClick={() => onSelectColumn?.(col)}
                className={`cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-500/[0.03] hover:bg-blue-500/[0.05]' : 'hover:bg-white/[0.01]'
                }`}
              >
                <td className="p-4 font-mono text-xs text-white font-bold">
                  <div className="flex items-center gap-2">
                    {col.name}
                    {col.isPrimaryKey && (
                      <span className="text-[9px] font-extrabold uppercase bg-yellow-500/10 text-yellow-500 px-1.5 py-0.2 rounded border border-yellow-500/20">
                        PK
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-xs">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/5 text-zinc-400 border border-white/5">
                    {col.type}
                  </span>
                </td>
                <td className="p-4 text-xs font-mono text-zinc-400 text-right">
                  {col.stats.nullCount.toLocaleString()}
                </td>
                <td className="p-4 text-xs font-mono text-zinc-400 text-right">
                  <span className={col.stats.nullCount > 0 ? 'text-amber-400' : 'text-zinc-500'}>
                    {col.stats.nullPercentage}%
                  </span>
                </td>
                <td className="p-4 text-xs font-mono text-zinc-400 text-right">
                  {col.stats.uniqueCount.toLocaleString()}
                </td>
                <td className="p-4 text-xs font-mono text-right">
                  <span className={`font-bold ${
                    col.qualityScore >= 90 ? 'text-emerald-400' : col.qualityScore >= 70 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {col.qualityScore}%
                  </span>
                </td>
                <td className="p-4 text-xs text-center">
                  <button className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-zinc-400 hover:text-white transition-all hover:bg-white/[0.08]">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
