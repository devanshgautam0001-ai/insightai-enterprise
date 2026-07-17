import React from 'react';
import { Card } from '../ui/Card';
import { ConfusionMatrixData } from '../../types/model';
import { HelpCircle } from 'lucide-react';

interface ConfusionMatrixProps {
  data: ConfusionMatrixData;
}

export const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({ data }) => {
  const { labels, matrix } = data;

  // Calculate row and column totals
  const rowTotals = matrix.map((row) => row.reduce((a, b) => a + b, 0));
  const grandTotal = rowTotals.reduce((a, b) => a + b, 0) || 1;

  // Find max cell value for color scaling
  const maxVal = Math.max(...matrix.flat()) || 1;

  // Get color intensity based on value fraction
  const getCellBg = (val: number, actualIdx: number, predIdx: number) => {
    const isDiagonal = actualIdx === predIdx;
    const ratio = val / maxVal;

    if (isDiagonal) {
      if (ratio > 0.7) return 'bg-purple-500 text-zinc-950';
      if (ratio > 0.4) return 'bg-purple-500/80 text-zinc-950';
      return 'bg-purple-500/50 text-white';
    } else {
      if (val === 0) return 'bg-zinc-950/20 text-zinc-600 border border-white/5';
      if (ratio > 0.4) return 'bg-red-500/40 text-red-100 border border-red-500/10';
      return 'bg-red-500/15 text-red-300 border border-red-500/5';
    }
  };

  return (
    <Card className="border border-white/5 bg-zinc-950/25">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-sm font-semibold text-white tracking-tight">Confusion Matrix (Normalized Heatmap)</h4>
          <p className="text-[10px] font-mono text-zinc-500 uppercase">Evaluated candidate correctness ratio</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 group relative cursor-help">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Diagonal is correct</span>
        </div>
      </div>

      <div className="grid grid-cols-[100px_1fr] gap-4">
        {/* Actual Column Title (rotated) */}
        <div className="flex items-center justify-center font-mono text-[10px] text-zinc-500 uppercase tracking-widest relative">
          <span className="rotate-270 absolute select-none">Actual Label</span>
        </div>

        <div>
          {/* Predicted Title */}
          <div className="text-center font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
            Predicted Label
          </div>

          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
            {/* Header labels */}
            {labels.map((lbl) => (
              <div key={lbl} className="text-center font-mono text-xs text-zinc-400 font-semibold truncate pb-2" title={lbl}>
                {lbl}
              </div>
            ))}

            {/* Matrix Cells */}
            {matrix.map((row, rowIdx) =>
              row.map((cell, colIdx) => {
                const cellPercent = ((cell / (rowTotals[rowIdx] || 1)) * 100).toFixed(0);
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`aspect-video rounded-xl flex flex-col items-center justify-center font-mono transition-all duration-300 hover:scale-[1.03] ${getCellBg(
                      cell,
                      rowIdx,
                      colIdx
                    )}`}
                  >
                    <span className="text-base font-bold">{cell}</span>
                    <span className="text-[10px] opacity-75">{cellPercent}%</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Grid footer metrics */}
      <div className="mt-5 pt-4 border-t border-white/5 flex justify-between text-[11px] font-mono text-zinc-500">
        <span>Test Population: <strong>{grandTotal}</strong> cases</span>
        <span>Accuracy Ratio: <strong>{((matrix.reduce((sum, row, idx) => sum + row[idx], 0) / grandTotal) * 100).toFixed(1)}%</strong></span>
      </div>
    </Card>
  );
};
export default ConfusionMatrix;
