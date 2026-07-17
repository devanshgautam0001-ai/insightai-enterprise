import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useUIStore } from '../../store';
import { Card } from '../../components/ui/Card';
import { DatasetColumn } from '../../types';

const distributionData = [
  { range: '0-50', count: 1240 },
  { range: '50-100', count: 4850 },
  { range: '100-150', count: 9820 },
  { range: '150-200', count: 14200 },
  { range: '200-250', count: 8120 },
  { range: '250-300', count: 3240 }
];

export const Eda: React.FC = () => {
  const { activeDataset, outlierThreshold, setOutlierThreshold } = useUIStore();

  return (
    <div className="space-y-8 animate-fade-in" id="eda-view">
      <div>
        <h2 className="font-display font-extrabold text-3xl">Exploratory Stats (EDA)</h2>
        <p className="text-zinc-400 text-sm">Visual distribution curves and outlier threshold parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Metric distributions bar chart */}
        <Card className="lg:col-span-2 flex flex-col justify-between h-96">
          <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
            <div>
              <h3 className="font-display font-bold text-lg">Density Distribution Curve</h3>
              <p className="text-xs text-zinc-500">Distribution frequency histogram of target feature parameters.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-500">Outlier Threshold (Z-score)</span>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="4.0"
                value={outlierThreshold}
                onChange={(e) => setOutlierThreshold(parseFloat(e.target.value))}
                className="w-16 bg-white/[0.03] border border-white/10 rounded-lg p-1.5 text-xs text-white text-center focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-grow w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="range" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Record Frequency" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quality Audit Checklist */}
        <Card className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="font-display font-bold text-lg">Statistical Quality Audit</h3>
            <p className="text-xs text-zinc-500">Validation score against standard metrics.</p>
          </div>

          {activeDataset ? (
            <div className="space-y-4">
              {(activeDataset.columns || []).map((col: DatasetColumn, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200">{col.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400">Score: {col.qualityScore}%</span>
                  </div>
                  <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${col.qualityScore}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                    <span>Missing records: {col.stats?.nullCount ?? 0}</span>
                    {col.stats?.mean !== undefined && <span>Mean: {col.stats.mean}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500 text-xs">
              Upload a dataset file to generate automated distribution analytics.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
