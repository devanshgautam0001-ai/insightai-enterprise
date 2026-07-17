import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TransformType, TransformationStep } from '../../types/pipeline';
import { Settings } from 'lucide-react';

interface TransformationCardProps {
  columns: string[];
  onApply: (step: TransformationStep) => void;
  isCleaning: boolean;
}

export const TransformationCard: React.FC<TransformationCardProps> = ({
  columns,
  onApply,
  isCleaning,
}) => {
  const [type, setType] = useState<TransformType>('rename_column');
  const [column, setColumn] = useState(columns[0] || '');
  const [targetColumn, setTargetColumn] = useState('');
  const [filterOp, setFilterOp] = useState('equals');
  const [filterVal, setFilterVal] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleApply = () => {
    let description = '';
    const parameters: Record<string, any> = {};

    if (type === 'rename_column') {
      description = `Rename column [${column}] to [${targetColumn || column + '_renamed'}]`;
      parameters.targetColumn = targetColumn || `${column}_renamed`;
    } else if (type === 'drop_column') {
      description = `Drop column [${column}]`;
    } else if (type === 'filter_rows') {
      description = `Filter rows where [${column}] ${filterOp} "${filterVal}"`;
      parameters.operator = filterOp;
      parameters.value = filterVal;
    } else if (type === 'sort_rows') {
      description = `Sort rows by [${column}] ${sortDir.toUpperCase()}`;
      parameters.direction = sortDir;
    }

    onApply({
      id: `step-${Date.now()}`,
      type,
      column,
      targetColumn: targetColumn || undefined,
      parameters,
      description,
    });
  };

  return (
    <Card className="p-6 space-y-6 bg-white/[0.01] border border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-transparent" />

      <div>
        <h4 className="font-display font-bold text-sm text-zinc-200 flex items-center gap-2">
          <Settings className="w-4 h-4 text-purple-400" />
          <span>Ingest New Transformation Rule</span>
        </h4>
        <p className="text-[11px] text-zinc-500 mt-0.5">Select a mathematical step to process the active data cache.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Transform type */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase text-zinc-500">Operation Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TransformType)}
            className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="rename_column">Rename Column</option>
            <option value="drop_column">Drop Column</option>
            <option value="filter_rows">Filter Rows</option>
            <option value="sort_rows">Sort Rows</option>
          </select>
        </div>

        {/* Source column selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase text-zinc-500">Target Column</label>
          <select
            value={column}
            onChange={(e) => setColumn(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic forms depending on selected type */}
      <div className="pt-2 border-t border-white/5">
        {type === 'rename_column' && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-zinc-500">New Target Name</label>
            <input
              type="text"
              placeholder="e.g. total_revenue_usd"
              value={targetColumn}
              onChange={(e) => setTargetColumn(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none"
            />
          </div>
        )}

        {type === 'filter_rows' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-zinc-500">Operator</label>
              <select
                value={filterOp}
                onChange={(e) => setFilterOp(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="greater">Is Greater Than</option>
                <option value="less">Is Less Than</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-zinc-500">Value</label>
              <input
                type="text"
                placeholder="e.g. Enterprise or 10000"
                value={filterVal}
                onChange={(e) => setFilterVal(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>
          </div>
        )}

        {type === 'sort_rows' && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-zinc-500">Direction</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="radio"
                  name="sortDir"
                  checked={sortDir === 'asc'}
                  onChange={() => setSortDir('asc')}
                  className="accent-blue-500"
                />
                Ascending (A-Z)
              </label>
              <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="radio"
                  name="sortDir"
                  checked={sortDir === 'desc'}
                  onChange={() => setSortDir('desc')}
                  className="accent-blue-500"
                />
                Descending (Z-A)
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-white/5">
        <Button
          onClick={handleApply}
          disabled={isCleaning}
          isLoading={isCleaning}
          className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white border-none font-bold text-xs"
        >
          Inject Rule Step
        </Button>
      </div>
    </Card>
  );
};
export default TransformationCard;
